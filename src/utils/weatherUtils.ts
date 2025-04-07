import { ForecastDay, Hour } from "@/types/WeatherData";

export const getHourFromEpoch = (epoch: number) => {
    const date = new Date(epoch * 1000);
    return date.getHours();
};

export const formatTime = (time: string): string => {
    const hourTime = new Date(time);
    const currentHour = new Date().getHours();
    const hourOnly = hourTime.getHours();
    const minutes = hourTime.getMinutes();

    return hourOnly === currentHour ? "Now" : `${hourOnly}:${minutes < 10 ? '0' : ''}${minutes}`;
};

export const formatDay = (dateEpoch: number): string => {
    const day = new Date(dateEpoch * 1000).getDay();
    const currentDay = new Date().getDay();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return day === currentDay ? "Today" : daysOfWeek[day];
};

export const formatDate = (dateInput: string | number): string => {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
};

export const getNextHours = (currentHour: number, currentHours: Hour[], totalHours: number, forecastData: ForecastDay[]): Hour[] => {
    const maxHours = 10;
    const limitedHours = Math.min(totalHours, maxHours);
    const todayHours = currentHours.slice(currentHour);
    const neededFromNextDay = limitedHours - todayHours.length;

    let nextDayHours: Hour[] = [];

    if (neededFromNextDay > 0 && forecastData[1]?.hour) {
        nextDayHours = forecastData[1].hour.slice(0, neededFromNextDay);
    }

    return [...todayHours, ...nextDayHours].slice(0, maxHours);
};

export const getWeatherClass = (weatherCode: number): string | undefined => {
    const weatherCategories = {
        sunny: [1000, 1003],
        cloudy: [1006, 1009, 1030, 1135, 1147],
        rainy: [1063, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
        snow: [1066, 1069, 1114, 1117, 1168, 1171, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264, 1279, 1282],
    };

    for (const [category, codes] of Object.entries(weatherCategories)) {
        if (codes.includes(weatherCode)) return category;
    }
};

export const getUvLabel = (uv: number): string => {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
};
