import { useState, useEffect, useContext } from "react";
import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext.tsx'
import { MapMouseEvent, EventData } from 'mapbox-gl'
import { useQuery } from 'react-query';

import { fetchNTAHeatData } from '../api/api.ts'
import { FeatureCollection } from "geojson";

const useNTALayer = (map: mapboxgl.Map | null) => {

    const ntaDataQuery = useQuery({ queryKey: ['cool roofs'], queryFn: fetchNTAHeatData })
    const { layer } = useContext(MapLayersContext) as MapLayersContextType;


    useEffect(() => {
        if (ntaDataQuery.isSuccess && ntaDataQuery.data) {
            console.log(ntaDataQuery.data.features)

            const features = ntaDataQuery.data.features;

            // Initialize max and min variables
            let maxPctAreaCoolRoof = -Infinity;
            let minPctAreaCoolRoof = Infinity;

            // Loop through each feature to find max and min
            features.forEach(feature => {
                const value = feature.properties?.pct_permeable
                    ;

                if (value !== undefined && value !== null) {
                    if (value > maxPctAreaCoolRoof) {
                        maxPctAreaCoolRoof = value;
                    }
                    if (value < minPctAreaCoolRoof) {
                        minPctAreaCoolRoof = value;
                    }
                }
            });

            // console.log('Max pct_Area_coolRoof:', maxPctAreaCoolRoof);
            // console.log('Min pct_Area_coolRoof:', minPctAreaCoolRoof);

            if (!map?.getSource('nta')) {
                map?.addSource('nta', {
                    type: 'geojson',
                    data: ntaDataQuery.data as FeatureCollection
                })
            }

            if (map?.getLayer('nta')) map.removeLayer('nta')

            if (layer === 'Cool Roofs') {
                map?.addLayer({
                    id: 'nta',
                    type: 'fill',
                    source: 'nta',
                    paint: {
                        'fill-color': [
                            "interpolate",
                            ["linear"],
                            ["get", "pct_Area_coolRoof"],
                            3,
                            "#b3cde0",
                            76.5,
                            "#03396c"
                        ],
                        'fill-opacity': 1,
                    },
                });
            }

            if (layer === "Parks") {
                map?.addLayer({
                    id: 'nta',
                    type: 'fill',
                    source: 'nta',
                    paint: {
                        'fill-color': [
                            "interpolate",
                            ["linear"],
                            ["get", "Avg_dist_to_parks_ft"],
                            222,
                            "#295f48",
                            6144,
                            "#b3d5c7",
                        ],
                    }
                })
            }

            if (layer === 'Premeable Surfaces') {
                map?.addLayer({
                    id: 'nta',
                    type: 'fill',
                    source: 'nta',
                    paint: {
                        'fill-color': [
                            "interpolate",
                            ["linear"],
                            ["get", "pct_permeable"],
                            0.74,
                            "#c68642",
                            70.4,
                            "#ffdbac",
                        ],
                    }
                })
            }

            if (map?.getLayer('nta_outline')) map.removeLayer('nta_outline');

            map?.addLayer({
                id: 'nta_outline',
                type: 'line',
                source: 'nta',
                paint: {
                    "line-color": 'rgba(255,255,255,0.6)',
                    'line-width': 1,
                }
            });

        }







    }, [map, layer])

}


export default useNTALayer