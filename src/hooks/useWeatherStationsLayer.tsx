// import { useEffect, useContext, Dispatch, SetStateAction } from "react"
// import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'
// import { MapMouseEvent, EventData } from 'mapbox-gl'
// import { useQuery } from 'react-query';

// import { fetchStationData } from "../utils/api.ts"



const useWeatherStationLayer = (
) => {
    // const weatherStationsQuery = useQuery({ queryKey: ['stations'], queryFn: fetchStationData });
    const weatherStationsQuery = []
    // console.log(weatherStationsQuery.data)

    // const { layer } = useContext(MapLayersContext) as MapLayersContextType;



    // useEffect(() => {
    //     if (layer === "Weather Stations") {
    //         if (weatherStationsQuery.isSuccess && weatherStationsQuery.data) {
    //             const weatherStationsDataForYear = {
    //                 type: "FeatureCollection",
    //                 //@ts-ignore
    //                 features: weatherStationsQuery.data.features.filter(d => d.properties.year === +year)
    //             };

    //             if (map?.getSource('weather_stations')) {
    //                 // If the source already exists, update its data
    //                 const source = map.getSource('weather_stations') as mapboxgl.GeoJSONSource;
    //                 source.setData(weatherStationsDataForYear as GeoJSON.FeatureCollection);
    //             } else {
    //                 // If the source does not exist, add it
    //                 map?.addSource('weather_stations', {
    //                     type: 'geojson',
    //                     data: weatherStationsDataForYear as GeoJSON.FeatureCollection
    //                 });
    //             }

    //             // Remove existing layers if they exist
    //             if (map?.getLayer("weather_stations_heat_event")) map.removeLayer("weather_stations_heat_event");
    //             if (map?.getLayer("weather_stations_heat_excessive")) map.removeLayer("weather_stations_heat_excessive");
    //             if (map?.getLayer("weather_stations_heat_advisory")) map.removeLayer("weather_stations_heat_advisory");

    //             // Add layers
    //             map?.addLayer({
    //                 id: "weather_stations_heat_event",
    //                 type: "circle",
    //                 source: "weather_stations",
    //                 layout: {
    //                     visibility: 'visible'
    //                 },
    //                 paint: {
    //                     "circle-stroke-width": 0,
    //                     "circle-stroke-color": '#1B1B1B',
    //                     "circle-radius": [
    //                         "*",
    //                         ['number', ['get', 'Days_with_NYC_HeatEvent']], 1.05
    //                     ],
    //                     "circle-color": "#e19f3d",
    //                     "circle-opacity": 1,

    //                 }
    //             });

    //             map?.addLayer({
    //                 id: "weather_stations_heat_advisory",
    //                 type: "circle",
    //                 source: "weather_stations",
    //                 layout: {
    //                     visibility: 'visible'
    //                 },
    //                 paint: {
    //                     "circle-radius": [
    //                         "*",
    //                         ['-', 0, ['number', ['get', 'Days_with_NWS_HeatAdvisory']]], 1.05
    //                     ],
    //                     "circle-color": "#c9733A",
    //                     'circle-opacity': 1
    //                 }
    //             });

    //             map?.addLayer({
    //                 id: "weather_stations_heat_excessive",
    //                 type: "circle",
    //                 source: "weather_stations",
    //                 layout: {
    //                     visibility: 'visible'
    //                 },
    //                 paint: {
    //                     "circle-radius": [
    //                         "*",
    //                         ['-', 0, ['number', ['get', 'Days_with_NWS_Excessive_Heat_Event']]], 1.05
    //                     ],
    //                     "circle-color": "#823E35",
    //                     'circle-opacity': 1
    //                 }
    //             });

    //             // pointer events for ux
    //             map?.on('mouseenter', "weather_stations_heat_event", () => {
    //                 map.getCanvas().style.cursor = 'pointer';
    //             })

    //             map?.on('mouseleave', "weather_stations_heat_event", () => {
    //                 map.getCanvas().style.cursor = '';
    //             })

    //             map?.on('click', "weather_stations_heat_event", (e: MapMouseEvent & EventData) => {
    //                 const properties = e.features[0].properties;
    //                 const address = properties.address;

    //                 setHeatEventDays({
    //                     heatEventDays: properties.Days_with_NYC_HeatEvent,
    //                     heatAdvisoryDays: properties.Days_with_NWS_HeatAdvisory,
    //                     excessiveHeatDays: properties.Days_with_NWS_Excessive_Heat_Event,
    //                     aboveHistoricMaxDays: properties.Days_warmer_than_normal_max,
    //                     aboveHistoricMinDays: properties.Days_warmer_than_normal_min
    //                 });
    //                 setAddress(address);

    //                 map?.setPaintProperty("weather_stations_heat_event", "circle-stroke-width", [
    //                     'case',
    //                     ['==', ['get', 'address'], address], 2,
    //                     0
    //                 ]);

    //                 const clickedLngLat = e.lngLat;
    //                 const targetLngLat = map.project(clickedLngLat);

    //                 // console.log(properties)

    //                 const offsetX = map.getContainer().clientWidth * 0.325; // Move the map by 37.5% of its width to the left
    //                 const newCenter = map.unproject([targetLngLat.x + offsetX, targetLngLat.y]);

    //                 map.easeTo({
    //                     center: newCenter,
    //                     duration: 1500
    //                 });

    //                 setProfileExpanded(true)

    //                 const targetLegend = (layer!.charAt(0).toLowerCase() + layer!.slice(1)).replace(/\s+/g, '')
    //                 setLegendShown(prevLegendShown => ({ ...prevLegendShown, [targetLegend]: false }));
    //             });

    //         }
    //     }
    // }, [map, year, weatherStationsQuery.isSuccess, weatherStationsQuery.data, layer]);
};


export default useWeatherStationLayer;