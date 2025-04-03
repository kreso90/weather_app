export interface CityInfo {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    url: string;
}

export interface PlacesResponse {
    predictions: CityInfo;
}
  