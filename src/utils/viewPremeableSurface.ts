import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";


import { viewNTABorderLine } from "./viewNTABorderLine";

export function viewPremeableSurface(map: mapboxgl.Map) {
    const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;

    //@ts-ignore
    mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

    const PMTILES_URL = `https://urban-heat-portal-tiles.s3.us-east-1.amazonaws.com/landcover_2feet.pmtiles`;
    PmTilesSource.getHeader(PMTILES_URL).then(header => {
        const bounds = [
            header.minLon,
            header.minLat,
            header.maxLon,
            header.maxLat,
        ];
        map.addSource("premeable_surface", {
            type: PmTilesSource.SOURCE_TYPE as any,
            url: PMTILES_URL,
            minzoom: header.minZoom,
            maxzoom: header.maxZoom,
            bounds: bounds,
        });
        map.addLayer({
            id: "premeable_surface",
            source: "premeable_surface",
            "source-layer": "raster-layer",
            type: "raster",
            "layout": { "visibility": "visible" },
            paint: {
                "raster-opacity": .85,
                'raster-color': [
                    "interpolate",
                    ["linear"],
                    ["raster-value"],
                    1.9/255, "rgba(0,0,0,0)",    // 小於 2 時透明
                    2/255, '#8f6018',           // 2 開始顯示棕色
                    4.1/255, "rgba(0,0,0,0)"    // 大於 4 時透明
                ],
                "raster-resampling": "nearest",
            },
        });


    viewNTABorderLine(map, "NTA_PCT_MRT_Less_Than_110")
    });

    return function onDestory() {
        map.removeLayer("premeable_surface")
        map.removeSource("premeable_surface")
        map.removeLayer('nta_outline')
        map.removeSource("nta");
    }
}