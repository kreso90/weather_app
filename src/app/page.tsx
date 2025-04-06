"use client";
import useWeather from "@/hooks/useWeather";
import GetPlaces from "./components/GetPlaces";
import {
  LuWind,
  LuCalendar,
  LuClock,
  LuThermometer,
  LuDroplet,
  LuDroplets,
  LuEye,
} from "react-icons/lu";

export default function Home() {
  const {
    getWeatherClass,
    getNextHours,
    formatTime,
    formatDay,
    formatDate,
    getUvLabel,
    weatherClass,
    loadingWeather,
    weatherData,
    error,
  } = useWeather();

  return (
    <main
      className={getWeatherClass(weatherData?.current.condition.code ?? 1000)}
    >
      <div className="container">
        <div className="row">
          <div className="col lg-5">
            <GetPlaces />
            <div
              className={`bg-wrapper ${getWeatherClass(
                weatherData?.current.condition.code ?? 1000
              )}`}
            >
              <div className="bg-wrapper__content">
                <h1 className="m-0 m-bottom-30">
                  {weatherData?.location?.name ?? "Please select city"}
                </h1>

                <div className="text-center m-bottom-50">
                  <p className="temp-font">{Math.floor(weatherData?.current.temp_c ?? 0)}°</p>
                  <p className="font-28 m-0">
                    {weatherData?.current.condition.text}
                  </p>
                </div>

                <div className="box-container">
                  <div className="box">
                    <div className="box__title">
                      <LuThermometer size={22} />
                      Feels like
                    </div>
                    <div className="box__content">
                      {Math.floor(weatherData?.current.feelslike_c ?? 0)}°
                    </div>
                  </div>

                  <div className="box">
                    <div className="box__title">
                      <LuDroplet size={22} />
                      Precipitation
                    </div>
                    <div className="box__content">
                      {Math.floor(weatherData?.current.precip_mm  ?? 0)} mm
                    </div>
                  </div>

                  <div className="box">
                    <div className="box__title">
                      <LuEye size={22} />
                      Visibility
                    </div>
                    <div className="box__content">
                      {Math.floor(weatherData?.current.vis_km ?? 0)} km
                    </div>
                  </div>

                  <div className="box">
                    <div className="box__title">
                      <LuDroplets size={22} />
                      Humidity
                    </div>
                    <div className="box__content">
                      {Math.floor(weatherData?.current.humidity ?? 0 )}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col lg-7">

            <div className="box m-bottom-20">
              <div className="box__title box__title--border">
                <LuClock size={22} />
                Hourly forecast
              </div>

              <div className="box__inner-container">
                {getNextHours(
                  weatherData?.forecast.forecastday[0]?.hour || [],
                  10
                ).map((hour, hourIndex) => (
                  <div key={hourIndex} className="col xs-4 md-2 text-center m-bottom-20">
                    <div className={hourIndex == 0 ? 'wrapper wrapper--grey' : 'wrapper'}>
                      <span>{formatTime(hour.time)}</span>
                      <p>{Math.floor(hour.temp_c)}°</p>
                      <img src={hour.condition.icon} alt={hour.condition.text} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="box m-bottom-20">
              <div className="box__title box__title--border">
                <LuCalendar  size={22} />
                7 day forecast
              </div>

              <div className="box__inner-container">
                {weatherData?.forecast.forecastday.slice(0, 10).map((day, dayIndex) => (
                  <div key={dayIndex} className="col xs-4 md-2 text-center m-bottom-20">
                    <div className={dayIndex == 0 ? 'wrapper wrapper--grey' : 'wrapper'}>
                      <span>{formatDay(day.date_epoch)}</span>
                      <small>{formatDate(day.date)}</small>
                      <p>{Math.floor(day.day.avgtemp_c)}°</p>
                      <img src={day.day.condition.icon} alt={day.day.condition.text} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">

              <div className="col md-6 m-bottom-20 m-md-bottom-0">
                <div className="box full-height flex flex-column space-between">
                  <div className="box__title">
                    <LuThermometer size={22} />
                    Uv index
                  </div>
                  
                  <div className="m-top-20 m-bottom-20">
                    <p className="font-26 m-0 m-bottom-5">{Math.floor(weatherData?.current.uv ?? 0)}</p>
                    <p className="font-20 m-0">{getUvLabel(weatherData?.current.uv ?? 0)}</p>
                  </div>
                  
                  <div className="relativ">
                    <div className="uv"></div>
                    <div className="uv-dot" style={{left: `${weatherData?.current.uv ?? 0}%`,}}></div>
                  </div>

                
                </div>
              </div>

              <div className="col md-6">
                <div className="box full-height">
                  <div className="box__title m-bottom-20">
                    <LuWind size={22} />
                    Wind
                  </div>
                  <div className="flex space-between">
                    <div className="flex flex-column space-center">

                      <div className="flex-v-center m-bottom-20">
                        <span className="font-26">{Math.floor(weatherData?.current.wind_kph ?? 0)}</span>
                        <div className="m-left-5">
                          <p className="m-0 light-grey">KPH</p>
                          <p className="m-0">Wind</p>
                        </div>
                      </div>

                      <div className="flex-v-center">
                        <span className="font-26">{Math.floor(weatherData?.current.gust_kph ?? 0)}</span>
                        <div className="m-left-5">
                          <p className="m-0 light-grey">KPH</p>
                          <p className="m-0">Gust</p>
                        </div>
                      </div>

                    </div>

                    <div className="compass">
                      <div className="direction n">N</div>
                      <div className="direction s">S</div>
                      <div className="direction e">E</div>
                      <div className="direction w">W</div>
                      <div className="needle" style={{ transform: `translate(-50%, -100%) rotate(${weatherData?.current.wind_degree ?? 0}deg)` }}></div>
                      <div className="center-dot"></div>
                    </div>

                  </div>
                </div>
              </div>

             
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
