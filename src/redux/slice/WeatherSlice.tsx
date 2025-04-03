import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeatherApiResponse } from "@/types/WeatherData";
import { PlacesResponse } from "@/types/PlacesData";

interface LocationState {
  placesData: PlacesResponse | null;
  weatherData: WeatherApiResponse | null;
  loadingWeather: boolean;
  loadingPlaces: boolean;
  error: string | null;
}

const initialState: LocationState = {
  placesData: null,
  weatherData: null,
  loadingWeather: false,
  loadingPlaces: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    loadingWeatherState(state) {
      state.loadingWeather = true;
      state.error = null;
    },
    loadingPlacesState(state){
      state.loadingPlaces = true;
      state.error = null;
    },
    fetchPlacesSuccess(state, action: PayloadAction<PlacesResponse>) {
      state.placesData = action.payload;
      state.loadingPlaces = false;
    },
    fetchWeatherSuccess(state, action: PayloadAction<WeatherApiResponse>) {
      state.weatherData = action.payload;
      state.loadingWeather = false;
    },
    fetchError(state, action: PayloadAction<string>) {
      state.loadingWeather = false;
      state.loadingPlaces = false;
      state.error = action.payload;
    },
  },
});

export const { loadingWeatherState, loadingPlacesState, fetchPlacesSuccess, fetchWeatherSuccess, fetchError } = locationSlice.actions;
export default locationSlice.reducer;
