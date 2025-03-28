
import { ArrowDownTrayIcon, CalendarDaysIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { Dataset, DownloadUrl } from "../utils/datasets"
import { formatDateString } from "../utils/format"

type Props = {
    dataset: Dataset | undefined
    hasMulti?: boolean
}

const DatasetDownloadRow = ({ dataset, hasMulti }: Props) => {
    const [urls, setUrls] = useState<DownloadUrl[]>([])
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedFormat, setSelectedFormat] = useState('')

    // get unique date options and sort date
    const dateOptions = [...new Set(urls.sort((a, b) => {
        return parseInt(b.date ?? '') - parseInt(a.date ?? '');
    }).map(d => d.date).filter(d => d))]

    // get unique file formats
    const formatOptions = [...new Set(urls.map(d => d.format))]

    if (!dataset) return 'error'

    useEffect(() => {
        if (dataset.getDownloadUrls) {
            dataset.getDownloadUrls().then(downloadUrls => {
                setUrls(downloadUrls)
            })
        }
    }, [])

    useEffect(() => {
        // update the selectedFormat and selectedDate, when the urls list gets updated
        setSelectedDate(dateOptions.at(0) ?? '')
        setSelectedFormat(formatOptions.at(0) ?? '')
    }, [urls])



    const downloadFile = (urls: DownloadUrl[], selectedDate: string, selectedFormat: string, filename?: string) => {

        const download = urls.find((url: any) => {
            if (selectedDate !== '') {
                // compare dates and format
                return url.date === String(selectedDate) && url.format === selectedFormat
            } else {
                return url.format === selectedFormat
            }
        })

        if (download) {
            const format = download.url.split('.').at(-1)
            const a = document.createElement('a');
            a.target = '_blank'
            if (format === "csv") {
                fetch(download.url)
                    .then(res => {
                        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
                        return res.blob()
                    })
                    .then(blob => {
                        const blobUrl = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = blobUrl
                        a.download = 'Outdoor Heat Exposure Index.csv'
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(blobUrl)
                    })
            } else {
                // if (format === 'geojson') {
                //     a.href = '';
                //     a.download = download.url
                // } else {
                // }
                a.href = download.url;
                a.download = filename ?? 'file.' + format;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

        } else {
            alert('Issue with download')
        }


    }

    // datasets that are external 
    // if (dataset.externalUrl) {
    //     return (
    //         <div className={`md:flex mb-5 `}>
    //             <div className={`flex gap-[1.875rem] mb-5 md:w-[55%]`}>
    //                 <div className="w-[120px] h-[120px] text-center bg-[#DCDCDC]"></div>
    //                 <div className="flex-1">
    //                     <h3 className="mb-2 font-semibold text-subheadline">{dataset.name}</h3>
    //                     <div className="font-light text-small">
    //                         {/* @ts-ignore */}
    //                         <p >{dataset.externalSource}</p><br />
    //                         <p className="">
    //                             {dataset.info}
    //                         </p>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className={`md:flex mb-5 `}>
            <div className={`flex gap-[1.875rem] mb-5 md:w-[70%]`}>
                {/* <div className="w-[170px] h-[124px] text-center bg-[#BDBDBD]"> */}
                <img src={dataset.thumbnail} alt="" className="w-[120px] h-[120px]" />

                {/* </div> */}
                <div className="flex-1">
                    <h3 className="mb-2 font-semibold text-subheadline">{dataset.name}</h3>
                    <div className="font-light text-small text-black">
                        <p  className="font-bold ">{dataset.externalSource?.citation} <span className="font-bold text-black"> | {dataset.externalSource?.year}</span></p>
                        <div className="mt-2">
                        {dataset.description.intro}
                        </div>
                        <div className="mt-2">
                            <h3 className="font-bold">Methodology</h3>
                            {dataset.description.method}
                        </div>
                        <div className="mt-2">
                            <h3 className="font-bold">Use Case</h3>
                            {dataset.description.case}
                        </div>
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
                    <div className="flex">
                        {hasMulti ?
                            <select name="FileFormat"
                                id=""
                                value={selectedFormat}
                                onChange={e => setSelectedFormat(e.target.value)}
                                className=" pl-1 pr-3 py-1 font-regular text-xsmall border-[1px] border-[#4F4F4F] rounded-l-[0.25rem] cursor-pointer">
                                {formatOptions.map(key => <option key={key} value={key}>{key}</option>)}
                            </select> :
                            <div className="flex justify-start items-center pl-1 pr-3 py-1  font-regular  text-xsmall border-[1px] border-[#4F4F4F] rounded-l-[0.25rem]">
                                tiff
                            </div>
                        }
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