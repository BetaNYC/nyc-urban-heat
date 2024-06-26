
import { ArrowDownTrayIcon, CalendarDaysIcon } from "@heroicons/react/24/outline"
import { useMediaQuery } from "react-responsive"



type Props = {
    title?: string
    hasTitle?: boolean
    source: string
    content: string
    hasDate?: boolean
    hasYear?: boolean
    hasStation?: boolean
    hasDistrict?: boolean
    date?: string
}

const DatasetDownloadRow = ({ title, hasTitle, hasYear, hasStation, hasDistrict, source, content, hasDate }: Props) => {

    const isDesktop = useMediaQuery({
        query: '(min-width: 1280px)'
    })
    const isTablet = useMediaQuery({
        query: '(min-width: 768px)'
    })

    const isMobile = useMediaQuery({
        query: '(max-width: 768px)'
    })



    return (
        <div className="w-[90%] ">
            <div className={`md:flex mb-10`}>
                <div className={`mb-5 md:w-[55%]`}>
                    {hasTitle && <h3 className="mb-2 font-semibold text-subheadline">{title}</h3>}
                    <p className="font-light text-small">
                        <a href="">{source}</a> | date <br />
                        <p className="">
                            {content}
                        </p>
                    </p>
                </div>
                <div className="flex-1 flex md:justify-end gap-[1.875rem] ">
                    {hasDate &&
                        <div className="md:w-[40%]">
                            <h3 className="mb-2  font-semibold text-small">Date</h3>
                            <div className="relative">
                                <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                <select
                                    name="Date"
                                    defaultValue=""
                                    className="pl-10 h-8 w-full font-semibold text-small border-[1px] border-[#4F4F4F] rounded-[0.25rem]"
                                >
                                    <option value="" disabled hidden>
                                        09/02/2023
                                    </option>
                                    <option value="1"> 09/02/2023</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3</option>
                                </select>
                            </div>
                        </div>
                    }
                    {
                        hasYear &&
                        <div className="w-[40%]">
                            <h3 className="mb-2 font-semibold text-small">Date</h3>
                            <select name="Date" id="" className="pl-3  h-8 w-[100%] font-semibold text-small border-[1px] border-[#4F4F4F] rounded-[0.25rem]">
                                <option value="">2023</option>
                            </select>
                        </div>
                    }
                    {
                        hasStation &&
                        <div className="w-[40%]">
                            <h3 className="mb-2 font-semibold text-small">Date</h3>
                            <select name="Date" id="" className="pl-3  h-8 w-[100%] font-semibold text-small border-[1px] border-[#4F4F4F] rounded-[0.25rem]">
                                <option value="">Station Name D8569</option>
                            </select>
                        </div>
                    }
                    {
                        hasDistrict &&
                        <div className="w-[40%]">
                            <h3 className="mb-2 font-semibold text-small">Date</h3>
                            <select name="Date" id="" className="pl-3  h-8 w-[100%] font-semibold text-small border-[1px] border-[#4F4F4F] rounded-[0.25rem]">
                                <option value="">Manhattan CD1</option>
                            </select>
                        </div>
                    }
                    <div>
                        <h3 className="mb-2 font-semibold text-small">Download File</h3>
                        <div className="flex cursor-pointer">
                            <select name="Date" id="" className="py-1 pr-3 font-regular text-xsmall border-[1px] border-[#4F4F4F] rounded-l-[0.25rem]">
                                <option value="">.geojson</option>
                            </select>
                            <div className="flex items-center justify-center w-8 h-8 bg-[#4F4F4F] border-[1px] border-[#4F4F4F] rounded-r-[0.25rem]">
                                <ArrowDownTrayIcon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DatasetDownloadRow