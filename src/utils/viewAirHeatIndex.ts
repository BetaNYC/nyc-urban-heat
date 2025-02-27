import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";

export const airHeatIndexValues: { [key: string]: number[] } = {
  "20230902": [-10.4, 0.96, 12.32, 23.68, 35.04, 46.4],
  "20230901": [-6.4, 5.36, 17.12, 28.88, 40.64, 52.4],
  "20230809": [-30.5, -15.34, -0.18, 14.98, 30.14, 45.3],
  "20230731": [-28.8, -10.56, 7.68, 25.92, 44.16, 62.4],
  "20230723": [-31.6, -13.0, 5.6, 24.2, 42.8, 61.4],
  "20220915": [-6.9, 3.76, 14.42, 25.08, 35.74, 46.4],
  "20220914": [-5.2, 4.32, 13.84, 23.36, 32.88, 42.4],
  "20220720": [-32, -13.26, 5.48, 24.22, 42.96, 61.7],
  "20220704": [-31.9, -13.06, 5.78, 24.62, 43.46, 62.3],
  "20220619": [-16.2, -2.7, 10.8, 24.3, 37.8, 51.3],
  "20220509": [-14.1, -2.14, 9.82, 21.78, 33.74, 45.7],
  "20210826": [-29.9, -13.98, 1.94, 17.86, 33.78, 49.7],
  "20210623": [-18.8, -4.58, 9.64, 23.86, 38.08, 52.3],
  "20200706": [-22.5, -5.74, 11.02, 27.78, 44.54, 61.3],
  "20200613": [-20.4, -4.96, 10.48, 25.92, 41.36, 56.8],
  "20190922": [-12.9, -1.96, 8.98, 19.92, 30.86, 41.8],
  "20190830": [-15.2, -3.94, 7.32, 18.58, 29.84, 41.1],
  "20170612": [-29.1, -11.22, 6.66, 24.54, 42.42, 60.3],
  "20160625": [-24.9, -7.06, 10.78, 28.62, 46.46, 64.3],
  "20160618": [-23.8, -7.8, 8.2, 24.2, 40.2, 56.2],
  "20160609": [-15.3, -3.46, 8.38, 20.22, 32.06, 43.9],
  "20140807": [-25.4, -10.48, 4.44, 19.36, 34.28, 49.2],
  "20130601": [-34.2, -17.1, 0, 17.1, 34.2, 51.3],
};

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
          airHeatIndexValues[date][0] / 255,
          "#F4D9CD",
          airHeatIndexValues[date][1] / 255,
          "#EFC9A9",
          airHeatIndexValues[date][2] / 255,
          "#EBBC85",
          airHeatIndexValues[date][3] / 255,
          "#E6AE61",
          airHeatIndexValues[date][4] / 255,
          "#E19F3D",
        ],
      },
    });
  });

  return function onDestroy() {
    map.removeLayer("air_heat_index");
    map.removeSource("air_heat_index");
  };
}
