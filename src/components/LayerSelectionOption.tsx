import { useContext, Dispatch, SetStateAction, useState } from 'react'
import { MapLayersContext, MapLayersContextType, LayersType } from '../contexts/mapLayersContext'

import { InformationCircleIcon } from "@heroicons/react/24/outline"


type Props = {
    title: LayersType
    img?: string
    toggle: {
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
    },
    setToggle: Dispatch<SetStateAction<{
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
    }>>,
    toggleExpand: {
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
    },
    setToggleExpand: Dispatch<SetStateAction<{
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
    }>>
    infoExpand: {
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
    },
    setInfoExpand: Dispatch<SetStateAction<{
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
    }>>
}

const LayerSelectionOption = ({ title, img, toggle, setToggle, infoExpand, setInfoExpand, toggleExpand, setToggleExpand }: Props) => {

    const { layer, setLayer } = useContext(MapLayersContext) as MapLayersContextType



    const toggleChangeHandler = (e: React.MouseEvent<HTMLDivElement>, l: LayersType) => {
        e.stopPropagation()
        const newToggle = { ...toggle, [l]: toggle[l] === 'nta' ? 'raw' : 'nta' }
        setToggle(newToggle)
    }
    const infoClickHandler = (e: React.MouseEvent<SVGSVGElement>, l: LayersType) => {
        e.stopPropagation()
        setInfoExpand(prev => {
            const newInfoExpand = { ...prev }

            Object.keys(prev).forEach((i) => i === l ? newInfoExpand[i as keyof typeof prev] = !prev[l] : newInfoExpand[i as keyof typeof prev] = false)

            return newInfoExpand
        })
    }

    const layerOptionClickHandler = (l: LayersType) => {
        setLayer(l)
        setInfoExpand(prev => {
            const newInfoExpand = { ...prev }

            Object.keys(prev).forEach((i) => i === l ? newInfoExpand[i as keyof typeof prev] = !prev[l] : newInfoExpand[i as keyof typeof prev] = false)

            return newInfoExpand
        })
        setToggleExpand(prev => {
            const newToggleExpand = { ...prev }

            Object.keys(prev).forEach((i) => i === l ? newToggleExpand[i as keyof typeof prev] = !prev[l] : newToggleExpand[i as keyof typeof prev] = false)
            return newToggleExpand
        })
    }

    return (
        <div className={`px-5 py-3 w-[20rem] text-[#F2F2F2] ${toggleExpand[title] ? 'bg-[#D9D9D9]': "hover:bg-[#6A6A6A] "} cursor-pointer`} onClick={() => layerOptionClickHandler(title)}>
            <div className="flex justify-between items-center gap-3 ">
                <div className="flex items-center gap-3">
                    <img src={img} alt="" className="w-6 h-6 text-[#828282]" />
                    <h3 className={`text-regular ${toggleExpand[title] ? "text-[#4F4F4F]" : 'text-[#F2F2F2]'}`}>{title}</h3>
                </div>
                <InformationCircleIcon width={20} height={20} className={`${toggleExpand[title] ? "text-[#4F4F4F]" : 'text-[#F2F2F2]'} `} onClick={(e) => infoClickHandler(e, title)} />
            </div>
            {
                infoExpand[title] === true && <div className={`mt-2 ml-8 font-regular text-small ${toggleExpand[title] ? "text-[#4F4F4F]" : 'text-[#F2F2F2]'}`}>
                    The Outdoor Heat Exposure Index is a measure of the risk of heat-related illnesses for people spending time outdoors.
                </div>
            }
            {
                toggleExpand[title] === true && <div className='flex items-center gap-3 mt-4 ml-8'>
                    <div className='font-semibold text-[#4F4F4F] text-small'>NTA Aggregated</div>
                    <div className={`flex items-center ${toggle[title] === 'nta' ? "justify-start" : "justify-end"} px-[2px] w-8 h-4 bg-[#A8A8A8] rounded-[20px]`} onClick={(e) => toggleChangeHandler(e, title)}>
                        <div className='w-3 h-3 bg-[#4F4F4F] rounded-full'></div>
                    </div>
                    <div className='font-semibold text-[#4F4F4F] text-small'>Raw Data</div>
                </div>
            }

        </div>
    )
}

export default LayerSelectionOption