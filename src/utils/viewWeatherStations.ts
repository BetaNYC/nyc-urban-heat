import mapboxgl, {
  MapMouseEvent,
  MapLayerMouseEvent,
  EventData,
  Popup,
} from "mapbox-gl";

import { fetchStationHeatStats } from "./api";
import {
  selectedDataset,
  weatherStationProfileData,
  clickedAddress,
  isWeatherStationProfileExpanded,
  isDataSelectionExpanded,
  previousClickCor,
} from "../pages/MapPage";
// import { WeatherStationProfileData } from "../types";

export function viewWeatherStations(map: mapboxgl.Map, year: number) {
  fetchStationHeatStats().then((data) => {
    const weatherStationsDataYear = {
      type: "FeatureCollection",
      //@ts-ignore
      features: data.features.filter((d) => d.properties.year === year),
    };

    const currentYear = selectedDataset.value?.currentYear || 2023;

    if (weatherStationProfileData) {
      weatherStationProfileData.value = weatherStationsDataYear.features;
    }

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

    let weatherStationNamePopup: mapboxgl.Popup | null = null;

    map?.on(
      "click",
      "weather_stations_heat_event",
      (event: MapMouseEvent & EventData) => {
        const { address } = event.features[0].properties;

        clickedAddress.value = address;
        isWeatherStationProfileExpanded.value = true;
        isDataSelectionExpanded.value = false;

        const clickedLat = event.lngLat.lat;
        const clickedLng = event.lngLat.lng;

        previousClickCor.value = [clickedLng, clickedLat];

        const bounds = map.getBounds();

        const centerCoordinates = map.getCenter();
        const centerLng = centerCoordinates.lng;
        const mapWidth = bounds.getEast() - bounds.getWest();
        const targetLng = bounds.getWest() + mapWidth * 0.175;
        const newLng = centerLng + (clickedLng - targetLng) * 0.65;

        const offsetLat = 0.005;
        const tooltipLat = clickedLat + offsetLat;

        if (weatherStationNamePopup) {
          weatherStationNamePopup.remove();
          weatherStationNamePopup = null;
        }

        weatherStationNamePopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: "clicked-popup",
        })
          .setLngLat([clickedLng, tooltipLat])
          .setHTML(`<div class='clicked-nta'>${address}</div>`)
          .addTo(map);

        map.flyTo({
          center: [newLng, clickedLat],
          zoom: map.getZoom(),
          essential: true,
          duration: 2000,
          easing: (t) => t * (2.5 - t),
        });
      }
    );

    let popup = new Popup({
      closeButton: false,
    });

    map?.on(
      "mousemove",
      "weather_stations_heat_event",
      (event: MapMouseEvent & EventData) => {
        map.getCanvas().style.cursor = "pointer";
        const {
          Days_with_NWS_Excessive_Heat_Event,
          Days_with_NWS_HeatAdvisory,
          Days_with_NYC_HeatEvent,
        } = event.features[0].properties;

        const contents = `
          <div className="bg-[#1B1B1B]">
            <h2 className="mb-2 font-medium text-[#F2F2F2] text-regular">Extreme Heat days in ${currentYear}</h2>
            <div className="">
              <div className="flex gap-4 text-[#D36051] text-xsmall">
                  <p className="font-medium ">NWS Excessive Heat</p>
                  <p className="w-4">${Days_with_NWS_Excessive_Heat_Event}</p>
              </div>
              <div className="flex gap-4 text-[#C9733A] text-xsmall">
                  <p className="font-medium ">NWS Heat Advisory</p>
                  <p className="w-4">${Days_with_NWS_HeatAdvisory}</p>
              </div>
              <div className="flex gap-4 text-[#BA8E50] text-xsmall">
                  <p className="font-medium ">NYC Heat Event</p>
                  <p className="w-4">${Days_with_NYC_HeatEvent}</p>
              </div>
            </div>
          </div>
        `;

        const coordinates = event.lngLat;

        const divElement = document.createElement("div");
        divElement.innerHTML = contents;
        divElement.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.3)";
        divElement.style.borderRadius = "8px";
        divElement.style.overflow = "hidden";

        if (popup) popup.remove();

        popup = new Popup({
          closeButton: true,
        })
          .setLngLat(coordinates)
          .setDOMContent(divElement)
          .setOffset([0, 0])
          .addTo(map);
      }
    );

    map?.on("mouseleave", "weather_stations_heat_event", () => {
      if (popup) popup.remove();
    });
  });

  return function onDestory() {
    map.removeLayer("weather_stations_heat_event");
    map.removeLayer("weather_stations_heat_advisory");
    map.removeLayer("weather_stations_heat_excessive");
    map.removeSource("weather_stations");
  };
}
