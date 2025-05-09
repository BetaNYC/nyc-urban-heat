import { useState } from "react"
import Nav from "../components/Nav"
import DatasetDownloadRow from "../components/DatasetDownloadRow"
import { datasets } from "../utils/datasets"
import Banner from "../components/Banner"
import { useGtagPageView } from '../hooks/useGtagPageView';

const DownloadPage = () => {
  useGtagPageView()
  const tags = ['Dataset']

  const [clickedIndex, setClickedIndex] = useState<string>(tags[0]);
  return (
    <>
      <Nav />
      <Banner title="Download" tags={["Dataset"]} clickedIndex={clickedIndex}
        setClickedIndex={setClickedIndex} content="Download the data visualized the NYC Urban Heat Portal for further research and analysis." />
      <div className="flex justify-center pt-8">
        <div className="container px-5">
          <div>
            <h1 className="mb-6 font-semibold text-headline">NYC Urban Heat Datasets</h1>
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'Outdoor Heat Exposure Index')}
              hasMulti={true}
            />
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'Mean Radiant Temperature')}
            />
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'Surface Temperature')}
            />
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'Tree Canopy')}
            />
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'Cool Roofs')}
            />
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'Permeable Surfaces')}
            />
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'Air Temperature')}
            />
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'Air Heat Index')}
            />
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'All NTA-Level Urban Heat Portal Data')}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default DownloadPage