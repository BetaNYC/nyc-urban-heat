import { useEffect, useContext, Dispatch, SetStateAction } from 'react'
import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'
import { Popup, MapLayerMouseEvent } from 'mapbox-gl'
import { useQuery } from 'react-query';

import { fetchNTAHeatData } from '../api/api.ts'
import { FeatureCollection, Geometry } from 'geojson';

const useOutdoorHeatExposureNTALayer = (map: mapboxgl.Map | null, setNtaProfileData: Dispatch<SetStateAction<object>>) => {
    const ntaQuery = useQuery({ queryKey: ['nta'], queryFn: fetchNTAHeatData });
    const { layer } = useContext(MapLayersContext) as MapLayersContextType;
    
    useEffect(() => {
        if (layer === 'Outdoor Heat Exposure Index') {
            if (ntaQuery.isSuccess && ntaQuery.data) {
                const popup = new Popup({
                    closeButton: false
                });
                let clickedNtacode: null | string = null

                if (!map?.getSource('nta')) {
                    map?.addSource('nta', {
                        type: 'geojson',
                        data: ntaQuery.data as FeatureCollection,
                        promoteId: "ntacode"
                    })
                }

                // Reset layers
                if (map?.getLayer('nta')) map.removeLayer('nta');
                if (map?.getLayer('nta-outline')) map.removeLayer('nta-outline');

                map?.addLayer({
                    'id': 'nta',
                    'type': 'fill',
                    'source': 'nta',
                    'layout': {},
                    'paint': {
                        // todo - color by 'Heat_Vulnerability' index
                        'fill-color': '#0080ff',
                        'fill-opacity': 0.4
                    }
                });

                map?.addLayer({
                    'id': 'nta-outline',
                    'type': 'line',
                    'source': 'nta',
                    'layout': {},
                    'paint': {
                        'line-color': 'rgba(0,0,0,0.6)',
                        'line-width': [
                            'case',
                            ['boolean', ['feature-state', 'selected'], false],
                            2,
                            0
                        ]
                    }
                });

                map?.on('click', 'nta', (e: MapLayerMouseEvent) => {
                    if (e.features) {
                        const properties = (e.features[0].properties as any)
                        const { ntacode } = properties

                        // unoutline previous, then outline
                        if (clickedNtacode !== null) {
                            map.setFeatureState(
                                { source: 'nta', id: clickedNtacode},
                                { selected: false }
                            );
                        }

                        clickedNtacode = JSON.parse(JSON.stringify(ntacode))
                        map.setFeatureState(
                            { source: 'nta', id: ntacode },
                            { selected: true }
                        );

                        //dispatch data to profile
                        setNtaProfileData(properties)
                    }
                })

                const boroExpand = {
                    'MN': 'Manhattan',
                    'BX': 'The Bronx',
                    'BK': 'Brooklyn',
                    'QN': 'Queens',
                    'SI': 'Staten Island'
                }

                map?.on('mousemove', 'nta', (e: MapLayerMouseEvent) => {
                    map.getCanvas().style.cursor = 'pointer';
                    if (e.features) {
                        const coordinates = e.lngLat
                        const { ntaname, ntacode, Heat_Vulnerability } = (e.features[0].properties as any)
                        const boro = boroExpand[ntacode.slice(0, 2) as keyof typeof boroExpand];
                        const title = `
                            <div class="tooltip-top">
                                <h5>${boro}</h5>
                                <h4>${ntaname}</h4>
                            </div>
                            
                        `
                        const details = `
                        <div class="tooltip-bottom">
                                <div>
                                    <span>Heat Vulnerability Index</span><span>${Heat_Vulnerability}</span>
                                </div>
                            </div>
                        `

                        const content = title + (Heat_Vulnerability ? details : '')

                        popup.setLngLat(coordinates).setHTML(content).addTo(map);
                    }
                });

                map?.on('mouseleave', 'nta', () => {
                    map.getCanvas().style.cursor = '';
                    //popup.remove();
                });
            } else {
                // todo: toast error message about layer
            }
        }
    }, [map, layer]);
};


export default useOutdoorHeatExposureNTALayer;