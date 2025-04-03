'use client';
import useWeather from "@/hooks/useWeather";
import GetPlaces from "./components/GetPlaces";

export default function Home() {

  const { loadingWeather, weatherData, error } = useWeather(); 

  return (
    <main>
      <GetPlaces/>
      {!loadingWeather ? "home" : "loading"}
      <h1>{weatherData?.location.name}</h1>
    </main>
  );
}
