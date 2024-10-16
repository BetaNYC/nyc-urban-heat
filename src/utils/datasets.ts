import outdoorHeatExposureIndex from "/icons/outdoor_heat_exposure_index.svg";
import weatherStations from "/icons/weather_stations.svg";
import airTemperature from "/icons/air_temperature.svg";
import airHeatIndex from "/icons/air_heat_index.svg";
import meanRadiantTemperature from "/icons/mean_radiant_temperature.svg";
import surfaceTemperature from "/icons/surface_temperature.svg";
import treeCanopy from "/icons/tree_canopy.svg";
import coolRoofs from "/icons/cool_roofs.svg";
import premeableSurface from "/icons/permeable_surface.svg";
import parks from "/icons/parks.svg";

import mapboxgl, { Map } from "mapbox-gl";
import { cachedFetch } from "./cache";
import { viewSurfaceTemperature } from "./viewSurfaceTemperature";
import { createNtaLayer } from "./viewGenericNTA";
import { API_KEY, BASE_URL, fetchStationHeatStats } from "./api";
import { viewTreeCanopy } from "./viewTreeCanopy";
import { viewWeatherStations } from "./viewWeatherStations";
import { nta_dataset_info } from "../App";
import { viewMRT } from "./viewMRT";
import { viewCoolRoofs } from "./viewCoolRoofs";

type IconType = typeof outdoorHeatExposureIndex;

export interface ViewOptions {
  date?: string;
  year?: number;
}

export interface LegendItem {
  label: string | number;
  value: string;
}

export interface View {
  name: string;
  legend?: LegendItem[];
  init?: (map: Map, options?: ViewOptions) => () => void;
}

interface CollectionOfViews {
  [key: string]: View;
}

export interface DownloadUrl {
  name: string;
  url: string;
  date?: string; // in YYYY or YYYYMMDD
  format: string;
}

export interface Dataset {
  name: string;
  group: string;
  icon: IconType;
  info?: string;
  externalSource?: string;
  externalUrl?: string; // direct to the landing page of the external resource we don't own
  // in some cases we need to look up the csv, generate a custom urls to the supabase, or call an api to get the links
  getDownloadUrls?: (options?: any) => Promise<DownloadUrl[]>;

  currentView: null | string;
  dates?: string[];
  currentDate?: null | string;
  getDates?: () => Promise<string[]>;
  years?: number[];
  currentYear?: null | number;
  getYears?: () => Promise<number[]>;
  views: CollectionOfViews;
}

export const datasets: Dataset[] = [
  {
    name: "Outdoor Heat Exposure Index",
    group: "",
    icon: outdoorHeatExposureIndex,
    info: "The Outdoor Heat Exposure Index is a measure of the risk of heat-related illnesses for people spending time outdoors.",
    currentView: null,
    views: {
      nta: {
        name: "NTA Aggregated",
        legend: [
          { label: 1, value: "#f1c490" },
          { label: 2, value: "#e39671" },
          { label: 3, value: "#d66852" },
          { label: 4, value: "#933d33" },
          { label: 5, value: "#511314" },
        ],
        init: function (map) {
          return createNtaLayer(map, "HEAT_VULNERABILITY", this.name, {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "HEAT_VULNERABILITY"],
              0,
              "#FFF3B0",
              3,
              "#D66852",
              5,
              "#511314",
            ],
          });
        },
      },
    },
  },
  {
    name: "Weather Stations",
    group: "",
    icon: weatherStations,
    currentView: null,
    getYears: async (): Promise<number[]> => {
      const data = await fetchStationHeatStats();
      const years = data.features.map((d: any) => d.properties.year);
      const uniqueYears = [...new Set(years)];
      return uniqueYears as number[];
    },
    years: [],
    currentYear: null,
    views: {
      points: {
        name: "Raw Data",
        init: (map, options) => viewWeatherStations(map, options?.year!),
      },
    },
  },
  {
    name: "Air Temperature",
    group: "Outdoor Heat Exposure",
    icon: airTemperature,
    info: "Air temperature is a measure of how hot or cold the air is. It is the most commonly measured weather parameter.",
    currentView: null,
    views: {
      nta: { name: "NTA Aggregated" },
      raw: { name: "Raw Data" },
    },
  },
  {
    name: "Air Heat Index",
    group: "Outdoor Heat Exposure",
    icon: airHeatIndex,
    info: "Air Heat Index is what the temperature feels like to the human body when relative humidity is combined with the air temperature.  This has important considerations for the human body's comfort.",
    currentView: null,
    views: {
      nta: { name: "NTA Aggregated" },
      raw: { name: "Raw Data" },
    },
  },
  {
    name: "Mean Radiant Temperature",
    group: "Outdoor Heat Exposure",
    icon: meanRadiantTemperature,
    currentView: null,
    views: {
      raw: {
        name: "Raw Data",
        init: function (map) {

          const MRTCleanup = viewMRT(map);
          const ntaLayerCleanup = createNtaLayer(
            map,
            "PCT_AREA_COOLROOF",
            this.name
          );
          return function onDestory() {
            ntaLayerCleanup();
            MRTCleanup();
          };
        },
      },
    },
  },
  {
    name: "Surface Temperature",
    group: "Outdoor Heat Exposure",
    icon: surfaceTemperature,
    info: `Surface Temperature indicates how hot the "surface" of the Earth would feel to the touch in a particular location (i.e. building roofs, grass, tree canopy, etc.). Surface temperature is not the same as the air temperature in the daily weather report.`,
    currentView: null,
    dates: [],
    currentDate: null,
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.type === "surface_temp")
        .reduce((urls: DownloadUrl[], dataset: any) => {
          // todo: setup csv in a better format
          const raw_url = dataset.downloads;
          const relative_url = dataset.downloads_2;
          return [
            ...urls,
            { name: "Raw", url: raw_url, date: dataset.date, format: "raw" },
            {
              name: "Relative",
              url: relative_url,
              date: dataset.date,
              format: "relative",
            },
          ];
        }, []);

      return urls;
    },
    getDates: async () => {
      return nta_dataset_info.value
        .filter((dataset) => dataset.type === "surface_temp")
        .map((d: any) => d.date)
        .sort();
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        init: function (map) {
          return createNtaLayer(map, "ST_20230902", this.name, {
            "fill-color": "orange",
          });
        },
      },
      raw: {
        name: "Raw Data",
        init: (map, options) => viewSurfaceTemperature(map, options?.date),
      },
    },
  },
  {
    name: "Tree Canopy",
    group: "Heat Mitigation",
    icon: treeCanopy,
    info: "Urban tree canopy (UTC) shows areas where leaves, branches, and stems of trees cover the ground, when viewed from above. UTC reduces the urban heat island effect, reduces heating/cooling costs, lowers air temperatures, reduces air pollution.",
    currentView: null,
    views: {
      nta: {
        name: "NTA Aggregated",
        legend: [
          { label: "10%", value: "#edf8e9" },
          { label: "20%", value: "#bae4b3" },
          { label: "30%", value: "#74c476" },
          { label: "40%", value: "#31a354" },
          { label: "50%", value: "#006d2c" },
        ],
        init: function (map) {
          return createNtaLayer(map, "PCT_TREES", this.name, {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "PCT_TREES"],
              10,
              "#edf8e9",
              20,
              "#bae4b3",
              30,
              "#74c476",
              40,
              "#31a354",
              50,
              "#006d2c",
            ],
          });
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map) {
          const ntaLayerCleanup = createNtaLayer(map, "PCT_TREES", this.name);
          const treeCanopyCleanup = viewTreeCanopy(map);
          return function onDestory() {
            ntaLayerCleanup();
            treeCanopyCleanup();
          };
        },
      },
    },
  },
  {
    name: "Cool Roofs",
    group: "Heat Mitigation",
    icon: coolRoofs,
    info: "Cool roofs absorb and transfer less heat from the sun to the building compared with a more conventional roof. Buildings with cool roofs use less air conditioning, save energy, and have more comfortable indoor temperatures. Cool roofs also impact surrounding areas by lowering temperatures outside of buildings and thus mitigating the heat island effect.",
    currentView: null,
    views: {
      nta: {
        name: "NTA Aggregated",
        legend: [
          { label: "3%", value: "#ccd7e1" },
          { label: "21%", value: "#9aafc4" },
          { label: "39%", value: "#6788a6" },
          { label: "58%", value: "#356089" },
          { label: "77%", value: "#03396c" },
        ],
        init: function (map) {
          return createNtaLayer(map, "PCT_AREA_COOLROOF", this.name, {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "PCT_AREA_COOLROOF"],
              3,
              "#b3cde0",
              76.5,
              "#03396c",
            ],
          });
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map) {
          const ntaLayerCleanup = createNtaLayer(
            map,
            "PCT_AREA_COOLROOF",
            this.name
          );
          const coolRoofsCleanup = viewCoolRoofs(map);
          return function onDestory() {
            ntaLayerCleanup();
            coolRoofsCleanup();
          };
        },
      },
    },
  },
  {
    name: "Premeable Surfaces",
    group: "Heat Mitigation",
    icon: premeableSurface,
    currentView: null,
    views: {
      nta: {
        name: "NTA Aggregated",
        legend: [
          { label: 70, value: "#e8ceb3" },
          { label: 53, value: "#dcb68d" },
          { label: 35, value: "#d19e67" },
          { label: 18, value: "#c68642" },
          { label: 0, value: "#9e6b34" },
        ],
        init: function (map) {
          return createNtaLayer(map, "PCT_PERMEABLE", this.name, {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "PCT_PERMEABLE"],
              0.74,
              "#c68642",
              70.4,
              "#ffdbac",
            ],
          });
        },
      },
      raw: {
        name: "Raw Data",
      },
    },
  },
  // {
  //   name: "Parks",
  //   group: "Heat Mitigation",
  //   icon: parks,
  //   currentView: null,
  //   views: {
  //     nta: {
  //       name: "NTA Aggregated",
  //       legend: [
  //         { label: 6144, value: "#d4dfda" },
  //         { label: 4662, value: "#a9bfb5" },
  //         { label: 3182, value: "#7e9f91" },
  //         { label: 1702, value: "#537e6c" },
  //         { label: 222, value: "#295f48" },
  //       ],
  //       init: function (map) {
  //         return createNtaLayer(map, "AVG_DIST_TO_PARKS_FT", this.name, {
  //           "fill-color": [
  //             "interpolate",
  //             ["linear"],
  //             ["get", "AVG_DIST_TO_PARKS_FT"],
  //             222,
  //             "#295f48",
  //             6144,
  //             "#d4dfda",
  //           ],
  //         });
  //       },
  //     },
  //     raw: { name: "Raw Data" },
  //   },
  // },
];

let destroyCallback: (() => void) | null = null;

export async function initializeView(
  dataset: Dataset,
  map: mapboxgl.Map | null
) {
  // fail states
  if (!dataset.currentView || !map) return dataset;

  // remove the previous view
  try {
    if (destroyCallback) destroyCallback();
  } catch (error) {
    destroyCallback = null;
  }

  const view = dataset.views[dataset.currentView];

  if (view.init) {
    const options: ViewOptions = {};

    // set up dates for the dataset
    if (dataset.getDates) {
      dataset.dates = await dataset.getDates();
      console.log(dataset.dates);
      // set the first option, if there is no currentDate
      if (!dataset.currentDate) {
        dataset.currentDate = dataset.dates.at(-1);
      }
      options.date = dataset.currentDate;
    }

    if (dataset.getYears) {
      dataset.years = await dataset.getYears();
      if (!dataset.currentYear) {
        dataset.currentYear = dataset.years.at(-1);
      }
      options.year = dataset.currentYear;
    }

    destroyCallback = view.init(map, options);
  } else {
    console.error(
      `${dataset.name}, ${dataset.currentView} doesn't have an init func`
    );
    destroyCallback = null;
  }

  return dataset;
}
