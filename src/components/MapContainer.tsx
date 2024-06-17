import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
// import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { useGeographic } from 'ol/proj';
import { Fill, Stroke, Style } from 'ol/style.js';
import { MapboxVectorLayer } from 'ol-mapbox-style';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY2xvdWRsdW4iLCJhIjoiY2s3ZWl4b3V1MDlkejNkb2JpZmtmbHp4ZiJ9.MbJU7PCa2LWBk9mENFkgxw'

const MapContainer = () => {

    const mapElement = useRef<HTMLDivElement>(null);
    const [mapObj, setMapObj] = useState<Map | null>(null);
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        // Initialize map
        useGeographic();

        const initialMapObj: Map = new Map({
            target: mapElement.current || undefined,
            layers: [
                new MapboxVectorLayer({
                    styleUrl: 'mapbox://styles/cloudlun/clxa8cwsd09ly01nx62o9fjyo',
                    accessToken: MAPBOX_ACCESS_TOKEN
                }),
            ],
            view: new View({
                center: [-73.84200928305255, 40.76043006443475],
                zoom: 12
            }),
        });

        setMapObj(initialMapObj);

        // Fetch data
        fetch("https://vcadeeaimofyayyevakl.supabase.co/rest/v1/cd_coolroofs?select=*&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWRlZWFpbW9meWF5eWV2YWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNzQzNzgsImV4cCI6MjAzMjY1MDM3OH0.clu7Zh0jdJWJVxbwyoyeILH33pew1QSpxeYHzAq4Auo")
            .then((res) => res.json())
            .then((data) => {

                const geoJSONObj: any = {
                    "type": "FeatureCollection",
                    "features": data.map((d: any) => {
                        const coordinates = JSON.parse(JSON.stringify(d.geometry.coordinates))
                        delete d.geometry
                        return {
                            "type": "Feature",
                            "properties": { ...d },
                            "geometry": {
                                coordinates,
                                "type": "MultiPolygon"
                            }
                        }
                    })
                }

                setData(geoJSONObj);
            });

        fetch("https://vcadeeaimofyayyevakl.supabase.co/rest/v1/stations_point?select=*&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWRlZWFpbW9meWF5eWV2YWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNzQzNzgsImV4cCI6MjAzMjY1MDM3OH0.clu7Zh0jdJWJVxbwyoyeILH33pew1QSpxeYHzAq4Auo")
            .then(res => res.json())
            .then(data => {
                const geoJSONObj: any = {
                    "type": "FeatureCollection",
                    "features": data.map((d: any) => {
                        const coordinates = JSON.parse(JSON.stringify(d.geometry.coordinates))
                        delete d.geometry
                        return {
                            "type": "Feature",
                            "properties": { ...d },
                            "geometry": {
                                coordinates,
                                "type": "Point"
                            }
                        }
                    })
                }

                console.log(geoJSONObj)
            })

        return () => initialMapObj.setTarget(undefined);
    }, []);

    useEffect(() => {
        if (data && mapObj) {
            try {
                if (data.features.length) {
                    const features = new GeoJSON().readFeatures(data);
                    const vectorSource = new VectorSource({ features })

                    const styles: any = {
                        'MultiPolygon': new Style({
                            stroke: new Stroke({
                                color: 'red',
                                width: 1,
                            }),
                            fill: new Fill({
                                color: 'rgba(255, 0, 0, 0.1)',
                            }),
                        })
                    }
                    const styleFunction = function (feature: any) {
                        return styles[feature.getGeometry().getType()];
                    };

                    const vectorLayer = new VectorLayer({
                        source: vectorSource,
                        style: styleFunction,
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
        <div
            ref={mapElement}
            className="h-full w-full"
        />
    )
}

export default MapContainer