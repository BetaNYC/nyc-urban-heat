import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { cachedFetch } from "./cache";

export const BASE_URL = "https://vcadeeaimofyayyevakl.supabase.co/rest/v1/";
export const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWRlZWFpbW9meWF5eWV2YWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNzQzNzgsImV4cCI6MjAzMjY1MDM3OH0.clu7Zh0jdJWJVxbwyoyeILH33pew1QSpxeYHzAq4Auo";

export function getNTAInfo(nta: string) {
  return cachedFetch(
    `${BASE_URL}nta_metrics?select=metric,${nta}&apikey=${API_KEY}`
  );
}

export const fetchWeatherStationData = async (
  selectedYear: number,
  selectedAddress: string
) => {
  const weatherStationData = await cachedFetch(
    `${BASE_URL}weather_stations_year?select=*&year=eq.${selectedYear}&address=eq.${selectedAddress}&apikey=${API_KEY}`
  );
  return weatherStationData;
};

export const fetchStationHeatStats = async () => {
  const [stationPoints, stationHeatStats] = await Promise.all([
    cachedFetch(`${BASE_URL}stations_point?select=*&apikey=${API_KEY}`),
    cachedFetch(`${BASE_URL}stations_summerstat?select=*&apikey=${API_KEY}`),
  ]);

  const stationPointsMap = new Map<string, any[]>();
  stationPoints.forEach((feature: Feature) => {
    // @ts-ignore
    const address = feature.address;
    if (feature.geometry && "coordinates" in feature.geometry) {
      stationPointsMap.set(address, feature.geometry.coordinates);
    }
  });
  // Combine the data with coordinates
  const stationFeatures = stationHeatStats.map((stat: { address: any }) => {
    const coordinates = stationPointsMap.get(stat.address) || [0, 0]; // Default to [0, 0] if coordinates not found

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coordinates,
      },
      properties: {
        ...stat,
      },
    };
  });

  const weatherStationsGeoJSON = {
    type: "FeatureCollection",
    features: stationFeatures,
  };

  return weatherStationsGeoJSON;
};
