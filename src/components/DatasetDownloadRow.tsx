import { ArrowDownTrayIcon, CalendarDaysIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import { Dataset, DownloadUrl } from "../utils/datasets"
import { formatDateString } from "../utils/format"
import { nta_dataset_info } from "../App"

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
            console.log(`DatasetDownloadRow Effect for ${dataset.name}: nta_dataset_info.value length = ${nta_dataset_info.value?.length}`);
            dataset.getDownloadUrls().then(downloadUrls => {
                console.log(`DatasetDownloadRow Effect for ${dataset.name}: Fetched downloadUrls:`, downloadUrls);
                setUrls(downloadUrls)
            })
        }
    }, [dataset, nta_dataset_info.value])

    useEffect(() => {
        // update the selectedFormat and selectedDate, when the urls list gets updated
        const currentFormatOptions = [...new Set(urls.map(d => d.format))];
        const currentDateOptions = [...new Set(urls.map(d => d.date).filter(d => d).sort((a, b) => parseInt(b!) - parseInt(a!)))];

        setSelectedDate(currentDateOptions.at(0) ?? '');
        setSelectedFormat(currentFormatOptions.at(0) ?? '');
    }, [urls]);



    const downloadFile = (urls: DownloadUrl[], selectedDate: string, selectedFormat: string, datasetName: string) => {
        console.log(`downloadFile called for ${datasetName}:`, { selectedDate, selectedFormat, urls });

        let foundDownload: DownloadUrl | undefined;

        if (dateOptions.length > 0) { // Dataset is configured with dates
            if (selectedDate) { // A date is selected
                foundDownload = urls.find(url => url.date === selectedDate && url.format === selectedFormat);
            } else {
                console.warn(`Dated dataset (${datasetName}), but no date selected for download. This may lead to download issues.`);
                // Attempt to find based on format only as a fallback, though this might not be correct for dated sets
                foundDownload = urls.find(url => url.format === selectedFormat);
            }
        } else { // Dataset does not use dates (e.g., single TIFFs, new S3 zip file, OHEI without dates)
            foundDownload = urls.find(url => url.format === selectedFormat);
        }

        console.log(`For ${datasetName}, foundDownload is:`, foundDownload);

        if (foundDownload) {
            const actualFormat = foundDownload.format;
            const downloadUrl = foundDownload.url;

            // ***** START DIAGNOSTIC BLOCK for Mean Radiant Temperature *****
            // if (datasetName === "Mean Radiant Temperature") { // KEEPING THIS COMMENTED FOR NOW
            //     console.log(`[MRT DIAGNOSTIC] Attempting to fetch: ${downloadUrl}`);
            //     fetch(downloadUrl)
            //         .then(response => {
            //             console.log('[MRT DIAGNOSTIC] Fetch successful. Response object:', response);
            //             console.log(`[MRT DIAGNOSTIC] Response status: ${response.status} ${response.statusText}`);
            //             console.log('[MRT DIAGNOSTIC] Response headers:');
            //             response.headers.forEach((value, name) => {
            //                 console.log(`  ${name}: ${value}`);
            //             });
            //             if (!response.ok) {
            //                console.error(`[MRT DIAGNOSTIC] Network response was not ok for ${downloadUrl}. Status: ${response.status}`);
            //             }
            //             // We will not proceed to blob or download for this test
            //         })
            //         .catch(err => {
            //             console.error(`[MRT DIAGNOSTIC] Fetch error for ${downloadUrl}:`, err);
            //             // Also log if the error object has more details
            //             if (err.cause) console.error('[MRT DIAGNOSTIC] Error cause:', err.cause);
            //         });
            //     return; // IMPORTANT: Stop further execution for MRT for this test
            // }
            // ***** END DIAGNOSTIC BLOCK *****

            let filenameToUse;
            if (actualFormat === "csv" && datasetName === "Outdoor Heat Exposure Index") {
                filenameToUse = "Outdoor Heat Exposure Index.csv";
            } else if (selectedDate) {
                filenameToUse = `${datasetName}_${selectedDate}.${actualFormat}`;
            } else {
                filenameToUse = `${datasetName}.${actualFormat}`;
            }

            // Conditional download logic based on preferDirectDownload flag
            if (dataset.preferDirectDownload) {
                console.log(`Using direct download for ${datasetName}: ${downloadUrl}`);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filenameToUse;
                // a.target = '_blank'; // Consider if needed, can cause pop-up issues
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.log(`Using fetch/blob download for ${datasetName}: ${downloadUrl}`);
                fetch(downloadUrl)
                    .then(res => {
                        if (!res.ok) {
                            throw new Error(`Fetch failed for ${datasetName} (${actualFormat}): ${res.status} ${res.statusText}`);
                        }
                        return res.blob();
                    })
                    .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = filenameToUse;
                        a.type = blob.type;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(blobUrl);
                    })
                    .catch(err => {
                        console.error(`Download failed for ${datasetName}:`, err);
                        alert(`Failed to download ${filenameToUse}. Error: ${err.message}. Please check the console for more details.`);
                    });
            }
        } else {
            console.error("Download URL object not found for:", { datasetName, selectedDate, selectedFormat, availableUrls: urls });
            alert('The selected file could not be found for download. Please check your selections or report an issue if the problem persists.');
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
                        {dataset.description.method && (
                            <div className="mt-2">
                                <h3 className="font-bold">Methodology</h3>
                                {dataset.description.method}
                            </div>
                        )}
                        {dataset.description.case && (
                            <div className="mt-2">
                                <h3 className="font-bold">Use Case</h3>
                                {dataset.description.case}
                            </div>
                        )}
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
                        {hasMulti || formatOptions.length > 1 ?
                            <select name="FileFormat"
                                id=""
                                value={selectedFormat}
                                onChange={e => setSelectedFormat(e.target.value)}
                                className=" pl-1 pr-3 py-1 font-regular text-xsmall border-[1px] border-[#4F4F4F] rounded-l-[0.25rem] cursor-pointer">
                                {formatOptions.map(key => <option key={key} value={key}>{key}</option>)}
                            </select> :
                            <div className="flex justify-start items-center pl-1 pr-3 py-1  font-regular  text-xsmall border-[1px] border-[#4F4F4F] rounded-l-[0.25rem]">
                                {selectedFormat || 'N/A'} {/* Display actual selected format or N/A if none */}
                            </div>
                        }
                        <button onClick={() => downloadFile(urls, selectedDate, selectedFormat, dataset.name)}
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