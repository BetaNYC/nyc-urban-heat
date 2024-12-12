import Nav from "../components/Nav"
import DatasetDownloadRow from "../components/DatasetDownloadRow"
import { datasets } from "../utils/datasets"
import Banner from "../components/Banner"

const DownloadPage = () => {

  return (
    <>
      <Nav />
      <Banner title="Download" tags={["Dataset", "Data Profile"]}/>
      <div className="flex justify-center pt-8">
        <div className="container px-5">
          <div>
            <h1 className="mb-6 font-semibold text-headline">NYC Urban Heat Datasets</h1>
            <DatasetDownloadRow
              dataset={datasets.find(d => d.name === 'Mean Radiant Temperature')}
            />
            <DatasetDownloadRow
              // hasDate={true}
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
          </div>
        </div>
      </div>
    </>
  )
}

export default DownloadPage