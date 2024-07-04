import { ArrowRightIcon, ArrowLeftIcon, InformationCircleIcon } from "@heroicons/react/24/outline"
import { useState, Dispatch, SetStateAction } from "react"

import { useMediaQuery } from "react-responsive"




type Props = {
    profileExpanded: boolean
    setProfileExpanded: Dispatch<SetStateAction<boolean>>
}




const NeighborhoodProfile = ({ profileExpanded, setProfileExpanded }: Props) => {

    const [clickedIndex, setClickedIndex] = useState("cool_roofs")
    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px)'
    })
    const clickHandler = () => {
        setProfileExpanded(!profileExpanded)
        console.log("aa")
    }

    return (
        <div className={`transition-all duration-[1500ms] ${!profileExpanded && "lg:translate-x-[calc(75vw)] xl:translate-x-[calc(65vw)]"} absolute bottom-0 lg:top-[3.125rem] lg:right-0 flex items-center  z-20`}>
            {
                isDesktop && <div className="flex items-center justify-center w-12 h-24 bg-[#1B1B1B] rounded-l-2xl cursor-pointer" onClick={clickHandler}>
                    {profileExpanded ? <ArrowRightIcon width={24} height={24} className="text-white" /> : <ArrowLeftIcon width={24} height={24} className="text-white" />}
                </div>
            }
            <div className={`px-4 lg:px-8 pt-12 py-6 lg:grid lg:grid-cols-6 lg:grid-rows-5 w-[100vw] lg:w-[75vw] xl:w-[65vw] h-[70vh] lg:h-[calc(100vh_-_3.125rem)] bg-[#1B1B1B] rounded-[1rem] lg:rounded-[0] overflow-y-auto `}>
                <div className="lg:mr-6 lg:col-start-1 lg:col-end-4 lg:row-span-2 ">
                    <h2 className="text-regular lg:text-subheadline text-gray_six">Brooklyn</h2>
                    <h1 className="lg:mb-4 font-semibold text-subheadline lg:text-headline text-gray_six">Neighrborhood Name</h1>
                    {
                        isDesktop &&
                        <p className="text-small text-[#D5D5D5]">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora,
                            sunt enim quos sapiente facere doloremque voluptate aspernatur sint eos debitis deserunt, quasi deleniti iste voluptatem aliquid voluptatibus, fuga assumenda. Eum?
                        </p>
                    }
                </div>
                <div className="grid grid-cols-6 lg:grid-cols-5 grid-rows-3 lg:grid-rows-6 lg:col-start-4 lg:col-end-7 lg:row-span-2 my-6 lg:my-0 pt-4 px-4 pb-4 lg:pb-0  w-full bg-[#333333] rounded-lg   ">
                    <div className="col-span-4 lg:col-span-2 row-span-1 lg:row-span-2">
                        <h2 className="mb-1 font-semibold text-regular lg:text-subheadline text-gray_six">Outdoor Heat Exposure Index</h2>
                        {/* <p className="text-xsmall text-[#9B9B9B]">The Heat Vulnerability Index (HVI) shows neighborhoods whose residents are more at risk for dying during and immediately following extreme heat.</p> */}
                    </div>
                    <div className="col-span-2 lg:col-start-4 lg:col-end-6 row-span-1 lg:row-span-2 flex flex-col items-center">
                        <h1 className="font-bold text-[2.5rem] lg:text-[3.75rem] text-gray_six leading-tight lg:leading-none ">4.0</h1>
                        <h3 className="font-regular text-regular lg:text-4 text-[#BDBDBD]">Medium High</h3>
                    </div>
                    <div className="col-span-6  row-span-2 lg:row-span-2 flex flex-col gap-2 mt-2 pt-4 border-t-[1px] border-[#757575]">
                        <div className="flex justify-between">
                            <h3 className="text-small text-gray_six">Air Temperature</h3>
                            <div className="flex items-center gap-2.5">
                                <InformationCircleIcon width={14} height={14} className="text-[#828282]" />
                                <div className="text-small text-[#C5C5C5]">Score</div>
                                <div className="flex gap-1">
                                    <div className="w-7 h-2 rounded-l-[20px] bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 rounded-r-[20px] bg-[#D9D9D9]"></div>
                                </div>
                                <div className="text-small text-[#C5C5C5]">5</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="text-small text-gray_six">Mean Radiant Temperature</h3>
                            <div className="flex items-center gap-2.5">
                                <InformationCircleIcon width={14} height={14} className="text-[#828282]" />
                                <div className="text-small text-[#C5C5C5]">Score</div>
                                <div className="flex gap-1">
                                    <div className="w-7 h-2 rounded-l-[20px] bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 rounded-r-[20px] bg-[#D9D9D9]"></div>
                                </div>
                                <div className="text-small text-[#C5C5C5]">5</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="text-small text-gray_six">Tree Canopy</h3>
                            <div className="flex items-center gap-2.5">
                                <InformationCircleIcon width={14} height={14} className="text-[#828282]" />
                                <div className="text-small text-[#C5C5C5]">Score</div>
                                <div className="flex gap-1">
                                    <div className="w-7 h-2 rounded-l-[20px] bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 rounded-r-[20px] bg-[#D9D9D9]"></div>
                                </div>
                                <div className="text-small text-[#C5C5C5]">5</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="text-small text-gray_six">Cool Roofs</h3>
                            <div className="flex items-center gap-2.5">
                                <InformationCircleIcon width={14} height={14} className="text-[#828282]" />
                                <div className="text-small text-[#C5C5C5]">Score</div>
                                <div className="flex gap-1">
                                    <div className="w-7 h-2 rounded-l-[20px] bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 rounded-r-[20px] bg-[#4F4F4F]"></div>
                                </div>
                                <div className="text-small text-[#C5C5C5]">4</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <h3 className="text-small text-gray_six">Premeable Surfaces</h3>
                            <div className="flex items-center gap-2.5">
                                <InformationCircleIcon width={14} height={14} className="text-[#828282]" />
                                <div className="text-small text-[#C5C5C5]">Score</div>
                                <div className="flex gap-1">
                                    <div className="w-7 h-2 rounded-l-[20px] bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 bg-[#D9D9D9]"></div>
                                    <div className="w-7 h-2 rounded-r-[20px] bg-[#4F4F4F]"></div>
                                </div>
                                <div className="text-small text-[#C5C5C5]">4</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-6 lg:row-start-3 lg:row-end-6 mt-8 w-full">
                    <div className="flex flex-col mt-4 mb-6 lg:my-6 w-full h-[16rem] lg:h-[75%] bg-[#333] rounded-[0.75rem]">
                        {/* {
                            isTablet &&
                            <div className="flex">
                                <button className={`pt-1 px-2 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "heat_vulnerability" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#828282"} `} onClick={() => setClickedIndex("heat_vulnerability")}>Heat Vulnerability Index</button>
                                <button className={`pt-1 px-2 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "cool_roofs" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#828282"} `} onClick={() => setClickedIndex("cool_roofs")}>Cool Roofs</button>
                                <button className={`pt-1 px-2 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "tree_canopies" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#828282"} `} onClick={() => setClickedIndex("tree_canopies")}>Tree Canopies</button>
                                <button className={`pt-1 px-2 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "cooling_centers" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#828282"} `} onClick={() => setClickedIndex("cooling_centers")}>Cooling Centers</button>
                            </div>
                        } */}
                    </div>
                    <button className="flex items-center justify-center py-2 w-[8.625rem] font-medium text-small text-black bg-[#E0E0E0] rounded-[0.375rem]">
                        Download profile
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NeighborhoodProfile