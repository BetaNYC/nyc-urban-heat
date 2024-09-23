import outdoorHeatExposureIndex from "/icons/outdoor_heat_exposure_index.svg"
import weatherStations from "/icons/weather_stations.svg"
import airTemperature from "/icons/air_temperature.svg"
import airHeatIndex from "/icons/air_heat_index.svg"
import meanRadiantTemperature from "/icons/mean_radiant_temperature.svg"
import surfaceTemperature from "/icons/surface_temperature.svg"
import treeCanopy from "/icons/tree_canopy.svg"
import coolRoofs from "/icons/cool_roofs.svg"
import premeableSurface from "/icons/permeable_surface.svg"
import parks from "/icons/parks.svg"

import ntaFeatureCollection from '../data/nta.geo.json'
import { Map, Popup, MapLayerMouseEvent } from "mapbox-gl"

import { FeatureCollection, Geometry } from 'geojson';
import { format } from 'd3-format';


const boroughExpand = {
  'MN': 'Manhattan',
  'BX': 'The Bronx',
  'BK': 'Brooklyn',
  'QN': 'Queens',
  'SI': 'Staten Island'
}

type IconType = typeof outdoorHeatExposureIndex;

export interface View {
  name: string;
  legend?: any;
  init?: (map: Map) => void;
}

interface CollectionOfViews {
  [key: string]: View;
}

export interface Dataset {
  name: string;
  group: string;
  icon: IconType;
  info?: string;
  data?: object;
  currentView: null | string;
  views: CollectionOfViews;
}

function createNtaLayer(map: mapboxgl.Map, metric: string, fill_paint_styles: any) {
  const sourceId = metric + '_SOURCE'
  const layerFillId = metric + '_FILL'
  const layerOutlineId = metric + '_OUTLINE'

  const popup = new Popup({
    closeButton: true
  });

  map.addSource(sourceId, {
    type: 'geojson',
    data: ntaFeatureCollection as FeatureCollection,
    promoteId: "ntacode"
  })

  map.addLayer({
    'id': layerFillId,
    'type': 'fill',
    'source': sourceId,
    'layout': {},
    'paint': {
      'fill-color': 'black',
    }
  });

  map?.addLayer({
    'id': layerOutlineId,
    'type': 'line',
    'source': sourceId,
    'layout': {},
    'paint': {
        'line-color': 'rgba(0,0,0,0.6)',
        'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            2,
            0
        ]
    }
});




  return () => {
    console.log('remove layer')
  }
}

export const datasets: Dataset[] = [
  {
    name: "Outdoor Heat Exposure Index",
    group: "",
    icon: outdoorHeatExposureIndex,
    info: "The Outdoor Heat Exposure Index is a measure of the risk of heat-related illnesses for people spending time outdoors.",
    currentView: null,
    views: {
      'nta': {
        name: 'NTA Aggregated',
        legend: [],
        init: (map) => createNtaLayer(map, 'HEAT_VULNERABILITY', {
          'fill-color': [
            "interpolate",
            ["linear"],
            ["get", "Heat_Vulnerability"],
            0,
            "#FFF3B0",
            3,
            "#D66852",
            5,
            "#511314"
          ],

        })
      },
      'raw': { name: 'Raw Data' }
    }
  },
  {
    name: "Weather Stations",
    group: "",
    icon: weatherStations,
    currentView: null,
    views: {
      'points': { name: 'Stations' }
    }
  },
  {
    name: "Air Temperature",
    group: "Outdoor Heat Exposure",
    icon: airTemperature,
    currentView: null,
    views: {
      'nta': { name: 'NTA Aggregated' },
      'raw': { name: 'Raw Data' }
    }
  },
  {
    name: "Air Heat Index",
    group: "Outdoor Heat Exposure",
    icon: airHeatIndex,
    currentView: null,
    views: {
      'nta': { name: 'NTA Aggregated' },
      'raw': { name: 'Raw Data' }
    }
  },
  {
    name: "Mean Radiant Temperature",
    group: "Outdoor Heat Exposure",
    icon: meanRadiantTemperature,
    currentView: null,
    views: {
      'nta': { name: 'NTA Aggregated' },
      'raw': { name: 'Raw Data' }
    }
  },
  {
    name: "Surface Temperature",
    group: "Outdoor Heat Exposure",
    icon: surfaceTemperature,
    currentView: null,
    views: {
      'nta': { name: 'NTA Aggregated' },
      'raw': { name: 'Raw Data' }
    }
  },
  {
    name: "Tree Canopy",
    group: "Heat Mitigation",
    icon: treeCanopy,
    currentView: null,
    views: {
      'nta': { name: 'NTA Aggregated' },
      'raw': { name: 'Raw Data' }
    }
  },
  {
    name: "Cool Roofs",
    group: "Heat Mitigation",
    icon: coolRoofs,
    currentView: null,
    views: {
      'nta': { name: 'NTA Aggregated' },
      'raw': { name: 'Raw Data' }
    }
  },
  {
    name: "Premeable Surfaces",
    group: "Heat Mitigation",
    icon: premeableSurface,
    currentView: null,
    views: {
      'nta': { name: 'NTA Aggregated' },
      'raw': { name: 'Raw Data' }
    }
  },
  {
    name: "Parks",
    group: "Heat Mitigation",
    icon: parks,
    currentView: null,
    views: {
      'nta': { name: 'NTA Aggregated' },
      'raw': { name: 'Raw Data' }
    }
  }
];
