import { useState } from 'react'
import { XMarkIcon, InformationCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { selectedDataset } from '../pages/MapPage'
import { computed } from '@preact/signals-react'
import InformationCircle from "./InformationCircle";

const Legends = () => {
    const [isLegendExpanded, setIsLegendExpanded] = useState(true)
    const [surfaceTemperatureAverage, setSurfaceTemperatureAverage] = useState({
        '20230902': 79.09,
        '20230901': 74.36,
        '20230809': 86.25,
        '20230731': 84.32,
        '20230723': 87.07,
        '20220915': 72.59,
        '20220914': 75.66,
        '20220720': 96.35,
        '20220704': 87.38,
        '20220619': 71.64,
        '20220509': 69.48,
        '20210826': 89.03,
        '20210623': 74.71,
        '20200706': 96.03,
        '20200613': 77.14,
        '20190922': 81.59,
        '20190830': 82.24,
        '20170612': 92.37,
        '20160625': 80.44,
        '20160618': 86.11,
        '20160609': 70.74,
        '20140807': 81.68,
        '20130601': 90.52
    })

    const currentYear = selectedDataset.value?.currentYear || 2023;

    const handleClick = () => setIsLegendExpanded(!isLegendExpanded)
    const datasetName = computed(() => selectedDataset.value?.name)
    const viewName = computed(() => selectedDataset.value?.currentView)
    const legend = computed(() => {
        if (selectedDataset.value?.currentView) {
            return selectedDataset.value?.views[selectedDataset.value.currentView].legend
        }
    })

    const date = selectedDataset.value?.currentDate!


    if (!isLegendExpanded) {
        return (<div
            className={`absolute left-6 bottom-6 flex justify-center items-center w-10 h-10 bg-[#1B1B1B] rounded-full  cursor-pointer z-10`}
            onClick={handleClick}
        >
            <ListBulletIcon width={18} height={18} className='text-white' />
        </div>)
    } else {
        return (

            <div className={`absolute left-6 bottom-6 drop-shadow-xl z-20`}>
                {
                    (
                        Array.isArray(legend.value) &&
                        legend.value.length &&
                        legend.value[0] &&
                        legend.value[0].hasOwnProperty('label') &&
                        legend.value[0].hasOwnProperty('value')
                    ) && viewName.value == 'nta' && <div className='p-5 w-[20rem] bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='flex gap-2 mb-2 items-center justify-between font-medium'>
                            <h3 className='text-regular text-[#F4F4F4]'>{datasetName.value}</h3>
                            <XMarkIcon width={18} height={18} className='text-[#BDBDBD] cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex items-center'>
                            {legend.value?.map((item: any) => (
                                <div key={`legend-${item.label}`} className='flex flex-col items-center gap-1 text-xsmall text-[#F4F4F4]'>
                                    <span className="w-[3.5rem] h-4 block " style={{ backgroundColor: item.value }} />
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Weather Stations" && <div className='p-5 w-[20rem] flex items-start bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='mr-8'>
                            <h3 className='mb-3 font-medium text-[#F4F4F4]'>Extreme Heat days in {currentYear}</h3>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-[0.625rem] h-[0.625rem] bg-[#823E35] rounded-full'></div>
                                    <div className='font-medium text-small text-[#F4F4F4] w-[125px]'>NWS Excessive Heat</div>
                                    <InformationCircle size='big'/>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='w-[0.625rem] h-[0.625rem] bg-[#E19869] rounded-full'></div>
                                    <div className='font-medium text-small text-[#F4F4F4] w-[125px]'>NWS Heat Advisory</div>
                                    <InformationCircle size='big'/>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='w-[0.625rem] h-[0.625rem] bg-[#E6B062] rounded-full'></div>
                                    <div className='font-medium text-small text-[#F4F4F4] w-[125px]'>NYC Heat Event</div>
                                    <InformationCircle size='big'/>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Mean Radiant Temperature" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[1rem]'>
                        <div className='flex justify-between text-regular text-[#F4F4F4]'>
                            <p>Mean Radiant Temperature</p>
                            <XMarkIcon width={18} height={18} className='cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex my-1 h-5'>
                            <div className='w-[100%] h-full bg-gradient-to-r from-[#859ea4] via-[#e0d0b6,#edc58a,#d39365] to-[#b8613f]'></div>
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            <p>88℉</p>
                            {/* <p>110</p> */}
                            <p>122℉</p>
                            {/* <p>136</p> */}
                            <p>152℉</p>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Surface Temperature" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[1rem]'>
                        <div className='flex justify-between text-regular text-[#F4F4F4]'>
                            <p>Surface Temperature</p>
                            <XMarkIcon width={18} height={18} className='cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex my-1 h-5'>
                            <div className='w-[50%] h-full bg-gradient-to-r from-[#202E41] via-[#BED0DD] to-[#BED0DD]'></div>
                            <div className='w-[50%] h-full bg-gradient-to-r from-[#FFE6A9] via-[#F2A18D] to-[#5E1A19]'></div>
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            <p>{(surfaceTemperatureAverage[date as keyof typeof surfaceTemperatureAverage] - 30).toFixed(1)}℉</p>
                            <p>{(surfaceTemperatureAverage[date as keyof typeof surfaceTemperatureAverage]).toFixed(1)}℉</p>
                            <p>{(surfaceTemperatureAverage[date as keyof typeof surfaceTemperatureAverage] + 70).toFixed(1)}℉</p>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Tree Canopy" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[1rem]'>
                        <div className='flex justify-between text-regular '>
                            <p>Tree Canopies</p>
                            <XMarkIcon width={18} height={18} className='cursor-pointer text-[#F4F4F4]' onClick={handleClick} />
                        </div>
                        <div className='my-[0.25rem] h-5 bg-[#335d68]'>
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            <p>Covered by trees</p>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Cool Roofs" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[1rem]'>
                        <div className='flex justify-between text-regular '>
                            <p>Cool Roofs</p>
                            <XMarkIcon width={18} height={18} className='cursor-pointer text-[#F4F4F4]' onClick={handleClick} />
                        </div>
                        <div className='flex my-1 h-5'>
                            <div className='w-[50%] h-full bg-gradient-to-r bg-[#DBDBDB]'></div>
                            <div className='w-[50%] h-full bg-gradient-to-r bg-[#4d5766]'></div>
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            <p>Dark Roofs</p>
                            <p>Cool Roofs</p>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Permeable Surfaces" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[1rem]'>
                        <div className='flex justify-between text-regular text-[#F4F4F4]'>
                            <p>Permeable Surfaces</p>
                            <XMarkIcon width={18} height={18} className='cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex my-1 h-5'>
                            <div className='w-[100%] h-full bg-gradient-to-r from-[#f3d9b1] via-[#dabb8b,#c19d65,#a87e3e] to-[#8f6018]'></div>
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            <p>10%</p>
                            <p>71%</p>
                        </div>
                    </div>
                }

            </div>
        )
    }
}

export default Legends