import { useEffect, useContext, Dispatch, SetStateAction } from 'react'
import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'
import { Popup, MapLayerMouseEvent } from 'mapbox-gl'
import { useQuery } from 'react-query';

import { fetchNTAHeatData } from '../api/api.ts'
import { FeatureCollection, Geometry } from 'geojson';

import { format } from 'd3-format';
import { NtaProfileData } from '../types.ts';

const boroughExpand = {
    'MN': 'Manhattan',
    'BX': 'The Bronx',
    'BK': 'Brooklyn',
    'QN': 'Queens',
    'SI': 'Staten Island'
}

const useOutdoorHeatExposureNTALayer = (map: mapboxgl.Map | null, setNtaProfileData: Dispatch<SetStateAction<NtaProfileData>>, setProfileExpanded: Dispatch<SetStateAction<boolean>>) => {
    const ntaQuery = useQuery({ queryKey: ['nta'], queryFn: fetchNTAHeatData });
    const { layer } = useContext(MapLayersContext) as MapLayersContextType;

    useEffect(() => {
        if (layer === 'Outdoor Heat Exposure Index') {
            if (ntaQuery.isSuccess && ntaQuery.data) {
                const popup = new Popup({
                    closeButton: true
                });
                let clickedNtacode: null | string = null
                let currentPopup: Popup | null = null;

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
                        const coordinates = e.lngLat
                        const currentFeature = e.features[0]
                        const { ntaname, ntacode, Heat_Vulnerability, pct_trees, pct_Area_coolRoof } = (currentFeature.properties as any)
                        const borough = boroughExpand[ntacode.slice(0, 2) as keyof typeof boroughExpand];
                        currentFeature!['properties']!['borough'] = borough; // set borough for profile
                        const title = `
                            <div class="tooltip-top">
                                <div>
                                    <h5>${borough}</h5>
                                    <h4>${ntaname}</h4>
                                </div>
                                <div class="text-center">
                                    <span class="text-xxs leading-3">Heat Vulnerability Index</span><span class="text-xl font-mono font-bold">${Heat_Vulnerability ? Heat_Vulnerability + '.0' : ''}</span>
                                </div>
                            </div>
                            
                        `
                        const details = `
                            <div class="tooltip-bottom">
                                <div class="flex flex-col">
                                    <div class="flex flex-row justify-between"><span>Average Surface Temperature</span><span></span></div>
                                    <div class="flex flex-row justify-between"><span>Average Air Temperature</span><span></span></div>
                                    <div class="flex flex-row justify-between"><span>Area Covered By Trees</span><span>${format('.1f')(pct_trees)}%</span></div>
                                    <div class="flex flex-row justify-between"><span>Cool Roofs</span><span>${format('.1f')(pct_Area_coolRoof)}%</span></div>
                                    <div class="flex flex-row justify-between"><span>Number of Cooling Centers</span><span></span></div>
                                </div>
                                <button class="mt-2 underline cursor-pointer" id="view-profile-link">Click to view community district profile</button>
                            </div>
                        `
                        const content = title + (Heat_Vulnerability ? details : '')
                        //create a dom element with click eventListerner to open profile and update its data
                        if (currentPopup) currentPopup.remove();

                        if (map && ntaQuery.data) {
                            const divElement = document.createElement('div');
                            divElement.innerHTML = content
                            divElement.querySelector('#view-profile-link')?.addEventListener('click', () => {
                                //dispatch data to profile
                                const data = {
                                    currentFeature,
                                    allFeatures: ntaQuery.data.features
                                }
                                setNtaProfileData(data)
                                setProfileExpanded(true)
                            })

                            currentPopup = popup.setLngLat(coordinates).setDOMContent(divElement).addTo(map);
                        }

                        // unoutline previous, then outline
                        if (clickedNtacode !== null) {
                            map.setFeatureState(
                                { source: 'nta', id: clickedNtacode },
                                { selected: false }
                            );
                        }

                        clickedNtacode = JSON.parse(JSON.stringify(ntacode))
                        map.setFeatureState(
                            { source: 'nta', id: ntacode },
                            { selected: true }
                        );

                    }
                })

                map?.on('mouseover', 'nta', (e: MapLayerMouseEvent) => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                map?.on('mouseleave', 'nta', () => {
                    map.getCanvas().style.cursor = '';
                });
            } else {
                // todo: toast error message about layer
            }
        }
    }, [map, layer]);
};


export default useOutdoorHeatExposureNTALayer;