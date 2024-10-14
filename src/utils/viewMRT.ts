import * as mapboxPmTiles from 'mapbox-pmtiles';
import mapboxgl from "mapbox-gl"
import { nta_dataset_info } from '../App';

export function viewMRT(map: mapboxgl.Map) {
    const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;

    //@ts-ignore
    mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

    const layer_source_url = nta_dataset_info.value.find(dataset => dataset.metric === 'MRT').downloads_2

    PmTilesSource.getHeader(layer_source_url).then(header => {

        const bounds = [
            header.minLon,
            header.minLat,
            header.maxLon,
            header.maxLat,
        ];
        map.addSource("mrt", {
            type: PmTilesSource.SOURCE_TYPE as any,
            url: layer_source_url,
            minzoom: header.minZoom,
            maxzoom: header.maxZoom,
            bounds: bounds,
        });

        map.addLayer({
            id: "mrt",
            source: "mrt",
            "source-layer": "raster-layer",
            type: "raster",
            paint: {
                'raster-opacity': 0.8,
                'raster-color': [
                    'interpolate',
                    ['linear'],
                    ['raster-value'],
                    88 / 255, 'rgba(0, 0, 0, 1)',  
                    155 / 255, 'rgba(255, 255, 255, 1)' 
                ],
                "raster-resampling": "nearest",
            }
        });
        
    });

    return function onDestory() {
        map.removeLayer('mrt')
        map.removeSource('mrt')
    }
}