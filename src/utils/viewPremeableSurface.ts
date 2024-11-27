import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";


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
                
                'raster-color': [
                    'interpolate',
                    ['linear'],
                    ['raster-value'],
                    0.10,"#f3d9b1",
                    0.20,"#dabb8b",
                    0.30,"#c19d65",
                    0.40,"#a87e3e",
                    0.71,"#8f6018"
                ],
                "raster-resampling": "nearest",
            },
        });
    });

    return function onDestory() {
        map.removeLayer("premeable_surface")
        map.removeSource("premeable_surface")
    }
}