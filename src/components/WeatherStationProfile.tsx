import { useState } from "react"

import { ArrowRightIcon, ArrowLeftIcon, InformationCircleIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction } from "react"

import { useMediaQuery } from "react-responsive"

type Props = {
    profileExpanded: boolean
    setProfileExpanded: Dispatch<SetStateAction<boolean>>
}

const WeatherStationProfile = ({ profileExpanded, setProfileExpanded }: Props) => {

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
        <div className={`transition-all duration-[1500ms] ${!profileExpanded && "translate-y-[70vh] lg:translate-y-0 lg:translate-x-[calc(75vw)] xl:translate-x-[calc(65vw)]"} absolute bottom-0 lg:top-[3.125rem] lg:right-0 flex items-center  z-20`}>
            {
                isDesktop && <div className="flex items-center justify-center w-12 h-24 bg-[#1B1B1B] rounded-l-2xl cursor-pointer" onClick={clickHandler}>
                    {profileExpanded ? <ArrowRightIcon width={24} height={24} className="text-white" /> : <ArrowLeftIcon width={24} height={24} className="text-white" />}
                </div>
            }
            <div className={`px-6 lg:px-10 pb-6 pt-12 md:pt-[3.75rem] w-[100vw] lg:w-[75vw] xl:w-[65vw] h-[70vh] lg:h-[calc(100vh_-_3.125rem)] bg-[#1B1B1B] rounded-[1rem] lg:rounded-[0] overflow-y-auto `}>
                <div className="md:flex md:gap-[3.375rem] md:mb-[1.75rem] md:h-[40%]">
                    <div className="md:flex md:flex-col w-full md:w-[50%]">
                        <div className="flex items-start justify-between mb-6 ">
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
                    <div className="flex gap-4 md:gap-8 my-5 md:my-0  p-4 w-full md:w-[50%] md:h-full bg-[#333] md:bg-transparent md:border-[1px]  md:border-[#333] rounded-[0.5rem]">
                        <div className="relative w-12 md:w-[5.25rem] h-12 md:h-[5.25rem]">
                            <div className="w-full h-full rounded-full bg-[#BA8E50]"></div>
                            <div className="absolute top-[calc(50%_-_0.9375rem)] left-[calc(50%_-_0.9375rem)]  w-6 md:w-[1.875rem] h-6 md:h-[1.875rem] bg-[#c9733A] rounded-full"></div>
                            <div className="absolute top-[calc(50%_-_0.25rem)] left-[calc(50%_-_0.25rem)] w-2 h-2 bg-[#823E35] rounded-full"></div>
                        </div>
                        <div >
                            <div className="mb-4">
                                <div className="flex items-center gap-2 ">
                                    <h2 className="font-medium text-[#F2F2F2]">Air Heat Index </h2>
                                    <InformationCircleIcon width={18} height={18} className="text-[#828282]" />
                                </div>
                                <h2 className="mb-2 font-medium text-[#F2F2F2]">Number of Extreme Heat days</h2>
                                <div className="">
                                    <div className="flex gap-4 text-[#D36051] text-small">
                                        <p className="w-4">5</p>
                                        <p className="font-medium ">National Weather Service Excessive Heat</p>
                                    </div>
                                    <div className="flex gap-4 text-[#C9733A] text-small">
                                        <p className="w-4">11</p>
                                        <p className="font-medium ">National Weather Service Heat Advisory</p>
                                    </div>
                                    <div className="flex gap-4 text-[#BA8E50] text-small">
                                        <p className="w-4">20</p>
                                        <p className="font-medium ">National Weather Service Excessive Heat</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 ">
                                    <h2 className="font-medium text-[#F2F2F2]">Air Temperature</h2>
                                    <InformationCircleIcon width={18} height={18} className="text-[#828282]" />
                                </div>
                                <h2 className="font-medium text-[#F2F2F2]">Number of Days Exceeding</h2>
                                <h2 className="mb-2 font-medium text-[#F2F2F2]">Historic Normal</h2>
                                <div className="">
                                    <div className="flex gap-4 text-[#E97159] text-small">
                                        <p className="w-4">30</p>
                                        <p className="font-medium ">days above historic maximum</p>
                                    </div>
                                    <div className="flex gap-4 text-[#5BA6BA] text-small">
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
                    <div className="flex flex-col w-full h-[50%]">
                        <div className="flex">
                            <button className={`pt-2 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "air_heat_index" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#333]"} `} onClick={() => setClickedIndex("air_heat_index")}>Air Heat Index</button>
                            <button className={`pt-2xs px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "air_temperature" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#333]"} `} onClick={() => setClickedIndex("air_temperature")}>Air Temperature</button>
                        </div>
                        <div className="flex flex-col mb-6  w-full h-full bg-[#333] rounded-[0.75rem] rounded-t-[0]"></div>
                    </div>
                )}
                <div className="flex md:justify-between gap-5 ">
                    <button className="p-[0.625rem] text-regular bg-[#E0E0E0] border-2 border-[#E0E0E0] rounded-[0.5rem]">Download</button>
                    {isTablet ?
                        <div className="flex items-center md:border-b-[1px] md:border-[#333]">
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