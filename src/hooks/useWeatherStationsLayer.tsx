import { useState, useEffect, useContext } from 'react'
import { useQuery } from 'react-query';

//@ts-ignore
import { fetchCombinedData } from "../api/api.js"

import stations from "../data/stations.geo.json";





const useWeatherStationLayer = (map: mapboxgl.Map | null) => {
    const weatherStationsQuery = useQuery({ queryKey: ['stations'], queryFn: fetchCombinedData });
    // console.log(weatherStationsQuery.data)

    useEffect(() => {
        if (weatherStationsQuery.isSuccess && weatherStationsQuery.data) {
            const weatherStationsData2023 = {
                type: "FeatureCollection",
                features: weatherStationsQuery.data.features.filter(d => d.properties.year === 2023)
            };


            if (!map?.getSource('weather_stations')) {
                console.log(weatherStationsData2023)
                map?.addSource('weather_stations', {
                    type: 'geojson',
                    data: weatherStationsData2023 as GeoJSON.FeatureCollection
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
                            ['-', 0, ['number', ['get', 'Days_with_NYC_HeatEvent']]], 1.08
                        ],
                        "circle-color": "#ad844a"
                    }

                });
                map?.addLayer({
                    id: "weather_stations_heat_advisory",
                    type: "circle",
                    source: "weather_stations",
                    layout: {
                        visibility: 'none'
                    },
                    paint: {
                        "circle-radius": [
                            "*",
                            ['-', 0, ['number', ['get', 'Days_with_NWS_HeatAdvisory']]], 2
                        ],
                        "circle-color": "#a46338",
                        'circle-opacity': 1
                    }
                });

                map?.addLayer({
                    id: "weather_stations_heat_excessive",
                    type: "circle",
                    source: "weather_stations",
                    layout: {
                        visibility: 'none'
                    },
                    paint: {
                        "circle-radius": [
                            "*",
                            ['-', 0, ['number', ['get', 'Days_with_NWS_Excessive_Heat_Event']]], 2
                        ],
                        "circle-color": "#823e35",
                        'circle-opacity': 1
                    }
                });
            }
        }
    }, [map, weatherStationsQuery.isSuccess, weatherStationsQuery.data]);
}

export default useWeatherStationLayer;