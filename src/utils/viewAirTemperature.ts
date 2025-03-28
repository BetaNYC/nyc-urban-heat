import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";
import airData from "../../public/airMaxMin.json"

import { viewNTABorderLine } from "./viewNTABorderLine";

  //@ts-ignore
const generateSequence = (min, max) => {
  const step = (max - min) / 5;
  return Array.from({ length: 6 }, (_, i) => Number((min + i * step).toFixed(2)));
};

const airTemperatureValues = airData.reduce((acc, { date, AirTemp_min, AirTemp_max }) => {
    //@ts-ignore
  acc[date] = generateSequence(AirTemp_min, AirTemp_max);
  return acc;
}, {});

export function viewAirTemperature(
  map: mapboxgl.Map,
  date: string = "20230902"
) {
  const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;
  //@ts-ignore
  mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

  const PMTILES_URL = `https://urban-heat-portal-tiles.s3.amazonaws.com/Air_temp_raster_${date}.pmtiles`;
  PmTilesSource.getHeader(PMTILES_URL).then((header) => {
    const bounds = [header.minLon, header.minLat, header.maxLon, header.maxLat];
    map.addSource("air_temperature", {
      type: PmTilesSource.SOURCE_TYPE as any,
      url: PMTILES_URL,
      minzoom: header.minZoom,
      maxzoom: header.maxZoom,
      bounds: bounds,
    });

    map.addLayer({
      id: "air_temperature",
      source: "air_temperature",
      "source-layer": "raster-layer",
      type: "raster",
      layout: { visibility: "visible" },
      interactive: true,
      paint: {
        "raster-opacity": 0.85,
        "raster-color": [
          "interpolate",
          ["linear"],
          ["raster-value"],
            //@ts-ignore
          airTemperatureValues[date][0] / 255,
          "#98c1d9",
            //@ts-ignore
          airTemperatureValues[date][1] / 255,
          "#ffe6a8",
            //@ts-ignore
          airTemperatureValues[date][2] / 255,
          "#ffbba8",
            //@ts-ignore
          airTemperatureValues[date][3] / 255,
          "#d66852",
            //@ts-ignore
          airTemperatureValues[date][4] / 255,
          "#511113",
        ],
      },
    });

    viewNTABorderLine(map)
  });

  return function onDestroy() {
    map.removeLayer("air_temperature");
    map.removeSource("air_temperature");
    map.removeLayer('nta_outline')
    map.removeSource("nta");
  };
}
