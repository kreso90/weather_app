import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const latitude = searchParams.get("latitude");
        const longitude = searchParams.get("longitude");
        const cityName = searchParams.get("city");

        let response;

        if (cityName) {
            response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API}&q=${cityName}&days=7&aqi=yes&alerts=no`);
        } else if (latitude && longitude) {
            response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API}&q=${latitude},${longitude}&days=7&aqi=yes&alerts=no`);
        } else {
            return NextResponse.json({ error: "Latitude and longitude or city name must be provided" }, { status: 400 });
        }

        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
