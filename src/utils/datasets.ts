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
import { viewPremeableSurface } from "./viewPremeableSurface";
import { viewAirTemperature } from "./viewAirTemperature";
import { viewAirHeatIndex } from "./viewAirHeatIndex";
import { format } from "d3";

type IconType = typeof outdoorHeatExposureIndex;

export interface ViewOptions {
  date?: string;
  year?: number;
}

export interface LegendItem {
  label: string;
  value: string;
}

export interface View {
  name: string;
  legend?: LegendItem[];
  legendTitle?: string;
  legendLastNumber?: string;
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
  externalSource?: {
    citation: string;
    year: string;
    href?: string;
  };
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
    info: "This index represents the overall risk of heat exposure on summer days in different neighborhoods. Please note that the outdoor temperature and thermal comfort levels are different from indoor conditions. Building quality, exposure to direct radiation, cooling systems, and other building features will be essential in translating outdoor heat into health factors. If you are interested in the health implications of heat exposure, you may need to explore the Heat Vulnerability Index that New York City's Department of Health has provided here: https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/hvi/ The OHRI can be used in conjunction with HVI but only represents the intensity of outdoor heat in each neighborhood. You can use this index to compare the heat exposure intensity in different communities. ",
    externalSource: {
      citation:
        "Heris, M., Louie, A., Flohr, T., Haijing, L., Kittredge, A., Pankin, He, Z., Marcotullio, P., Fein, M. New York City Outdoor Heat Exposure Index. ",
      year: "2025 ",
    },
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.metric === "MRT")
        .reduce((urls: DownloadUrl[], dataset: any) => {
          const tiff_url = dataset.downloads;
          return [
            ...urls,
            {
              name: "Tiff",
              url: tiff_url,
              date: "",
              format: "tiff",
            },
          ];
        }, []);

      return urls;
    },
    currentView: "nta",
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Outdoor Heat Exposure Index (OHEI)",
        legend: [
          { label: "1", value: "#F9EBC5" },
          { label: "2", value: "#E7A98B" },
          { label: "3", value: "#D66852" },
          { label: "4", value: "#A33F34" },
          { label: "5", value: "#841F21" },
        ],
        legendLastNumber: "5",
        init: function (map) {
          return createNtaLayer(
            map,
            "Outdooor_Heat_Volnerability_Index",
            this.name,
            this.legend!,
            {
              "fill-color": [
                "interpolate",
                ["linear"],
                ["get", "Outdooor_Heat_Volnerability_Index"],
                1,
                "#F9EBC5",
                2,
                "#E7A98B",
                3,
                "#D66852",
                4,
                "#A33F34",
                5,
                "#841F21",
              ],
            }
          );
        },
      },
    },
  },
  {
    name: "Weather Stations",
    group: "",
    icon: weatherStations,
    info: "Weather station data is produced using professional sensors and instruments. However, they offer insight into the condition of air around a point. They are a reliable resource if you need to know how temperature is changing day to day. This dataset reports the minimum and maximum air temperature and heat index for any summer day. Such temporal resolution is not available for other heat-related data sources. Also, air temperature is highly variable in different locations, but comparing the temperatures of different weather stations can give you a general idea of the heat distribution in the city.",
    externalSource: {
      citation: "Visual Crossing. Timeline Weather Data.",
      year: "2013 - 2023",
      href: "https://www.visualcrossing.com/",
    },
    currentView: null,
    getYears: async (): Promise<number[]> => {
      const data = await fetchStationHeatStats();
      const years = data.features.map((d: any) => d.properties.year);
      const uniqueYears = [...new Set(years)];
      return uniqueYears as number[];
    },
    years: [],
    currentYear: 2023,
    views: {
      points: {
        name: "Raw Data",
        init: (map, options) => viewWeatherStations(map, options?.year!),
      },
    },
  },
  {
    name: "Mean Radiant Temperature",
    group: "Static Factors",
    icon: meanRadiantTemperature,
    info: "The Mean Radiant Temperature (MRT) map shows the amount of radiation a pedestrian receives from its environment. The MRT data presents the conditions for only one day (July 15th) as a sample day and only one hour (2 PM, peak radiation). So, this layer does not provide information about heat exposure in other hours. For example, morning or evening hours should be relatively cooler. The MRT layer that is modeled here is spatially static. In other words, the MRT map does not tell you how temperature changes during the day. It shows how the radiation exposure is distributed across the space. The MRT values are highly dependent on shade coverage. Therefore, in the morning hours and later afternoon hours, there will be more shade in the space, and MRT would be lower in any shaded spot. To see how shade affects the MRT values, you can explore the current data (2 PM) and see how shaded areas are more remarkable than those without shade. One thing that you should pay attention to is that at 2 PM, the sun is slightly on the west side of the sky, and therefore, the shade of any objects (buildings and trees) would be on the east side. In later hours (i.e., 4 and 5 PM), the shades would be longer and will cover more space but in the same directions. The shade in the morning will be in the opposite direction of the objects. ",
    externalSource: {
      citation:
        "Heris, M., Louie, A., Flohr, T., Haijing, L., Kittredge, A., Pankin, He, Z., Marcotullio, P., Fein, M. New York City Mean Radiant Temperature.",
      year: "2025",
    },
    currentView: null,
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.metric === "MRT")
        .reduce((urls: DownloadUrl[], dataset: any) => {
          const tiff_url = dataset.downloads;
          return [
            ...urls,
            {
              name: "Tiff",
              url: tiff_url,
              date: "",
              format: "tiff",
            },
          ];
        }, []);

      return urls;
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Percent area of outdoor spaces with thermal comfort",
        legend: [
          { label: "62%", value: "#f1dfd9" },
          { label: "44%", value: "#e3c0b2" },
          { label: "34%", value: "#d4a08c" },
          { label: "30%", value: "#c68165" },
          { label: "27%", value: "#b8613f" },
        ],
        legendLastNumber: "3%",
        init: function (map) {
          return createNtaLayer(
            map,
            "NTA_PCT_MRT_Less_Than_110",
            this.name,
            this.legend!,
            {
              "fill-color": [
                "case",
                ["<=", ["get", "NTA_PCT_MRT_Less_Than_110"], 3],
                "#b8613f",
                ["<=", ["get", "NTA_PCT_MRT_Less_Than_110"], 18],
                "#c68165",
                ["<=", ["get", "NTA_PCT_MRT_Less_Than_110"], 33],
                "#d4a08c",
                ["<=", ["get", "NTA_PCT_MRT_Less_Than_110"], 48],
                "#e3c0b2",
                ["<=", ["get", "NTA_PCT_MRT_Less_Than_110"], 63],
                "#f1dfd9",
                "#000000", // Default color if no match
              ],
            }
          );
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map) {
          const MRTCleanup = viewMRT(map);
          const ntaLayerCleanup = createNtaLayer(
            map,
            "NTA_PCT_MRT_Less_Than_110",
            this.name,
            this.legend!
          );
          return function onDestroy() {
            ntaLayerCleanup();
            MRTCleanup();
          };
        },
      },
    },
  },
  {
    name: "Surface Temperature",
    group: "Static Factors",
    icon: surfaceTemperature,
    info: `The surface temperature layers represent the temperature of surfaces such as roofs, streets, and pavements. In a given space, the surface temperature will be different from the air temperature or MRT. To know what the surface temperature is, you should touch the surface. On summer days, the surfaces that have been exposed to sunlight are usually much warmer than other surfaces. It is not unusual for an asphalt surface that is exposed to direct sunlight to have a 120F temperature. High surface temperatures eventually warm up the air above it, but there are so many different factors that contribute to that conversion. For example, wind speed and direction are major determinants of how surface temperature will warm up the air above it and how that air moves around. Our goal in urban heat mitigation is to reduce surface temperatures because it eventually reduces the air temperature across the city. Use the surface temperature to see what surfaces are generating heat and what surfaces are generating cool air. Note that parks are cooler, cool roofs are cooler than dark roofs, and trees are cooler than open impervious surfaces such as highways and parking lots.`,
    externalSource: {
      citation:
        "Earth Resources Observation and Science (EROS) Center. Landsat 8-9 Operational Land Imager / Thermal Infrared Sensor Level-2, Collection 2 [dataset]. U.S. Geological Survey",
      year: "2020",
      href: "https://doi.org/10.5066/P9OGBGM6.",
    },
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
            // { name: "Raw", url: raw_url, date: dataset.date, format: "tiff" },
            {
              name: "Relative",
              url: relative_url,
              date: dataset.date,
              format: "tiff",
            },
          ];
        }, []);

      return urls;
    },
    getDates: async () => {
      console.log();
      return nta_dataset_info.value
        .filter((dataset) => dataset.type === "surface_temp")
        .map((d: any) => d.date)
        .sort();
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Average surface temperature (°F)",
        init: function (map, options) {
          const date = `ST_${options?.date || "20230902"}`;
          const data = nta_dataset_info.value.find(
            (dataset) => dataset.metric === date
          );
          const values = Object.entries(data)
            .filter(
              ([key, value]) =>
                /^[A-Z]{2}\d{2}$/.test(key as string) && value !== ""
            ) // 只保留符合地區代碼格式的鍵
            .map(([_, value]) => parseFloat(value as string).toFixed(1));
          // 轉換成浮點數
          //@ts-ignore
          const minValue = Math.min(...values).toFixed(1);
          //@ts-ignore
          const maxValue = Math.max(...values).toFixed(1);
          // 3. 計算四個等距的數字
          const step = (
            (parseFloat(maxValue) - parseFloat(minValue)) /
            5
          ).toFixed(1);
          const bins = Array.from({ length: 6 }, (_, i) =>
            (parseFloat(minValue) + parseFloat(step) * i).toFixed(1)
          );

          return createNtaLayer(map, date, this.name, this.legend!, {
            "fill-color": [
              "case",
              ["<=", ["get", date], +bins[1]],
              "#f4e0d7",
              ["<=", ["get", date], +bins[2]],
              "#cbada6",
              ["<=", ["get", date], +bins[3]],
              "#a37a76",
              ["<=", ["get", date], +bins[4]],
              "#7a4645",
              "#511314",
            ],
          });
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map, options) {
          const date = `ST_${options?.date || "20230731"}`;
          const surfaceTemperatureCleanup = viewSurfaceTemperature(
            map,
            options?.date
          );
          const ntaLayerCleanup = createNtaLayer(
            map,
            date,
            this.name,
            this.legend!
          );

          return function onDestroy() {
            ntaLayerCleanup();
            surfaceTemperatureCleanup();
          };
        },
      },
    },
  },
  {
    name: "Cool Roofs",
    group: "Static Factors",
    icon: coolRoofs,
    info: "The cool roof layer shows the buildings that have reflective roofs and the buildings that have dark roofs.",
    externalSource: {
      citation:
        "Heris, M., George, R., Flohr, T., Avila, A. New York City Cool Roofs. Hunter College City University of New York, Penn State University, and the Mayor's Office of Climate and Environmental Justice of New York.",
      year: "2024",
      href: "https://storymaps.arcgis.com/stories/0cdc24592f85480ebaa094037b47a767.",
    },
    currentView: null,
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.metric === "PCT_AREA_COOLROOF")
        .reduce((urls: DownloadUrl[], dataset: any) => {
          const tiff_url = dataset.downloads_2;
          return [
            ...urls,
            {
              name: "Tiff",
              url: tiff_url,
              date: "",
              format: "tiff",
            },
          ];
        }, []);

      return urls;
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Area of buildings with cool roofs",
        legend: [
          { label: "76%", value: "#D2D6DC" },
          { label: "55%", value: "#A4ADBA" },
          { label: "47%", value: "#818FA4" },
          { label: "37%", value: "#526B8F" },
          { label: "20%", value: "#2D5185" },
        ],
        legendLastNumber: "3%",
        init: function (map) {
          return createNtaLayer(
            map,
            "PCT_AREA_COOLROOF",
            this.name,
            this.legend!,
            {
              "fill-color": [
                "case",
                ["<=", ["get", "PCT_AREA_COOLROOF"], 20],
                "#2D5185",
                ["<=", ["get", "PCT_AREA_COOLROOF"], 37],
                "#526B8F",
                ["<=", ["get", "PCT_AREA_COOLROOF"], 47],
                "#818FA4",
                ["<=", ["get", "PCT_AREA_COOLROOF"], 55],
                "#A4ADBA",
                ["<=", ["get", "PCT_AREA_COOLROOF"], 76],
                "#D2D6DC",
                "#000000", // Default color if no match
              ],
            }
          );
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map) {
          // const ntaLayerCleanup = createNtaLayer(
          //   map,
          //   "PCT_AREA_COOLROOF",
          //   this.name,
          //   this.legend!
          // );
          const coolRoofsCleanup = viewCoolRoofs(map);
          return function onDestroy() {
            // ntaLayerCleanup();
            coolRoofsCleanup();
          };
        },
      },
    },
  },
  {
    name: "Tree Canopy",
    group: "Static Factors",
    icon: treeCanopy,
    info: "The tree canopy map shows what areas in the city are covered by trees.",
    externalSource: {
      citation:
        "Office of Technology and Innovation. Land Cover Raster Data (2017) - 6in Resolution.",
      year: "September 23, 2022",
      href: "https://data.cityofnewyork.us/Environment/Land-Cover-Raster-Data-2017-6in-Resolution/he6d-2qns.",
    },
    currentView: null,
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.metric === "PCT_TREES")
        .reduce((urls: DownloadUrl[], dataset: any) => {
          const tiff_url = dataset.downloads;
          return [
            ...urls,
            {
              name: "Tiff",
              url: tiff_url,
              date: "",
              format: "tiff",
            },
          ];
        }, []);

      return urls;
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Area of tree canopy",
        legend: [
          { label: "50%", value: "#d6dfe1" },
          { label: "24%", value: "#adbec3" },
          { label: "20%", value: "#859ea4" },
          { label: "17%", value: "#5c7d86" },
          { label: "14%", value: "#335d68" },
        ],
        legendLastNumber: "2%",
        init: function (map) {
          return createNtaLayer(map, "PCT_TREES", this.name, this.legend!, {
            "fill-color": [
              "case",
              ["<=", ["get", "PCT_TREES"], 14],
              "#335d68",
              ["<=", ["get", "PCT_TREES"], 17],
              "#5c7d86",
              ["<=", ["get", "PCT_TREES"], 20],
              "#859ea4",
              ["<=", ["get", "PCT_TREES"], 24],
              "#adbec3",
              ["<=", ["get", "PCT_TREES"], 50],
              "#d6dfe1",
              "#000000", // Default color if no match
            ],
          });
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map) {
          const ntaLayerCleanup = createNtaLayer(
            map,
            "PCT_TREES",
            this.name,
            this.legend!
          );
          const treeCanopyCleanup = viewTreeCanopy(map);
          return function onDestroy() {
            ntaLayerCleanup();
            treeCanopyCleanup();
          };
        },
      },
    },
  },

  {
    name: "Permeable Surfaces",
    group: "Static Factors",
    icon: premeableSurface,
    info: "This layer shows the areas that can absorb water and they are usually cooler  than impervious surfaces.",
    externalSource: {
      citation:
        "Office of Technology and Innovation. Land Cover Raster Data (2017) - 6in Resolution",
      year: "September 23, 2022.",
      href: "https://data.cityofnewyork.us/Environment/Land-Cover-Raster-Data-2017-6in-Resolution/he6d-2qns.",
    },
    currentView: null,
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.metric === "PCT_PERMEABLE")
        .reduce((urls: DownloadUrl[], dataset: any) => {
          const tiff_url = dataset.downloads;
          return [
            ...urls,
            {
              name: "Tiff",
              url: tiff_url,
              date: "",
              format: "tiff",
            },
          ];
        }, []);

      return urls;
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Area of permeable surfaces",
        legend: [
          { label: "71%", value: "#f3d9b1" },
          { label: "20%", value: "#dabb8b" },
          { label: "10%", value: "#c19d65" },
          { label: "6%", value: "#a87e3e" },
          { label: "4%", value: "#8f6018" },
        ],
        legendLastNumber: "1%",
        init: function (map) {
          return createNtaLayer(map, "PCT_PERMEABLE", this.name, this.legend!, {
            "fill-color": [
              "case",
              ["<=", ["get", "PCT_PERMEABLE"], 4],
              "#8f6018",
              ["<=", ["get", "PCT_PERMEABLE"], 6],
              "#a87e3e",
              ["<=", ["get", "PCT_PERMEABLE"], 10],
              "#c19d65",
              ["<=", ["get", "PCT_PERMEABLE"], 20],
              "#dabb8b",
              ["<=", ["get", "PCT_PERMEABLE"], 71],
              "#f3d9b1",
              "#000000", // Default color if no match
            ],
          });
        },
      },
      raw: {
        name: "Raw Data",
        legend: [],
        init: (map) => viewPremeableSurface(map),
      },
    },
  },
  {
    name: "Air Temperature",
    group: "Dynamic Factors",
    icon: airTemperature,
    info: "The air temperature raster layer is modeled, and therefore, it represents the estimated air temperature for any given cell/pixel. The air temperature layers are estimated based on the surface temperature around a cell and the wind direction and speed at a given hour/day. Therefore, it is specific to the air movement patterns. In other summer days and other hours, the air temperature distribution will have different patterns. If your neighborhood has a higher temperature (compared to its adjacent neighborhoods) in one of the air temperature raster layers, it does not mean that it is always warmer. If the wind direction changes, the air temperature pattern will change, too. That's why we call these layers dynamic layers; they are variable based on wind and regional temperature patterns. If you need to see how the built environment in your neighborhood affects the temperature patterns, we suggest using MRT or surface temperature layers. We call those layers static layers because their spatial pattersn are not very variable.",
    externalSource: {
      citation:
        "Heris, M., Louie, A., Flohr, T., Haijing, L., Kittredge, A., Pankin, He, Z., Marcotullio, P., Fein, M. New York City Air Temperature.",
      year: "2025",
    },
    currentView: null,
    dates: [],
    currentDate: null,
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.metric.includes("Air_temp_raster_"))
        .reduce((urls: DownloadUrl[], dataset: any) => {
          // todo: setup csv in a better format
          const raw_url = dataset.downloads;
          const relative_url = dataset.downloads_2;
          console.log()
          return [
            ...urls,
            // { name: "Raw", url: raw_url, date: dataset.date, format: "tiff" },
            {
              name: "Relative",
              url: raw_url,
              date: dataset.date,
              format: "tiff",
            },
          ];
        }, []);

      return urls;
    },
    getDates: async () => {
      return nta_dataset_info.value
        .filter((dataset) => dataset.type === "air_temp")
        .map((d: any) => d.date)
        .sort();
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Average air temperature (°F)",
        init: function (map, options) {
          const date = `Air_temp_raster_${options?.date || "20230902"}`;
          const data = nta_dataset_info.value.find(
            (dataset) => dataset.metric === date
          );
          const values = Object.entries(data)
            .filter(
              ([key, value]) =>
                /^[A-Z]{2}\d{2}$/.test(key as string) &&
                value !== "" &&
                value !== "inf" &&
                !isNaN(Number(value))
            )
            .map(([_, value]) => parseFloat(value as string).toFixed(1));
          //@ts-ignore
          const minValue = Math.min(...values).toFixed(1);
          console.log(minValue);
          //@ts-ignore
          const maxValue = Math.max(...values).toFixed(1);
          const step = (
            (parseFloat(maxValue) - parseFloat(minValue)) /
            5
          ).toFixed(1);
          const bins = Array.from({ length: 6 }, (_, i) =>
            (parseFloat(minValue) + parseFloat(step) * i).toFixed(1)
          );

          return createNtaLayer(map, date, this.name, this.legend!, {
            "fill-color": [
              "case",
              ["<=", ["get", date], +bins[1]],
              "#F4D9CD",
              ["<=", ["get", date], +bins[2]],
              "#EFC9A9",
              ["<=", ["get", date], +bins[3]],
              "#EBBC85",
              ["<=", ["get", date], +bins[4]],
              "#E6AE61",
              "#E19F3D",
            ],
          });
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map, options) {
          const date = `Air_temp_raster_${options?.date || "20230902"}`;
          const airTemperatureCleanup = viewAirTemperature(map, options?.date);
          const ntaLayerCleanup = createNtaLayer(
            map,
            date,
            this.name,
            this.legend!
          );

          return function onDestroy() {
            ntaLayerCleanup();
            airTemperatureCleanup();
          };
        },
      },
    },
  },
  {
    name: "Air Heat Index",
    group: "Dynamic Factors",
    icon: airHeatIndex,
    info: "Air heat index raster layer is very similar to the air temperature raster layer. The difference is that the heat index is the combination of air temperature and relative humidity. Similar to the air temperature raster layers, this heat index layer is also modeled based on the wind direction and speed, and therefore, it is a dynamic layer (for more information, please see the use case of the air temperature layer). The heat index is what feels like temperature. In a given temperature, higher relative humidity will create higher heat index values because the evaporating cooling will be more complex, and you will feel warmer. In a weather situation where the relative humidity is lower, it feels like the temperature or heat index will also be lower. Read this page for more information: https://www.weather.gov/ama/heatindex",
    externalSource: {
      citation:
        "Heris, M., Louie, A., Flohr, T., Haijing, L., Kittredge, A., Pankin, He, Z., Marcotullio, P., Fein, M. New York City Air Heat Index",
      year: "2025",
    },
    currentView: null,
    dates: [],
    currentDate: null,
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.metric.includes("Air_Heat_Index_outputs"))
        .reduce((urls: DownloadUrl[], dataset: any) => {
          // todo: setup csv in a better format
          const raw_url = dataset.downloads;
          const relative_url = dataset.downloads_2;
          return [
            ...urls,
            // { name: "Raw", url: raw_url, date: dataset.date, format: "tiff" },
            {
              name: "Relative",
              url: raw_url,
              date: dataset.date,
              format: "tiff",
            },
          ];
        }, []);

      return urls;
    },
    getDates: async () => {
      return nta_dataset_info.value
        .filter((dataset) => dataset.type === "air_heat_index")
        .map((d: any) => d.date)
        .sort();
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Average air heat index (°F)",
        init: function (map, options) {
          const date = `Air_Heat_Index_outputs${options?.date || "20230902"}`;
          const data = nta_dataset_info.value.find(
            (dataset) => dataset.metric === date
          );
          const values = Object.entries(data)
            .filter(
              ([key, value]) =>
                /^[A-Z]{2}\d{2}$/.test(key as string) &&
                value !== "" &&
                value !== "inf" &&
                !isNaN(Number(value))
            )
            .map(([_, value]) => parseFloat(value as string).toFixed(1));
          //@ts-ignore
          const minValue = Math.min(...values).toFixed(1);
          //@ts-ignore
          const maxValue = Math.max(...values).toFixed(1);
          const step = (
            (parseFloat(maxValue) - parseFloat(minValue)) /
            5
          ).toFixed(1);
          const bins = Array.from({ length: 6 }, (_, i) =>
            (parseFloat(minValue) + parseFloat(step) * i).toFixed(1)
          );

          return createNtaLayer(map, date, this.name, this.legend!, {
            "fill-color": [
              "case",
              ["<=", ["get", date], +bins[1]],
              "#F7E7D0",
              ["<=", ["get", date], +bins[2]],
              "#EFC7B1",
              ["<=", ["get", date], +bins[3]],
              "#E6A891",
              ["<=", ["get", date], +bins[4]],
              "#DE8872",
              "#D66852",
            ],
          });
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map, options) {
          const date = `Air_Heat_Index_outputs${options?.date || "20230902"}`;
          const airHeatIndexCleanup = viewAirHeatIndex(map, options?.date);
          const ntaLayerCleanup = createNtaLayer(
            map,
            date,
            this.name,
            this.legend!
          );

          return function onDestroy() {
            ntaLayerCleanup();
            airHeatIndexCleanup();
          };
        },
      },
    },
  },
];

let destroyCallback: (() => void) | null = null;

export async function initializeView(
  dataset: Dataset,
  map: mapboxgl.Map | null
) {
  if (!dataset.currentView || !map) return dataset;

  try {
    if (destroyCallback) destroyCallback();
  } catch (error) {
    destroyCallback = null;
  }

  const view = dataset.views[dataset.currentView];

  if (view.init) {
    const options: ViewOptions = {};

    if (dataset.getDates) {
      dataset.dates = await dataset.getDates();
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

    await new Promise<void>((resolve) => {
      const source = map.getSource("weather_stations");
      if (source && map.isSourceLoaded("weather_stations")) {
        resolve();
      } else {
        map.once("sourcedata", () => {
          resolve();
        });
      }
    });
  } else {
    console.error(
      `${dataset.name}, ${dataset.currentView} doesn't have an init func`
    );
    destroyCallback = null;
  }

  return dataset;
}
