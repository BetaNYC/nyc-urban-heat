import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { MapboxGeoJSONFeature } from "mapbox-gl";

export interface NtaProfileData {
  metrics: Map<string, string>;
  currentMetric: string;
  ntacode: string;
  boroname: string;
  ntaname: string;
}

export type WeatherStationData = {
  Day: number;
  Days_warmer_than_max_record: number;
  Days_warmer_than_normal_max: number;
  Days_warmer_than_normal_min: number;
  ExcessiveHeat: string;
  HeatAdvisory: string;
  NYC_HeatEvent: string;
  Normal_Temp_Max: number;
  Normal_Temp_Mean: number;
  Normal_Temp_Min: number;
  Record_Max: number;
  Record_Max_Year: number;
  Record_Min: number;
  Record_Min_Year: number;
  address: string;
  datetime: Date;
  datetimeEpoch: number;
  feelslike: number;
  feelslikemax: number;
  feelslikemin: number;
  icon: string;
  latitude: number;
  longitude: number;
  stations: string;
  temp: number;
  tempmax: number;
  tempmin: number;
  year: number;
};
