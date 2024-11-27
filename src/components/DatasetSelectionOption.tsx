import React, { useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Dataset } from '../utils/datasets';
import { selectedDataset } from "../pages/MapPage";
import { computed } from '@preact/signals-react';
import InformationCircle from "./InformationCircle";

type Props = {
    dataset: Dataset,
    handleDatasetChange: (e: React.MouseEvent<HTMLDivElement>, dataset: Dataset) => void;
    handleViewChange: (e: React.MouseEvent<HTMLDivElement>, dataset: Dataset) => void;
}

const DatasetSelectionOption: React.FC<Props> = ({ dataset, handleDatasetChange, handleViewChange }) => {
    const [isInfoExpanded, setIsInfoExpanded] = useState(true);

    const handleInfoChange = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        setIsInfoExpanded(!isInfoExpanded);
    };

    const isDatasetSelected = computed(() => selectedDataset.value?.name === dataset.name);
    const currentViewSelected =  computed(() => {
        if(isDatasetSelected) return selectedDataset.value?.currentView
    });
    const viewNames = Object.keys(dataset.views);
    console.log(viewNames)

    return (
        <div
            className={`px-5 py-3 w-[20rem] ${isDatasetSelected.value ? 'bg-[#D9D9D9] text-[#4F4F4F]' : "hover:bg-[#6A6A6A] text-[#F2F2F2]"} cursor-pointer`}
            onClick={(e) => handleDatasetChange(e, dataset)}
        >
            <div className="flex justify-between items-center ">
                <div className="flex items-center gap-3">
                    <img src={dataset.icon} alt="" className="w-6 h-6 text-[#BDBDBD]" />
                    <h3 className={`text-regular ${isDatasetSelected.value ? "font-semibold" : ''}`}>{dataset.name}</h3>
                </div>
                {/* <ExclamationCircleIcon width={20} height={20}  onClick={handleInfoChange}/> */}
                <InformationCircle isActive={isDatasetSelected.value} clickHandler={handleInfoChange} size="big"/>
            </div>
            {isDatasetSelected.value && isInfoExpanded && (
                <div
                    title={dataset.info}
                    className="mt-2 ml-8 font-regular text-small"
                >
                    {dataset.info ?? 'Dataset info to be added.'}
                </div>
            )}
            {isDatasetSelected.value && viewNames.length === 2 && (
                <div className='flex items-center gap-3 mt-4 ml-8 font-semibold text-small'>
                    <div>{dataset.views[viewNames[0]].name}</div>
                    <div
                        className={`flex items-center ${currentViewSelected.value === viewNames[0] ? "justify-start bg-[#BDBDBD]" : "justify-end bg-[#BDBDBD] outline outline-1 outline-gray-300"}
                        transition-colors ease-in-out px-[2px] w-8 h-4 rounded-[20px]`}
                        onClick={e => handleViewChange(e, dataset)}
                    >
                        <div className='w-3 h-3 bg-[#4F4F4F] rounded-full'></div>
                    </div>
                    <div>{dataset.views[viewNames[1]].name}</div>
                </div>
            )}
        </div>
    );
};

export default DatasetSelectionOption