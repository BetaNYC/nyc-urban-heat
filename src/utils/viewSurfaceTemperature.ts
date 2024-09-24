import * as mapboxPmTiles from 'mapbox-pmtiles';
import mapboxgl from "mapbox-gl"


export function viewSurfaceTemperature(map: mapboxgl.Map) {
    const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;

    //@ts-ignore
    mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

    const PMTILES_URL = `https://urban-heat-portal-tiles.s3.amazonaws.com/ST_Clipped_20230902.pmtiles`;
    PmTilesSource.getHeader(PMTILES_URL).then(header => {
        const bounds = [
            header.minLon,
            header.minLat,
            header.maxLon,
            header.maxLat,
        ];
        map.addSource("surface_temperature", {
            type: PmTilesSource.SOURCE_TYPE as any,
            url: PMTILES_URL,
            minzoom: header.minZoom,
            maxzoom: header.maxZoom,
            bounds: bounds,
        });
        map.addLayer({
            id: 'surface_temperature',
            source: 'surface_temperature',
            'source-layer': 'raster-layer',
            type: 'raster',
            layout: { visibility: 'visible' },
            interactive: true,
            paint: {
                'raster-opacity': 0.8,
                'raster-color': [
                    'interpolate',
                    ['linear'],
                    ['raster-value'],
                    0, '#5e4fa2',
                    0.315, '#98c1d9',
                    0.375, '#ffe6a8',
                    0.4, '#ffbba8',
                    0.45, '#d66852',
                    0.55, '#511113',
                ]
            },
        });
    });

    return function onDestory() {
        map.removeLayer('surface_temperature')
        map.removeSource('surface_temperature')
    }
}