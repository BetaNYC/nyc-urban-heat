
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/20/solid"

const DatasetDownloadPopup = () => {
    return (
        <div className="absolute top-[calc(50%_-_17rem)] left-[calc(50%_-_17.5rem)] flex flex-col gap-8 items-center p-6 w-[35rem] h-[34rem] bg-[#F2F2F2] z-99 overflow-y-scroll">
            <div className="flex items-center justify-between w-full">
                <div>
                    <div className="font-bold text-[1.5rem] text-[#333]">
                        Download Datasets
                    </div>
                    <div className="font-regular text-[0.75rem]  text-[#333]">
                        Map layers currently visible
                    </div>
                </div>
                <div className="flex justify-center items-center w-[1.5rem] h-[1.5rem] bg-white rounded-full">
                    <XMarkIcon width={14} height={14} className="font-bold" />
                </div>
            </div>
            <div>
                <button className="flex items-center justify-center w-8 h-8 bg-[#4F4F4F] border-[1px] border-[#4F4F4F] rounded-r-[0.25rem]">
                    <ArrowDownTrayIcon className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    )
}

export default DatasetDownloadPopup