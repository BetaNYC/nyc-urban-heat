import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";
import { nta_dataset_info } from "../App";

import { viewNTABorderLine } from "./viewNTABorderLine";

export function viewMRT(map: mapboxgl.Map) {
  const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;

  //@ts-ignore
  mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

  const layer_source_url = nta_dataset_info.value.find(
    (dataset) => dataset.metric === "MRT"
  ).downloads_2;

  PmTilesSource.getHeader(layer_source_url).then((header) => {
    const bounds = [header.minLon, header.minLat, header.maxLon, header.maxLat];
    map.addSource("mrt", {
      type: PmTilesSource.SOURCE_TYPE as any,
      url: layer_source_url,
      minzoom: header.minZoom,
      maxzoom: header.maxZoom,
      bounds: bounds,
    });

    map.addLayer({
      id: "mrt",
      source: "mrt",
      "source-layer": "raster-layer",
      type: "raster",
      paint: {
        "raster-opacity": 0.85,
        "raster-color": [
          "interpolate",
          ["linear"],
          ["raster-value"],
          88/255,
          "#859ea4",
          110/255,
          "#e0d0b6",
          120.3/255,
          "#edc58a",
          136.43/255,
          "#d39365",
          153/255,
          "#b8613f",
        ],
        "raster-resampling": "nearest",
      },
    });


    viewNTABorderLine(map)
  });

  return function onDestory() {
    map.removeLayer("mrt");
    map.removeSource("mrt");
    map.removeLayer('nta_outline')
    map.removeSource("nta");
  };
}
