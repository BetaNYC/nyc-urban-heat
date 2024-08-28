import { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react'
import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'


import { XMarkIcon, InformationCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline'


type Props = {
    profileExpanded: boolean
    legendShown: {
        weatherStations: boolean,
        treeCanopy: boolean,
        surfaceTemperature: boolean,
        coolRoofs: boolean,
    }
    setLegendShown:Dispatch<SetStateAction<{
        weatherStations: boolean,
        treeCanopy: boolean,
        surfaceTemperature: boolean,
        coolRoofs: boolean,
    }>>
}

const Legends = ({ profileExpanded, legendShown, setLegendShown }: Props) => {

    const { layer } = useContext(MapLayersContext) as MapLayersContextType

    const closeClickHandler = () => {
        const targetLegend = (layer!.charAt(0).toLowerCase() + layer!.slice(1)).replace(/\s+/g, '')
        setLegendShown(prevLegendShown => ({ ...prevLegendShown, [targetLegend]: false }));
    }

    const openClickHandler = () => {
        if (!layer) return;
        console.log('aa')

        const targetLegend = (layer.charAt(0).toLowerCase() + layer.slice(1)).replace(/\s+/g, '');

        //@ts-ignore
        if (legendShown[targetLegend] === false) {
            setLegendShown(prevLegendShown => ({ ...prevLegendShown, [targetLegend]: true }));
        }
    };

    return (
        <div>
            <div
                className={`absolute ${profileExpanded ? "left-6" : "right-[4.8rem]"} bottom-6 flex justify-center items-center w-10 h-10 bg-white rounded-full  cursor-pointer z-10`}
                onClick={openClickHandler}
            >
                <ListBulletIcon width={18} height={18} />
            </div>
            <div className={`absolute ${profileExpanded ? "left-6" : "right-[4.8rem]"} bottom-6 drop-shadow-xl z-20`}>
                {
                    //@ts-ignore
                    layer === "Weather Stations" && legendShown["weatherStations"] === true && <div className='p-5 bg-[#FFF] rounded-[0.5rem]'>
                        <div className='mb-4'>
                            <div className='flex gap-4 mb-2 items-center font-medium'>
                                <h3 className='text-[#2D2D2D]'>Extreme Heat Advisory Alert</h3>
                                <XMarkIcon width={20} height={20} className='text-[#2D2D2D] cursor-pointer' onClick={closeClickHandler} />
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='w-[0.625rem] h-[0.625rem] bg-[#823E35] rounded-full'></div>
                                <div className='font-medium text-small text-[#4F4F4F] w-[125px]'>NWS Excessive Heat</div>
                                <InformationCircleIcon width={24} height={24} className='text-[#828282]' />
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='w-[0.625rem] h-[0.625rem] bg-[#E19869] rounded-full'></div>
                                <div className='font-medium text-small text-[#4F4F4F] w-[125px]'>NWS Heat Advisory</div>
                                <InformationCircleIcon width={24} height={24} className='text-[#828282]' />
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='w-[0.625rem] h-[0.625rem] bg-[#E6B062] rounded-full'></div>
                                <div className='font-medium text-small text-[#4F4F4F] w-[125px]'>NYC Heat Event</div>
                                <InformationCircleIcon width={24} height={24} className='text-[#828282]' />
                            </div>
                        </div>
                        <div >
                            <div className='flex mb-4 items-center font-medium text-[#2D2D2D]'>Number of extreme heat days</div>
                            <div className='flex '>
                                <div className='relative w-[70%] h-24'>
                                    <div className='absolute left-0 bottom-0 w-24 h-24 border-[1.5px] border-[#7A7A7A] rounded-full'></div>
                                    <div className='absolute left-[1rem] bottom-0 w-16 h-16 border-[1.5px] border-[#7A7A7A] rounded-full'></div>
                                    <div className='absolute left-[2rem] bottom-0 w-8 h-8 border-[1.5px] border-[#7A7A7A] rounded-full'></div>
                                    <div className='absolute left-[2.5rem] bottom-0 w-4 h-4 border-[1.5px] border-[#7A7A7A] rounded-full'></div>
                                    <div className='absolute top-0 left-12 w-28 h-[1px] bg-[#4F4F4F]'></div>
                                    <div className='absolute top-8 left-12 w-28 h-[1px] bg-[#4F4F4F]'></div>
                                    <div className='absolute top-16 left-12 w-28 h-[1px] bg-[#4F4F4F]'></div>
                                    <div className='absolute top-20 left-12 w-28 h-[1px] bg-[#4F4F4F]'></div>
                                </div>
                                <div className='relative w-[30%]'>
                                    <div className='absolute top-[-9px] font-medium text-small text-[#4F4F4F]'>30 days</div>
                                    <div className='absolute top-[calc(2rem_-_9px)] font-medium text-small text-[#4F4F4F]'>20 days</div>
                                    <div className='absolute top-[calc(4rem_-_9px)] font-medium text-small text-[#4F4F4F]'>10 days</div>
                                    <div className='absolute top-[calc(5rem_-_9px)] font-medium text-small text-[#4F4F4F]'>5 days</div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    layer === "Tree Canopy" && legendShown["treeCanopy"] === true && <div className='p-[1rem] w-[12rem] text-[#4F4F4F] bg-[#F4F4F4] rounded-[1rem]'>
                        <div className='flex justify-between text-regular '>
                            <p>Tree Canopy</p>
                            <XMarkIcon width={24} height={24} className='cursor-pointer' onClick={closeClickHandler} />
                        </div>
                        <div className='my-[0.25rem] h-5 bg-[#345C67]'>
                        </div>
                        <div className='flex justify-between text-xsmall '>
                            <p>Covered by trees</p>
                        </div>
                    </div>
                }
                {
                    layer === "Surface Temperature" && legendShown["surfaceTemperature"] === true && <div className='p-[1rem] w-[15rem] text-[#4F4F4F] bg-[#F4F4F4] rounded-[1rem]'>
                        <div className='flex justify-between text-regular'>
                            <p>Surface Temperature</p>
                            <XMarkIcon width={24} height={24} className='cursor-pointer' onClick={closeClickHandler} />
                        </div>
                        <div className='flex my-1 h-5'>
                            <div className='w-[50%] h-full bg-gradient-to-r from-[#202E41] via-[#BED0DD] to-[#BED0DD]'></div>
                            <div className='w-[50%] h-full bg-gradient-to-r from-[#FFE6A9] via-[#F2A18D] to-[#5E1A19]'></div>
                        </div>
                        <div className='flex justify-between text-xsmall'>
                            <p>55.57℉</p>
                            <p>84.32℉</p>
                            <p>146.72℉</p>
                        </div>
                    </div>
                }
                {/* {
                    layer === 'Cool Roofs' && shown['']
                } */}
            </div>
        </div>

    )
}

export default Legends