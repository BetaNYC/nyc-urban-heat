import { useEffect, useRef } from 'react'
import mapboxgl, { MapboxGeoJSONFeature, LngLatLike } from "mapbox-gl"

import Nav from "../components/Nav"
import DatasetDownloadPopup from '../components/DatasetDownloadPopup.js'
import NeighborhoodProfile from '../components/NeighborhoodProfile.js';
import DatasetSelections from '../components/DatasetSelections.js';
import MapDateSelections from '../components/MapDateSelections.js';
import WeatherStationProfile from '../components/WeatherStationProfile.js';
import Legends from '../components/Legends.js';
import "./Map.css"
import { signal } from '@preact/signals-react'
import { Dataset, datasets } from '../utils/datasets.js';
import { NtaProfileData, WeatherStationData } from '../types.js';
import { initializeView } from '../utils/datasets.js';


export const map = signal<mapboxgl.Map | null>(null)
export const selectedDataset = signal<Dataset | null>(datasets[0])
export const neighborhoodProfileData = signal<NtaProfileData | null>(null)
export const isNeighborhoodProfileExpanded = signal(false)
export const weatherStationProfileData = signal<WeatherStationData | null>(null)
export const isWeatherStationProfileExpanded = signal(false)
export const clickedAddress = signal<string>("F4321")
export const clickedWeatherStationName = signal<string>("Upper East Side")
export const isDataSelectionExpanded = signal(false)
export const previousClickCor = signal<[number, number]>([0, 0])
export const clickedWeatherStationPopup = signal<mapboxgl.Popup | null>(null)
export const clickedNeighborhoodPopup = signal<mapboxgl.Popup | null>(null)
export const clickedNeighborhoodInfo = signal<{
  boro: string,
  nta: string
}>({
  boro: "Manhattan",
  nta: "West Village"
})

export const clickedWeatherStationNeighborhoodID = signal<string | null>(null)
export const clickedNeighborhoodNearestStationAddress = signal<string | null>(null)


const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  const defaultCoordinates: LngLatLike | undefined = [-73.913, 40.763]
  const defaultZoom = 11

  useEffect(() => {
    // init map
    if (!mapContainer.current) return;

    mapboxgl.accessToken = "pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw";

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/cloudlun/clle3783901j201p43864c07n",
      center: defaultCoordinates,
      zoom: defaultZoom,
      maxZoom: 20,
      interactive: true,
      doubleClickZoom: false,
    });

    m.dragRotate.disable();
    m.touchZoomRotate.disableRotation();
    m.addControl(new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: true,
    }), 'bottom-right');

    const bounds = new mapboxgl.LngLatBounds(
      [-74.30, 40.40], // 西南角：West Orange 和 Sandy Hook Bay
      [-73.10, 40.98]  // 東北角：Long Island 和 White Plains
    );

    m.setMaxBounds(bounds);

    m.on('load', () => {
      map.value = m
      initializeView(datasets[0], map.value)
    });

    return () => {
      if (m) {
        m.remove();
        map.value = null;
      }
    };
  }, []);



  return (
    <div className='relative w-full h-full'>
      {/* <div className='absolute top-0 left-[17.5vw] w-[2px] h-[100vh] bg-[#fe8585] z-[100000]'></div>
      <div className='absolute top-1/2 left-1/2 w-[20px] h-[20px] bg-[#fe8585] z-[1000000] rounded-full transform -translate-x-1/2 -translate-y-1/2'></div> */}
      <Nav />
      {
        selectedDataset.value?.name === "Weather Stations" && <WeatherStationProfile />
      }
      {
        selectedDataset.value?.name !== "Weather Stations" && <NeighborhoodProfile />
      }
      <DatasetSelections />
      <MapDateSelections />
      <Legends />
      <div className='w-full h-[calc(100%_-_3.125rem)]' ref={mapContainer} />
    </div>
  );
};

export default MapPage;
