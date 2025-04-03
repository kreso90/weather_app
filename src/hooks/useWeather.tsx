import { fetchError, loadingWeatherState, loadingPlacesState, fetchPlacesSuccess, fetchWeatherSuccess } from "@/redux/slice/WeatherSlice";
import { RootState } from "@/redux/store";
import { CityInfo } from "@/types/PlacesData";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useWeather = () => {
    const dispatch = useDispatch();
    const { loadingWeather, loadingPlaces, error, weatherData, placesData } = useSelector((state: RootState) => state.weather);

    const [ citiesList, setCitiesList ] = useState<CityInfo[]>([]);
    const [ city, setCity ] = useState("");
    
    const fetchWeather = async (latitude: number, longitude: number) => {
        dispatch(loadingWeatherState());

        try {
            const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);
            const weatherData = await response.json(); 
            dispatch(fetchWeatherSuccess(weatherData));
            console.log(weatherData)
        } catch (error) {
            dispatch(fetchError("Failed to weather data"));
        }
    }

    const fetchWeatherByCityName = async (cityName: string) => {
        dispatch(loadingWeatherState());

        try {
            const response = await fetch(`/api/weather?city=${cityName}`);
            const weatherData = await response.json(); 
            dispatch(fetchWeatherSuccess(weatherData));
        } catch (error) {
            dispatch(fetchError("Failed to weather data"));
        }
    }

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
  
        if (newCity.length > 2) {
            fetchPlaces(newCity);
            console.log(citiesList)
        }else{
            setCitiesList([])
        }
    };

    const handleSelectCity = (selectedCity: string) => {
        const cityName = selectedCity.split(",")[0];
        fetchWeatherByCityName(cityName);
        setCitiesList([]); 
    };
        

    useEffect(() => {
        getGeolocation()
    }, [dispatch])

  
    return { loadingPlaces, loadingWeather, weatherData, error, city, citiesList, handleCityChange, handleSelectCity, placesData };
}

export default useWeather;