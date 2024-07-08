import { useState, useContext } from 'react'


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




const LayerSelections = () => {

  const [expand, setExpand] = useState<boolean>(false)
  const { layer } = useContext(MapLayersContext) as MapLayersContextType

  return (
    <div className={`absolute left-6 top-[4.625rem] py-3 w-[18rem] lg:w-[24rem] ${!expand ? "h-[4.5rem] overflow-hidden" : "h-[85%] overflow-scroll"} bg-white rounded-lg drop-shadow-lg`}>
      <div className='flex justify-between items-center h-[3rem] mb-3  px-6 '>
        <div className="flex items-center  gap-3 ">
          {
            layer && <div className="flex justify-center items-center w-10 h-10 bg-[#F2F2F2] rounded-full">
              <img src={layerImgSource[layer]} alt="" className="w-6 h-6" />
            </div>
          }
          <h2 className="font-medium">{!layer ? "Urban Heat Data Layers" : layer}</h2>
        </div>
        {expand ? <ChevronUpIcon width={24} height={24} className='cursor-pointer' onClick={() => setExpand(false)} />
          : <ChevronDownIcon width={24} height={24} className='cursor-pointer' onClick={() => setExpand(true)} />}
      </div>
      <div>
        <div className=''>
          <h3 className="px-6 text-small text-[#4F4F4F]">Outdoor Heat Exposure</h3>
          <div className='my-3 w-full h-[1px] bg-[#828282]'></div>
          <LayerSelectionOption title="Outdoor Heat Exposure Index" img={layerImgSource['Outdoor Heat Exposure Index']} />
          {/* <LayerSelectionOption title="Disadvantages Communities" img={disadvantagesCommunites} /> */}
        </div>
        <div>
          <h3 className="px-6 text-small text-[#4F4F4F]">Temperature</h3>
          <div className='my-3 w-full h-[1px] bg-[#828282]'></div>
          <LayerSelectionOption title="Air Temperature" img={layerImgSource["Air Temperature"]} />
          <LayerSelectionOption title="Air Heat Index" img={layerImgSource["Air Heat Index"]} />
          <LayerSelectionOption title="Mean Radiant Temperature" img={layerImgSource["Mean Radiant Temperature"]} />
          <LayerSelectionOption title="Surface Temperature" img={layerImgSource["Surface Temperature"]} />
          <LayerSelectionOption title="Weather Stations" img={layerImgSource["Weather Stations"]} />
        </div>
        <div>
          <h3 className="px-6 text-small text-[#4F4F4F]">Heat Mitigation</h3>
          <div className='my-3 w-full h-[1px] bg-[#828282]'></div>
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