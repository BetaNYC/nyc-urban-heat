import { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react'

import { MapContext, MapContextType } from "../contexts/mapContext.js"
import { MapLayersContext, MapLayersContextType, LayersType } from '../contexts/mapLayersContext'

import LayerSelectionOption from './LayerSelectionOption'

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


import { ChevronUpIcon, ChevronDownIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid'


const layerImgSource = {
  "Outdoor Heat Exposure Index": outdoorHeatExposureIndex,
  "Weather Stations": weatherStations,
  "Air Temperature": airTemperature,
  "Air Heat Index": airHeatIndex,
  "Mean Radiant Temperature": meanRadiantTemperature,
  "Surface Temperature": surfaceTemperature,
  "Tree Canopy": treeCanopy,
  "Cool Roofs": coolRoofs,
  "Premeable Surfaces": premeableSurface,
  "Parks": parks,
}

type Props = {
  setTimeScale: Dispatch<SetStateAction<"date" | "year" | "default">>
  setProfileExpanded: Dispatch<SetStateAction<boolean>>
}

const LayerSelections = ({ setTimeScale, setProfileExpanded }: Props) => {

  const [expand, setExpand] = useState<boolean>(true)
  const { map } = useContext(MapContext) as MapContextType
  const { layer } = useContext(MapLayersContext) as MapLayersContextType

  const [prevLayer, setPrevLayer] = useState<LayersType | null>(null)

  const [toggle, setToggle] = useState<{
    "Outdoor Heat Exposure Index": 'nta' | 'raw',
    "Weather Stations": 'nta' | 'raw',
    "Air Temperature": 'nta' | 'raw',
    "Air Heat Index": 'nta' | 'raw',
    "Mean Radiant Temperature": 'nta' | 'raw',
    "Surface Temperature": 'nta' | 'raw',
    "Tree Canopy": 'nta' | 'raw',
    "Cool Roofs": 'nta' | 'raw',
    "Premeable Surfaces": 'nta' | 'raw',
    "Parks": 'nta' | 'raw'
  }>({
    "Outdoor Heat Exposure Index": 'nta',
    "Weather Stations": 'nta',
    "Air Temperature": 'nta',
    "Air Heat Index": 'nta',
    "Mean Radiant Temperature": 'nta',
    "Surface Temperature": 'nta',
    "Tree Canopy": 'nta',
    "Cool Roofs": 'nta',
    "Premeable Surfaces": 'nta',
    "Parks": 'nta'
  })

  const [toggleExpand, setToggleExpand] = useState<{
    "Outdoor Heat Exposure Index": boolean,
    "Weather Stations": boolean,
    "Air Temperature": boolean,
    "Air Heat Index": boolean,
    "Mean Radiant Temperature": boolean,
    "Surface Temperature": boolean,
    "Tree Canopy": boolean,
    "Cool Roofs": boolean,
    "Premeable Surfaces": boolean,
    "Parks": boolean,
  }>({
    "Outdoor Heat Exposure Index": false,
    "Weather Stations": false,
    "Air Temperature": false,
    "Air Heat Index": false,
    "Mean Radiant Temperature": false,
    "Surface Temperature": false,
    "Tree Canopy": false,
    "Cool Roofs": false,
    "Premeable Surfaces": false,
    "Parks": false
  })

  const [infoExpand, setInfoExpand] = useState<{
    "Outdoor Heat Exposure Index": boolean,
    "Weather Stations": boolean,
    "Air Temperature": boolean,
    "Air Heat Index": boolean,
    "Mean Radiant Temperature": boolean,
    "Surface Temperature": boolean,
    "Tree Canopy": boolean,
    "Cool Roofs": boolean,
    "Premeable Surfaces": boolean,
    "Parks": boolean,
  }>({
    "Outdoor Heat Exposure Index": false,
    "Weather Stations": false,
    "Air Temperature": false,
    "Air Heat Index": false,
    "Mean Radiant Temperature": false,
    "Surface Temperature": false,
    "Tree Canopy": false,
    "Cool Roofs": false,
    "Premeable Surfaces": false,
    "Parks": false
  })


  useEffect(() => {
    if (prevLayer && map) {
      switch (prevLayer) {
        case "Outdoor Heat Exposure Index":
          if (map?.getLayer('nta')) map.removeLayer('nta');
          if (map?.getLayer('nta-outline')) map.removeLayer('nta-outline');
          break;
        case "Weather Stations":
          // map.setLayoutProperty("weather_stations_heat_event", "visibility", "none");
          // map.setLayoutProperty("weather_stations_heat_advisory", "visibility", "none");
          // map.setLayoutProperty("weather_stations_heat_excessive", "visibility", "none");
          map.removeLayer("weather_stations_heat_event");
          map.removeLayer("weather_stations_heat_advisory")
          map.removeLayer("weather_stations_heat_excessive")
          map.removeSource('weather_stations');
          break;
        case "Surface Temperature":
          map.removeLayer('surface_temperature');
          map.removeSource('surface_temperature');
          break;
        case "Tree Canopy":
          map.removeLayer('tree_canopy');
          map.removeSource('tree_canopy');
          break;
        case "Cool Roofs":
          map.removeLayer('nta')
          map.removeLayer('nta_outline')
          map.removeSource('nta')
          break;
        case 'Premeable Surfaces':
          map.removeLayer('nta')
          map.removeLayer('nta_outline')
          map.removeSource('nta')
          break;
        case "Parks":
          map.removeLayer('nta')
          map.removeLayer('nta_outline')
          map.removeSource('nta')
          break;
        default:
          // const prevLayerName = prevLayer?.toLocaleLowerCase().replace(" ", "_")
          // map.setLayoutProperty(prevLayerName, "visibility", "none");
          break;
      }
    }
    if (layer && map) {
      switch (layer) {
        case "Weather Stations":
          setTimeScale("year")
          // map.setLayoutProperty("weather_stations_heat_event", "visibility", "visible");
          // map.setLayoutProperty("weather_stations_heat_advisory", "visibility", "visible");
          // map.setLayoutProperty("weather_stations_heat_excessive", "visibility", "visible");
          break;
        case "Surface Temperature":
          setTimeScale("date")
          break;
        default:
          // const layerName = layer?.toLocaleLowerCase().replace(" ", "_")
          // map.setLayoutProperty(layerName, "visibility", "visible");
          break;
      }
    }
    setPrevLayer(layer)
    setProfileExpanded(false)
  }, [layer])

  // ${!expand ? "h-[3rem] overflow-hidden" : "max-h-[75%] overflow-y-scroll"}



  return (
    <div className={`absolute left-6 top-[4.625rem] w-[20rem] ${!expand ? "h-[3.5rem] overflow-hidden" : "pb-4 h-[70%]"} bg-[#1B1B1B] rounded-lg drop-shadow-lg z-[999] cursor-pointer`}    >
      <div className='flex justify-between items-center px-5 h-[3.5rem]' onClick={() => setExpand(!expand)}>
        <div className="flex items-center gap-3 ">
          {
            layer && <img src={layerImgSource[layer]} alt="" className="w-6 h-6 text-[#BDBDBD]" />
          }
          <h2 className={`font-medium text-regular text-[#F2F2F2]`}>{!layer ? "Urban Heat Data Layers" : layer}</h2>
        </div>
        {expand ? <ChevronUpIcon width={24} height={24} className='text-[#BDBDBD]' />
          : <ChevronDownIcon width={24} height={24} className='text-[#BDBDBD]' />}
      </div>
      {
        expand && (
          <>
            <div className='h-[calc(100%_-_7.25rem)] overflow-y-scroll overflow-hidden scrollbar'>
              <div className=''>
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Outdoor Heat Exposure Index" img={layerImgSource['Outdoor Heat Exposure Index']} />
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Weather Stations" img={layerImgSource["Weather Stations"]} />
              </div>
              <div>
              <h3 className="px-6 pt-3 pb-1 text-regular text-[#BDBDBD]">Outdoor Heat Exposure</h3>
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Air Temperature" img={layerImgSource["Air Temperature"]} />
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Air Heat Index" img={layerImgSource["Air Heat Index"]} />
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Mean Radiant Temperature" img={layerImgSource["Mean Radiant Temperature"]} />
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Surface Temperature" img={layerImgSource["Surface Temperature"]} />
              </div>
              <div>
                <h3 className="px-6 pt-3 pb-1 text-regular text-[#BDBDBD]">Heat Mitigation</h3>
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Tree Canopy" img={layerImgSource["Tree Canopy"]} />
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Cool Roofs" img={layerImgSource["Cool Roofs"]} />
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Premeable Surfaces" img={layerImgSource["Premeable Surfaces"]} />
                <LayerSelectionOption infoExpand={infoExpand} setInfoExpand={setInfoExpand} toggleExpand={toggleExpand} setToggleExpand={setToggleExpand} toggle={toggle} setToggle={setToggle} title="Parks" img={layerImgSource["Parks"]} />
              </div>
            </div>
            <div className='flex justify-between items-center mt-3 px-2 py-6 m-auto w-[calc(100%_-_40px)] h-8 bg-[#4F4F4F] rounded-[0.25rem] cursor-pointer' onClick={() => setExpand(true)}>
              <div className='font-bold text-regular text-[#F2F2F2]'>Download dataset(s)</div>
              <ArrowDownTrayIcon width={18} height={18} className='text-[#F2F2F2]' />
            </div>
          </>
        )
      }
    </div>
  )
}

export default LayerSelections