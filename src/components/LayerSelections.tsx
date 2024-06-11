import { useState } from 'react'

import LayerSelectionOption from './LayerSelectionOption'


import heatVulnerabilityIndex from "/icons/bar_chart.svg"
import disadvantagesCommunites from "/icons/sick.svg"
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'




const LayerSelections = () => {

  const [expand, setExpand] = useState<boolean>(false)

  return (
    <div className={`absolute left-6 top-20  py-5 w-[24rem] ${!expand && "h-[4.25rem] overflow-hidden"} bg-white rounded-lg`}>
      <div className='flex justify-between mb-3 px-6 py-1'>
        <h2 className="font-medium">Urban Heat Data Layers</h2>
        {expand ? <ChevronUpIcon width={24} height={24} className='cursor-pointer' onClick={() => setExpand(false)} />
          : <ChevronDownIcon width={24} height={24} className='cursor-pointer' onClick={() => setExpand(true)} />}
      </div>
      <div>
        <div className=''>
          <h3 className="px-6 text-[0.75rem] text-[#4F4F4F]">Heat Vulnerability</h3>
          <div className='my-3 w-full h-[1px] bg-[#828282]'></div>
          <LayerSelectionOption title="Heat Vulnerability Index" img={heatVulnerabilityIndex} />
          <LayerSelectionOption title="Disadvantages Communities" img={disadvantagesCommunites} />
        </div>
        <div></div>
        <div></div>
      </div>
      <div></div>
    </div>
  )
}

export default LayerSelections