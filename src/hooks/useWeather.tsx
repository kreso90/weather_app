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

    const fetchWeather = async (latitude: number, longitude: number) => {
        dispatch(loadingWeatherState());
    
        try {
            const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);
            const weatherData = await response.json(); 

            dispatch(fetchWeatherSuccess(weatherData));

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
                    const selectedCity = localStorage.getItem("selectedCity");

                    if (selectedCity) {
                        fetchWeatherByCityName(selectedCity);
                    } else {
                        fetchWeather(latitude, longitude);
                    }
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.log("User denied the request for geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.log("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            console.log("The request to get user location timed out.");
                            break;
                    }
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };
    

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
        fetchPlaces(e.target.value);
    };

    const handleSelectCity = (selectedCity: string) => {
        const cityName = selectedCity.split(",")[0];
        setCity(selectedCity)
        fetchWeatherByCityName(cityName);
        setCitiesList([]); 
        localStorage.setItem("selectedCity", selectedCity);
    };

    useEffect(() => {
        getGeolocation()
    }, [])      

  
    return { loadingPlaces, loadingWeather, weatherData, error, city, citiesList, handleCityChange, handleSelectCity, placesData };
}

export default useWeather;