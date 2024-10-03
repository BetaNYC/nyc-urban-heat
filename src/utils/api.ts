import {Feature, GeoJsonProperties, Geometry} from "geojson";
import { cachedFetch } from "./cache";

export const BASE_URL = "https://vcadeeaimofyayyevakl.supabase.co/rest/v1/";
export const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWRlZWFpbW9meWF5eWV2YWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNzQzNzgsImV4cCI6MjAzMjY1MDM3OH0.clu7Zh0jdJWJVxbwyoyeILH33pew1QSpxeYHzAq4Auo";


export const fetchStationHeatStats = async () => {
  const res = await fetch(`${BASE_URL}stations_summerstat?select=*&apikey=${API_KEY}`);
  return res.json();
};