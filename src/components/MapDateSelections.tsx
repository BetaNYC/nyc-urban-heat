import { useState, useContext, Dispatch, SetStateAction, } from "react"

import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'
import { useQuery } from 'react-query';

import { fetchSurfaceTemp } from "../api/api.ts"


import { useMediaQuery } from "react-responsive"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'


type Props = {
  date: string,
  year: string
  timeScale: 'year' | 'date' | "default",
  setDate: Dispatch<SetStateAction<string>>
  setYear: Dispatch<SetStateAction<string>>
  profileExpanded: boolean
}

const formatDateString = (dateString: string) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);


  return `${month}/${day}/${year}`;
};



const MapDateSelections = ({ date, timeScale, setDate, setYear, year, profileExpanded }: Props) => {

  const { layer } = useContext(MapLayersContext) as MapLayersContextType
  const [expand, setExpand] = useState(false)
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)'
  })


  const surfaceTemperatureQuery = useQuery({ queryKey: ['temperature'], queryFn: fetchSurfaceTemp })
  //@ts-ignore
  const clippedPMTiles = surfaceTemperatureQuery.data?.filter(d => d.filename.includes("ST_Clipped_")) || [];
  const years = ["2023", "2022", "2021", "2020", "2019", "2017", "2016", "2014", "2013"]


  return (
    <div className={`absolute  ${profileExpanded ? "left-6 top-[9.25rem]" : "left-[22rem] top-[4.625rem]"} bg-white rounded-[0.5rem] cursor-pointer overflow-hidden z-10`} onClick={() => setExpand(!expand)}>
      <div className="flex justify-between items-center gap-3 px-3 h-[3rem] ">
        <CalendarDaysIcon width={24} height={24} className="" />
        {isTablet && <div className="mr-5 font-medium text-regular">{timeScale === 'date' ? formatDateString(date) : timeScale === 'year' ? year : "Available Datasets"}</div>}
        {expand && layer ? <ChevronUpIcon width={24} height={24} />
          : <ChevronDownIcon width={24} height={24} />}
      </div>
      <div className={`flex flex-col ${timeScale === 'year' ? "gap-0" : "gap-4"} my-3 w-full ${expand && timeScale === 'date' ? "h-[60vh] overflow-scroll" : expand && timeScale === 'year' ? "overflow-scroll" : "hidden"}`}>
        {
          timeScale === "date" && (
            years.map((y) => {
              return (
                <div className="" key={y}>
                  <h3 className="px-5 font-medium text-regular text-[#4F4F4F]">{y}</h3>
                  <div className='my-2 h-[1px] bg-[#828282]'></div>
                  <div className="flex flex-col items-start ">
                    {
                      //@ts-ignore
                      clippedPMTiles.filter(d => d.date.includes(y)).map((d) => (
                        <div key={d.date} className="pl-12 py-2 w-full font-medium text-regular hover:bg-[#E0E0E0]" onClick={() => {
                          setDate(d.date)
                        }}>
                          {formatDateString(d.date)}
                        </div>
                      ))
                    }
                  </div>
                </div>
              )
            })
          )
        }
        {
          timeScale === 'year' && (
            years.map((y) => {
              return (
                <div className="hover:bg-[#828282] text-[#4F4F4F] hover:text-white" key={y} onClick={() => setYear(y)}>
                  <h3 className="my-2 px-5 font-medium text-regular ">{y}</h3>
                  <div className=' h-[1px] bg-[#828282]'></div>
                </div>
              )
            })
          )
        }
      </div>
    </div>
  )
}

export default MapDateSelections


{/* <div className="">
<h3 className="px-5 font-medium text-regular text-[#4F4F4F]">2022</h3>
<div className='my-2  h-[1px] bg-[#828282]'></div>
<div className="flex flex-col items-start">
  {
    //@ts-ignore
    clippedPMTiles.filter(d => d.date.includes("2022")).map((d) => (
      <div key={d.date} className="px-12 py-2 w-full font-medium text-regular hover:bg-[#E0E0E0]" onClick={() => setDate(d.date)}>
        {formatDateString(d.date)}
      </div>
    ))
  }
</div>
</div> */}