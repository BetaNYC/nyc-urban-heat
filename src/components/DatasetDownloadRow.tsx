
import { ArrowDownTrayIcon, CalendarDaysIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { Dataset, DownloadUrl } from "../utils/datasets"
import { formatDateString } from "../utils/format"

type Props = {
    dataset: Dataset | undefined
    hasDate?: boolean
}

const DatasetDownloadRow = ({ dataset }: Props) => {
    const [urls, setUrls] = useState<DownloadUrl[]>([])
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedFormat, setSelectedFormat] = useState('')

    // get unique date options and sort date
    const dateOptions = [...new Set(urls.sort((a, b) => {
        return parseInt(b.date ?? '') - parseInt(a.date ?? '');
    }).map(d => d.date).filter(d => d))]

    console.log(dateOptions)

    // get unique file formats
    const formatOptions = [...new Set(urls.map(d => d.format))]

    if(!dataset) return 'error'

    useEffect(() => {
        if(dataset.getDownloadUrls){
            dataset.getDownloadUrls().then(downloadUrls => {
                console.log(downloadUrls)
                setUrls(downloadUrls)
            })
        }
    },[])

    useEffect(()=> {
        // update the selectedFormat and selectedDate, when the urls list gets updated
        setSelectedDate(dateOptions.at(0) ?? '')
        setSelectedFormat(formatOptions.at(0) ?? '')
    },[urls])



    const downloadFile = (urls: DownloadUrl[], selectedDate: string, selectedFormat: string, filename?: string) => {
        console.log(urls, selectedDate, selectedFormat)
        const download = urls.find((url: any) => {
            if(selectedDate !== ''){
                // compare dates and format
                return url.date === String(selectedDate) && url.format === selectedFormat
            }else{
                return url.format === selectedFormat
            }
        })

        if(download){
            const format = download.url.split('.').at(-1)
            const a = document.createElement('a');
            a.target = '_blank'
            if (format === 'geojson') {
                a.href = '';
                a.download = download.url
            } else {
                a.href = download.url;
            }
            a.download = filename ?? 'file.' + format;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }else{
            alert('Issue with download')
        }
    }

    // datasets that are external 
    if (dataset.externalUrl) {
        return (
            <div className={`md:flex mb-5 `}>
                <div className={`flex gap-[1.875rem] mb-5 md:w-[55%]`}>
                    <div className="w-[120px] h-[120px] text-center bg-[#DCDCDC]"></div>
                    <div className="flex-1">
                        <h3 className="mb-2 font-semibold text-subheadline">{dataset.name}</h3>
                        <div className="font-light text-small">
                            <a href={dataset.externalUrl}>{dataset.externalSource}</a><br />
                            <p className="">
                                {dataset.info}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`md:flex mb-5 `}>
            <div className={`flex gap-[1.875rem] mb-5 md:w-[55%]`}>
                <div className="w-[170px] h-[124px] text-center bg-[#BDBDBD]">
                    {/* <img src={dataset.icon} alt="" className="w-[120px] h-[120px] text-[#BDBDBD]" /> */}

                </div>
                <div className="flex-1">
                    <h3 className="mb-2 font-semibold text-subheadline">{dataset.name}</h3>
                    <div className="font-light text-small">
                        <a href={`${dataset.externalSource?.href}`} className="font-bold text-black">{dataset.externalSource?.citation}</a> <span className="font-bold text-black"> | {dataset.externalSource?.year}</span>
                        <p className="mt-2">
                            {dataset.info}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex md:justify-end gap-[1.875rem] ">
                {
                    dateOptions.length > 0 &&
                    <div className="md:w-[40%]">
                        <h3 className="mb-2  font-semibold text-small">Date</h3>
                        <div className="relative">
                            <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                            <select
                                name="Date"
                                defaultValue=""
                                className="pl-10 h-8 w-full font-semibold text-small border-[1px] border-[#4F4F4F] rounded-[0.25rem]"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                            >
                                {dateOptions.map(key => <option key={key} value={key}>{formatDateString(key ?? '')}</option>)}
                            </select>
                        </div>
                    </div>
                }
                <div>
                    <h3 className="mb-2 font-semibold text-small">Download File</h3>
                    <div className="flex cursor-pointer">
                        <select name="FileFormat"
                            id=""
                            value={selectedFormat}
                            onChange={e => setSelectedFormat(e.target.value)}
                            className="py-1 pr-3 font-regular text-xsmall border-[1px] border-[#4F4F4F] rounded-l-[0.25rem]">
                                {formatOptions.map(key => <option key={key} value={key}>{key}</option>)}
                            </select>
                        <button onClick={() => downloadFile(urls, selectedDate, selectedFormat)}
                            className="flex items-center justify-center w-8 h-8 bg-[#4F4F4F] border-[1px] border-[#4F4F4F] rounded-r-[0.25rem]">
                            <ArrowDownTrayIcon className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DatasetDownloadRow