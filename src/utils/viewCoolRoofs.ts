// @ts-ignore
import FeatureService from 'mapbox-gl-arcgis-featureserver'
import mapboxgl from "mapbox-gl"


export function viewCoolRoofs(map: mapboxgl.Map) {
    const fsSourceId = 'featureserver-src'

    const service = new FeatureService(fsSourceId, map, {
        url: 'https://services3.arcgis.com/QnAlpI4OtHhbgGN9/arcgis/rest/services/Dashboard_Data_WFL1/FeatureServer/2'
    })

    // see attributes here 
    // https://services3.arcgis.com/QnAlpI4OtHhbgGN9/arcgis/rest/services/Dashboard_Data_WFL1/FeatureServer/2
    map.addLayer({
        'id': 'fill-lyr',
        'source': fsSourceId,
        'type': 'fill',
        'paint': {
            'fill-opacity': 0.5,
            'fill-color': [
                'step',
                ['get', 'ref2020'],
                '#6e008c',  // color for values < 30
                30, '#a23f9a',
                45, '#cd6666',
                55, '#e0bf80',
                60, '#ffff73'
            ]
        }
    })

    return function onDestory() {
        map.removeLayer('fill-lyr')
    }
}