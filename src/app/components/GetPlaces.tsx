import React from 'react'
import Loader from './Loader';
import useWeather from '@/hooks/useWeather';

export default function GetPlaces() {
    const { city, citiesList, loadingWeather, handleCityChange, handleSelectCity } = useWeather(); 

    return (
        <div>
            <label htmlFor="city">GetPlaces</label>
            <input type="text" id="city" onChange={handleCityChange} value={city}/>
            {citiesList && (
            <div className="dropdown">
                {Object.entries(citiesList).map(([key, city]) => (
                <div key={key} className="dropdown-item" onClick={() => handleSelectCity(city.name)}>
                    {city.name}
                </div>
                ))}
            </div>
            )}

        </div>
    )
}
