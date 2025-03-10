import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";
import airData from "../../public/airMaxMin.json"

  //@ts-ignore
const generateSequence = (min, max) => {
  const step = (max - min) / 5;
  return Array.from({ length: 6 }, (_, i) => Number((min + i * step).toFixed(2)));
};
const airHeatIndexValues = airData.reduce((acc, { date, AHI_min, AHI_max }) => {
  //@ts-ignore
  acc[date] = generateSequence(AHI_min, AHI_max);
  return acc;
}, {});

export function viewAirHeatIndex(
  map: mapboxgl.Map,
  date: string = "20230902"
) {
  const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;
  //@ts-ignore
  mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

  const PMTILES_URL = `https://urban-heat-portal-tiles.s3.amazonaws.com/Air_Heat_Index_outputs${date}.pmtiles`;
  PmTilesSource.getHeader(PMTILES_URL).then((header) => {
    const bounds = [header.minLon, header.minLat, header.maxLon, header.maxLat];
    map.addSource("air_heat_index", {
      type: PmTilesSource.SOURCE_TYPE as any,
      url: PMTILES_URL,
      minzoom: header.minZoom,
      maxzoom: header.maxZoom,
      bounds: bounds,
    });

    map.addLayer({
      id: "air_heat_index",
      source: "air_heat_index",
      "source-layer": "raster-layer",
      type: "raster",
      layout: { visibility: "visible" },
      interactive: true,
      paint: {
        "raster-opacity": 1,
        "raster-color": [
          "interpolate",
          ["linear"],
          ["raster-value"],
  //@ts-ignore
          airHeatIndexValues[date][0] / 255,
          "#F7E7D0",
            //@ts-ignore
          airHeatIndexValues[date][1] / 255,
          "#EFC7B1",
            //@ts-ignore
          airHeatIndexValues[date][2] / 255,
          "#E6A891",
            //@ts-ignore
          airHeatIndexValues[date][3] / 255,
          "#DE8872",
            //@ts-ignore
          airHeatIndexValues[date][4] / 255,
          "#D66852",
        ],
      },
    });
  });

  return function onDestroy() {
    map.removeLayer("air_heat_index");
    map.removeSource("air_heat_index");
  };
}
