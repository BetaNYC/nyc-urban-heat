import Nav from "../components/Nav"
import DatasetDownloadRow from "../components/DatasetDownloadRow"

const DownloadPage = () => {
  return (
    <>
      <Nav />
      <div className="px-6 pt-4">
        <div className="">
          <h1 className="mb-2 font-semibold text-headline">Download NYC Urban Heat Data</h1>
          <p className="font-light text-small max-w-[55rem]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore nemo unde magni repellat nesciunt magnam dignissimos temporibus distinctio consequuntur ab minima, explicabo rerum atque facere nisi molestiae eaque repudiandae voluptates.</p>
        </div>
        <div className="m-auto mt-[10.5rem] mb-4 w-[calc(100vw_-_3rem)] h-[1px] bg-black"></div>
        <div>
          <h1 className="mb-4 font-semibold text-headline">NYC Urban Heat Datasets</h1>
          <DatasetDownloadRow
            title="NYC Heat Vulnerability Index"
            hasTitle={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            hasDate={true}
          />
          <DatasetDownloadRow
            title="Air Temperature"
            hasTitle={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            hasDate={true}
          />
          <DatasetDownloadRow
            title="Air Heat Index"
            hasTitle={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            hasDate={true}
          />
          <DatasetDownloadRow
            title="Cool Roofs"
            hasTitle={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
          <DatasetDownloadRow
            title="Cooling Centers"
            hasTitle={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
          <DatasetDownloadRow
            title="Disadvantaged Communities"
            hasTitle={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
          <DatasetDownloadRow
            title="Surface Temperature"
            hasTitle={true}
            hasYear={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
          <DatasetDownloadRow
            title="Tree Canopies"
            hasTitle={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
          <DatasetDownloadRow
            title="Weather Stations"
            hasTitle={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            hasDate={true}
          />
          <DatasetDownloadRow
            title="Download All Datasets"
            hasTitle={true}
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
        </div>
        <div className="m-auto mt-[6.25rem] mb-4 w-[calc(100vw_-_3rem)] h-[1px] bg-black"></div>
        <div>
          <h1 className="mb-2 font-semibold text-headline">Weather Station Profiles</h1>
          <div>
            <DatasetDownloadRow
              source="[data source]"
              content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              hasStation={true}
            />
          </div>
        </div>
        <div className="m-auto mt-[6.25rem] mb-4 w-[calc(100vw_-_3rem)] h-[1px] bg-black"></div>
        <div className="mb-[6.25rem]">
          <h1 className="mb-2 font-semibold text-headline">Community District Profiles</h1>
          <DatasetDownloadRow
            source="[data source]"
            content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            hasDistrict={true}
          />
        </div>
      </div>


    </>
  )
}

export default DownloadPage