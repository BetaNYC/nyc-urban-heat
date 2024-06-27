import { useState, useEffect, useRef, useContext } from 'react'
import { useQuery } from 'react-query';
//@ts-ignore
import { fetchStationsPoint } from "../api/api.js"
import Nav from "../components/Nav"
import * as mapboxPmTiles from 'mapbox-pmtiles';
import mapboxgl from "mapbox-gl"
import { MapContext, MapContextType } from "../contexts/mapContexts"

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
  const coolRoofsQuery = useQuery({ queryKey: ['stations'], queryFn: fetchStationsPoint });

  useEffect(() => {
    loadScript(
      'https://cdn.jsdelivr.net/npm/mapbox-pmtiles@1/dist/mapbox-pmtiles.umd.min.js',
      () => setIsScriptLoaded(true)
    );
  }, []);

  useEffect(() => {
    if (!coolRoofsQuery.isSuccess || !mapContainer.current || !isScriptLoaded) return;

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

        const PMTILES_URL = 'https://urban-heat-portal-tiles.s3.amazonaws.com/ST_Clipped_20130601.pmtiles';
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

        // m.showTileBoundaries = true;
        m.addLayer({
          id: 'surface_temperature',
          source: 'surface_temperature',
          'source-layer': 'raster-layer',
          type: 'raster',
          layout: { visibility: 'visible' },
          interactive: true,
          paint: {
            "raster-resampling": "nearest",
          },
        });
        m.on("click", 'surface_temperature', (e) => {
          console.log("Clicked on surface_temperature layer", e.features);
          setProfileExpanded(true); // Verify that setProfileExpanded function is working as expected
        });



        // m.addSource('cool_roofs', {
        //   type: 'geojson',
        //   data: coolRoofsQuery.data as GeoJSON.FeatureCollection
        // });

        // m.addLayer({
        //   id: 'cool_roofs',
        //   source: 'cool_roofs',
        //   type: 'circle',
        //   paint: {
        //     'circle-color': "#306DDD",
        //     'circle-radius': 6,
        //   }
        // });

        setMap(m);
      }
    });

    return () => {
      if (m) m.remove();
    };
  }, [coolRoofsQuery.isSuccess, coolRoofsQuery.data, isScriptLoaded]);

  return (
    <div className='relative w-full h-full'>
      <Nav />
      <div className='w-full h-[calc(100%_-_3.125rem)]' ref={mapContainer} />
      <div className={`transition-all duration-75 dabsolute top-[3.125rem] right-0 ${profileExpanded ? "w-[50%]" : "w-0"}  h-[calc(100%_-_3.125rem)] bg-[#1B1B1B] z-20`}></div>
    </div>
  );
};

export default MapPage;
