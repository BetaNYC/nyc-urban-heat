import ntaFeatureCollection from '../data/nta.geo.json'
import mapboxgl, { Popup } from "mapbox-gl"

import { FeatureCollection } from 'geojson';
import { cachedFetch } from "./cache"

import { GeoJSONTransformHandler } from "./geojson"
import { API_KEY, BASE_URL } from './api';


export function createNtaLayer(map: mapboxgl.Map, metric: string, fill_paint_styles: any) {
    const sourceId = metric + '_SOURCE'
    const layerFillId = metric + '_FILL'
    const layerOutlineId = metric + '_OUTLINE'

    const popup = new Popup({
        closeButton: true
    });

    const url =
        cachedFetch(`${BASE_URL}nta_metrics?metric=eq.${metric}&apikey=${API_KEY}`).then(async (data) => {

            // merge in data with nta
            const features = GeoJSONTransformHandler((ntaFeatureCollection as FeatureCollection).features).map(feature => {
                if (feature.properties) {
                    const { ntacode } = feature.properties
                    feature.properties[metric] = +data[0][ntacode]
                }
                return feature
            })

            // create layers
            map.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: "FeatureCollection",
                    features
                } as FeatureCollection,
                promoteId: "ntacode"
            })

            map.addLayer({
                'id': layerFillId,
                'type': 'fill',
                'source': sourceId,
                'layout': {},
                'paint': fill_paint_styles
            });

            map?.addLayer({
                'id': layerOutlineId,
                'type': 'line',
                'source': sourceId,
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
        })

    return function onDestory() {
        map.removeLayer(layerFillId)
        map.removeLayer(layerOutlineId)
        map.removeSource(sourceId)
    }
}