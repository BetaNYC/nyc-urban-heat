import * as mapboxPmTiles from "mapbox-pmtiles";
import mapboxgl from "mapbox-gl";

import { fetchStationHeatStats } from "./api";

export function viewWeatherStations(map: mapboxgl.Map, year: number) {
  fetchStationHeatStats().then((data) => {
    console.log(data);
    const weatherStationsDataYear = {
      type: "FeatureCollection",
      //@ts-ignore
      features: data.features.filter((d) => d.properties.year === year),
    };

    if (map?.getSource("weather_stations")) {
      // If the source already exists, update its data
      const source = map.getSource(
        "weather_stations"
      ) as mapboxgl.GeoJSONSource;
      source.setData(weatherStationsDataYear as GeoJSON.FeatureCollection);
    } else {
      // If the source does not exist, add it
      map?.addSource("weather_stations", {
        type: "geojson",
        data: weatherStationsDataYear as GeoJSON.FeatureCollection,
      });
    }

    // Remove existing layers if they exist
    if (map?.getLayer("weather_stations_heat_event"))
      map.removeLayer("weather_stations_heat_event");
    if (map?.getLayer("weather_stations_heat_excessive"))
      map.removeLayer("weather_stations_heat_excessive");
    if (map?.getLayer("weather_stations_heat_advisory"))
      map.removeLayer("weather_stations_heat_advisory");

    // map?.addSource("weather_stations", {
    //   type: "geojson",
    //   data: weatherStationsDataYear as GeoJSON.FeatureCollection,
    // });

    map?.addLayer({
      id: "weather_stations_heat_event",
      type: "circle",
      source: "weather_stations",
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-stroke-width": 0,
        "circle-stroke-color": "#1B1B1B",
        "circle-radius": [
          "*",
          ["number", ["get", "Days_with_NYC_HeatEvent"]],
          1.05,
        ],
        "circle-color": "#e19f3d",
        "circle-opacity": 1,
      },
    });

    map?.addLayer({
      id: "weather_stations_heat_advisory",
      type: "circle",
      source: "weather_stations",
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-radius": [
          "*",
          ["-", 0, ["number", ["get", "Days_with_NWS_HeatAdvisory"]]],
          1.05,
        ],
        "circle-color": "#c9733A",
        "circle-opacity": 1,
      },
    });

    map?.addLayer({
      id: "weather_stations_heat_excessive",
      type: "circle",
      source: "weather_stations",
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-radius": [
          "*",
          ["-", 0, ["number", ["get", "Days_with_NWS_Excessive_Heat_Event"]]],
          1.05,
        ],
        "circle-color": "#823E35",
        "circle-opacity": 1,
      },
    });
  });

  return function onDestory() {
    map.removeLayer("weather_stations");
    map.removeSource("weather_stations");
  };
}
