import { CalendarDaysIcon} from "@heroicons/react/24/outline"


const MapDateSelections = () => {
  return (
    <div className={`absolute left-[21rem] lg:left-[27rem] top-[4.625rem] flex items-center justify-center w-[3rem] h-[3rem] bg-white rounded-[0.5rem]`}>
        <CalendarDaysIcon width={24} height={24} className=""/>
    </div>
  )
}

export default MapDateSelections