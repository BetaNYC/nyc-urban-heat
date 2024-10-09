import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { formatDateString } from "../utils/format"
import { map, selectedDataset, isProfileExpanded } from '../pages/MapPage'
import { computed } from "@preact/signals-react"
import { group } from 'd3-array';
import { initializeView } from "../utils/datasets"


const MapDateSelections = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)'
  })

  function formatDate(date: string) {
    if (date.startsWith('20') && date.length == 8) return formatDateString(date)
    return date
  }
  const dates = computed(() => {
    const dates = selectedDataset.value?.dates ?? []
    // sort dates and create an new object that can be grouped
    const datesObj = dates.sort((a, b) => b.localeCompare(a)).map(date => {
      let formattedDate = date
      let group = ''
      // check if the date contains a year/month/date
      if (date.startsWith('20') && date.length == 8) {
        formattedDate = formatDateString(date)
        group = date.slice(0, 4)
      }

      return {
        date,
        formattedDate,
        group,
      }
    })

    return group(datesObj, d => d.group)
  })

  const years = computed(() => selectedDataset.value?.years ?? [])

  function handleDateChange(date: string) {
    if (selectedDataset.value) {
      selectedDataset.value.currentDate = date

      initializeView(selectedDataset.value, map.value).then(dataset => {
        selectedDataset.value = { ...dataset }
      })
    }
  }

  function handleYearChange(year: number) {
    if (selectedDataset.value) {
      selectedDataset.value.currentYear = year


      initializeView(selectedDataset.value, map.value).then(dataset => {
        selectedDataset.value = {...dataset}
      })
    }
  }

  if (selectedDataset.value?.dates) {
    return (
      <div className={`absolute ${isProfileExpanded ? "left-[22rem] top-[4.625rem]" : "left-6 top-[9.25rem]"}
           bg-[#1B1B1B] rounded-[0.5rem] cursor-pointer overflow-hidden z-10`}
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center gap-3 px-3 h-[3.5rem] ">
          <CalendarDaysIcon width={24} height={24} className="text-[#BDBDBD]" />
          {isTablet && <div className="mr-5 font-medium text-regular text-[#F2F2F2]">
            {selectedDataset.value?.currentDate ? formatDate(selectedDataset.value?.currentDate) : 'Available Datasets'}
          </div>}
          {isExpanded ? <ChevronUpIcon width={24} height={24} className="text-[#BDBDBD]" />
            : <ChevronDownIcon width={24} height={24} className="text-[#BDBDBD]" />}
        </div>
        <div className={`flex flex-col gap-0 my-3 w-full ${isExpanded ? "h-[60vh] overflow-scroll" : "hidden"}`}>
          {Array.from(dates.value).map(([category, values]) => (
            <div key={`date-cat-${category}`}>
              {category !== '' ? (
                // divider
                <>
                  <h3 className="px-5 pt-2 font-medium text-regular text-[#BDBDBD]">{category}</h3>
                  <div className='my-2 h-[1px] bg-[#828282]'></div>
                </>
              ) : ''}
              <>
                {values.map((date: any) => <div className=" text-[#F2F2F2] hover:bg-[#6A6A6A]" key={`date-${date}`} onClick={() => handleDateChange(date.date)}>
                  <h3 className="my-2 px-5 font-medium text-regular ">{date.formattedDate}</h3>
                  <div className='h-[1px] bg-[#828282]'></div>
                </div>)}
              </>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (selectedDataset.value?.years) {
    return (
      <div className={`absolute ${isProfileExpanded ? "left-[22rem] top-[4.625rem]" : "left-6 top-[9.25rem]"}
      bg-[#1B1B1B] rounded-[0.5rem] cursor-pointer overflow-hidden z-10`}
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center gap-3 px-3 h-[3.5rem] ">
          <CalendarDaysIcon width={24} height={24} className="text-[#BDBDBD]" />
          {isTablet && <div className="mr-5 font-medium text-regular text-[#F2F2F2]">
            {selectedDataset.value?.currentYear ? selectedDataset.value?.currentYear : 'Available Datasets'}
          </div>}
          {isExpanded ? <ChevronUpIcon width={24} height={24} className="text-[#BDBDBD]" />
            : <ChevronDownIcon width={24} height={24} className="text-[#BDBDBD]" />}
        </div>
        <div className={`flex flex-col gap-0 my-3 w-full ${isExpanded ? "overflow-scroll" : "hidden"}`}>
          {

            Array.from(years.value).map((y: any) => {
              return (
                <div className="hover:bg-[#828282] text-[#828282] hover:text-white" key={y} onClick={() => handleYearChange(y)}>
                  <h3 className="my-2 px-5 font-medium text-regular ">{y}</h3>
                  <div className=' h-[1px] bg-[#828282]'></div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  return (<></>)
}

export default MapDateSelections;


