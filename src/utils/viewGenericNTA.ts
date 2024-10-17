import ntaFeatureCollection from "../data/nta.geo.json";
import mapboxgl, { MapLayerMouseEvent, Popup } from "mapbox-gl";

import { FeatureCollection } from "geojson";
import { GeoJSONTransformHandler } from "./geojson";

import { format } from "d3-format";
import { nta_dataset_info } from "../App";
import {
  isProfileExpanded,
  profileData,
  isDataSelectionExpanded,
  previousClickCor,
} from "../pages/MapPage";

let hoveredNtacode: null | string = null;
let clickedNtacode: null | string = null;

function getDataset(metric: string) {
  return nta_dataset_info.value.find((dataset) => dataset.metric === metric);
}

function getNTAInfo(nta: string) {
  return nta_dataset_info.value.map((dataset) => ({
    metric: dataset.metric,
    [nta]: dataset[nta],
  }));
}

export function createNtaLayer(
  map: mapboxgl.Map,
  metric: string,
  layerName: string,
  fillPaintStyles: any = { "fill-color": "rgba(0,0,0,0)" }
) {
  const sourceId = metric + "_SOURCE";
  const layerFillId = metric + "_FILL";
  const layerOutlineId = metric + "_OUTLINE";
  const layerBasicOutlineId = metric + "_BASICOUTLINE";

  let popup = new Popup({
    closeButton: true,
  });

  const data = getDataset(metric);

  // merge in data with nta
  const features = GeoJSONTransformHandler(
    (ntaFeatureCollection as FeatureCollection).features
  )
    .map((feature) => {
      if (feature.properties) {
        const { ntacode } = feature.properties;
        feature.properties[metric] = +data[ntacode];
      }
      return feature;
    })
    .filter((feature) => feature.properties && feature.properties[metric]); // filter out features without the metric

  // create layers
  map.addSource(sourceId, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features,
    } as FeatureCollection,
    promoteId: "ntacode",
  });

  map.addLayer({
    id: layerFillId,
    type: "fill",
    source: sourceId,
    layout: {},
    paint: fillPaintStyles,
  });

  map.addLayer({
    id: layerBasicOutlineId,
    type: "line",
    source: sourceId,
    layout: {},
    paint: {
      "line-color": "#FBD266",
      "line-width": 1,
    },
  });

  map.addLayer({
    id: layerOutlineId,
    type: "line",
    source: sourceId,
    layout: {},
    paint: {
      "line-color": [
        "case",
        ["boolean", ["feature-state", "clicked"], false],
        "#0c0c0c", // Clicked NTA outline color
        ["boolean", ["feature-state", "hovered"], false],
        "#808080", // Hovered NTA outline color
        "rgba(0, 0, 0, 0)", // Default (no outline if not hovered or clicked)
      ],
      "line-width": [
        "case",
        ["boolean", ["feature-state", "clicked"], false],
        2, // Thicker line for clicked NTA
        ["boolean", ["feature-state", "hovered"], false],
        2, // Thinner line for hovered NTA
        0, // No line for default
      ],
    },
  });

  map.on("mousemove", layerFillId, (e: MapLayerMouseEvent) => {
    map.getCanvas().style.cursor = "pointer";
    if (e.features) {
      isDataSelectionExpanded.value = false;

      const coordinates = e.lngLat;
      const { ntacode, boroname, ntaname } = e.features[0].properties as any;

      const data = getNTAInfo(ntacode);

      const metrics = new Map<string, string>(
        data.map((d: any) => [d.metric, d[ntacode]])
      );
      let current_metric = metrics.has(metric)
        ? format(".1f")(+(metrics.get(metric) ?? ""))
        : "N/A";

      if (metric.startsWith("PCT")) {
        current_metric += "%";
      }

      const PCT_TREES = format(".1f")(+(metrics.get("PCT_TREES") ?? ""));
      const PCT_BUILDINGS_COOLROOF = format(".1f")(
        +(metrics.get("PCT_BUILDINGS_COOLROOF") ?? "")
      );

      const title = `<div class="tooltip-top">
                              <div>
                                  <h5>${boroname}</h5>
                                  <h4>${ntaname}</h4>
                              </div>
                              <div class="text-center">
                                  <span class="text-xxs leading-3">${layerName}</span>
                                  <span class="text-xl font-mono font-bold">${current_metric}</span>
                              </div>
                          </div>`;

      const details = `
              <div class="tooltip-bottom">
                  <div class="flex flex-col">
                      <div class="flex flex-row justify-between"><span>Average Surface Temperature</span><span></span></div>
                      <div class="flex flex-row justify-between"><span>Average Air Temperature</span><span></span></div>
                      <div class="flex flex-row justify-between"><span>Area Covered By Trees</span><span>${PCT_TREES}%</span></div>
                      <div class="flex flex-row justify-between"><span>Cool Roofs</span><span>${PCT_BUILDINGS_COOLROOF}%</span></div>
                      <div class="flex flex-row justify-between"><span>Number of Cooling Centers</span><span></span></div>
                  </div>
                  <button class="mt-2 underline cursor-pointer" id="view-profile-link">Click to view community district profile</button>
              </div>`;

      const divElement = document.createElement("div");
      divElement.innerHTML = title + details;
      divElement
        .querySelector("#view-profile-link")
        ?.addEventListener("click", () => {
          //dispatch data to profile
          const data = {
            metrics,
            currentMetric: metric,
            ntacode,
            boroname,
            ntaname,
          };
          profileData.value = data;
          isProfileExpanded.value = true;
        });

      if (popup) popup.remove();
      popup = new Popup({
        closeButton: true,
      })
        .setLngLat(coordinates)
        .setDOMContent(divElement)
        .addTo(map);
      // unoutline previous, then outline
      if (hoveredNtacode !== null && hoveredNtacode !== ntacode) {
        map.setFeatureState(
          { source: sourceId, id: hoveredNtacode },
          { hovered: false }
        );
      }

      // Set new hovered NTA
      hoveredNtacode = ntacode;
      map.setFeatureState({ source: sourceId, id: ntacode }, { hovered: true });
    }
  });

  map.on("mouseleave", layerFillId, () => {
    map.getCanvas().style.cursor = "";
    if (popup) popup.remove();

    // Reset hovered state on mouse leave
    if (hoveredNtacode !== null) {
      map.setFeatureState(
        { source: sourceId, id: hoveredNtacode },
        { hovered: false }
      );
      hoveredNtacode = null; // Reset to null
    }
  });

  map?.on("click", layerFillId, (e: MapLayerMouseEvent) => {
    const { ntacode } = e.features![0].properties as any;

    isProfileExpanded.value = true;
    isDataSelectionExpanded.value = false;

    const clickedLat = e.lngLat.lat;
    const clickedLng = e.lngLat.lng;

    previousClickCor.value = [clickedLng, clickedLat];

    const bounds = map.getBounds();

    const centerCoordinates = map.getCenter();
    const centerLng = centerCoordinates.lng;

    const mapWidth = bounds.getEast() - bounds.getWest();

    const targetLng = bounds.getWest() + mapWidth * 0.175;

    const newLng = centerLng + (clickedLng - targetLng)*0.65;
    console.log(newLng);


    // Fly to the target with a westward offset to keep the red line in the same position
    map.flyTo({
      center: [newLng, clickedLat], // Fly to the red line's longitude and half-height latitude
      zoom: map.getZoom(), // Maintain current zoom level
      essential: true,
      duration: 2000, // Duration of the animation
      easing: (t) => t * (2.5 - t), // Smooth easing
    });

    if (clickedNtacode !== null) {
      map.setFeatureState(
        { source: sourceId, id: clickedNtacode },
        { clicked: false }
      );
    }

    clickedNtacode = ntacode;
    map.setFeatureState({ source: sourceId, id: ntacode }, { clicked: true });
  });

  return function onDestory() {
    map.removeLayer(layerFillId);
    map.removeLayer(layerOutlineId);
    map.removeLayer(layerBasicOutlineId);
    map.removeSource(sourceId);
  };
}
