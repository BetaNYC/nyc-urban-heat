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

const useTreeCanopyLayer = (map: mapboxgl.Map | null) => {
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
        if (layer === "Tree Canopy") {
            (async () => {

                //@ts-ignore
                mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

                const PMTILES_URL =
                    "https://urban-heat-portal-tiles.s3.amazonaws.com/NYC_Tree_Canopy_2_Feet.pmtiles";

                const header = await mapboxPmTiles.PmTilesSource.getHeader(PMTILES_URL);
                const bounds = [
                    header.minLon,
                    header.minLat,
                    header.maxLon,
                    header.maxLat,
                ];

                map!.addSource('pmTile', {
                    type: mapboxPmTiles.PmTilesSource.SOURCE_TYPE as any,
                    url: PMTILES_URL,
                    minzoom: header.minZoom,
                    maxzoom: header.maxZoom,
                    bounds: bounds,
                })

                map!.showTileBoundaries = true;
                map!.addLayer({
                    id: "raster-layer",
                    source: "pmTile",
                    "source-layer": "raster-layer",
                    type: "raster",
                    "layout": { "visibility": "visible" },
                    paint: {
                        'raster-color': [
                            'interpolate',
                            ['linear'],
                            ['raster-value'],
                            0, 'rgba(0,0,0,0)',
                            1 / 255, 'rgba(0,100,0,0.6)',
                        ],
                        "raster-resampling": "nearest",
                    },
                });


            })()
        }
    })

}

export default useTreeCanopyLayer