import { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react'

import { MapContext, MapContextType } from "../contexts/mapContext.js"
import { MapLayersContext, MapLayersContextType, LayersType } from '../contexts/mapLayersContext'

import LayerSelectionOption from './LayerSelectionOption'


import heatVulnerabilityIndex from "/icons/bar_chart.svg"
// import disadvantagesCommunites from "/icons/sick.svg"
import airTemperature from "/icons/thermostat_auto.svg"
import airHeatIndex from "/icons/air.svg"
import surfaceTemperature from "/icons/device_thermostat.svg"
import weatherStations from "/icons/settings_input_antenna.svg"
import treeCanopy from "/icons/park.svg"
import coolRoofs from "/icons/wb_shade.svg"
// import coolingCenters from "/icons/wind_power.svg"

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'


const layerImgSource = {
  "Outdoor Heat Exposure Index": heatVulnerabilityIndex,
  "Air Temperature": airTemperature,
  "Air Heat Index": airHeatIndex,
  "Mean Radiant Temperature": surfaceTemperature,
  "Surface Temperature": surfaceTemperature,
  "Weather Stations": weatherStations,
  "Tree Canopy": treeCanopy,
  "Cool Roofs": coolRoofs,
  "Premeable Surfaces": surfaceTemperature,
  "Parks": surfaceTemperature,
}



type Props = {
  setTimeScale: Dispatch<SetStateAction<"date" | "year" | "default">>
}


const LayerSelections = ({ setTimeScale }: Props) => {

  const [expand, setExpand] = useState<boolean>(false)
  const { map } = useContext(MapContext) as MapContextType
  const { layer } = useContext(MapLayersContext) as MapLayersContextType

  const [prevLayer, setPrevLayer] = useState<LayersType | null>(null)


  useEffect(() => {
    if (prevLayer && map) {
      if (prevLayer === "Weather Stations") {
        //     map.setLayoutProperty("weather_stations_heat_event", "visibility", "none");
        //     map.setLayoutProperty("weather_stations_heat_advisory", "visibility", "none");
        //     map.setLayoutProperty("weather_stations_heat_excessive", "visibility", "none");
        map.removeLayer("weather_stations_heat_event");
        map.removeLayer("weather_stations_heat_advisory")
        map.removeLayer("weather_stations_heat_excessive")
        map.removeSource('weather_stations');
      }
      if (prevLayer === "Surface Temperature") {
            map.removeLayer('surface_temperature');
            map.removeSource('surface_temperature');
      }
      if(prevLayer === 'Tree Canopy') {
        map.removeLayer('tree_canopy');
        map.removeSource('tree_canopy');
      }
      //   else {
      //     const prevLayerName = prevLayer?.toLocaleLowerCase().replace(" ", "_")

      //   map.setLayoutProperty(prevLayerName, "visibility", "none");
      //   }
    }
    if (layer && map) {
      if (layer === "Weather Stations") {
        setTimeScale("year")
        // map.setLayoutProperty("weather_stations_heat_event", "visibility", "visible");
        // map.setLayoutProperty("weather_stations_heat_advisory", "visibility", "visible");
        // map.setLayoutProperty("weather_stations_heat_excessive", "visibility", "visible");
      }

      if (layer === "Surface Temperature") {
        setTimeScale("date")
      }
      // else {
      //   const layerName = layer?.toLocaleLowerCase().replace(" ", "_")
      // map.setLayoutProperty(layerName, "visibility", "visible");
      // }
    }

    setPrevLayer(layer)
  }, [layer])



  return (
    <div className={`absolute left-6 top-[4.625rem] pb-4  cursor-pointer ${!expand ? "h-[3rem] overflow-hidden" : "overflow-scroll"} bg-white rounded-lg drop-shadow-lg`} onClick={() => setExpand(!expand)} >
      <div className='flex justify-between items-center mb-2  px-3 h-[3rem]'>
        <div className="flex items-center  gap-3 ">
          {
            layer && <div className="flex justify-center items-center w-6 h-6 bg-[#F2F2F2] rounded-full">
              <img src={layerImgSource[layer]} alt="" className="w-4 h-4" />
            </div>
          }
          <h2 className="font-medium text-regular">{!layer ? "Urban Heat Data Layers" : layer}</h2>
        </div>
        {expand ? <ChevronUpIcon width={24} height={24} />
          : <ChevronDownIcon width={24} height={24} />}
      </div>
      <div>
        <div className=''>
          <h3 className="px-6 text-small text-[#4F4F4F]">Outdoor Heat Exposure</h3>
          <div className='my-2 w-full h-[1px] bg-[#828282]'></div>
          <LayerSelectionOption title="Outdoor Heat Exposure Index" img={layerImgSource['Outdoor Heat Exposure Index']} />
          {/* <LayerSelectionOption title="Disadvantages Communities" img={disadvantagesCommunites} /> */}
        </div>
        <div>
          <h3 className="px-6 pt-3 text-small text-[#4F4F4F]">Temperature</h3>
          <div className='my-2 w-full h-[1px] bg-[#828282]'></div>
          <LayerSelectionOption title="Air Temperature" img={layerImgSource["Air Temperature"]} />
          <LayerSelectionOption title="Air Heat Index" img={layerImgSource["Air Heat Index"]} />
          <LayerSelectionOption title="Mean Radiant Temperature" img={layerImgSource["Mean Radiant Temperature"]} />
          <LayerSelectionOption title="Surface Temperature" img={layerImgSource["Surface Temperature"]} />
          <LayerSelectionOption title="Weather Stations" img={layerImgSource["Weather Stations"]} />
        </div>
        <div>
          <h3 className="px-6 pt-3 text-small text-[#4F4F4F]">Heat Mitigation</h3>
          <div className='my-2 w-full h-[1px] bg-[#828282]'></div>
          <LayerSelectionOption title="Tree Canopy" img={layerImgSource["Tree Canopy"]} />
          <LayerSelectionOption title="Cool Roofs" img={layerImgSource["Cool Roofs"]} />
          <LayerSelectionOption title="Premeable Surfaces" img={layerImgSource["Premeable Surfaces"]} />
          <LayerSelectionOption title="Parks" img={layerImgSource["Parks"]} />
          {/* <LayerSelectionOption title="Cooling Centers" img={coolingCenters} /> */}
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default LayerSelections