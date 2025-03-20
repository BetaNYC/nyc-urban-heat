import mapboxgl from "mapbox-gl";

import ntaFeatureCollection from "../data/nta.geo.json";
import { FeatureCollection } from "geojson";
import { GeoJSONTransformHandler } from "./geojson";

const features = GeoJSONTransformHandler(
  (ntaFeatureCollection as FeatureCollection).features
);

export function viewNTABorderLine(map: mapboxgl.Map) {
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
      "line-color": "#ffffff",
      "line-width": 1,
    },
  });
}
