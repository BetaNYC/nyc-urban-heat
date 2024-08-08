import { useState, useContext, useEffect, Dispatch, SetStateAction } from 'react'
import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'


import { XMarkIcon, InformationCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline'



const Legends = () => {

    const { layer } = useContext(MapLayersContext) as MapLayersContextType

    const [shown, setShown] = useState({
        weatherStations: true,
        treeCanopy: true,
        surfaceTemperature: true,
    })

    const closeClickHandler = () => {
        const targetLegend = (layer!.charAt(0).toLowerCase() + layer!.slice(1)).replace(/\s+/g, '')
        const newShown = { ...shown, [targetLegend]: false }
        setShown(newShown)
    }

    const openClickHandler = () => {
        const targetLegend = (layer!.charAt(0).toLowerCase() + layer!.slice(1)).replace(/\s+/g, '')
        //@ts-ignore
        if (shown[targetLegend] === false) {
            setShown({ ...shown, [targetLegend]: true })
        }

    }

    return (
        <>
            <div className='absolute right-[0.5%] bottom-[15%] flex justify-center items-center w-10 h-10  bg-white rounded-full drop-shadow-xl cursor-pointer' onClick={openClickHandler}>
                <ListBulletIcon width={18} height={18} />
            </div>
            <div className='absolute right-[4%] bottom-[4%] drop-shadow-xl'>

                {
                    //@ts-ignore
                    layer === "Weather Stations" && shown["weatherStations"] === true && <div className='p-5 bg-white rounded-[0.5rem]'>
                        <div className='mb-4'>
                            <div className='flex gap-4 mb-2 items-center font-medium'>
                                <h3 className='text-[#2D2D2D]'>Extreme Heat Advisory Alert</h3>
                                <XMarkIcon width={20} height={20} className='text-[#2D2D2D]' onClick={closeClickHandler} />
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
                    layer === "Tree Canopy" && shown["treeCanopy"] === true && <div className='p-[1rem] w-[15rem] text-white bg-[#4F4F4F] rounded-[1rem]'>
                        <div className='flex justify-between text-regular text-gray_six'>
                            <p>Tree Canopy</p>
                            <XMarkIcon width={24} height={24} className='cursor-pointer' onClick={closeClickHandler} />
                        </div>
                        <div className='my-[0.25rem] h-5 bg-gradient-to-r from-[#BDBCC3] to-[#345C67]'>
                        </div>
                        <div className='flex justify-between text-xsmall text-gray_six'>
                            <p>No tree cover</p>
                            <p>Covered by trees</p>
                        </div>
                    </div>
                }
                {
                    layer === "Surface Temperature" && shown["surfaceTemperature"] === true && <div className='p-[1rem] w-[15rem] text-white bg-[#4F4F4F] rounded-[1rem]'>
                        <div className='flex justify-between text-regular text-gray_six'>
                            <p>Surface Temperature</p>
                            <XMarkIcon width={24} height={24} className='cursor-pointer' onClick={closeClickHandler} />
                        </div>
                        <div className='flex my-1 h-5'>
                            <div className='w-[50%] h-full bg-gradient-to-r from-[#202E41] via-[#BED0DD] to-[#BED0DD]'></div>
                            <div className='w-[50%] h-full bg-gradient-to-r from-[#FFE6A9] via-[#F2A18D] to-[#5E1A19]'></div>
                        </div>
                        <div className='flex justify-between text-xsmall text-gray_six'>
                            <p>55.57℉</p>
                            <p>84.32℉</p>
                            <p>146.72℉</p>
                        </div>
                    </div>
                }
            </div>
        </>

    )
}

export default Legends