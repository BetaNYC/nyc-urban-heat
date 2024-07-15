import { useState, useEffect, useRef, useContext } from 'react'
import { useQuery } from 'react-query';
//@ts-ignore
import { fetchStationsPoint } from "../api/api.js"

import Nav from "../components/Nav"
import NeighborhoodProfile from '../components/NeighborhoodProfile.js';
import LayerSelections from '../components/LayerSelections.js';
import MapDateSelections from '../components/MapDateSelections.js';

import stations from "../data/stations.geo.json";


import mapboxgl from "mapbox-gl"
import { MapContext, MapContextType } from "../contexts/mapContext.js"


import useSurfaceTemperatureLayer from '../hooks/useSurfaceTemperatureLayer.js';


const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, setMap } = useContext(MapContext) as MapContextType;

  const [profileExpanded, setProfileExpanded] = useState(false)
  const [date, setDate] = useState<string | null>("20230902")

  const weatherStationsQuery = useQuery({ queryKey: ['stations'], queryFn: fetchStationsPoint });
  // console.log(weatherStationsQuery.data)




  useEffect(() => {
    if (!weatherStationsQuery.isSuccess || !mapContainer.current) return;

    mapboxgl.accessToken = "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw";

    const lng = -73.913;
    const lat = 40.763;
    const zoom = 11;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/cloudlun/clxa8cwsd09ly01nx62o9fjyo",
      center: [lng, lat],
      zoom: zoom,
      minZoom: 10,
      maxZoom: 15,
      interactive: true,
      doubleClickZoom: false,
    });

    m.dragRotate.disable();
    m.touchZoomRotate.disableRotation();
    m.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    m.on('load', async () => {
      m.addSource('weather_stations', {
        type: 'geojson',
        data: stations as GeoJSON.FeatureCollection
      });

      m.addLayer({
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
          'circle-opacity': 0.8
        }
      })

      m.addLayer({
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
          'circle-opacity': 0.8
        }
      })

      m.addLayer({
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
          'circle-opacity': 0.8
        }
      })

      setMap(m);
    }
    );



    return () => {
      if (m) m.remove();
    };
  }, [weatherStationsQuery.isSuccess, weatherStationsQuery.data]);





  useSurfaceTemperatureLayer(date, map)











  return (
    <div className='relative w-full h-full'>
      <Nav />
      <div className='w-full h-[calc(100%_-_3.125rem)]' ref={mapContainer} />
      <NeighborhoodProfile profileExpanded={profileExpanded} setProfileExpanded={setProfileExpanded} />
      <LayerSelections />
      <MapDateSelections date={date!} setDate={setDate} />
    </div>
  );
};

export default MapPage;
