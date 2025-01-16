import { ChevronLeftIcon, ChevronRightIcon, ArrowLongRightIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import OverviewProfileChart from "./OverviewProfileChart"
import { isNeighborhoodProfileExpanded, isWeatherStationProfileExpanded, selectedDataset, neighborhoodProfileData, map, previousClickCor, clickedNeighborhoodInfo, clickedNeighborhoodPopup, clickedWeatherStationPopup, clickedAddress, clickedWeatherStationName, clickedNeighborhoodNearestStationAddress } from "../pages/MapPage"
import { datasets, initializeView } from "../utils/datasets"
import { viewWeatherStations } from "../utils/viewWeatherStations"
import { fetchStationHeatStats } from "../utils/api";
import nta from "../data/nta.geo.json"
import weatherStaions from "../data/stations.geo.json"
import weatherStationName from "../data/weather_station_name.json"

import InformationCircle from './InformationCircle'

import mapboxgl, { Popup } from "mapbox-gl";

import { nta_dataset_info } from '../App'

import NeighborhoodProfileBarChart from "../components/NeighborhoodProfileBarChart"

type Borough = "Brooklyn" | "Queens" | "Manhattan" | "Staten Island" | "Bronx"
type Metrics = "PCT_TREES" | "PCT_AREA_COOLROOF" | "PCT_PERMEABLE"

// ntaneighborhoodProfileData 
const NeighborhoodProfile = () => {
    const [clickedMetric, setClickedMetric] = useState<Metrics>("PCT_TREES")

    const isTablet = useMediaQuery({
        query: '(min-width: 768px)'
    })
    const printPage = () => {
        window.print();
    }

    let barChartData

    let valueAverage = {
        NY: 0,
        boro: 0
    }
    const options = ["Brooklyn", "Queens", "Manhattan", "Staten Island", "Bronx"];


    const [isBoroSelectionOpen, setIsBoroSelectionOpen] = useState(false);
    const [selectedBoro, setSelectedBoro] = useState<Borough>("Brooklyn");
    // const [nyAverage , setNyAverage] = useState(0)
    // const [boroAverage, setBoroAverage] = useState(0)

    const toggleDropdown = () => setIsBoroSelectionOpen((prev) => !prev);

    const handleOptionClick = (option: Borough) => {
        setSelectedBoro(option);
        setIsBoroSelectionOpen(false);
    };


    const selectedMetricBarChartRawData = nta_dataset_info.value.filter(d => d.metric === clickedMetric)
    if (selectedMetricBarChartRawData && Array.isArray(selectedMetricBarChartRawData)) {
        // .filter(([key]) => key.toLowerCase().startsWith(selectedBoro === "Manhattan" ? 'mn' : selectedBoro === "Brooklyn" ? 'bk' : selectedBoro === "Queens" ? "qn" : selectedBoro === "Bronx" ? 'bx' : 'si'))
        const selectedMetricBarChartData = selectedMetricBarChartRawData.map(item => {
            if (item && typeof item === 'object') {
                return Object.entries(item)
                    .map(([key, value]) => {
                        const numericValue = isNaN(Number(value)) ? 0 : Number(value);
                        return { [key]: numericValue };
                    });
            }
            return [];
        });


        const selectedBoroPrefix = selectedBoro === "Manhattan" ? 'mn' :
            selectedBoro === "Brooklyn" ? 'bk' :
                selectedBoro === "Queens" ? 'qn' :
                    selectedBoro === "Bronx" ? 'bx' :
                        'si';



        barChartData = selectedMetricBarChartData.flat().map(d => {
            const neighborhood = Object.keys(d)[0];
            const value = d[neighborhood];
            return { neighborhood, value };
        })

        valueAverage.NY = parseFloat((barChartData.reduce((sum, d) => sum + d.value, 0) / barChartData.length).toFixed(1));

        barChartData = barChartData.filter(d => d.neighborhood.toLowerCase().startsWith(selectedBoroPrefix)).sort((a, b) => a.value - b.value);

        valueAverage.boro = parseFloat((barChartData.reduce((sum, d) => sum + d.value, 0) / barChartData.length).toFixed(1))



    }




    const clickHandler = () => {
        isNeighborhoodProfileExpanded.value = !isNeighborhoodProfileExpanded.value
        if (isNeighborhoodProfileExpanded.value === false) {
            map.value!.flyTo({
                center: [-73.913, 40.763],
                zoom: 11,
                essential: true,
                duration: 2000,
                easing: (t) => t
            })
        }
    }

    //@ts-ignore
    clickedNeighborhoodNearestStationAddress.value = nta.features.find(n => n.properties.ntaname === clickedNeighborhoodInfo.value?.nta).properties.nearestStation
    const clickedNeighborhoodNearestStationFeature = weatherStaions.features.find(w => w.properties.address === clickedNeighborhoodNearestStationAddress.value)
    const clickedNeighborhoodNearestStationProperties = clickedNeighborhoodNearestStationFeature?.properties
    const clickedNeighborhoodNearestStationCoordinates = clickedNeighborhoodNearestStationFeature?.geometry.coordinates


    const profileChangeClickHandler = () => {
        isNeighborhoodProfileExpanded.value = false
        isWeatherStationProfileExpanded.value = true
        selectedDataset.value = datasets[1]

        if (!datasets[1].currentView) {
            datasets[1].currentView = 'points'
        }

        clickedAddress.value = clickedNeighborhoodNearestStationAddress.value!
        clickedWeatherStationName.value = weatherStationName.find(w => w.address === clickedNeighborhoodNearestStationAddress.value)!.name

        initializeView(datasets[1], map.value).then(dataset => {
            selectedDataset.value = { ...dataset }

            map.value!.setFeatureState(
                { source: "weather_stations", id: clickedNeighborhoodNearestStationAddress.value! },
                { clicked: true }
            );
        })



        clickedNeighborhoodPopup.value?.remove()

        const bounds = map.value!.getBounds();
        const centerCoordinates = map.value!.getCenter();
        const centerLng = centerCoordinates.lng;
        const mapWidth = bounds.getEast() - bounds.getWest();
        const targetLng = bounds.getWest() + mapWidth * 0.175;
        const newLng = centerLng + (clickedNeighborhoodNearestStationCoordinates![0] - targetLng) * 0.65;




        map.value!.flyTo({
            center: [newLng, clickedNeighborhoodNearestStationCoordinates![1]],
            zoom: map.value!.getZoom(),
            essential: true,
            duration: 2000,
            easing: (t) => t * (2.5 - t),
        })


        const offsetLat = 0.005
        const tooltipLat = clickedNeighborhoodNearestStationCoordinates![1] + offsetLat;

        if (clickedWeatherStationPopup) {
            clickedWeatherStationPopup.value?.remove();
        }

        clickedWeatherStationPopup.value = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: "clicked-popup",
        })
            .setLngLat([clickedNeighborhoodNearestStationCoordinates![0], tooltipLat])
            .setHTML(`<div class='clicked-nta'>${clickedNeighborhoodNearestStationAddress}</div>`)
            .addTo(map.value!);



    }




    // const { currentFeature, allFeatures } = ntaneighborhoodProfileData
    // if (Object.keys(currentFeature).length === 0) {
    //     // no feature is selected
    //     return (
    //         <div className={`transition-all duration-[1500ms] ${!profileExpanded && "translate-y-[70vh] lg:translate-y-0 lg:translate-x-[calc(75vw)] xl:translate-x-[calc(65vw)]"} absolute bottom-0 lg:top-[3.125rem] lg:right-0 flex items-center  z-20`}>
    //             {
    //                 isDesktop && <div className="flex items-center justify-center w-12 h-24 bg-[#1B1B1B] rounded-l-2xl cursor-pointer" onClick={clickHandler}>
    //                     {profileExpanded ? <ArrowRightIcon width={24} height={24} className="text-white" /> : <ArrowLeftIcon width={24} height={24} className="text-white" />}
    //                 </div>
    //             }
    //             <div className={`printable-white-bg px-4 lg:px-8 pt-12 py-6 lg:grid lg:grid-cols-6 lg:grid-rows-10  w-[100vw] lg:w-[75vw] xl:w-[65vw] h-[56vh] lg:h-[calc(100vh_-_3.125rem)] bg-[#1B1B1B] rounded-[1rem] lg:rounded-[0] overflow-y-auto `}>
    //                 <OverviewProfileChart allFeatures={allFeatures} clickedMetric={clickedMetric} />
    //             </div>
    //         </div>
    //     )
    // }

    // const { properties } = (currentFeature as any)
    // const { borough, ntaname } = properties

    // if (neighborhoodProfileData.value) {

    return (
        <div className={`transition-all duration-[1500ms] ${!isNeighborhoodProfileExpanded.value && "translate-y-[70vh] md:translate-y-0 md:translate-x-[calc(65vw)]"} absolute bottom-0 md:top-[3.125rem] md:right-0 flex items-center z-20`}>
            {
                isTablet && <div className="flex items-center justify-center w-9 h-24 bg-[#1B1B1B] rounded-l-2xl cursor-pointer" onClick={clickHandler}>
                    {isNeighborhoodProfileExpanded.value ? <ChevronRightIcon width={20} height={20} className="text-[#BDBDBD]" /> : <ChevronLeftIcon width={20} height={20} className="text-[#BDBDBD]" />}
                </div>
            }
            <div className={`printable-white-bg md:flex md:flex-col md:justify-center md:gap-[4rem] px-6 md:px-10 pt-12 pb-6 md:pt-0 md:pb-0 w-[100vw] md:w-[65vw] h-[70vh] md:h-[calc(100vh_-_3.125rem)] bg-[#1B1B1B] rounded-[1rem] md:rounded-[0] overflow-y-auto scrollbar`}>
                <div className="md:flex md:gap-8 md:h-[30%]">
                    <div className="md:flex md:flex-col md:w-[50%] h-full">
                        <h2 className="text-regular md:text-subheadline text-gray_six">{clickedNeighborhoodInfo.value?.boro}</h2>
                        <h1 className="md:mb-4 font-semibold text-subheadline md:text-headline text-gray_six">{clickedNeighborhoodInfo.value?.nta}</h1>
                        {
                            isTablet &&
                            <p className="flex-1 p-4 text-small text-[#D5D5D5] border-[1px] border-[#333] rounded-[0.75rem] overflow-y-scroll">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora,
                                sunt enim quos sapiente facere doloremque voluptate aspernatur sint eos debitis deserunt, quasi deleniti iste voluptatem aliquid voluptatibus, fuga assumenda. Eum?
                            </p>
                        }
                    </div>
                    <div className="md:flex md:flex-col md:gap-2 md:justify-center my-6 md:my-0 p-4 w-full md:w-[50%] md:h-full bg-[#333333] rounded-lg">
                        <div className="flex justify-between md:h-[35%]">
                            <h2 className="font-semibold w-[50%] min-w-[4rem] text-regular md:text-[1rem] lg:text-subheadline text-gray_six">Outdoor Heat Exposure Index</h2>
                            <div className="flex flex-col">
                                <h1 className="font-bold text-[2.5rem] lg:text-[3.5rem] text-gray_six leading-tight lg:leading-none ">4.0</h1>
                                <h3 className="font-regular text-regular lg:text-[1rem] text-[#BDBDBD]">Medium High</h3>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2 mt-2 pt-4 border-t-[1px] border-[#757575] overflow-scroll">
                            <div className="flex justify-between items-center gap-4">
                                <h3 className="text-small text-gray_six min-w-20">Air Temperature</h3>
                                <div className="flex items-center gap-2.5">
                                    <InformationCircle size="small" />
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
                            <div className="flex justify-between items-center gap-4">
                                <h3 className="text-small text-gray_six min-w-20">Mean Radiant Temperature</h3>
                                <div className="flex items-center gap-2.5">
                                    <InformationCircle size="small" />
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
                            <div className="flex justify-between items-center gap-4">
                                <h3 className="text-small text-gray_six min-w-20">Tree Canopy</h3>
                                <div className="flex items-center gap-2.5">
                                    <InformationCircle size="small" />
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
                            <div className="flex justify-between items-center gap-4">
                                <h3 className="text-small text-gray_six min-w-20">Cool Roofs</h3>
                                <div className="flex items-center gap-2.5">
                                    <InformationCircle size="small" />
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
                            <div className="flex justify-between items-center gap-4">
                                <h3 className="text-small text-gray_six min-w-20">Premeable Surfaces</h3>
                                <div className="flex items-center gap-2.5">
                                    <InformationCircle size="small" />
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
                </div>

                <div className="md:flex md:flex-col md:gap-6 w-full md:h-[55%]">
                    <div className="flex flex-col w-full h-[16rem] md:h-[90%] rounded-[0.75rem]">
                        {
                            isTablet &&
                            <div className="flex">
                                <button className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedMetric === "PCT_TREES" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#333] "}`} onClick={() => setClickedMetric("PCT_TREES")}>Tree Canopy</button>
                                <button className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedMetric === "PCT_AREA_COOLROOF" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#333]"}`} onClick={() => setClickedMetric("PCT_AREA_COOLROOF")}>Cool Roofs</button>
                                <button className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedMetric === "PCT_PERMEABLE" ? "text-white bg-[#333] border-none " : "text-[#828282] border-[#333]"}`} onClick={() => setClickedMetric("PCT_PERMEABLE")}>Permeable Surfaces</button>
                            </div>
                        }
                        <div className='flex-1 w-full rounded-[12px] rounded-tl-[0px] bg-[#333]'>
                            <div className='flex justify-between items-center px-5 w-full h-[20%]'>
                                <h2 className='font-semibold text-[21px] text-white'>Area of Tree Canopy in Brooklyn</h2>
                                <div className="relative inline-block text-left">
                                    {/* Dropdown Trigger */}
                                    <div
                                        className="flex gap-[6px] py-1 px-3 border-2 border-[#787878] rounded-[20px] cursor-pointer"
                                        onClick={toggleDropdown}
                                    >
                                        <p className="font-medium text-sm text-[#787878]">{selectedBoro}</p>
                                        <ChevronDownIcon
                                            width={20}
                                            height={20}
                                            className={`text-[#787878] transform transition-transform ${isBoroSelectionOpen ? "rotate-180" : "rotate-0"
                                                }`}
                                        />
                                    </div>

                                    {/* Dropdown Menu */}
                                    {isBoroSelectionOpen && (
                                        <ul className="absolute left-0 mt-2 w-full bg-[#333] border border-[#787878] rounded-lg shadow-lg z-10">
                                            {options.map((option) => (
                                                <li
                                                    key={option}
                                                    className="px-3 py-2 text-sm text-[#787878] hover:bg-gray-100 rounded-lg cursor-pointer"
                                                    onClick={() => handleOptionClick(option)}
                                                >
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <NeighborhoodProfileBarChart data={barChartData} valueAverage={valueAverage} boro={selectedBoro}  metric={clickedMetric}/>
                        </div>
                    </div>
                    <div className="flex-1 flex md:justify-between md:items-center gap-5 md:gap-0">
                        <button onClick={printPage} className="print:hidden min-w-[9rem] h-[2.4rem] font-medium text-regular bg-[#E0E0E0] border-2 border-[#E0E0E0] rounded-[0.5rem]">
                            Print profile
                        </button>
                        {isTablet &&
                            <div className="flex items-center">
                                <button className="p-[0.625rem] text-regular text-[#E0E0E0]" onClick={profileChangeClickHandler}>View the closest weather station</button> :
                                <ArrowLongRightIcon width={20} height={20} className="text-white" />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}



export default NeighborhoodProfile