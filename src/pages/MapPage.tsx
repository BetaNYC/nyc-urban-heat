import { useState, useEffect, useRef, useContext } from 'react'
import { useQuery } from 'react-query';
//@ts-ignore
import { fetchStationsPoint } from "../api/api.js"

import Nav from "../components/Nav"
import NeighborhoodProfile from '../components/NeighborhoodProfile.js';
import LayerSelections from '../components/LayerSelections.js';
import MapDateSelections from '../components/MapDateSelections.js';

import stations from "../data/stations.geo.json";

import * as mapboxPmTiles from 'mapbox-pmtiles';
import mapboxgl from "mapbox-gl"
import { MapContext, MapContextType } from "../contexts/mapContext.js"

const loadScript = (src: string, onLoad: () => void) => {
  const script = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  script.onload = onLoad;
  document.head.appendChild(script);
};

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { setMap } = useContext(MapContext) as MapContextType;

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false)

  const weatherStationsQuery = useQuery({ queryKey: ['stations'], queryFn: fetchStationsPoint });

  useEffect(() => {
    loadScript(
      'https://cdn.jsdelivr.net/npm/mapbox-pmtiles@1/dist/mapbox-pmtiles.umd.min.js',
      () => setIsScriptLoaded(true)
    );
  }, []);

  useEffect(() => {
    if (!weatherStationsQuery.isSuccess || !mapContainer.current || !isScriptLoaded) return;

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
      if (mapboxPmTiles) {
        const { PmTilesSource, SOURCE_TYPE } = mapboxPmTiles;
        //@ts-ignore
        mapboxgl.Style.setSourceType(SOURCE_TYPE, PmTilesSource);

        const PMTILES_URL = 'https://urban-heat-portal-tiles.s3.amazonaws.com/ST_Clipped_20230902.pmtiles';
        const header = await PmTilesSource.getHeader(PMTILES_URL);
        const bounds = [
          header.minLon,
          header.minLat,
          header.maxLon,
          header.maxLat,
        ];

        m.addSource("surface_temperature", {
          type: PmTilesSource.SOURCE_TYPE as any,
          url: PMTILES_URL,
          minzoom: header.minZoom,
          maxzoom: header.maxZoom,
          bounds: bounds,
        });


        m.addSource('weather_stations', {
          type: 'geojson',
          data: stations as GeoJSON.FeatureCollection
        });

        // m.showTileBoundaries = true;
        m.addLayer({
          id: 'surface_temperature',
          source: 'surface_temperature',
          'source-layer': 'raster-layer',
          type: 'raster',
          layout: { visibility: 'none' },
          interactive: true,
          paint: {
            // "raster-resampling": "nearest",
          },
        });
        // m.on("click", 'surface_temperature', () => {
        //   console.log("Clicked on surface_temperature layer");
        //   setProfileExpanded(true);
        // });

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
    });

    return () => {
      if (m) m.remove();
    };
  }, [weatherStationsQuery.isSuccess, weatherStationsQuery.data, isScriptLoaded]);




  return (
    <div className='relative w-full h-full'>
      <Nav />
      <div className='w-full h-[calc(100%_-_3.125rem)]' ref={mapContainer} />
      <NeighborhoodProfile profileExpanded={profileExpanded} setProfileExpanded={setProfileExpanded} />
      <LayerSelections />
      <MapDateSelections />
    </div>
  );
};

export default MapPage;
