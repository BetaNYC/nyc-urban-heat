import { Feature, GeoJsonProperties, Geometry } from "geojson"
import { MapboxGeoJSONFeature } from "mapbox-gl"

export interface NtaProfileData {
    metrics: Map<string, string>;
    currentMetric: string,
    ntacode: string,
    boroname: string,
    ntaname: string
}