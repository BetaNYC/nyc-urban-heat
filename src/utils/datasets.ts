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

import thumbnailOHE from "/thumbnails/OHE.png.png"
import thumbnailWS from "/thumbnails/WS-2023.png.png"
import thumbnailMRT from "/thumbnails/MRT_NTA.png.png"
import thumbnailST from "/thumbnails/ST_NTA.png.png"
import thumbnailCoolRoofs from "/thumbnails/coolroofs_NTA.png.png"
import thumbnailTreeCanopy from "/thumbnails/treecanopy_NTA.png.png"
import thumbnailPermableSurf from "/thumbnails/permablesurf_NTA.png.png"
import thumbnailAirTemp from '/thumbnails/airtemp_raster.png.png'
import thumbnailAirHeatIndex from "/thumbnails/airheatindex_raster.png.png"

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
  thumbnail:string;
  info?: string;
  description:string;
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
    thumbnail: thumbnailOHE,
    info: "The Outdoor Heat Exposure Index (OHEI) measures the risk of exposure to higher temperatures in outdoor environments. This index combines mean tree cover, radiant temperature (MRT), surface temperature, permeable surfaces, and cool roofs.",
    description:"To calculate the Outdoor Heat Exposure Index for each neighborhood, we combined the following variables: (1) the mean summertime surface temperature extracted from cloud-free Landsat images. (2) the average mean radiant temperature (MRT) calculated for 2 PM on a typical summer day. (3) a percentage of tree coverage in the neighborhood, (4) a percentage of permeable surfaces in the neighborhood, and (5) the percentage of cool roofs from the total roof area of the neighborhood. We simply calculated the average score of these five variables. ",
    externalSource: {
      citation:
        "Heris, M., Louie, A., Flohr, T., Haijing, L., Kittredge, A., Pankin, He, Z., Marcotullio, P., Fein, M. New York City Outdoor Heat Exposure Index. ",
      year: "2025 ",
    },
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.metric === "Outdooor_Heat_Volnerability_Index")
        .reduce((urls: DownloadUrl[], dataset: any) => {
          const tiff_url = dataset.downloads;
          return [
            ...urls,
            {
              name: "csv",
              url: "https://urban-heat-files.s3.us-east-1.amazonaws.com/NTA_Outdoor_Heat_Index.csv",
              date: "",
              format: "csv",
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
    thumbnail: thumbnailWS,
    info: "VisualCrossing weather station locations measure daily air temperature and relative humidity, and are aggregated to show the number of extreme heat days measured per year.",
    description:"The weather station data reports each day's air temperature, relative humidity, and heat index values. We included the maximum and minimum daily values. To show how these values differ from the historical normals, we provided both minimum and maximum air temperature averages. These values are calculated for 1991-2020 extracted from the New York City Central Park weather station (https://www.weather.gov/media/okx/Climate/CentralPark/monthlyannualtemp.pdf)",
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
        legendLastNumber: "0",
        init: (map, options) => viewWeatherStations(map, options?.year!),
      },
    },
  },
  {
    name: "Mean Radiant Temperature",
    group: "Static Factors",
    icon: meanRadiantTemperature,
    thumbnail: thumbnailMRT,
    info: "The area-weighted mean temperature of all the objects in the urban evironment surrounding the body (e.g. buildings, vegetation, pavement).",
    description:"Mean Radiant Temperature (MRT) is central to our understanding of the radiant heat exchange between the human body and the surrounding environment. MRT is a useful concept as the net exchange of radiant energy between two objects is approximately proportional to the product of their temperature difference multiplied by their emissivity (ability to emit and absorb heat). The MRT is simply the area-weighted mean temperature of all the objects surrounding the body. You can also use a dry black globe to measure MRT. The MRT layer in this portal is produced using the Land Cover Layer of New York City (2017, resampled to one-meter resolution). The MRT layer is calculated for 2 PM on July 15th as a typical summer day. The MRT is produced using SOLWEIG model. The input values of the model are: 1) air temperature: 82.4; relative humidity: 50%; water temperture: 71.6; global radation: 600; direct radation 700; diffuse radation: 150; wind speed: 3.1 m/s; wind sensor height 3m; utc offset: -4; local standard time 14:00. ",
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
    thumbnail: thumbnailST,
    info: `The temperature of the ground or other surfaces, which can vary significantly from air temperature due to direct solar heating.`,
    description:"Surface Temperature (ST) refers to the temperature of the ground or other surfaces, which can vary significantly from air temperature due to direct solar heating. Surface Temperature indicates how hot the “surface” of the Earth would feel to the touch in a particular location (i.e. building roofs, grass, tree canopy, etc.). Surface temperature is not the same as the air temperature in the daily weather report. We retrieved the surface temperature from the Landsat 8/9 Level 2 Collection dataset (https://www.usgs.gov/landsat-missions/landsat-collection-2-level-2-science-products). These layers are extracted from Band 10 of Landsat 8 and 9 images. The resolution of these raster layers is 30m. We have included all cloud-free images available for this region between 2013 and 2023. ",
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
        .filter((dataset) => dataset.type === "surface_temp")
        .map((d: any) => d.date)
        .sort();
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Average surface temperature (°F)",
        init: function (map, options) {
          const date = options?.date || "20230902"
          const metric = `ST_${options?.date || "20230902"}`;
          const data = nta_dataset_info.value.find(
            (dataset) => dataset.metric === metric
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

          const legend = [
            { label: bins[5], value: "#511314" },
            { label: bins[4], value: "#7a4645" },
            { label: bins[3], value: "#a37a76" },
            { label: bins[2], value: "#cbada6" },
            { label: bins[1], value: "#f4e0d7" },
          ];

          return createNtaLayer(map, metric, this.name, legend, {
            "fill-color": [
              "case",
              ["<=", ["get", metric], +bins[1]],
              "#f4e0d7",
              ["<=", ["get", metric], +bins[2]],
              "#cbada6",
              ["<=", ["get", metric], +bins[3]],
              "#a37a76",
              ["<=", ["get", metric], +bins[4]],
              "#7a4645",
              "#511314",
            ],
          },date);
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map, options) {
          const date = options?.date || "20230902"
          const metric = `ST_${options?.date || "20230902"}`;
          const data = nta_dataset_info.value.find(
            (dataset) => dataset.metric === metric 
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


          const legend = [
            { label: bins[5], value: "#511314" },
            { label: bins[4], value: "#7a4645" },
            { label: bins[3], value: "#a37a76" },
            { label: bins[2], value: "#cbada6" },
            { label: bins[1], value: "#f4e0d7" },
          ]
          const surfaceTemperatureCleanup = viewSurfaceTemperature(
            map,
            options?.date
          );
          const ntaLayerCleanup = createNtaLayer(
            map,
            metric ,
            this.name,
            legend,
            {
              "fill-color": [
                "case",
                ["<=", ["get", metric ], +bins[1]],
                "#f4e0d7",
                ["<=", ["get", metric ], +bins[2]],
                "#cbada6",
                ["<=", ["get", metric ], +bins[3]],
                "#a37a76",
                ["<=", ["get", metric ], +bins[4]],
                "#7a4645",
                "#511314",
              ],
            },date
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
    thumbnail: thumbnailCoolRoofs,
    info: "Buildings with cool roofs absorb and transfer less heat from the sun; cool roof areas have a reflectivity value greater than or equal to 60.",
    description:"Buildings with cool roofs absorb and transfer less heat from the sun to the building compared with a more conventional roof and have a have a reflectivity value greather than or equal to 60. Buildings with cool roofs use less air conditioning, save energy, and have more comfortable indoor temperatures. Cool roofs also impact surrounding areas by lowering temperatures outside of buildings and thus mitigating the heat island effect. We have measured the roof reflectivity from the ortho images of New York City (2020). For further information about this layer",
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
          const ntaLayerCleanup = createNtaLayer(
            map,
            "PCT_AREA_COOLROOF",
            this.name,
            [
              { label: "76%", value: "#D2D6DC" },
              { label: "55%", value: "#A4ADBA" },
              { label: "47%", value: "#818FA4" },
              { label: "37%", value: "#526B8F" },
              { label: "20%", value: "#2D5185" },
            ]
          );
          const coolRoofsCleanup = viewCoolRoofs(map);
          return function onDestroy() {
            ntaLayerCleanup();
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
    thumbnail: thumbnailTreeCanopy,
    info: "Areas where leaves, branches, and stems of trees cover the ground, when viewed from above. Tree canopy areas reduce urban heat island effect.",
    description:"Urban tree canopy (UTC) shows areas where leaves, branches, and stems of trees cover the ground, when viewed from above. UTC reduces the urban heat island effect, reduces heating/cooling costs, lowers air temperatures, reduces air pollution. We have extracted the tree canopy layer from New York City's high-resolution land cover data (2017, 0.5 feet). The layer is resampled to a 1-meter resolution. The source of this layer is NYC Open Data. ",
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
            [
              { label: "50%", value: "#d6dfe1" },
              { label: "24%", value: "#adbec3" },
              { label: "20%", value: "#859ea4" },
              { label: "17%", value: "#5c7d86" },
              { label: "14%", value: "#335d68" },
            ],
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
    thumbnail: thumbnailPermableSurf,
    info: "Areas with porous surface materials that allow water to pass through them, which reduce stormwater runoff, filter out pollutants, and recharge groundwater aquifers.",
    description:"Permeable surfaces, also known as porous or pervious surfaces, are materials that allow water to pass through them, rather than impeding its flow. These surfaces are designed to reduce stormwater runoff, filter out pollutants, and recharge groundwater aquifers. This layer is extracted from New York City's high-resolution land cover layer (2017, 0.5 feet). We chose the land cover classes of bare soil, grass, and water as the permeable surfaces. We resampled this layer to 1 meter. The high-resolution land cover layer is available through NYC Open Data.",
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
        init: function(map) {
          const ntaLayerCleanup = createNtaLayer(
            map,
            "PCT_PERMEABLE",
            this.name,
            [
              { label: "71%", value: "#f3d9b1" },
              { label: "20%", value: "#dabb8b" },
              { label: "10%", value: "#c19d65" },
              { label: "6%", value: "#a87e3e" },
              { label: "4%", value: "#8f6018" },
            ],
          );
          const premeableSurfaceCleanup =  viewPremeableSurface(map)
          return function onDestroy(){
            ntaLayerCleanup();
            premeableSurfaceCleanup()
          }
        },
      },
    },
  },
  {
    name: "Air Temperature",
    group: "Dynamic Factors",
    icon: airTemperature,
    thumbnail: thumbnailAirTemp,
    info: "Temperature measure of how hot or cold the air is. Air temperature is the most commonly measured weather parameter which is calculated at 3pm in the following dates",
    description:"Air Temperature or Dry-Bulb Temperature (DBT) is the temperature of air measured by a thermometer freely exposed to the air, but shielded from radiation. The thermometer is typically placed at about 2 meters above the ground. This is independent of the humidity of the air.",
    externalSource: {
      citation:
        "Heris, M., Louie, A., Flohr, T., Haijing, L., Kittredge, A., Pankin, He, Z., Marcotullio, P., Fein, M. New York City Air Temperature.",
      year: "2025",
    },
    currentView: 'raw',
    dates: [],
    currentDate: null,
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter((dataset) => dataset.metric.includes("Air_temp_raster_"))
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
        .filter((dataset) => dataset.type === "air_temp")
        .map((d: any) => d.date)
        .sort();
    },
    views: {
      nta: {
        name: "NTA Aggregated",
        legendTitle: "Average air temperature (°F)",
        init: function (map, options) {
          const date = options?.date || "20230902"
          const metric = `Air_temp_raster_${date}`;
          const data = nta_dataset_info.value.find(
            (dataset) => dataset.metric === metric
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

          const legend = [
            { label: bins[5], value: "#E19F3D" },
            { label: bins[4], value: "#E6AE61" },
            { label: bins[3], value: "#EBBC85" },
            { label: bins[2], value: "#EFC9A9" },
            { label: bins[1], value: "#F4D9CD" },
          ];

          return createNtaLayer(map, metric, this.name, legend, {
            "fill-color": [
              "case",
              ["<=", ["get", metric], +bins[1]],
              "#F4D9CD",
              ["<=", ["get", metric], +bins[2]],
              "#EFC9A9",
              ["<=", ["get", metric], +bins[3]],
              "#EBBC85",
              ["<=", ["get", metric], +bins[4]],
              "#E6AE61",
              "#E19F3D",
            ],
          }, date);
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map, options) {
          const date = options?.date || "20230902"
          const metric = `Air_temp_raster_${date}`;
          const data = nta_dataset_info.value.find(
            (dataset) => dataset.metric === metric
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

          const legend = [
            { label: bins[5], value: "#E19F3D" },
            { label: bins[4], value: "#E6AE61" },
            { label: bins[3], value: "#EBBC85" },
            { label: bins[2], value: "#EFC9A9" },
            { label: bins[1], value: "#F4D9CD" },
          ];
          const airTemperatureCleanup = viewAirTemperature(map, options?.date);
          const ntaLayerCleanup = createNtaLayer(map, metric, this.name, legend, {
            "fill-color": [
              "case",
              ["<=", ["get", metric], +bins[1]],
              "#F4D9CD",
              ["<=", ["get", metric], +bins[2]],
              "#EFC9A9",
              ["<=", ["get", metric], +bins[3]],
              "#EBBC85",
              ["<=", ["get", metric], +bins[4]],
              "#E6AE61",
              "#E19F3D",
            ],
          },date);

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
    thumbnail: thumbnailAirHeatIndex,
    info: "What the temperature feels like to the human body when relative humidity is combined with the air temperature. This has important considerations for the human body's comfort. The parameter is calculated at 3pm in the following dates",
    description:"Heat Index is a measure of how hot it really feels when factoring in the relative humidity. This index is a combination of air temperature and relative humidity and you can calculate it using a formula.",
    externalSource: {
      citation:
        "Heris, M., Louie, A., Flohr, T., Haijing, L., Kittredge, A., Pankin, He, Z., Marcotullio, P., Fein, M. New York City Air Heat Index",
      year: "2025",
    },
    currentView: "raw",
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
          const date = options?.date || "20230902"
          const metric = `Air_Heat_Index_outputs${date}`;
          const data = nta_dataset_info.value.find(
            (dataset) => dataset.metric === metric
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

          const legend = [
            { label: bins[5], value: "#D66852" },
            { label: bins[4], value: "#DE8872" },
            { label: bins[3], value: "#E6A891" },
            { label: bins[2], value: "#EFC7B1" },
            { label: bins[1], value: "#F7E7D0" },
          ]

          return createNtaLayer(map, metric, this.name, legend, {
            "fill-color": [
              "case",
              ["<=", ["get", metric], +bins[1]],
              "#F7E7D0",
              ["<=", ["get", metric], +bins[2]],
              "#EFC7B1",
              ["<=", ["get", metric], +bins[3]],
              "#E6A891",
              ["<=", ["get", metric], +bins[4]],
              "#DE8872",
              "#D66852",
            ],
          },date);
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map, options) {
          const date = options?.date || "20230902"
          const metric = `Air_Heat_Index_outputs${date}`;
          const data = nta_dataset_info.value.find(
            (dataset) => dataset.metric === metric
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
          const legend = [
            { label: bins[5], value: "#D66852" },
            { label: bins[4], value: "#DE8872" },
            { label: bins[3], value: "#E6A891" },
            { label: bins[2], value: "#EFC7B1" },
            { label: bins[1], value: "#F7E7D0" },
          ]
          const airHeatIndexCleanup = viewAirHeatIndex(map, options?.date);
          const ntaLayerCleanup = createNtaLayer(map, metric, this.name, legend, {
            "fill-color": [
              "case",
              ["<=", ["get", metric], +bins[1]],
              "#F7E7D0",
              ["<=", ["get", metric], +bins[2]],
              "#EFC7B1",
              ["<=", ["get", metric], +bins[3]],
              "#E6A891",
              ["<=", ["get", metric], +bins[4]],
              "#DE8872",
              "#D66852",
            ],
          },date);

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
