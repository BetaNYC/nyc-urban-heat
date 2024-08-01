import { useState } from "react"

import * as d3 from 'd3';

import { ArrowRightIcon, ArrowLeftIcon, InformationCircleIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction } from "react"

import { useMediaQuery } from "react-responsive"

import AirHeatIndexLineChart from '../components/AirHeatIndexLineChart';

import airHeatIndex from "../data/airHeatIndex2022.json";


type Props = {
    profileExpanded: boolean
    setProfileExpanded: Dispatch<SetStateAction<boolean>>
}

interface AirHeatIndexData {
    address: string;
    datetime: string;
    feelslikemax: number;
    feelslikemin: number;
    NYC_HeatEvent: "" | "NYC_Heat_Event"
    HeatAdvisory: "" | "HeatAdvisory"
    ExcessiveHeat: "" | "Excessive_Heat_Event"
    Record_Max: number;
    Record_Min: number
}

const WeatherStationProfile = ({ profileExpanded, setProfileExpanded }: Props) => {

    const parseDate = d3.timeParse('%Y-%m-%d');

    const data = (airHeatIndex as AirHeatIndexData[])
        .filter(d => d.address === "AV066")
        .map(d => ({
            ...d,
            datetime: parseDate(d.datetime)!,
        }))
        .filter(d => d.datetime !== null);

    console.log(data)

    const HeatEventDays = data.filter(d => d.NYC_HeatEvent !== '').length;
    const HeatAdvisoryDays = data.filter(d => d.HeatAdvisory !== "").length;
    const ExcessiveHeatDays = data.filter(d => d.ExcessiveHeat !== "").length;

    const aboveHistoricMaxDays = data.filter(d => d.feelslikemax > d.Record_Max).length
    const aboveHistoricMinDays = data.filter(d => d.feelslikemax > d.Record_Min).length


    const [clickedIndex, setClickedIndex] = useState("air_heat_index")

    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px)'
    })
    const isTablet = useMediaQuery({
        query: '(min-width: 768px)'
    })

    const clickHandler = () => {
        setProfileExpanded(!profileExpanded)
    }


    return (
        <div className={`transition-all duration-[1500ms] ${!profileExpanded && "translate-y-[70vh] lg:translate-y-0 lg:translate-x-[65vw]"} absolute bottom-0 lg:top-[3.125rem] lg:right-0 flex items-center  z-20`}>
            {
                isDesktop && <div className="flex items-center justify-center w-12 h-24 bg-[#1B1B1B] rounded-l-2xl cursor-pointer" onClick={clickHandler}>
                    {profileExpanded ? <ArrowRightIcon width={24} height={24} className="text-white" /> : <ArrowLeftIcon width={24} height={24} className="text-white" />}
                </div>
            }
            <div className={`md:flex md:flex-col md:gap-6 px-6 lg:px-10 pb-6 pt-12 md:pt-8 w-[100vw] lg:w-[65vw] h-[70vh] lg:h-[calc(100vh_-_3.125rem)] bg-[#1B1B1B] rounded-[1rem] lg:rounded-[0] overflow-y-auto `}>
                <div className="md:flex md:gap-[3.375rem]  h-[30%]">
                    <div className="md:flex md:flex-col w-full md:w-[50%]">
                        <div className="flex items-start justify-between mb-[3%] ">
                            <div>
                                {/* <h2 className="text-regular lg:text-subheadline text-gray_six">Brooklyn</h2> */}
                                <h1 className="font-semibold text-subheadline lg:text-headline text-gray_six">Bedford Stuyvesant</h1>
                                <h1 className="font-semibold text-subheadline lg:text-headline text-gray_six">Weather Station</h1>
                            </div>
                            <select name="" id="" className="px-2 w-32 md:h-10 font-medium text-[#BDBDBD] bg-[#1B1B1B] border-2 border-[#333] rounded-[0.5rem]">
                                <option value="" className="">2020</option>
                            </select>
                        </div>
                        <div className="md:flex-1 p-4 w-full border-[1px] border-[#333] rounded-[0.5rem]">
                            <p className="text-regular text-[#D5D5D5]">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora,
                                sunt enim quos sapiente facere doloremque voluptate aspernatur sint eos debitis deserunt, quasi deleniti iste voluptatem aliquid voluptatibus, fuga assumenda. Eum?
                            </p>
                            {
                                !isTablet &&
                                <p className="text-regular text-[#D36051]">
                                    Chart interactive features are not available on mobile. Please access the website on desktop
                                    for full functionality.
                                </p>
                            }
                        </div>
                    </div>
                    <div className="flex gap-4 md:gap-8 my-5 md:my-0 p-4  w-full md:w-[50%] md:h-full overflow-scroll bg-[#333] md:bg-transparent md:border-[1px]  md:border-[#333] rounded-[0.5rem]">
                        <div className="relative w-12 md:w-[5.25rem] h-12 md:h-[5.25rem]">
                            <div className="w-full h-full rounded-full bg-[#BA8E50]"></div>
                            <div className="absolute top-[calc(50%_-_0.9375rem)] left-[calc(50%_-_0.9375rem)]  w-6 md:w-[1.875rem] h-6 md:h-[1.875rem] bg-[#c9733A] rounded-full"></div>
                            <div className="absolute top-[calc(50%_-_0.25rem)] left-[calc(50%_-_0.25rem)] w-2 h-2 bg-[#823E35] rounded-full"></div>
                        </div>
                        <div >
                            <div className="mb-4">
                                <div className="flex items-center gap-2 ">
                                    <h2 className="font-medium text-[#F2F2F2] text-regular">Air Heat Index </h2>
                                    <InformationCircleIcon width={18} height={18} className="text-[#828282]" />
                                </div>
                                <h2 className="mb-2 font-medium text-[#F2F2F2] text-regular">Number of Extreme Heat days</h2>
                                <div className="">
                                    <div className="flex gap-4 text-[#D36051] text-xsmall">
                                        <p className="w-4">{ExcessiveHeatDays}</p>
                                        <p className="font-medium ">NWS Excessive Heat</p>
                                    </div>
                                    <div className="flex gap-4 text-[#C9733A] text-xsmall">
                                        <p className="w-4">{HeatAdvisoryDays}</p>
                                        <p className="font-medium ">NWS Heat Advisory</p>
                                    </div>
                                    <div className="flex gap-4 text-[#BA8E50] text-xsmall">
                                        <p className="w-4">{HeatEventDays}</p>
                                        <p className="font-medium ">NYC Heat Event</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 ">
                                    <h2 className="font-medium text-[#F2F2F2] text-regular">Air Temperature</h2>
                                    <InformationCircleIcon width={18} height={18} className="text-[#828282]" />
                                </div>
                                <h2 className="mb-2 font-medium text-[#F2F2F2] text-regular">Number of Days Exceeding Historic Normal</h2>
                                <div className="">
                                    <div className="flex gap-4 text-[#E97159] text-xsmall">
                                        <p className="w-4">30</p>
                                        <p className="font-medium ">days above historic maximum</p>
                                    </div>
                                    <div className="flex gap-4 text-[#5BA6BA] text-xsmall">
                                        <p className="w-4">40</p>
                                        <p className="font-medium ">days above historic minimum</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {!isTablet && (<>
                    <div className="mb-5 ">
                        <h2 className="mb-2 font-medium text-[#F2F2F2]">Air Heat Index </h2>
                        <div className="p-4 w-full h-24 bg-[#333] rounded-[0.5rem]"></div>
                    </div>
                    <div className="mb-4">
                        <h2 className="mb-2 font-medium text-[#F2F2F2]">Air Temperature </h2>
                        <div className="p-4 w-full h-24 bg-[#333] rounded-[0.5rem]"></div>
                    </div>
                </>)}
                {isTablet && (
                    <div className="flex flex-col w-full h-[60%]">
                        <div className="flex">
                            <button className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "air_heat_index" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#333]"} `} onClick={() => setClickedIndex("air_heat_index")}>Air Heat Index</button>
                            <button className={`flex justify-center items-center py-1  px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "air_temperature" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#333]"} `} onClick={() => setClickedIndex("air_temperature")}>Air Temperature</button>
                        </div>
                        <div className="flex flex-col justify-center py-[1.25%] px-[2.5%]  w-full h-full bg-[#333] rounded-[0.75rem] rounded-t-[0]">
                            <div className="flex justify-between">
                                <div className="font-semibold text-large text-white">
                                    <p>Bedford Stuyvesant</p>
                                    <p>Air Heat Index in 2022</p>
                                </div>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-small text-[#CCC]">Daily Air Heat Index</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-[2px] bg-[#EE745D] rounded-full"></div>
                                            <p className="font-regular text-xsmall text-[#999]">Max Daily Temperature</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-[2px] bg-[#49808D] rounded-full"></div>
                                            <p className="font-regular text-xsmall text-[#999]">Min Daily Temperature</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-small text-[#CCC]">Extreme Heat Advisory</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-2 bg-[#823E35]"></div>
                                            <p className="font-regular text-xsmall text-[#999]">NWS Excessive Heat</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-2 bg-[#A46338]"></div>
                                            <p className="font-regular text-xsmall text-[#999]">NWS Heat Advisory</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-2 bg-[#AD844A]"></div>
                                            <p className="font-regular text-xsmall text-[#999]">NYC Heat Event</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AirHeatIndexLineChart />
                        </div>
                    </div>
                )}
                <div className="flex md:justify-between md:items-center gap-5 md:gap-0">
                    <button className="px-2 h-[2.4rem] font-medium text-regular bg-[#E0E0E0] border-2 border-[#E0E0E0] rounded-[0.5rem]">Download Profile</button>
                    {isTablet ?
                        <div className="flex items-center">
                            <button className="p-[0.625rem] text-regular text-[#E0E0E0] ">View the Outdoor Heat Exposure Index for this neighborhood</button> :
                            <ArrowLongRightIcon width={24} height={24} className="text-white" />
                        </div> :
                        <button className="p-[0.625rem] text-regular text-[#E0E0E0] border-2 border-[#E0E0E0] rounded-[0.5rem]">Neighborhood's HVI</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default WeatherStationProfile