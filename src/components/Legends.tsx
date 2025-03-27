import { useState } from 'react'
import { XMarkIcon, InformationCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { selectedDataset } from '../pages/MapPage'
import { computed } from '@preact/signals-react'
import InformationCircle from "./InformationCircle";

import { surfaceTemperatureRelativeValues } from '../utils/viewSurfaceTemperature';
import { nta_dataset_info } from '../App';


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
    const legendTitle = computed(() => {
        if (selectedDataset.value?.currentView) {
            return selectedDataset.value?.views[selectedDataset.value.currentView].legendTitle
        }
    })

    const legend = computed(() => {
        if (selectedDataset.value?.currentView) {

            if (selectedDataset.value?.name === "Outdoor Heat Exposure Index") {
                return [
                    { label: "1", value: "#F9EBC5" },
                    { label: "2", value: "#E7A98B" },
                    { label: "3", value: "#D66852" },
                    { label: "4", value: "#A33F34" },
                    { label: "5", value: "#841F21" },
                ]
            }

            if (selectedDataset.value?.name === "Surface Temperature") {
                const date = `ST_${selectedDataset.value.currentDate || "20230902"}`
                const data = nta_dataset_info.value.find(
                    (dataset) => dataset.metric === date
                );
                const values = Object.entries(data)
                    .filter(([key, value]) => /^[A-Z]{2}\d{2}$/.test(key as string) && value !== "")
                    .map(([_, value]) => parseFloat(value as string).toFixed(1));
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

                selectedDataset.value.views.nta.legendLastNumber = bins[5]

                return [
                    { label: bins[0], value: "#f4e0d7" },
                    { label: bins[1], value: "#cbada6" },
                    { label: bins[2], value: "#a37a76" },
                    { label: bins[3], value: "#7a4645" },
                    { label: bins[4], value: "#511314" },
                ]
            }

            if (selectedDataset.value?.name === "Air Temperature") {
                const date = `Air_temp_raster_${selectedDataset.value.currentDate || "20230902"}`;
                const data = nta_dataset_info.value.find(
                    (dataset) => dataset.metric === date
                );
                const values = Object.entries(data)
                    .filter(([key, value]) => /^[A-Z]{2}\d{2}$/.test(key as string) && value !== "" && value !== "inf" && !isNaN(Number(value)))
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

                selectedDataset.value.views.nta.legendLastNumber = bins[5]

                return [
                    { label: bins[0], value: "#F4D9CD" },
                    { label: bins[1], value: "#EFC9A9" },
                    { label: bins[2], value: "#EBBC85" },
                    { label: bins[3], value: "#E6AE61" },
                    { label: bins[4], value: "#E19F3D" },
                ]
            }

            if (selectedDataset.value?.name === "Air Heat Index") {
                const date = `Air_Heat_Index_outputs${selectedDataset.value.currentDate || "20230902"}`;
                const data = nta_dataset_info.value.find(
                    (dataset) => dataset.metric === date
                );
                const values = Object.entries(data)
                    .filter(([key, value]) => /^[A-Z]{2}\d{2}$/.test(key as string) && value !== "" && value !== "inf" && !isNaN(Number(value)))
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

                selectedDataset.value.views.nta.legendLastNumber = bins[5]

                return [
                    { label: bins[0], value: "#F7E7D0" },
                    { label: bins[1], value: "#EFC7B1" },
                    { label: bins[2], value: "#E6A891" },
                    { label: bins[3], value: "#DE8872" },
                    { label: bins[4], value: "#D66852" },
                ]
            }


            return selectedDataset.value?.views[selectedDataset.value.currentView].legend
        }
    })


    //@ts-ignore
    const legendLastNum = selectedDataset.value?.views[selectedDataset.value.currentView].legendLastNumber



    const isPermeableSurface = ["Permeable Surfaces"].includes(datasetName.value!);
    const isTreeCanopy = ["Tree Canopy"].includes(datasetName.value!);
    const isCoolRoofs = ["Cool Roofs"].includes(datasetName.value!);
    const isthermalComfort = ["Mean Radiant Temperature"].includes(datasetName.value!);
    const isOutDoorHeatIndex = ["Outdoor Heat Exposure Index"].includes(datasetName.value!)
    const isSurfaceTemperature = ["Surface Temperature"].includes(datasetName.value!)


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
                    ) && viewName.value == 'nta' && <div className='p-4 w-[20rem] bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='flex gap-2 items-center justify-between font-medium'>
                            <h3 className='text-regular text-[#F4F4F4]'>{legendTitle.value}</h3>
                            <XMarkIcon width={18} height={18} className='text-[#ffffff] cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex justify-between my-1 w-full'>
                            <div className='text-small text-[#F4F4F4]'>{isOutDoorHeatIndex ? "Less OHE" : isTreeCanopy ? 'More tree canopy area' : isPermeableSurface ? "More permeable surface" : isCoolRoofs ? "More cool roof area" : isSurfaceTemperature ? "Low temperature" : isthermalComfort ? <span>more <br /> thermal comfort</span> : "low"}</div>
                            <div className='text-small text-[#F4F4F4]'>{isOutDoorHeatIndex ? "More OHE" : isTreeCanopy ? 'Less tree canopy area' : isPermeableSurface ? "Less permeable surface" : isCoolRoofs ? "Less cool roof area" : isSurfaceTemperature ? "High temperature" : isthermalComfort ? <div className="flex flex-col items-end">
                                <span>less</span>
                                <span>thermal comfort</span>
                            </div> : "more"}</div>
                        </div>
                        <div className='relative flex items-center'>
                            {legend.value?.map((item: any) => (
                                <div key={`legend-${item.label}`} className={`flex flex-col ${selectedDataset.value?.name === "Outdoor Heat Exposure Index"? "items-center" : "items-start"}  gap-1 text-xsmall text-[#F4F4F4]`}>
                                    <span className="w-[3.6rem] h-4 block " style={{ backgroundColor: item.value }} />
                                    {item.label}
                                </div>
                            ))}
                            <div className='absolute top-5 right-0 text-xsmall text-[#F4F4F4]'>{legendLastNum}</div>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Weather Stations" && <div className='p-5 w-[16rem] flex items-start bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className=' w-full'>
                            <div className='flex items-center justify-between mb-3 w-full '>
                                <h3 className='font-medium text-regular text-[#F4F4F4]'>Extreme Heat days in {currentYear}</h3>
                                <XMarkIcon width={18} height={18} className='text-[#ffffff] cursor-pointer' onClick={handleClick} />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-[0.625rem] h-[0.625rem] bg-[#823E35] rounded-full'></div>
                                    <div className='font-medium text-small text-[#F4F4F4] w-[125px]'>NWS Excessive Heat</div>
                                    <InformationCircle size='big' positionRight={true} content='Periods when the maximum heat index temperature is 105° F or higher for at least 2 days and night time air temperatures do not drop below 75° F.' />
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='w-[0.625rem] h-[0.625rem] bg-[#E19869] rounded-full'></div>
                                    <div className='font-medium text-small text-[#F4F4F4] w-[125px]'>NWS Heat Advisory</div>
                                    <InformationCircle size='big' positionRight={true} content="Periods when the maximum heat index temperature is 100° F or higher for at least 2 days, and night time air temperatures do not drop below 75° F." />
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='w-[0.625rem] h-[0.625rem] bg-[#E6B062] rounded-full'></div>
                                    <div className='font-medium text-small text-[#F4F4F4] w-[125px]'>NYC Heat Event</div>
                                    <InformationCircle size='big' positionRight={true} content='Periods in New York City when the heat index is 100° F or higher for one or more days, or when the heat index is 95° F or higher for two or more consecutive days.' />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Mean Radiant Temperature" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='flex justify-between text-regular text-[#F4F4F4]'>
                            <p className='font-medium'>Mean Radiant Temperature (MRT)</p>
                            <XMarkIcon width={18} height={18} className='text-[#ffffff] cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex justify-between  text-small text-[#F4F4F4]'>
                            <div className="flex flex-col ">
                                <span>more</span>
                                <span>thermal comfort</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span>less</span>
                                <span>thermal comfort</span>
                            </div>
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
                    datasetName.value === "Surface Temperature" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='flex justify-between text-regular text-[#F4F4F4]'>
                            <p className='font-medium'>Surface temperature</p>
                            <XMarkIcon width={18} height={18} className='text-[#ffffff] cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex justify-between text-small text-[#F4F4F4]'>
                            <span>low</span>
                            <span>high</span>
                        </div>
                        <div className='flex my-1 h-5'>
                            <div className='w-full h-full bg-gradient-to-r from-[#202E41] via-[#BED0DD,#FFE6A9,#F2A18D] to-[#5E1A19]'></div>
                            {/* <div className='w-[50%] h-full bg-gradient-to-r from-[] via-[] to-[]'></div> */}
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            {/* <div className='flex justify-between text-xsmall text-[#F4F4F4]'> */}
                            <p>
                                {(
                                    surfaceTemperatureRelativeValues[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureRelativeValues || "20230902"
                                    ][0] +
                                    surfaceTemperatureAverage[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureAverage || "20230902"
                                    ]
                                ).toFixed(1)}℉
                            </p>
                            <p>
                                {(
                                    surfaceTemperatureAverage[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureAverage || "20230902"
                                    ]
                                ).toFixed(1)}℉
                            </p>
                            <p>
                                {(
                                    surfaceTemperatureRelativeValues[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureRelativeValues || "20230902"
                                    ][5] +
                                    surfaceTemperatureAverage[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureAverage || "20230902"
                                    ]
                                ).toFixed(1)}℉
                            </p>
                            {/* </div> */}
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Tree Canopy" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='flex justify-between text-regular '>
                            <p className='font-medium'>Tree Canopy Area</p>
                            <XMarkIcon width={18} height={18} className='cursor-pointer text-[#F4F4F4]' onClick={handleClick} />
                        </div>
                        <div className='my-[0.25rem] h-5 bg-[#335d68]'>
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            <p>Tree canopy</p>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Cool Roofs" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='flex justify-between text-regular '>
                            <p className='font-medium'>Cool Roof Area</p>
                            <XMarkIcon width={18} height={18} className='text-[#ffffff] cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex w-full gap-2 text-xsmall text-[#F4F4F4]'>
                            <div className='w-[50%]'>
                                <div className='my-1 h-5 bg-gradient-to-r bg-[#2D5185]'></div>
                                <p>Cool Roofs (R ≥ 60)</p>
                            </div>
                            <div className='w-[50%]'>
                                <div className='my-1 h-5 bg-gradient-to-r bg-[#A4ADBA]'></div>
                                <p>Dark Roofs</p>
                            </div>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Permeable Surfaces" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='flex justify-between text-regular text-[#F4F4F4]'>
                            <p className='font-medium'>Permeable Surface Area</p>
                            <XMarkIcon width={18} height={18} className='text-[#ffffff] cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='my-[0.25rem] h-5 bg-[#8f6018]'>
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            <p>Permeable surfaces</p>
                        </div>
                    </div>
                }
                {
                    datasetName.value === "Air Temperature" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='flex justify-between text-regular text-[#F4F4F4]'>
                            <p className='font-medium'>Air Temperature</p>
                            <XMarkIcon width={18} height={18} className='text-[#ffffff] cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex justify-between text-small text-[#F4F4F4]'>
                            <span>low</span>
                            <span>high</span>
                        </div>
                        <div className='flex my-1 h-5'>
                            <div className='w-full h-full bg-gradient-to-r from-[#98c1d9] via-[#ffe6a8,#ffbba8,#d66852] to-[#511113]'></div>
                            {/* <div className='w-[50%] h-full bg-gradient-to-r from-[] via-[] to-[]'></div> */}
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            <p>
                                {(
                                    surfaceTemperatureRelativeValues[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureRelativeValues || "20230902"
                                    ][0] +
                                    surfaceTemperatureAverage[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureAverage || "20230902"
                                    ]
                                ).toFixed(1)}℉
                            </p>
                            <p>
                                {(
                                    surfaceTemperatureAverage[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureAverage || "20230902"
                                    ]
                                ).toFixed(1)}℉
                            </p>
                            <p>
                                {(
                                    surfaceTemperatureRelativeValues[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureRelativeValues || "20230902"
                                    ][5] +
                                    surfaceTemperatureAverage[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureAverage || "20230902"
                                    ]
                                ).toFixed(1)}℉
                            </p>
                        </div>
                    </div>
                }
                                {
                    datasetName.value === "Air Heat Index" && viewName.value == 'raw' && <div className='p-[1rem] w-[20rem] text-[#F4F4F4] bg-[#1B1B1B] rounded-[0.5rem]'>
                        <div className='flex justify-between text-regular text-[#F4F4F4]'>
                            <p className='font-medium'>Air Heat Index</p>
                            <XMarkIcon width={18} height={18} className='text-[#ffffff] cursor-pointer' onClick={handleClick} />
                        </div>
                        <div className='flex justify-between text-small text-[#F4F4F4]'>
                            <span>low</span>
                            <span>high</span>
                        </div>
                        <div className='flex my-1 h-5'>
                            <div className='w-full h-full bg-gradient-to-r from-[#98c1d9] via-[#ffe6a8,#ffbba8,#d66852] to-[#511113]'></div>
                            {/* <div className='w-[50%] h-full bg-gradient-to-r from-[] via-[] to-[]'></div> */}
                        </div>
                        <div className='flex justify-between text-xsmall text-[#F4F4F4]'>
                            <p>
                                {(
                                    surfaceTemperatureRelativeValues[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureRelativeValues || "20230902"
                                    ][0] +
                                    surfaceTemperatureAverage[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureAverage || "20230902"
                                    ]
                                ).toFixed(1)}℉
                            </p>
                            <p>
                                {(
                                    surfaceTemperatureAverage[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureAverage || "20230902"
                                    ]
                                ).toFixed(1)}℉
                            </p>
                            <p>
                                {(
                                    surfaceTemperatureRelativeValues[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureRelativeValues || "20230902"
                                    ][5] +
                                    surfaceTemperatureAverage[
                                    selectedDataset.value!.currentDate as keyof typeof surfaceTemperatureAverage || "20230902"
                                    ]
                                ).toFixed(1)}℉
                            </p>
                        </div>
                    </div>
                }

            </div>
        )
    }
}

export default Legends