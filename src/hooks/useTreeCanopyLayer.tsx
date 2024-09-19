import { useState, useEffect, useContext } from 'react'


import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'
import * as mapboxPmTiles from 'mapbox-pmtiles';
import mapboxgl from "mapbox-gl"

const loadScript = (src: string) => {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.head.appendChild(script);
};

const useTreeCanopyLayer = (map: mapboxgl.Map | null) => {
    const { layer, layerData } = useContext(MapLayersContext) as MapLayersContextType

    const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;


    useEffect(() => {
        loadScript(
            'https://cdn.jsdelivr.net/npm/mapbox-pmtiles@1/dist/mapbox-pmtiles.umd.min.js'
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

                switch (layerData['Tree Canopy']) {
                    case 'nta':
                        if (map!.getSource('tree_canopy')) {
                            map!.removeLayer('tree_canopy');
                            map!.removeSource('tree_canopy');
                        }
                        break
                    case 'raw':
                        if (map!.getSource('tree_canopy')) {
                            map!.removeLayer('tree_canopy');
                            map!.removeSource('tree_canopy');
                        }
                        map!.addSource("tree_canopy", {
                            type: mapboxPmTiles.PmTilesSource.SOURCE_TYPE as any,
                            url: PMTILES_URL,
                            minzoom: header.minZoom,
                            maxzoom: header.maxZoom,
                            bounds: bounds,
                        }),
                            map!.addLayer({
                                id: "tree_canopy",
                                source: "tree_canopy",
                                "source-layer": "raster-layer",
                                type: "raster",
                                "layout": { "visibility": "visible" },
                                paint: {
                                    'raster-color': [
                                        'interpolate',
                                        ['linear'],
                                        ['raster-value'],
                                        0, 'rgba(188,188,195,1)',
                                        1 / 255, 'rgba(52,92,103,0.6)',
                                    ],
                                    "raster-resampling": "nearest",
                                },
                            });
                        break;
                }

                // map!.showTileBoundaries = true;




            })()
        }
    }, [map, layer, layerData])

}

export default useTreeCanopyLayer