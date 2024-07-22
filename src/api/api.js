const baseUrl = "https://vcadeeaimofyayyevakl.supabase.co/rest/v1/";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYWRlZWFpbW9meWF5eWV2YWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNzQzNzgsImV4cCI6MjAzMjY1MDM3OH0.clu7Zh0jdJWJVxbwyoyeILH33pew1QSpxeYHzAq4Auo";

const GeoJSONTransformHandler = (data) => {
  return data.map((d) => {
    const coordinates = JSON.parse(JSON.stringify(d.geometry.coordinates));
    delete d.geometry;
    return {
      type: "Feature",
      properties: { ...d },
      geometry: {
        coordinates,
        type: "MultiPolygon",
      },
    };
  });
};

export const fetchCoolRoofs = async () => {
  const res = await fetch(`${baseUrl}cd_coolroofs?select=*&apikey=${API_KEY}`);
  const data = await res.json();
  const geoJSONObj = {
    type: "FeatureCollection",
    features: GeoJSONTransformHandler(data),
  };
  return geoJSONObj;
};

export const fetchStationsPoint = async () => {
  const res = await fetch(
    `${baseUrl}stations_point?select=*&apikey=${API_KEY}`
  );
  const data = await res.json();
  const geoJSONObj = {
    type: "FeatureCollection",
    features: GeoJSONTransformHandler(data),
  };
  return geoJSONObj;
};

export const fetchStationHeatStats = async () => {
  const res = await fetch(
    `${baseUrl}stations_summerstat?select=*&apikey=${API_KEY}`
  );
  const data = await res.json();

  return data;
};

export const fetchStationData = async () => {
  // Fetch the data
  const [stationPoints, stationHeatStats] = await Promise.all([
    fetchStationsPoint(),
    fetchStationHeatStats(),
  ]);

  // Create a map of station points by address for quick lookup
  const stationPointsMap = new Map();
  stationPoints.features.forEach((feature) => {
    const address = feature.properties.address;
    stationPointsMap.set(address, feature.geometry.coordinates);
  });

  // Combine the data with coordinates
  const stationFeatures = stationHeatStats.map((stat) => {
    const coordinates = stationPointsMap.get(stat.address) || [0, 0]; // Default to [0, 0] if coordinates not found

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coordinates,
      },
      properties: {
        ...stat,
      },
    };
  });

  // Return the combined GeoJSON object
  const stationGeoJSONObj = {
    type: "FeatureCollection",
    features: stationFeatures,
  };

  return stationGeoJSONObj;
};

export const fetchSurfaceTemp = async () => {
  const res = await fetch(`${baseUrl}pmtiles?select=*&apikey=${API_KEY}`);
  const data = await res.json();

  return data;
};
