import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";

export function viewRelativeSurfaceTemperature(
  map: mapboxgl.Map,
) {
  const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;

  //@ts-ignore
  mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

  const PMTILES_URL = `https://urban-heat-portal-tiles.s3.amazonaws.com/nanmean_raster_bet_20_80_percentiles_plus100.pmtiles`;
  PmTilesSource.getHeader(PMTILES_URL).then((header) => {
    const bounds = [header.minLon, header.minLat, header.maxLon, header.maxLat];
    map.addSource("relative_surface_temperature", {
      type: PmTilesSource.SOURCE_TYPE as any,
      url: PMTILES_URL,
      minzoom: header.minZoom,
      maxzoom: header.maxZoom,
      bounds: bounds,
    });
    map.addLayer({
      id: "relative_surface_temperature",
      source: "relative_surface_temperature",
      "source-layer": "raster-layer",
      type: "raster",
      layout: { visibility: "visible" },
      interactive: true,
      paint: {
        "raster-opacity": 0.8,
        // tile layer values has modified to have values be above 0 (will be fixed with rgb tile translater)
        // + 100   
        // min: -15 (85 cell value)
        // max: 51F (151 cell value)
        "raster-color": [
          "interpolate",
          ["linear"],
          ["raster-value"],
          85/255,
          "#5e4fa2",
          92/255,
          "#98c1d9",
          100/255,
          "#ffe6a8",
          117/255,
          "#ffbba8",
          134/255,
          "#d66852",
          151/255,
          "#511113",
        ],
      },
    });

  });

  return function onDestroy() {
    map.removeLayer("relative_surface_temperature");
    map.removeSource("relative_surface_temperature");
  };
}



