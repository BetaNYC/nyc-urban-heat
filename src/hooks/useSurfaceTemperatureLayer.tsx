import { useState, useEffect, useContext } from 'react'


import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'
import * as mapboxPmTiles from 'mapbox-pmtiles';
import mapboxgl from "mapbox-gl"


const loadScript = (src: string, onLoad: () => void) => {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.onload = onLoad;
    document.head.appendChild(script);
};


const useSurfaceTemperatureLayer = (date: string | null, map: mapboxgl.Map | null) => {

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const { layer } = useContext(MapLayersContext) as MapLayersContextType


    const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;


    useEffect(() => {
        loadScript(
            'https://cdn.jsdelivr.net/npm/mapbox-pmtiles@1/dist/mapbox-pmtiles.umd.min.js',
            () => setIsScriptLoaded(true)
        );
    }, []);

    useEffect(() => {
        if (layer === "Surface Temperature") {
            (async () => {

                if (!map) return;
                if (map.getLayer('surface_temperature')) map.removeLayer('surface_temperature');
                if (map.getSource('surface_temperature')) map.removeSource('surface_temperature');

                //@ts-ignore
                mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);
                const PMTILES_URL = `https://urban-heat-portal-tiles.s3.amazonaws.com/ST_Clipped_${date === "Available Datasets" ? "20230902" : date}.pmtiles`;
                const header = await PmTilesSource.getHeader(PMTILES_URL);
                const bounds = [
                    header.minLon,
                    header.minLat,
                    header.maxLon,
                    header.maxLat,
                ];
                map!.addSource("surface_temperature", {
                    type: PmTilesSource.SOURCE_TYPE as any,
                    url: PMTILES_URL,
                    minzoom: header.minZoom,
                    maxzoom: header.maxZoom,
                    bounds: bounds,
                });

                map!.addLayer({
                    id: 'surface_temperature',
                    source: 'surface_temperature',
                    'source-layer': 'raster-layer',
                    type: 'raster',
                    layout: { visibility: 'visible' },
                    interactive: true,
                    paint: {
                        'raster-opacity': 0.8,
                        // 'raster-color': "red"
                        // "raster-resampling": "nearest", // Uncomment if needed for resampling method
                    },
                });
                // m.on("click", 'surface_temperature', () => {
                //   console.log("Clicked on surface_temperature layer");
                //   setProfileExpanded(true);
                // });

                map!.setPaintProperty('surface_temperature', 'raster-color', [
                    'interpolate',
                    ['linear'],
                    ['raster-value'],
                    // 0.25, '#1f2c3f',
                    // 0.29, '#98c1d9',
                    // 0.31, "#dfdee1",
                    // 0.31, '#ffe6a8',
                    // 0.33, '#ffbba8',
                    // 0.375, '#d66852',
                    // 0.6, '#511113'
                    // 0.55, '#d66852',
                    // 0.6, '#511113'

                    0, '#5e4fa2',
                    0.315, '#98c1d9',
                    // 0.325, '#66c2a5',
                    // 0.35, '#abdda4',
                    // 0.375, '#e6f598',
                    0.375, '#ffe6a8',
                    0.4, '#ffbba8',
                    0.45, '#d66852',
                    0.55, '#511113',
                    // 0.6, '#9e0142'
                ])
            }
            )()
        }


    }, [date, map, layer])
}

export default useSurfaceTemperatureLayer

