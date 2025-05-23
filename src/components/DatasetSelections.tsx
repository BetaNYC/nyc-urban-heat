import { useState, useRef, useEffect } from 'react'
import { map, selectedDataset, isNeighborhoodProfileExpanded, isDataSelectionExpanded } from '../pages/MapPage'
import DatasetSelectionOption from './DatasetSelectionOption'

import { Dataset, ViewOptions, datasets, initializeView } from '../utils/datasets'
import { group } from 'd3-array';
import { ChevronUpIcon, ChevronDownIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid'
import InformationCircle from './InformationCircle';

import { Link } from 'react-router-dom';

const datasetsForMap = datasets.filter(d => Object.keys(d.views).length > 0);
const groupedDataset = group(datasetsForMap, d => d.group)

const DatasetSelections = () => {
  const destroyCallbackRef = useRef<any>(null);

  const handleDatasetChange = (e: React.MouseEvent<HTMLDivElement>, dataset: Dataset) => {
    e.stopPropagation()
    if (!dataset.currentView) {
      dataset.currentView = Object.keys(dataset.views)[0]
    }

    selectedDataset.value = dataset
    isNeighborhoodProfileExpanded.value = false

    initializeView(dataset, map.value).then(dataset => {
      selectedDataset.value = { ...dataset }
    })
  }

  const handleViewChange = (e: React.MouseEvent<HTMLDivElement>, dataset: Dataset) => {
    e.stopPropagation()
    // swap views
    if (dataset.currentView) {
      const views = Object.keys(dataset.views)
      const currentViewIndex = views.indexOf(dataset.currentView)
      if (currentViewIndex < views.length - 1) {
        dataset.currentView = views[1]
      } else {
        dataset.currentView = views[0]
      }

      initializeView(dataset, map.value).then(dataset => {
        selectedDataset.value = { ...dataset }
      })
    }
  }

  return (
    <div className={`absolute left-6 top-[4.625rem] w-[20rem] ${!isDataSelectionExpanded.value ? "h-[3.5rem] overflow-hidden" : "max-h-[60%] overflow-y-auto"} bg-[#1B1B1B] rounded-lg drop-shadow-lg z-[999] cursor-pointer`}    >
      <div className='flex justify-between items-center px-5 h-[3.5rem] sticky top-0 bg-[#1B1B1B] z-[1000]' onClick={() => isDataSelectionExpanded.value = !isDataSelectionExpanded.value}>
        <div className="flex items-center gap-3 ">
          {
            selectedDataset.value && <img src={selectedDataset.value?.icon} alt="" className="w-6 h-6 text-[#BDBDBD]" />
          }
          <h2 className={`font-medium text-regular text-[#F2F2F2]`}>{!isDataSelectionExpanded.value ? selectedDataset.value?.name : 'Urban Heat Data'}</h2>
        </div>
        {isDataSelectionExpanded.value ? <ChevronUpIcon width={20} height={20} className='text-[#BDBDBD]' />
          : <ChevronDownIcon width={20} height={20} className='text-[#BDBDBD]' />}
      </div>
      {
        isDataSelectionExpanded.value && (
          <>
            <div className='h-[calc(100%_-_7.25rem)] overflow-y-auto overflow-hidden scrollbar'>

              {Array.from(groupedDataset).map(([category, values]) => (
                <div key={`ds-cat-${category}`}>
                  {category !== '' ?
                    <div className='px-5 w-[20rem] flex justify-between items-center'>
                      <h3 className="pt-3 pb-1 text-regular text-[#BDBDBD]">{category}</h3>
                      {category === "Static Factors" ? <InformationCircle size='small' content='stable based on the built environment'/> : <InformationCircle size='small' content='variable due to changes wind direction changes, these layers are dependent on'/>}            

                    </div>

                    : ''}
                  <>
                    {values.map((dataset: Dataset) => <DatasetSelectionOption
                      key={`ds-${dataset.name}`}
                      dataset={dataset}
                      handleDatasetChange={handleDatasetChange}
                      handleViewChange={handleViewChange}
                    />)}
                  </>
                </div>
              ))}

            </div>
            <div className='sticky bottom-0 py-4  w-full  bg-[#1B1B1B]'>
              <Link to="/download" className='flex justify-between items-center px-2 py-6 m-auto w-[calc(100%_-_40px)] h-8 bg-[#4F4F4F] rounded-[0.25rem] cursor-pointer ' onClick={() => isDataSelectionExpanded.value = true}>
                <div className='font-bold text-regular text-[#F2F2F2]'>Download dataset(s)</div>
                <ArrowDownTrayIcon width={18} height={18} className='text-[#F2F2F2]' />
              </Link>
            </div>

          </>
        )
      }
    </div>
  )
}

export default DatasetSelections