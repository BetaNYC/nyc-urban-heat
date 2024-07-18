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

export const fetchCombinedData = async () => {
  // Fetch the data
  const [stationPoints, stationHeatStats] = await Promise.all([
    fetchStationsPoint(),
    fetchStationHeatStats(),
  ]);

  // Create a map of heat stats by address for quick lookup
  const heatStatsMap = new Map();
  stationHeatStats.forEach((stat) => {
    heatStatsMap.set(stat.address, stat);
  });

  // Combine the data
  const combinedFeatures = stationPoints.features.map((feature) => {
    const address = feature.properties.address;
    const heatStat = heatStatsMap.get(address) || {};

    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        type:"Point"
      },
      properties: {
        ...feature.properties,
        ...heatStat,
        // Days_with_NWS_Excessive_Heat_Event: Number(heatStat.Days_with_NWS_Excessive_Heat_Event) || 0,
        // Days_with_NWS_HeatAdvisory: Number(heatStat.Days_with_NWS_HeatAdvisory) || 0,
        // Days_with_NYC_HeatEvent: Number(heatStat.Days_with_NYC_HeatEvent) || 0 
      },
    };
  });

  // Return the combined GeoJSON object
  const combinedGeoJSONObj = {
    type: "FeatureCollection",
    features: combinedFeatures,
  };

  return combinedGeoJSONObj;
};

export const fetchSurfaceTemp = async () => {
  const res = await fetch(`${baseUrl}pmtiles?select=*&apikey=${API_KEY}`);
  const data = await res.json();

  return data;
};
