import { useState, useEffect, useRef, useContext } from 'react'

import mapboxgl from "mapbox-gl"
import { MapContext, MapContextType } from "../contexts/mapContext.js"


import useSurfaceTemperatureLayer from '../hooks/useSurfaceTemperatureLayer.js';
import useWeatherStationLayer from '../hooks/useWeatherStationsLayer.js';

import Nav from "../components/Nav"
import NeighborhoodProfile from '../components/NeighborhoodProfile.js';
import LayerSelections from '../components/LayerSelections.js';
import MapDateSelections from '../components/MapDateSelections.js';
import WeatherStationProfile from '../components/WeatherStationProfile.js';


const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, setMap } = useContext(MapContext) as MapContextType;

  const [profileExpanded, setProfileExpanded] = useState(false)
  const [date, setDate] = useState<string | null>("20230902")


  useEffect(() => {
    if (!mapContainer.current) return;

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

    m.on('load', () => {


      setMap(m);
    });

    // return () => {
    //   if (m) m.remove();
    // };
  }, []);





  useSurfaceTemperatureLayer(date, map)
  useWeatherStationLayer(map)











  return (
    <div className='relative w-full h-full'>
      <Nav />
      <div className='w-full h-[calc(100%_-_3.125rem)]' ref={mapContainer} />
      < WeatherStationProfile profileExpanded={profileExpanded} setProfileExpanded={setProfileExpanded} />
      <LayerSelections />
      <MapDateSelections date={date!} setDate={setDate} />
    </div>
  );
};

export default MapPage;
