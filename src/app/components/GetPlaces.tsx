import React from 'react'
import Loader from './Loader';
import useWeather from '@/hooks/useWeather';
import { LuMapPin } from "react-icons/lu";

export default function GetPlaces() {
  const { city, citiesList, loadingWeather, handleCityChange, handleSelectCity } = useWeather(); 

  return (
    <>
      <div className="relativ">

        <div className="input-icon">
          <LuMapPin  size={20}/>
        </div>
        <input type="text" id="city" onChange={handleCityChange} value={city}/>
          
        {citiesList.length > 0 && (
          <ul className="dropdown">
              {Object.entries(citiesList).map(([key, place]) => (
              <li key={key} className="dropdown-item" onClick={() => handleSelectCity(place.name)}>
                  {place.name}, {place.country}
              </li>
              ))}
          </ul>
        )}
      </div>

    </>
    )
}
