import Nav from "../components/Nav"
import DatasetDownloadRow from "../components/DatasetDownloadRow"
import { datasets } from "../utils/datasets"

const DownloadPage = () => {

  return (
    <>
      <Nav />
      <div className="flex justify-center pt-4">
        <div className="container px-5">
          <div className="">
            <h1 className="mb-2 font-semibold text-headline">Download NYC Urban Heat Data</h1>
            <p className="font-light text-small max-w-[55rem]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore nemo unde magni repellat nesciunt magnam dignissimos temporibus distinctio consequuntur ab minima, explicabo rerum atque facere nisi molestiae eaque repudiandae voluptates.</p>
          </div>
          <div className="m-auto mt-[10.5rem] mb-4 container h-[1px] bg-black"></div>
          <div>
            <h1 className="mb-6 font-semibold text-headline">NYC Urban Heat Datasets</h1>
            <DatasetDownloadRow
              dataset={datasets.find(d=> d.name === 'Surface Temperature')}
            />

          </div>
          <div className="m-auto mt-[10.5rem] mb-4 container h-[1px] bg-black"></div>
          <div>
            <h1 className="mb-6 font-semibold text-headline">Weather Station Profiles</h1>
            {/* <div>
              <DatasetDownloadRow
                options={datasets?.['Weather Station Profiles'] ?? {}}
                source="[data source]"
                content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                hasStation={true}
              /> */}
          </div>
          <div className="m-auto mt-[10.5rem] mb-4 container h-[1px] bg-black"></div>
          <div className="mb-[6.25rem]">
            <h1 className="mb-6 font-semibold text-headline">Neighborhood Profiles</h1>
            {/* <DatasetDownloadRow
              options={datasets?.['Community District Profiles'] ?? {}}
              source="[data source]"
              content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              hasDistrict={true}
            /> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default DownloadPage