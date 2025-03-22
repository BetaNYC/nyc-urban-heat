import { useState, Dispatch, SetStateAction, useEffect } from "react"
import mapboxgl, { Popup } from "mapbox-gl";
import * as turf from "@turf/turf";

import { useMediaQuery } from "react-responsive"

import AirHeatIndexLineChart from '../components/AirHeatIndexLineChart';
import AirTemperatureLineChart from "./AirTemperatureLineChart";

import { ChevronLeftIcon, ChevronRightIcon, InformationCircleIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

import {
    isNeighborhoodProfileExpanded, isWeatherStationProfileExpanded, selectedDataset, clickedAddress, clickedWeatherStationName, map, weatherStationProfileData, clickedNeighborhoodInfo, clickedWeatherStationPopup, clickedNeighborhoodPopup, clickedWeatherStationNeighborhoodID, clickedWeatherStationHeatEventDays,
    clickedWeatherStationHeatAdvisoryDays,
    clickedWeatherStationExcesiveHeatDays,

} from "../pages/MapPage";

import { datasets, initializeView } from "../utils/datasets"

import { WeatherStationData } from "../types";

import { fetchStationHeatStats, fetchWeatherStationData } from "../utils/api";


import nta from "../data/nta.geo.json"
import weatherStaions from "../data/stations.geo.json"


import InformationCircle from "./InformationCircle";

const WeatherStationProfile = () => {

    const currentYear = selectedDataset.value?.currentYear || 2023;
    const currentAddress = clickedAddress.value
    const currentWeatherStationName = clickedWeatherStationName.value

    const [weatherStationData, setWeatherStationData] = useState<WeatherStationData[]>([]);
    const [heatStatusData, setHeatStatusData] = useState<{
        excessiveHeatDays:number,
        heatAdvisoryDays:number,
        heatEventDays:number
    }>({
        excessiveHeatDays:0,
        heatAdvisoryDays:0,
        heatEventDays:0
    })

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchWeatherStationData(currentYear, currentAddress)
            const data = res.map((d: WeatherStationData) => ({
                ...d,
                datetime: new Date(d.datetime)
            }));

            const heatStatusRes = await fetchStationHeatStats()
            // @ts-ignore
            const heatData = await heatStatusRes.features.filter(d => d.properties.year === currentYear).filter(d => d.properties.address === currentAddress)[0]
            const heatDaysData = {
                excessiveHeatDays:heatData.properties['Days_with_NWS_Excessive_Heat_Event'],
                heatAdvisoryDays:heatData.properties['Days_with_NWS_HeatAdvisory'],
                heatEventDays:heatData.properties['Days_with_NYC_HeatEvent']
            }

            setWeatherStationData(data)
            setHeatStatusData(heatDaysData)


        }
        fetchData()
    }, [currentYear, currentAddress, currentWeatherStationName])

    const airHeatIndexData = weatherStationData.map(d => ({
        address: d.address!,
        datetime: d.datetime!,
        year: d.year!,
        feelslikemax: d.feelslikemax!,
        feelslikemin: d.feelslikemin!,
        NYC_HeatEvent: d.NYC_HeatEvent as "" | "NYC_Heat_Event",
        HeatAdvisory: d.HeatAdvisory as "" | "HeatAdvisory",
        ExcessiveHeat: d.ExcessiveHeat as "" | "Excessive_Heat_Event",
    }));

    const airTemperatureData = weatherStationData.map(d => ({
        address: d.address!,
        datetime: d.datetime!,
        year: d.year!,
        tempmax: d.tempmax!,
        tempmin: d.tempmin!,
        Normal_Temp_Max: d.Normal_Temp_Max!,
        Normal_Temp_Min: d.Normal_Temp_Min!,
    }));


    const heatEventDays = heatStatusData.heatEventDays;
    const heatAdvisoryDays = heatStatusData.heatAdvisoryDays;
    const excessiveHeatDays = heatStatusData.excessiveHeatDays;

    const aboveHistoricMaxDays = weatherStationData.filter(d => d.feelslikemax > d.Record_Max).length
    const aboveHistoricMinDays = weatherStationData.filter(d => d.feelslikemin > d.Record_Min).length

    const heatEventDaysCircleRadius = `${+heatEventDays / 45 * 6}rem`
    const heatAdvisoryDaysCircleRadius = `${+heatAdvisoryDays / 45 * 6}rem`
    const excessiveHeatDaysRadius = `${+excessiveHeatDays / 45 * 6}rem`


    const [clickedIndex, setClickedIndex] = useState<"air_heat_index" | "air_temperature">("air_heat_index")

    const isTablet = useMediaQuery({
        query: '(min-width: 768px)'
    })

    const clickHandler = () => {
        isWeatherStationProfileExpanded.value = !isWeatherStationProfileExpanded.value
        if (isWeatherStationProfileExpanded.value === false) {
            map.value!.flyTo({
                center: [-73.913, 40.763],
                zoom: 11,
                essential: true,
                duration: 2000,
                easing: (t) => t
            })
        }
    }

    const handleChange = (event: any) => {
        if (selectedDataset.value) {
            selectedDataset.value.currentYear = +event.target.value

            initializeView(selectedDataset.value, map.value).then(dataset => {
                selectedDataset.value = { ...dataset }
            })
        }
    };


    clickedWeatherStationNeighborhoodID.value = weatherStaions.features.find(w => w.properties.address === clickedAddress.value)?.properties.nearestNTA!
    //@ts-ignore
    const clickedWeatherStationNeighborhoodFeature = nta.features.find(n => n.properties.ntacode === clickedWeatherStationNeighborhoodID.value)
    //@ts-ignore
    const clickedWeatherStationNeighborhoodCentroid = turf.centroid(clickedWeatherStationNeighborhoodFeature).geometry.coordinates
    const clickedWeatherStationNeighborhoodBoro = clickedWeatherStationNeighborhoodFeature?.properties?.boroname
    const clickedWeatherStationNeighborhoodName = clickedWeatherStationNeighborhoodFeature?.properties?.ntaname



    const profileChangeClickHandler = () => {
        isNeighborhoodProfileExpanded.value = true
        isWeatherStationProfileExpanded.value = false
        selectedDataset.value = datasets[0]


        initializeView(datasets[0], map.value).then(dataset => {
            selectedDataset.value = { ...dataset }
        })

        console.log(clickedWeatherStationNeighborhoodID.value)


        map.value!.setFeatureState(
            {
                source: "Outdooor_Heat_Volnerability_Index_SOURCE",
                id: clickedWeatherStationNeighborhoodID.value!,
            },
            { clicked: true }
        );

        clickedWeatherStationPopup.value?.remove()

        const bounds = map.value!.getBounds();
        const centerCoordinates = map.value!.getCenter();
        const centerLng = centerCoordinates.lng;
        const mapWidth = bounds.getEast() - bounds.getWest();
        const targetLng = bounds.getWest() + mapWidth * 0.175;
        const newLng = centerLng + (clickedWeatherStationNeighborhoodCentroid[0] - targetLng) * 0.65;


        clickedNeighborhoodInfo.value = {
            code: clickedWeatherStationNeighborhoodID.value || "Unknow NTA Code",
            boro: clickedWeatherStationNeighborhoodBoro as "Brooklyn" | "Queens" | "Manhattan" | "Staten Island" | "Bronx" || "Unknown Boro",
            nta: clickedWeatherStationNeighborhoodName || "Unknown NTA"
        }

        const offsetLat = 0.005
        const tooltipLat = clickedWeatherStationNeighborhoodCentroid[1] + offsetLat;

        if (clickedNeighborhoodPopup) {
            clickedNeighborhoodPopup.value?.remove();
            clickedNeighborhoodPopup.value = null;
        }

        clickedNeighborhoodPopup.value = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: "clicked-popup",
        })
            .setLngLat([clickedWeatherStationNeighborhoodCentroid[0], tooltipLat])
            .setHTML(`<div class='clicked-nta'>${clickedWeatherStationNeighborhoodName}</div>`)
            .addTo(map.value!);

        // if (clickedWeatherStationNeighborhoodID !== null) {
        //     clickedNeighborhoodID.value = clickedWeatherStationNeighborhoodID!
        //     console.log(clickedWeatherStationNeighborhoodID)
        //     map.value!.setFeatureState(
        //         { source: "HEAT_VULNERABILITY_SOURCE", id: clickedWeatherStationNeighborhoodID },
        //         { clicked: false }
        //     );
        // }




        map.value!.flyTo({
            center: [newLng, clickedWeatherStationNeighborhoodCentroid[1]],
            zoom: map.value!.getZoom(),
            essential: true,
            duration: 2000,
            easing: (t) => t * (2.5 - t),
        });


    }



    return (
        <div className={`transition-all duration-[1500ms] ${!isWeatherStationProfileExpanded.value && "translate-y-[70vh] md:translate-y-0 md:translate-x-[65vw]"} absolute bottom-0 md:top-[3.125rem] md:right-0 flex items-center z-20`}>
            {
                isTablet && <div className="flex items-center justify-center w-9 h-24 bg-[#1B1B1B] rounded-l-2xl cursor-pointer" onClick={clickHandler}>
                    {isWeatherStationProfileExpanded.value ? <ChevronRightIcon width={20} height={20} className="text-[#BDBDBD]" /> : <ChevronLeftIcon width={20} height={20} className="text-[#BDBDBD]" />}
                </div>
            }
            <div className={`md:flex md:flex-col md:justify-center md:gap-6 px-6 lg:px-10 pt-12 pb-6 md:pt-0 md:pb-0 w-[100vw] md:w-[65vw] h-[70vh] md:h-[calc(100vh_-_3.125rem)] bg-[#1B1B1B] rounded-[1rem]  md:rounded-[0] overflow-y-auto scrollbar`}>
                <div className="md:flex md:items-center md:gap-6  md:h-[25%] overflow-y-scroll">
                    <div className="md:flex md:flex-col md:justify-center md:gap-3 md:px-4 md:py-2 w-full h-full md:w-[70%] md:border-[1px] md:border-[#333] rounded-[0.5rem]">
                        <div className="flex justify-between items-start w-full">
                            <div className="flex items-center gap-5">
                                {
                                    isTablet &&
                                    <div className="flex justify-center max-w-40 min-w-10">
                                        <div className="relative aspect-square rounded-full bg-[#e19f3c]" style={{ width: heatEventDaysCircleRadius, height: heatEventDaysCircleRadius }}>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className=" bg-[#d66852] rounded-full" style={{ width: heatAdvisoryDaysCircleRadius, height: heatAdvisoryDaysCircleRadius }}></div>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-[#9d2b2b] rounded-full" style={{ width: excessiveHeatDaysRadius, height: excessiveHeatDaysRadius }}></div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="">
                                    <h1 className="text-regular lg:text-headline text-gray_six">{currentWeatherStationName}</h1>
                                    <h2 className="font-semibold text-subheadline lg:text-subheadline text-gray_six">Weather Station {clickedAddress.value}</h2>
                                </div>
                            </div>
                            <select
                                name=""
                                id=""
                                className="px-2 w-32 md:h-10 font-medium text-[#BDBDBD] bg-[#1B1B1B] border-2 border-[#333] rounded-[0.5rem]"
                                value={selectedDataset.value?.currentYear ?? ""}
                                onChange={handleChange}
                            >
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                                <option value="2018">2018</option>
                                <option value="2017">2017</option>
                                <option value="2016">2016</option>
                                <option value="2015">2015</option>
                                <option value="2014">2014</option>
                                <option value="2013">2013</option>
                            </select>
                        </div>
                        <div className="flex items-start gap-4 my-6 md:my-0 py-2 md:p-0 w-full bg-[#333] md:bg-transparent rounded-[0.5rem] overflow-y-auto scrollbar">
                            {
                                !isTablet &&
                                <div className="flex justify-center pt-1 pl-4 max-w-40 min-w-10">
                                    <div className="relative aspect-square rounded-full bg-[#BA8E50]" style={{ width: heatEventDaysCircleRadius, height: heatEventDaysCircleRadius }}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className=" bg-[#c9733A] rounded-full" style={{ width: heatAdvisoryDaysCircleRadius, height: heatAdvisoryDaysCircleRadius }}></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-[#823E35] rounded-full" style={{ width: excessiveHeatDaysRadius, height: excessiveHeatDaysRadius }}></div>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                <div className="">
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-medium text-[#F2F2F2] text-regular">Air Heat Index </h2>
                                        <InformationCircle size="small" content="Number of days per year when the air heat index temperature meets NWS and NYC extreme heat advisory criteria." />
                                    </div>
                                    <h2 className="mb-2 font-medium text-[#F2F2F2] text-regular">Extreme Heat days in {currentYear}</h2>
                                    <div className="">
                                        <div className="flex gap-4 text-[#D36051] text-xsmall">
                                            <p className="w-4">{excessiveHeatDays}</p>
                                            <p className="font-medium ">NWS Excessive Heat</p>
                                        </div>
                                        <div className="flex gap-4 text-[#C9733A] text-xsmall">
                                            <p className="w-4">{heatAdvisoryDays}</p>
                                            <p className="font-medium ">NWS Heat Advisory</p>
                                        </div>
                                        <div className="flex gap-4 text-[#BA8E50] text-xsmall">
                                            <p className="w-4">{heatEventDays}</p>
                                            <p className="font-medium ">NYC Heat Event</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-medium text-[#F2F2F2] text-regular">Air Temperature</h2>
                                        <InformationCircle size="small" content="Number of days per year when the minimum and maximum air temperature exceeds the historic normals between 1991-2020." />
                                    </div>
                                    <h2 className="mb-2 font-medium text-[#F2F2F2] text-regular"> Days Exceeding Historic Normal in {currentYear}</h2>
                                    <div className="">
                                        <div className="flex gap-4 text-[#E97159] text-xsmall">
                                            <p className="w-4">{aboveHistoricMaxDays}</p>
                                            <p className="font-medium ">days above historic maximum</p>
                                        </div>
                                        <div className="flex gap-4 text-[#5BA6BA] text-xsmall">
                                            <p className="w-4">{aboveHistoricMinDays}</p>
                                            <p className="font-medium ">days above historic minimum</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:flex-1 px-4 py-2 w-full h-full  border-[1px] border-[#333] rounded-[0.5rem] overflow-y-auto scrollbar">
                        <p className="text-regular text-[#D5D5D5]">
                            This weather station profile summarizes data collected between 2013-2023 from weather station {clickedAddress.value} in {currentWeatherStationName}. Data collected at each weather station reports the daily air temperature, relative humidity, and heat index values.
                            <p className="my-2"></p>
                            The air heat index chart shows the daily maximum and minimum air heat index temperatures between May-September and highlights the number of extreme heat days within a particular year.
                            <p className="my-2"></p>
                            The air temperature chart shows the daily maximum and minimum air temperature relative to the historic normal values. The historic normal baseline values are calculated from the New York City Central Park weather station values and aggregated between 1991-2020.
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
                {!isTablet && (<>
                    <div className="my-6">
                        <h2 className="mb-2 font-medium text-[#F2F2F2]">Air Heat Index </h2>
                        <div className="p-4 w-full h-24 bg-[#333] rounded-[0.5rem]"></div>
                    </div>
                    <div className="mb-6">
                        <h2 className="mb-2 font-medium text-[#F2F2F2]">Air Temperature </h2>
                        <div className="p-4 w-full h-24 bg-[#333] rounded-[0.5rem]"></div>
                    </div>
                </>)}
                {isTablet && (
                    <div className="flex flex-col gap-6 w-full h-[65%] overflow-y-auto scrollbar">
                        <div className="flex flex-col w-full h-[90%]">
                            <div className="flex">
                                <button className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "air_heat_index" ? "text-white bg-[#333] border-none " : "text-[#BDBDBD] border-[#333]"} `} onClick={() => setClickedIndex("air_heat_index")}>Air Heat Index</button>
                                <button className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "air_temperature" ? "text-white bg-[#333] border-none " : "text-[#BDBDBD] border-[#333]"} `} onClick={() => setClickedIndex("air_temperature")}>Air Temperature</button>
                            </div>
                            <div className="flex flex-col justify-center py-[1.25%] px-[2.5%]  w-full h-full bg-[#333] rounded-[0.75rem] rounded-t-[0]">
                                <div className="flex justify-between">
                                    <div className="font-semibold text-large text-white">
                                        {
                                            clickedIndex === "air_heat_index" ? <p>{currentWeatherStationName} ({clickedAddress}) <br /> Air Heat Index in {currentYear} </p> : <p>{currentWeatherStationName} ({clickedAddress}) <br /> Daily Air Temperature in {currentYear}</p>
                                        }
                                    </div>
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-small text-[#CCC]">Daily Air Heat Index</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-[2px] bg-[#EE745D] rounded-full"></div>
                                                <p className="w-[7.5rem] font-regular text-xsmall text-[#BDBDBD]">Max Daily Temperature</p>
                                                <InformationCircle size="small" content="Number of days per year when the maximum air temperature exceeds the historic normals between 1991-2020." />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-[2px] bg-[#49808D] rounded-full"></div>
                                                <p className="w-[7.5rem] font-regular text-xsmall text-[#BDBDBD]">Min Daily Temperature</p>
                                                <InformationCircle size="small" content="Number of days per year when the minimum air temperature exceeds the historic normals between 1991-2020." />
                                            </div>
                                        </div>
                                        {
                                            clickedIndex === "air_heat_index" ?
                                                <div>
                                                    <p className="text-small text-[#CCC]">Extreme Heat Advisory</p>
                                                    <div className="flex items-center gap-2 ">
                                                        <div className="w-4 h-2 bg-[#823E35]"></div>
                                                        <p className="w-[6.75rem] font-regular text-xsmall text-[#999]">NWS Excessive Heat</p>
                                                        <InformationCircle size="small" content="Periods when the maximum heat index temperature is 105° F or higher for at least 2 days and night time air temperatures do not drop below 75° F." />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-2 bg-[#A46338]"></div>
                                                        <p className="w-[6.75rem] font-regular text-xsmall text-[#999]">NWS Heat Advisory</p>
                                                        <InformationCircle size="small" content="Periods when the maximum heat index temperature is 100° F or higher for at least 2 days, and night time air temperatures do not drop below 75° F." />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-2 bg-[#AD844A]"></div>
                                                        <p className="w-[6.75rem] font-regular text-xsmall text-[#999]">NYC Heat Event</p>
                                                        <InformationCircle size="small" content="Periods in New York City when the heat index is 100° F or higher for one or more days, or when the heat index is 95° F or higher for two or more consecutive days." />
                                                    </div>
                                                </div> :
                                                <div>
                                                    <p className="text-small text-[#CCC]">Historical Normal Daily Air Temperature (1991-2020)</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="">
                                                            <svg width="24" height="2">
                                                                <line
                                                                    x1="0"
                                                                    y1="0"
                                                                    x2="24"
                                                                    y2="0"
                                                                    stroke="#E59E88"
                                                                    strokeWidth="4"
                                                                    strokeDasharray="2, 2" // Adjust dash and gap lengths
                                                                />
                                                            </svg>
                                                        </div>
                                                        <p className="w-[14.5rem] font-regular text-xsmall text-[#999]">Historical Normal Maximum Daily Temperature</p>
                                                        <InformationCircle size="small" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="">
                                                            <svg width="24" height="2">
                                                                <line
                                                                    x1="0"
                                                                    y1="0"
                                                                    x2="24"
                                                                    y2="0"
                                                                    stroke="#7A8A94"
                                                                    strokeWidth="4"
                                                                    strokeDasharray="2, 2" // Adjust dash and gap lengths
                                                                />
                                                            </svg>
                                                        </div>
                                                        <p className="w-[14.5rem] font-regular text-xsmall text-[#999]">Historical Normal Minimum Daily Temperature</p>
                                                        <InformationCircle size="small" />
                                                    </div>
                                                </div>
                                        }

                                    </div>
                                </div>
                                {
                                    clickedIndex === "air_heat_index" ?
                                        <AirHeatIndexLineChart data={airHeatIndexData} /> :
                                        <AirTemperatureLineChart data={airTemperatureData} />
                                }
                            </div>
                        </div>
                        {/* <div className="flex-1 flex md:justify-between md:items-center gap-5 md:gap-0">
                            <button className="min-w-[9rem] h-[2.4rem] font-medium text-regular bg-[#E0E0E0] border-2 border-[#E0E0E0] rounded-[0.5rem]">Print Profile</button> */}
                        {isTablet &&
                            <div className="flex items-center cursor-pointer z-[999]">
                                <button className="p-[0.625rem] text-regular text-[#E0E0E0] " onClick={profileChangeClickHandler}>View the Outdoor Heat Exposure Index for this neighborhood</button> :
                                <ArrowLongRightIcon width={20} height={20} className="text-white" />
                            </div>
                        }
                        {/* </div> */}
                    </div>
                )}

            </div>
        </div>
    )
}

export default WeatherStationProfile