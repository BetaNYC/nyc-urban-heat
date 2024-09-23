import {Feature, GeoJsonProperties, Geometry} from "geojson";

// const baseUrl = "https://vcadeeaimofyayyevakl.supabase.co/rest/v1/";
// const API_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWRlZWFpbW9meWF5eWV2YWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNzQzNzgsImV4cCI6MjAzMjY1MDM3OH0.clu7Zh0jdJWJVxbwyoyeILH33pew1QSpxeYHzAq4Auo";

// const GeoJSONTransformHandler = (data: Feature[]): Feature<Geometry, GeoJsonProperties>[] => {
//   return data.map((d: Feature): Feature<Geometry, GeoJsonProperties> => {
//     // create a deep copy of coordinates
//     const { geometry, ...properties } = d;
//     let coordinates: any[] = [];
//     if (geometry && 'coordinates' in geometry) {
//       coordinates = JSON.parse(JSON.stringify((geometry as any).coordinates));
//     }

//     return {
//       type: "Feature",
//       properties,
//       geometry: {
//         coordinates,
//         type: geometry.type,
//       } as Geometry,
//     };
//   });
// };

// const fetchAllFromLayer = async (layer: string) => {
//   const res = await fetch(`${baseUrl}${layer}?select=*&apikey=${API_KEY}`);
//   const data = await res.json();
//   const geoJSONObj = {
//     type: "FeatureCollection",
//     features: GeoJSONTransformHandler(data),
//   };
//   return geoJSONObj;
// }

// export const fetchCoolRoofs = async () => fetchAllFromLayer('cd_coolroofs');
// export const fetchNTAHeatData = async () => fetchAllFromLayer('nta_heat_data');
// export const fetchStationsPoint = async () => fetchAllFromLayer('stations_point');
// export const fetchStationHeatStats = async () => {
//   const res = await fetch(`${baseUrl}stations_summerstat?select=*&apikey=${API_KEY}`);
//   return res.json();
// };

// export const fetchStationData = async () => {
//   // Fetch the data
//   const [stationPoints, stationHeatStats] = await Promise.all([
//     fetchStationsPoint(),
//     fetchStationHeatStats(),
//   ]);

//   // Create a map of station points by address for quick lookup
//   const stationPointsMap = new Map<string, any[]>();
//   stationPoints.features.forEach((feature: Feature) => {
//     const address = feature.properties?.address;
//     if (feature.geometry && 'coordinates' in feature.geometry) {
//       stationPointsMap.set(address, feature.geometry.coordinates);
//     }
//   });

//   // Combine the data with coordinates
//   const stationFeatures = stationHeatStats.map((stat: { address: any; }) => {
//     const coordinates = stationPointsMap.get(stat.address) || [0, 0]; // Default to [0, 0] if coordinates not found

//     return {
//       type: "Feature",
//       geometry: {
//         type: "Point",
//         coordinates: coordinates,
//       },
//       properties: {
//         ...stat,
//       },
//     };
//   });

//   // Return the combined GeoJSON object
//   const stationGeoJSONObj = {
//     type: "FeatureCollection",
//     features: stationFeatures,
//   };

//   return stationGeoJSONObj;
// };

// export const fetchSurfaceTemp = async () => {
//   const res = await fetch(`${baseUrl}pmtiles?select=*&apikey=${API_KEY}`);
//   return res.json();
// };
