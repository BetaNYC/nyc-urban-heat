import Nav from "../components/Nav"
import DatasetDownloadRow from "../components/DatasetDownloadRow"

const DownloadPage = () => {
  return (
    <>
      <Nav />
      <div className="px-5 pt-4">
        <div className="">
          <h1 className="mb-2 font-semibold text-headline">Download NYC Urban Heat Data</h1>
          <p className="font-light text-small max-w-[55rem]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore nemo unde magni repellat nesciunt magnam dignissimos temporibus distinctio consequuntur ab minima, explicabo rerum atque facere nisi molestiae eaque repudiandae voluptates.</p>
        </div>
        <div className="m-auto mt-[10.5rem] mb-4 w-[calc(100vw_-_3rem)] h-[1px] bg-black"></div>
        <div>
          <h1 className="mb-6 font-semibold text-headline">NYC Urban Heat Datasets</h1>
          <DatasetDownloadRow
            title="Outdoor Heat Exposure Index"
            hasTitle={true}
            source="[data source]"
            content="The Heat Vulnerability Index (HVI) shows community districts that are more at risk for dying during and immediately following extreme heat."
            hasDate={true}
          />
          <DatasetDownloadRow
            title="Air Temperature"
            hasTitle={true}
            source="[data source]"
            content="Air temperature is a measure of how hot or cold the air is. It is the most commonly measured weather parameter."
            hasDate={true}
          />
          <DatasetDownloadRow
            title="Air Heat Index"
            hasTitle={true}
            source="[data source]"
            content="Air Heat Index is what the temperature feels like to the human body when relative humidity is combined with the air temperature.  This has important considerations for the human body's comfort."
            hasDate={true}
          />
          <DatasetDownloadRow
            title="Cool Roofs"
            hasTitle={true}
            source="[data source]"
            content="Cool roofs absorb and transfer less heat from the sun to the building compared with a more conventional roof. Buildings with cool roofs use less air conditioning, save energy, and have more comfortable indoor temperatures. Cool roofs also impact surrounding areas by lowering temperatures outside of buildings and thus mitigating the heat island effect."
          />
          {/* <DatasetDownloadRow
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
          /> */}
          <DatasetDownloadRow
            title="Surface Temperature"
            hasTitle={true}
            hasYear={true}
            source="[data source]"
            content="Surface Temperature indicates how hot the “surface” of the Earth would feel to the touch in a particular location (i.e. building roofs, grass, tree canopy, etc.). Surface temperature is not the same as the air temperature in the daily weather report."
          />
          <DatasetDownloadRow
            title="Tree Canopies"
            hasTitle={true}
            source="[data source]"
            content="Urban tree canopy (UTC) shows areas where leaves, branches, and stems of trees cover the ground, when viewed from above. UTC reduces the urban heat island effect, reduces heating/cooling costs, lowers air temperatures, reduces air pollution."
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
          <h1 className="mb-6 font-semibold text-headline">Weather Station Profiles</h1>
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
          <h1 className="mb-6 font-semibold text-headline">Community District Profiles</h1>
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