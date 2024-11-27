import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";

export function viewSurfaceTemperature(
  map: mapboxgl.Map,
  date: string = "20230902"
) {
  const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;

  //@ts-ignore
  mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

  const PMTILES_URL = `https://urban-heat-portal-tiles.s3.amazonaws.com/ST_Clipped_${date}.pmtiles`;
  PmTilesSource.getHeader(PMTILES_URL).then((header) => {
    const bounds = [header.minLon, header.minLat, header.maxLon, header.maxLat];
    map.addSource("surface_temperature", {
      type: PmTilesSource.SOURCE_TYPE as any,
      url: PMTILES_URL,
      minzoom: header.minZoom,
      maxzoom: header.maxZoom,
      bounds: bounds,
    });
    map.addLayer({
      id: "surface_temperature",
      source: "surface_temperature",
      "source-layer": "raster-layer",
      type: "raster",
      layout: { visibility: "visible" },
      interactive: true,
      paint: {
        "raster-opacity": 0.8,
        "raster-color": [
          "interpolate",
          ["linear"],
          ["raster-value"],
          0,
          "#5e4fa2",
          0.315,
          "#98c1d9",
          0.375,
          "#ffe6a8",
          0.4,
          "#ffbba8",
          0.45,
          "#d66852",
          0.55,
          "#511113",
          // 0.0055, '#1f2c3f',
          // 0.0201, '#98c1d9',
          // 0.0347, '#dfdee1',
          // 0.0464, '#ffe6a8',
          // 0.0558, '#ffbba8',
          // 0.0663, '#d66852',
          // 0.0982, '#511113'
          // 0, '#1f2c3f',
          // 0.158, '#98c1d9',
          // 0.315, '#dfdee1',
          // 0.444, '#ffe6a8',
          // 0.551, '#ffbba8',
          // 0.659, '#d66852',
          // 1, '#511113'
        ],
      },
    });

    // -34.1967 - 28.75 - 14.37;
    // 0;
    // 11.6018;
    // 21;
    // 31.2;
    // 62.4;
    // 64.2959;

    // map.on('click', function (e) {
    //     console.log(e)
    //     const x = e.point.x;
    //     const y = e.point.y;

    //     // Use the `queryRenderedFeatures` method to query raster tiles
    //     const features = map.queryRenderedFeatures([x, y], {
    //       layers: ['surface_temperature'],
    //     });

    //     // Assuming raster value is within the features returned (check documentation for specifics)
    //     console.log(features);
    //   });

    // -34.1967
    // 64.2959
  });

  return function onDestroy() {
    map.removeLayer("surface_temperature");
    map.removeSource("surface_temperature");
  };
}
