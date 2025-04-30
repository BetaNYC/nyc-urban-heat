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

import thumbnailOHE from "/thumbnails/OHE.png.png";
import thumbnailWS from "/thumbnails/WS-2023.png.png";
import thumbnailMRT from "/thumbnails/MRT_NTA.png.png";
import thumbnailST from "/thumbnails/ST_NTA.png.png";
import thumbnailCoolRoofs from "/thumbnails/coolroofs_NTA.png.png";
import thumbnailTreeCanopy from "/thumbnails/treecanopy_NTA.png.png";
import thumbnailPermableSurf from "/thumbnails/permablesurf_NTA.png.png";
import thumbnailAirTemp from "/thumbnails/airtemp_raster.png.png";
import thumbnailAirHeatIndex from "/thumbnails/airheatindex_raster.png.png";

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
import { viewRelativeSurfaceTemperature } from "./viewRelativeSurfaceTemperature";

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
  thumbnail: string;
  info?: string;
  description: {
    intro: string;
    method: string;
    case: string;
  };
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
    description: {
      intro:
        "The Outdoor Heat Exposure Index (OHEI) measures the risk of exposure to higher temperatures in outdoor environments on summer days in different neighborhoods.",
      method:
        "OHEI is calculated for each neighborhood tabulation area (NTA) by calculating the average score from the following five variables: (1) the summertime mean surface temperature, extracted from cloud-free Landsat images, (2) the average mean radiant temperature (MRT) at 2pm on a typical summer day, (3) the percentage of tree coverage area in each NTA, (4) the percentage of permeable surfaces area in each NTA, and (5) the percentage of cool roofs from the total building roof area in each NTA.",
      case: "OHEI can be used to compare the heat exposure intensity in different communities. The OHEI, which represents the outdoor heat intensity, was designed to be used in conjunction with the Heat Vulnerability Index (HVI), which considers social and environmental vulnerability factors of residents; both the OHEI and HVI aggregate data to NTA boundaries in NYC.Please note that the outdoor temperature and thermal comfort levels are different from indoor conditions. Building quality, exposure to direct radiation, cooling systems, and other building features will be essential in translating outdoor heat into health factors. If you are interested in the health implications of heat exposure, you may need to explore the Heat Vulnerability Index provided by the New York City Department of Health.",
    },
    externalSource: {
      citation:
        "Heris, M., Louie, A., Flohr, T., Haijing, L., Kittredge, A., Pankin, He, Z., Marcotullio, P., Fein, M. New York City Outdoor Heat Exposure Index. ",
      year: "2025 ",
    },
    getDownloadUrls: async () => {
      const urls = nta_dataset_info.value
        .filter(
          (dataset) => dataset.metric === "Outdooor_Heat_Volnerability_Index"
        )
        .reduce((urls: DownloadUrl[], dataset: any) => {
          const csv_url = dataset.downloads;
          return [
            ...urls,
            {
              name: "csv",
              url: csv_url,
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
        // legendLastNumber: "5",
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
    description: {
      intro:
        "VisualCrossing weather station locations measure daily air temperature and relative humidity, and are aggregated to show the number of extreme heat days measured per year.",
      method:
        "Weather stations report data on daily air temperature, relative humidity, and air heat index values. The NYC Urban Heat Portal includes the minimum and maximum daily values for air temperature and air heat index for summer days (between May 1 - September 30), and shows how these values differ from the historical normal minimum and maximum air temperature averages. These historic normal values are calculated between 1991-2020, and are sampled from the New York City Central Park weather station. (https://www.weather.gov/media/okx/Climate/CentralPark/monthlyannualtemp.pdf)",
      case: "Weather stations use professional sensors and instruments to measure data; however, they only offer insights into the condition of air around a point location. They are reliable resource for understanding how temperature changes from day to day. Although only measured in certain locations, such temporal resolution is not available for other heat-related data sources. Additionally, air temperature is highly variable by locations, but comparing the temperatures between different weather stations can provide a general idea of the heat distribution in urban areas.",
    },
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
    description: {
      intro:
        "Mean Radiant Temperature (MRT) is the area-weighted mean temperature of all surrounding objects in the urban evironment surrounding the body (e.g. buildings, vegetation, pavement). A dry black globe is used to measure MRT and the net exchange of radiant energy between two objects. This measure is approximately proportional to the product of their temperature difference multiplied by their emissivity (the ability to emit and absorb heat). MRT is central to understanding the radiant heat exchange between the human body and the surrounding environment.",
      method:
        "The MRT data in the NYC Urban Heat Portal is resampled from the Land Cover Layer of New York City (2017) at a one-meter resolution. MRT data is calculated for a sample of a typical summer day (July 15, 2017) during one hour of peak radiation (2pm). The MRT is produced using the SOLWEIG model, in which the input values of the model are: 1) air temperature: 82.4; relative humidity: 50%; water temperture: 71.6; global radation: 600; direct radation 700; diffuse radation: 150; wind speed: 3.1 m/s; wind sensor height 3m; utc offset: -4; local standard time 14:00.",
      case: "The mapped MRT data shows the amount of radiation that a pedestrian receives from the surrounding environment. The MRT data modeled in the NYC Urban Heat portal is spatially static, meaning that the map only shows how radiation exposure is distributed across space, and it does not represent how temperature changes during the day. These MRT values are highly dependent on shade coverage, where morning and late afternoon hours will create variability in shade within the urban environment. Because the MRT data was only sampled for the conditions of one typical summer day for one hour (July 15, 2017 at 2pm), this layer does not provide information about heat exposure in other hours (e.g. morning and evening hours are typically relatively cooler). The MRT values show lower values in shaded areas, and this can be seen in the sampled MRT data at 2pm, where the sun is oriented slightly west and the shade cast by objects (i.e. buildings and trees) would be on the east side. The MRT is variable based on the time of day; it is typically lower in the mornings and evenings, and likewise, the shade would change orientation in the morning or cover much more area during the late afternoon (i.e. 4-5pm).",
    },
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
    name: "Relative Surface Temperature",
    group: "Static Factors",
    icon: surfaceTemperature,
    info: `Mean value ( lowest 20 percentiles and the highest 80 percentiles ) of the relative ST values (relative to the parks in NYC) `,
    currentView: null,
    currentDate: null,
    getDownloadUrls: async () => {
      const urls =  [{
        name: "Relative",
        url: 'https://urban-heat-files.s3.us-east-1.amazonaws.com/nanmean_raster_bet_20_80_percentiles.tif',
        date: '',
        format: "relative",
      }]

      return urls;
    },
    views: {
      raw: {
        name: "Raw Data",
        init: function (map) {
          const surfaceTemperatureCleanup = viewRelativeSurfaceTemperature(map);
          // // Todo: Update datasets.csv have NTA_Relative_MEAN_ST_20_80_percentiles from NTA_Level_Heat_Data.csv, add to NTA shapefile?
          // const ntaLayerCleanup = createNtaLayer(
          //   map,
          //   'NTA_Relative_MEAN_ST_20_80_percentiles', 
          //   this.name,
          //   this.legend!
          // );
          return function onDestroy() {
            //ntaLayerCleanup();
            surfaceTemperatureCleanup();
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
    description: {
      intro:
        "Surface temperature measures the temperature of the ground or other surfaces, which can vary significantly from air temperature due to direct solar heating. It indicates how hot the surface of the earth would feel to touch in a particular location (i.e. building roofs, grass, tree canopy, etc.).",
      method:
        "Surface temperature data in the NYC Urban Heat Portal is retrieved from the USGS Landsat 8/9 Level 2 Collection. Data was extracted rom Band 10 of Landsat 8 and 9 raster images, sampled at a resolution of 30m. All cloud-free raster images are available on the NYC Urban Heat Portal for the greater NYC region between 2013 and 2023.",
      case: "Surface temperature represents the temperature of surfaces such as roofs, streets, and pavements (e.g. how it feels to touch the surface). On summer days, the surfaces that have been exposed to sunlight absorb heat and are usually much warmer than other surfaces. It is not unusual for an asphalt surface that is exposed to direct sunlight to have a 120°F temperature. High surface temperatures eventually warm up the air above it, but there are many different factors that contribute to that conversion. For example, wind speed and direction are major determinants of how surface temperature will warm up the air above it and how that air moves around. Our goal in urban heat mitigation is to reduce surface temperatures because it contributes to reducing the air temperature across the city. Use the surface temperature to see what surfaces are generating heat and what surfaces are generating cool air. Note that parks are cooler, cool roofs are cooler than dark roofs, and trees are cooler than open impervious surfaces, such as highways and parking lots. In a given space, surface temperature is different from air temperature or mean radiant temperature.",
    },
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
          const date = options?.date || "20230902";
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

          return createNtaLayer(
            map,
            metric,
            this.name,
            legend,
            {
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
            },
            date
          );
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map, options) {
          const date = options?.date || "20230902";
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
          const surfaceTemperatureCleanup = viewSurfaceTemperature(
            map,
            options?.date
          );
          const ntaLayerCleanup = createNtaLayer(
            map,
            metric,
            this.name,
            legend,
            {
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
            },
            date
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
    description: {
      intro:
        "Buildings with cool roofs absorb and transfer less heat from the sun to the building.",
      method:
        "Roof reflecctivity is measured from ortho images of New York City (2020). The NYC Urban Heat Portal defines cool roofs for areas that have a reflectivity value greater than or equal to 60. ",
      case: "Cool roofs data shows the buildings that have reflective roofs and the buildings that have dark roofs and retain more heat. Buildings with cool roofs use less air conditioning, save energy, and have more comfortable indoor temperatures. Cool roofs also impact surrounding areas by lowering temperatures outside of buildings and thus mitigating the heat island effect.",
    },
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
    description: {
      intro:
        "Urban Tree Canopy (UTC) shows areas where leaves, branches, and stems of trees cover the ground, when viewed from above.",
      method:
        "Tree canopy data is referenced from New York City's high-resolution land cover data (2017, 0.5 feet), and resampled at a 1 meter resolution.",
      case: "The tree canopy map shows what areas in the city are covered by trees. Tree canopy areas reduce urban heat island effect, reduces heating and cooling costs, lowers air temperature, and mitigates air pollution.",
    },
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
          const ntaLayerCleanup = createNtaLayer(map, "PCT_TREES", this.name, [
            { label: "50%", value: "#d6dfe1" },
            { label: "24%", value: "#adbec3" },
            { label: "20%", value: "#859ea4" },
            { label: "17%", value: "#5c7d86" },
            { label: "14%", value: "#335d68" },
          ]);
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
    description: {
      intro:
        "Permeable surfaces are areas with porous surface materials that allow water to pass through them, rather than impeding its flow.",
      method:
        "Permeable surface data is referenced from New York City's high-resolution land cover data (2017, 0.5 feet), and resampled at a 1 meter resolution. Permeable surfaces are defined by classes including: bare soil, grass, and water.",
      case: "Permeable surface data shows the areas that can absorb water and are usually cooler than impervious surfaces. These surfaces are designed to reduce stormwater runoff, filter out pollutants, and recharge groundwater aquifers.",
    },
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
        init: function (map) {
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
            ]
          );
          const premeableSurfaceCleanup = viewPremeableSurface(map);
          return function onDestroy() {
            ntaLayerCleanup();
            premeableSurfaceCleanup();
          };
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
    description: {
      intro:
        "Air temperature is the measure of how hot or cold the air is. Air temperature is the most commonly measured weather parameter.",
      method:
        "Air temperature or dry-bulb Temperature (DBT) is the temperature of air measured by a thermometer freely exposed to the air, but shielded from radiation. The thermometer is typically placed at about 2 meters above the ground. The air temperature raster data is modeled as an estimate based on the surface temperature around a cell and the wind direction and speed at a given hour and day; the NYC Urban Heat Portal features air temperature sampled at 3pm in the afternoon for dates specified between 2013-2023.",
      case: "Air temperature data is dynamic layer that is variable based on air movement patterns, including wind and regional temperature. In other summer days and other hours, the air temperature distribution will have different patterns. Air temperature raster layer is modeled, so this means that it represents the estimated air temperature for any given cell/pixel. If one neighborhood has a higher air temperature avefrage compared to its adjacent neighborhoods, this does not necessarily mean that it is always warmer. When the wind direction changes, the air temperature value in a given cell would change too. If you want to see how the built environment in a given neighborhood affects the temperature patterns, we suggest using static layers, such as mean radiant temperature or surface temperature data, that do not vary based on wind and temperature. Note that the measure for air temperature is independent of the humidity of the air. ",
    },
    externalSource: {
      citation:
        "Heris, M., Louie, A., Flohr, T., Haijing, L., Kittredge, A., Pankin, He, Z., Marcotullio, P., Fein, M. New York City Air Temperature.",
      year: "2025",
    },
    currentView: "raw",
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
          const date = options?.date || "20230902";
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

          return createNtaLayer(
            map,
            metric,
            this.name,
            legend,
            {
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
            },
            date
          );
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map, options) {
          const date = options?.date || "20230902";
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
          const ntaLayerCleanup = createNtaLayer(
            map,
            metric,
            this.name,
            legend,
            {
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
            },
            date
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
    thumbnail: thumbnailAirHeatIndex,
    info: "What the temperature feels like to the human body when relative humidity is combined with the air temperature. This has important considerations for the human body's comfort. The parameter is calculated at 3pm in the following dates",
    description: {
      intro:
        "Air heat index is what the temperature feels like to the human body when relative humidity is combined with the air temperature. This has important considerations for the human body's comfort.",
      method:
        "Air heat index raster data is modeled as an estimate based on the combination of air temperature and relative humidity. Similar to the air temperature data, air heat index is a dynamic layer that varies based on the wind direction and speed, but differs from air temperature because it also factors in relative humidity. Air heat index data is sampled at 3pm in the afternoon.",
      case: "The heat index is what feels like temperature. In a given temperature, higher relative humidity will create higher heat index values because the evaporating cooling will be more complex, and you will feel warmer. In a weather situation where the relative humidity is lower, it feels like the temperature or heat index will also be lower.",
    },
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
          const date = options?.date || "20230902";
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
          ];

          return createNtaLayer(
            map,
            metric,
            this.name,
            legend,
            {
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
            },
            date
          );
        },
      },
      raw: {
        name: "Raw Data",
        init: function (map, options) {
          const date = options?.date || "20230902";
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
          ];
          const airHeatIndexCleanup = viewAirHeatIndex(map, options?.date);
          const ntaLayerCleanup = createNtaLayer(
            map,
            metric,
            this.name,
            legend,
            {
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
            },
            date
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
