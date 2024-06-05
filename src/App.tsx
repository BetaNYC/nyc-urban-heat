import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { useGeographic } from 'ol/proj';

function App() {
  const mapElement = useRef();
  const [mapObj, setMapObj] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Initialize map
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    useGeographic();

    const initialMapObj = new Map({
      target: mapElement.current,
      layers: [osmLayer],
      view: new View({
        center: [-73.84200928305255, 40.76043006443475],
        zoom: 12,
      }),
    });

    setMapObj(initialMapObj);

    // Fetch data
    fetch("https://zkcygezgkswabugyieuz.supabase.co/rest/v1/cd_coolroofs?select=*&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprY3lnZXpna3N3YWJ1Z3lpZXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5MDk0MTIsImV4cCI6MjAzMTQ4NTQxMn0.41iJLd8aGYm5BSbwUANqNW1xSdxbONvSXVrqwp6yPSU")
      .then((res) => res.json())
      .then((data) => {
        const sample = data.filter((d, i) => i < 3);

        const geoJSONObj = {
          'type': 'FeatureCollection',
          'features': sample.map(d => ({
            type: 'Feature',
            properties: {
              ...d
            },
            geometry: {
              type: "MultiPolygon",
              coordinates: d.geometry.coordinates
            }
          }))
        };

        setData(geoJSONObj);
      });

    return () => initialMapObj.setTarget(null);
  }, []);

  useEffect(() => {
    if (data && mapObj) {
      try {
        // @ts-ignore
        const features = new GeoJSON().readFeatures(data);

        if (features && features.length > 0) {
          const vectorSource = new VectorSource({
            features
          });

          const vectorLayer = new VectorLayer({
            source: vectorSource
          });

          mapObj.addLayer(vectorLayer);
        } else {
          console.error("No features found in the GeoJSON data.");
        }
      } catch (error) {
        console.error("Error reading features from GeoJSON:", error);
      }
    }
  }, [data, mapObj]);

  return (
    <main>
      <div
        style={{ height: "90vh", width: "100%" }}
        ref={mapElement}
        className="map-container"
      />
    </main>
  );
}

export default App;
