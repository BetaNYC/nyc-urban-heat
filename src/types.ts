import { Feature, GeoJsonProperties, Geometry } from "geojson"
import { MapboxGeoJSONFeature } from "mapbox-gl"

export interface NtaProfileData {
    currentFeature: MapboxGeoJSONFeature;
    allFeatures: Feature<Geometry, GeoJsonProperties>[];
}