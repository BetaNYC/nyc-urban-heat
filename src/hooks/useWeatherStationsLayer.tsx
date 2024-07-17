import { useState, useEffect, useContext } from 'react'
import { useQuery } from 'react-query';

//@ts-ignore
import { fetchStationsPoint } from "../api/api.js"

import stations from "../data/stations.geo.json";


// const weatherStationsQuery = useQuery({ queryKey: ['stations'], queryFn: fetchStationsPoint });



const useWeatherStationLayer = (map: mapboxgl.Map | null) => {

    useEffect(() => {


        if (!map?.getSource('weather_stations')) {
            map?.addSource('weather_stations', {
                type: 'geojson',
                data: stations as GeoJSON.FeatureCollection
            });
        }

        if (!map?.getLayer("weather_stations_heat_event")) {
            map?.addLayer({
                id: "weather_stations_heat_event",
                type: "circle",
                source: "weather_stations",
                layout: {
                    visibility: 'none'
                },
                paint: {
                    "circle-radius": [
                        "*",
                        ['-', 0, ['number', ['get', 'NYC_HeatEvent']]], 1.08
                    ],
                    "circle-color": "#ad844a",
                    'circle-opacity': 1
                }
            })

            map?.addLayer({
                id: "weather_stations_heat_advisory",
                type: "circle",
                source: "weather_stations",
                layout: {
                    visibility: 'none'
                },
                paint: {
                    "circle-radius":
                        [
                            "*",
                            ['-', 0, ['number', ['get', 'HeatAdvisory']]], 1.08
                        ],
                    "circle-color": "#a46338",
                    'circle-opacity': 1
                }
            })

            map?.addLayer({
                id: "weather_stations_heat_excessive",
                type: "circle",
                source: "weather_stations",
                layout: {
                    visibility: 'none'
                },
                paint: {
                    "circle-radius":
                        [
                            "*",
                            ['-', 0, ['number', ['get', 'Excessive_Heat_Event']]], 1.08
                        ],
                    "circle-color": "#823e35",
                    'circle-opacity': 1
                }
            })
        }

    }, [map])
}

export default useWeatherStationLayer