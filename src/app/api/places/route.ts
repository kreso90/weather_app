import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {

        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city");

        const response = await fetch(`http://api.weatherapi.com/v1/search.json?key=${process.env.WEATHER_API}&q=${city}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch places");
        }

        const data = await response.json(); 
        
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to places data" }, { status: 500 });
    }
}