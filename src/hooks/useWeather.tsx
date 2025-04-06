import { fetchError, loadingWeatherState, loadingPlacesState, fetchPlacesSuccess, fetchWeatherSuccess } from "@/redux/slice/WeatherSlice";
import { RootState } from "@/redux/store";
import { CityInfo } from "@/types/PlacesData";
import { Hour } from "@/types/WeatherData";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useWeather = () => {
    const dispatch = useDispatch();
    const { loadingWeather, loadingPlaces, error, weatherData, placesData } = useSelector((state: RootState) => state.weather);

    const [ citiesList, setCitiesList ] = useState<CityInfo[]>([]);
    const [ city, setCity ] = useState("");
    const [ weatherCode, setWeatherCode] = useState(0);
    const [ weatherClass, setWeatherClass ] = useState<string | undefined>();
    const [ currentHour, setCurrentHour ] = useState(0);

    const fetchWeather = async (latitude: number, longitude: number) => {
        dispatch(loadingWeatherState());
    
        try {
            const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);
            const weatherData = await response.json(); 
            dispatch(fetchWeatherSuccess(weatherData));
            if (response.ok) {
                getHourFromEpoch(weatherData.location.localtime_epoch);
                setWeatherCode(weatherData.current.condition.code);
            }
        } catch (error) {
            dispatch(fetchError("Failed to fetch weather data"));
        }
    };
    
    const fetchWeatherByCityName = async (cityName: string) => {
        dispatch(loadingWeatherState());
    
        try {
            const response = await fetch(`/api/weather?city=${cityName}`);
            const weatherData = await response.json(); 
           
            dispatch(fetchWeatherSuccess(weatherData));
         
            if (response.ok) {
                getHourFromEpoch(weatherData.location.localtime_epoch);
                setWeatherCode(weatherData.current.condition.code);
            }

        } catch (error) {
            dispatch(fetchError("Failed to fetch weather data"));
        }
    };
    

    const fetchPlaces = async (city: string) => {
        dispatch(loadingPlacesState());

        try {
            const response = await fetch(`/api/places?city=${city}`);
            const placesData = await response.json(); 
            dispatch(fetchPlacesSuccess(placesData));
            const cityList: CityInfo[] = placesData?.map((place: any) => ({
                id: place.id,            
                name: place.name,        
                region: place.region,   
                country: place.country,
                lat: place.lat,      
                lon: place.lon,     
                url: place.url   
            })) || [];
    
            setCitiesList(cityList);
        } catch (error) {
            dispatch(fetchError("Failed to get places data"));
        }
    }

    const getGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeather(latitude, longitude)
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("User denied the request for geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            alert("The request to get user location timed out.");
                            break;
                    }
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };
    

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCity = e.target.value;
        setCity(newCity);
 
        if (newCity.length > 1) {
            fetchPlaces(newCity);
        }else{
            setCitiesList([])
        }
    };

    const handleSelectCity = (selectedCity: string) => {
        const cityName = selectedCity.split(",")[0];
        setCity(selectedCity)
        fetchWeatherByCityName(cityName);
        setCitiesList([]); 
    };

    const getHourFromEpoch = (epoch: number) => {
        const date = new Date(epoch * 1000);
        setCurrentHour(date.getHours());
    };

    const formatTime = (time: string) => {
        const hourTime = new Date(time);

        const currentHour = new Date().getHours();
        const hourOnly = hourTime.getHours();
        const minutes = hourTime.getMinutes();

        return hourOnly === currentHour ? "Now" : `${hourOnly}:${minutes < 10 ? '0' : ''}${minutes}`;

    };

    const formatDay = (dateEpoch: number): string => {
        const day = new Date(dateEpoch * 1000).getDay();
        const currentDay = new Date().getDay();
        
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        return day === currentDay ? "Today" : daysOfWeek[day];
    };

    const formatDate = (dateInput: string | number): string => {
        const date = new Date(dateInput);
        
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        
        return `${day}/${month}`;
    };

    const getNextHours = (currentHours: Hour[], totalHours: number): Hour[] => {
        if (!weatherData || !weatherData.forecast?.forecastday) return [];
      
        const maxHours = 10;
        const limitedHours = Math.min(totalHours, maxHours);
      
        const todayHours = currentHours.slice(currentHour);
        const neededFromNextDay = limitedHours - todayHours.length;
      
        let nextDayHours: Hour[] = [];
      
        if (neededFromNextDay > 0) {
          const nextDay = weatherData.forecast.forecastday[1];
          if (nextDay && nextDay.hour) {
            nextDayHours = nextDay.hour.slice(0, neededFromNextDay);
          }
        }
      
        return [...todayHours, ...nextDayHours].slice(0, maxHours);
    };
      

    const getWeatherClass = (weatherCode: number) => {
        const weatherCategories = {
            sunny: [1000],
            cloudy: [1006, 1009, 1030, 1135, 1147, 1003],
            rainy: [1063, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
            snow: [1066, 1069, 1114, 1117, 1168, 1171, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264, 1279, 1282],
        };
    
        for (const [category, codes] of Object.entries(weatherCategories)) {
            if (codes.includes(weatherCode)) {
                return category;
            }
        }
    };

    const getUvLabel = (uv: number) => {
        if (uv <= 2) return "Low";
        if (uv <= 5) return "Moderate";
        if (uv <= 7) return "High";
        if (uv <= 10) return "Very High";
        return "Extreme";
    };

    useEffect(() => {
        getGeolocation()
    }, [])      

  
    return { getUvLabel, formatDate, formatDay, getWeatherClass, weatherClass, getNextHours, formatTime, currentHour, loadingPlaces, loadingWeather, weatherData, error, city, citiesList, handleCityChange, handleSelectCity, placesData };
}

export default useWeather;