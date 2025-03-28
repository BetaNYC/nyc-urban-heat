import * as mapboxPmTiles from 'mapbox-pmtiles';
import mapboxgl from "mapbox-gl"

import { viewNTABorderLine } from "./viewNTABorderLine";
export function viewTreeCanopy(map: mapboxgl.Map) {
    const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;

    //@ts-ignore
    mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

    const PMTILES_URL = `https://urban-heat-portal-tiles.s3.amazonaws.com/NYC_Tree_Canopy_2_Feet.pmtiles`;
    PmTilesSource.getHeader(PMTILES_URL).then(header => {
        const bounds = [
            header.minLon,
            header.minLat,
            header.maxLon,
            header.maxLat,
        ];
        map.addSource("tree_canopy", {
            type: PmTilesSource.SOURCE_TYPE as any,
            url: PMTILES_URL,
            minzoom: header.minZoom,
            maxzoom: header.maxZoom,
            bounds: bounds,
        });
        map.addLayer({
            id: "tree_canopy",
            source: "tree_canopy",
            "source-layer": "raster-layer",
            type: "raster",
            "layout": { "visibility": "visible" },
            paint: {
                "raster-opacity": .85,
                'raster-color': [
                    'case',
                    ['==', ['raster-value'], 0], 'rgba(0, 0, 0, 0)', 
                    '#335d68' 
                ],
                "raster-resampling": "nearest",
            },
        });

        viewNTABorderLine(map, "PCT_TREES")
    });

    return function onDestory() {
        map.removeLayer('tree_canopy')
        map.removeSource('tree_canopy')
        map.removeLayer('nta_outline')
        map.removeSource("nta");
    }
}