// @ts-ignore
import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";

export function viewCoolRoofs(map: mapboxgl.Map) {
  const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;

  //@ts-ignore
  mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

  const PMTILES_URL = `https://urban-heat-portal-tiles.s3.us-east-1.amazonaws.com/CoolRoof_2020.pmtiles`;

  PmTilesSource.getHeader(PMTILES_URL).then((header) => {
    const bounds = [header.minLon, header.minLat, header.maxLon, header.maxLat];
    map.addSource("cool_roofs", {
      type: PmTilesSource.SOURCE_TYPE as any,
      url: PMTILES_URL,
      minzoom: header.minZoom,
      maxzoom: header.maxZoom,
      bounds: bounds,
    });
    map.addLayer({
      id: "cool_roofs",
      source: "cool_roofs",
      "source-layer": "raster-layer",
      type: "raster",
      layout: { visibility: "visible" },
      paint: {
        "raster-color": [
          "interpolate",
          ["linear"],
          ["raster-value"],
          0,"#6e008c",
          1,"#a23f9a",
          // "#cd6666",
          // 55,
          // "#e0bf80",
          // 60,
          // "#ffff73",
        ],
      },
    });
  });

  return function onDestory() {
    map.removeLayer("cool_roofs");
    map.removeSource("cool_roofs");
  };

  // see attributes here
  // https://services3.arcgis.com/QnAlpI4OtHhbgGN9/arcgis/rest/services/Dashboard_Data_WFL1/FeatureServer/2
}
