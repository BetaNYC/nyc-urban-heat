import mapboxgl from "mapbox-gl";

import ntaFeatureCollection from "../data/nta.geo.json";
import { FeatureCollection } from "geojson";
import { GeoJSONTransformHandler } from "./geojson";

const features = GeoJSONTransformHandler(
  (ntaFeatureCollection as FeatureCollection).features
);

export function viewNTABorderLine(map: mapboxgl.Map, metric?: string) {
  map.addSource("nta", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features,
    } as FeatureCollection,
    promoteId: "ntacode",
  });

  map.addLayer({
    id: "nta_outline",
    type: "line",
    source: "nta",
    layout: {},
    paint: {
      "line-color": metric === "NTA_PCT_MRT_Less_Than_110" ? "#A9A9A9" : metric === "PCT_AREA_COOLROOF" ? "#A9A9A9" : metric === "PCT_TREES" ? "#A9A9A9" :"#FFF",
      "line-width": 1,
    },
  });
}
