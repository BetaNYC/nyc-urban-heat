import mapboxgl, {
  MapMouseEvent,
  MapLayerMouseEvent,
  EventData,
  Popup,
} from "mapbox-gl";

import * as turf from "@turf/turf";

import { fetchStationHeatStats } from "./api";
import {
  selectedDataset,
  weatherStationProfileData,
  clickedAddress,
  clickedWeatherStationName,
  isWeatherStationProfileExpanded,
  isDataSelectionExpanded,
  previousClickCor,
  clickedWeatherStationPopup,
  clickedNeighborhoodNearestStationAddress,
} from "../pages/MapPage";

import "../pages/Map.css";
import ntaFeatureCollection from "../data/nta.geo.json";

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
        promoteId: "address",
      });
    }

    // if (!map?.getSource("nta_layer")) {
    //   map?.addSource("nta_layer", {
    //     type: "geojson",
    //     //@ts-ignore
    //     data: ntaFeatureCollection,
    //   });
    // }

    // map.addLayer({
    //   id: "nta_layer",
    //   type: "line",
    //   source: "nta_layer",
    //   layout: {},
    //   paint: {
    //     "line-color": "#000",
    //     "line-width": 1,
    //     "line-opacity": 0,
    //   },
    // });

    // console.log(weatherStationsDataYear);

    // Remove existing layers if they exist
    if (map?.getLayer("weather_stations_heat_event"))
      map.removeLayer("weather_stations_heat_event");
    if (map?.getLayer("weather_stations_heat_excessive"))
      map.removeLayer("weather_stations_heat_excessive");
    if (map?.getLayer("weather_stations_heat_advisory"))
      map.removeLayer("weather_stations_heat_advisory");

    map?.addLayer({
      id: "weather_stations_heat_event",
      type: "circle",
      source: "weather_stations",
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-stroke-width": [
          "case",
          ["boolean", ["feature-state", "clicked"], false],
          2.5,
          ["boolean", ["feature-state", "hovered"], false],
          2.5,
          0, // Default width 0
        ],
        "circle-stroke-color": [
          "case",
          ["boolean", ["feature-state", "clicked"], false],
          "#0079DA", // Blue for clicked
          ["boolean", ["feature-state", "hovered"], false],
          "#666666", // Gray for hovered
          "rgba(0, 0, 0, 0)", // Transparent by default
        ],
        "circle-radius": [
          "*",
          ["number", ["get", "Days_with_NYC_HeatEvent"]],
          1.25,
        ],
        "circle-color": "#e19f3c",
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
          1.25,
        ],
        "circle-color": "#d66852",
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
          1.25,
        ],
        "circle-color": "#9d2b2b",
        "circle-opacity": 1,
      },
    });

    let hoveredWeatherStationAddress: null | string = null;
    let clickedWeatherStationAddress: null | string = null;

    map?.on(
      "click",
      "weather_stations_heat_event",
      (event: MapMouseEvent & EventData) => {
        const { address, name } = event.features[0].properties;

        clickedAddress.value = address;
        clickedWeatherStationName.value = name;
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

        const clickedPoint = turf.point([event.lngLat.lng, event.lngLat.lat]);
        // const ntaName = ntaFeatureCollection.features.find((feature) =>
        //   turf.booleanPointInPolygon(clickedPoint, feature)
        // ).properties.ntaname;

        if (clickedWeatherStationPopup.value) {
          clickedWeatherStationPopup.value.remove();
          // clickedWeatherStationPopup.value = null;
        }

        clickedWeatherStationPopup.value = new mapboxgl.Popup({
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

        if (
          clickedWeatherStationAddress !== null &&
          clickedWeatherStationAddress !== address
        ) {
          map.setFeatureState(
            { source: "weather_stations", id: clickedWeatherStationAddress },
            { clicked: false }
          );
        }

        map.setFeatureState(
          {
            source: "weather_stations",
            id: clickedNeighborhoodNearestStationAddress.value!,
          },
          { clicked: false }
        );

        clickedWeatherStationAddress = address;
        map.setFeatureState(
          { source: "weather_stations", id: address },
          { clicked: true }
        );
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
          address,
          name,
        } = event.features[0].properties;

        const contents = `
          <div class="px-[1rem] py-[0.5rem] bg-[#1B1B1B]">
            <div class="mb-2 pb-2 border-b-[1px] border-[#999]">
              <h1 class="font-medium text-[#F2F2F2] text-large">${name}</h1>
              <h2 class="font-medium text-[#F2F2F2] text-small">Weather Station ${address}</h2>
            </div>
            <div>
              <h2 class="mb-1 font-medium text-[#F2F2F2] text-small">Extreme Heat days measured in ${currentYear}</h2>
              <div class="flex flex-col gap-0">
                <div class="flex gap-4 text-[#D36051] text-regular">
                  <p class="w-3">${Days_with_NWS_Excessive_Heat_Event}</p>
                  <p class="font-medium ">NWS Excessive Heat</p>

                </div>
                <div class="flex gap-4 text-[#C9733A] text-regular">
                  <p class="w-3">${Days_with_NWS_HeatAdvisory}</p>
                  <p class="font-medium ">NWS Heat Advisory</p>
                </div>
                <div class="flex gap-4 text-[#BA8E50] text-regular">
                  <p class="w-3">${Days_with_NYC_HeatEvent}</p>
                  <p class="font-medium ">NYC Heat Event</p>
                </div>
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

        if (
          hoveredWeatherStationAddress &&
          hoveredWeatherStationAddress !== address
        ) {
          map.setFeatureState(
            { source: "weather_stations", id: hoveredWeatherStationAddress },
            { hovered: false }
          );
        }

        hoveredWeatherStationAddress = address;

        map.setFeatureState(
          { source: "weather_stations", id: address },
          { hovered: true }
        );
      }
    );

    map?.on("mouseout", "weather_stations_heat_event", () => {
      if (popup) popup.remove();

      if (hoveredWeatherStationAddress !== null) {
        map.setFeatureState(
          { source: "weather_stations", id: hoveredWeatherStationAddress },
          { hovered: false }
        );
        hoveredWeatherStationAddress = null; // Reset to null
      }
    });
  });

  return function onDestory() {
    removeAllPopups();
    map.removeLayer("weather_stations_heat_event");
    map.removeLayer("weather_stations_heat_advisory");
    map.removeLayer("weather_stations_heat_excessive");
    map.removeSource("weather_stations");
  };
}

function removeAllPopups() {
  if (clickedWeatherStationPopup.value) {
    clickedWeatherStationPopup.value.remove();
    clickedWeatherStationPopup.value = null; // Optionally, set the value to null if it's used later
  }
}
