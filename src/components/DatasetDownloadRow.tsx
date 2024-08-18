
import { ArrowDownTrayIcon, CalendarDaysIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
// import { useMediaQuery } from "react-responsive"

interface Options {
    [key: string]: {
        [key: string]: string
    }
}

type Props = {
    title?: string
    hasTitle?: boolean
    source: string
    content: string
    options: Options
    hasStation?: boolean
    hasDistrict?: boolean
    date?: string
}

const DatasetDownloadRow = ({ title, options, hasTitle, hasStation, hasDistrict, source, content }: Props) => {

    // const isDesktop = useMediaQuery({
    //     query: '(min-width: 1280px)'
    // })
    // const isTablet = useMediaQuery({
    //     query: '(min-width: 768px)'
    // })

    // const isMobile = useMediaQuery({
    //     query: '(max-width: 768px)'
    // })
    const optionsKeys = Object.keys(options)

    if (optionsKeys.length === 0) {
        return (
            <div className={`md:flex mb-10 `}>
                <div className={`flex gap-[1.875rem] mb-5 md:w-[55%]`}>
                    <div className="w-[120px] h-[120px] text-center bg-[#DCDCDC]"></div>
                    <div className="flex-1">
                        {hasTitle && <h3 className="mb-2 font-semibold text-subheadline">{title}</h3>}
                        <div className="font-light text-small">
                            <a href="">{source}</a> | date <br />
                            <p className="">
                                {content}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const hasDateInKeys = !!optionsKeys.find(d => d.startsWith('20'))
    // when options has more than key and at least one element starts with 20
    const hasDate = optionsKeys.length > 1 && hasDateInKeys

    const [selectedOption, setSelectedOption] = useState(optionsKeys[0])
    useEffect(() => {
        setSelectedFormat(Object.keys(options[selectedOption])[0])
    }, [selectedOption])

    const [selectedFormat, setSelectedFormat] = useState('')

    function formatDate(dateString: string) {
        if (dateString.length === 4) { // Year
            return dateString
        }
        const date = new Date(
            parseInt(dateString.slice(0, 4)), // Year
            parseInt(dateString.slice(4, 6)) - 1, // Month (0-indexed)
            parseInt(dateString.slice(6, 8)) // Day
        );
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    function downloadFile() {
        let url = options[selectedOption][selectedFormat]
        let filename = url.split('/').pop()
        if (!url.startsWith('https://')) {
            // add base url 
            url = 'https://urban-heat-files.s3.amazonaws.com/' + url
        }

        // check if vaild filename
        if (!filename?.endsWith('.' + selectedFormat)) {
            filename = `${title?.toLocaleLowerCase().replace(' ', '_')}${selectedOption === '_' ? '' : selectedOption}.${selectedFormat}`
        }

        const a = document.createElement('a');
        a.target = '_blank'
        if(selectedFormat === 'geojson'){
            a.href = '';
            a.download = url
        }else{
            a.href = url;
        }
        a.download = filename ?? 'file.' + selectedFormat;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        // <div className="container">
        <div className={`md:flex mb-10 `}>
            <div className={`flex gap-[1.875rem] mb-5 md:w-[55%]`}>
                <div className="w-[120px] h-[120px] text-center bg-[#DCDCDC]"></div>
                <div className="flex-1">
                    {hasTitle && <h3 className="mb-2 font-semibold text-subheadline">{title}</h3>}
                    <div className="font-light text-small">
                        <a href="">{source}</a> | date <br />
                        <p className="">
                            {content}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex md:justify-end gap-[1.875rem] ">
                {
                    hasDate &&
                    <div className="md:w-[40%]">
                        <h3 className="mb-2  font-semibold text-small">Date</h3>
                        <div className="relative">
                            <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                            <select
                                name="Date"
                                defaultValue=""
                                className="pl-10 h-8 w-full font-semibold text-small border-[1px] border-[#4F4F4F] rounded-[0.25rem]"
                                value={selectedOption}
                                onChange={e => setSelectedOption(e.target.value)}
                            >
                                {optionsKeys.sort((a, b) => {
                                    return parseInt(b) - parseInt(a);
                                }).map(key => <option key={key} value={key}>{formatDate(key)}</option>)}
                            </select>
                        </div>
                    </div>
                }
                {
                    !hasDate && optionsKeys.length > 1 &&
                    <div className="w-[40%]">
                        <h3 className="mb-2 font-semibold text-small">Weather Station</h3>
                        <select name="Date"
                            id=""
                            className="pl-3  h-8 w-[100%] font-semibold text-small border-[1px] border-[#4F4F4F] rounded-[0.25rem]"
                            value={selectedOption}
                            onChange={e => setSelectedOption(e.target.value)}>
                            {optionsKeys.map(key => <option key={key} value={key}>{key}</option>)}
                        </select>
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
                            {Object.keys(options[selectedOption]).map(key => <option key={key} value={key}>.{key}</option>)}
                        </select>
                        <button onClick={downloadFile}
                            className="flex items-center justify-center w-8 h-8 bg-[#4F4F4F] border-[1px] border-[#4F4F4F] rounded-r-[0.25rem]">
                            <ArrowDownTrayIcon className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        // </div>

    )
}

export default DatasetDownloadRow