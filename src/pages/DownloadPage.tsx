import Nav from "../components/Nav"
import DatasetDownloadRow from "../components/DatasetDownloadRow"
import { useEffect, useState } from "react"

const DownloadPage = () => {
  const [datasets, setDatasets] = useState(null)

  // todo - setup DatasetDownloadRow[] to loop over items with thumbnails and other details

  useEffect(() => {
    fetch('https://urban-heat-files.s3.amazonaws.com/datasets.json').then(res => res.json()).then(datasets => setDatasets(datasets))
  }, [])

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
              title="Outdoor Heat Exposure Index"
              hasTitle={true}
              options={datasets?.['Outdoor Heat Exposure Index'] ?? {}}
              source="[data source]"
              content="The Heat Vulnerability Index (HVI) shows community districts that are more at risk for dying during and immediately following extreme heat."
            />
            <DatasetDownloadRow
              title="Air Temperature"
              hasTitle={true}
              options={datasets?.['Air Temperature'] ?? {}}
              source="[data source]"
              content="Air temperature is a measure of how hot or cold the air is. It is the most commonly measured weather parameter."
            />
            <DatasetDownloadRow
              title="Air Heat Index"
              options={datasets?.['Air Heat Index'] ?? {}}
              hasTitle={true}
              source="[data source]"
              content="Air Heat Index is what the temperature feels like to the human body when relative humidity is combined with the air temperature.  This has important considerations for the human body's comfort."
            />
            <DatasetDownloadRow
              title="Cool Roofs"
              options={datasets?.['Cool Roofs'] ?? {}}
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
              options={datasets?.['Surface Temperature'] ?? {}}
              hasTitle={true}
              source="[data source]"
              content="Surface Temperature indicates how hot the “surface” of the Earth would feel to the touch in a particular location (i.e. building roofs, grass, tree canopy, etc.). Surface temperature is not the same as the air temperature in the daily weather report."
            />
            <DatasetDownloadRow
              title="Tree Canopies"
              options={datasets?.['Tree Canopies'] ?? {}}
              hasTitle={true}
              source="[data source]"
              content="Urban tree canopy (UTC) shows areas where leaves, branches, and stems of trees cover the ground, when viewed from above. UTC reduces the urban heat island effect, reduces heating/cooling costs, lowers air temperatures, reduces air pollution."
            />
            <DatasetDownloadRow
              title="Weather Stations"
              options={datasets?.['Weather Stations'] ?? {}}
              hasTitle={true}
              source="[data source]"
              content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            />
            <DatasetDownloadRow
              title="Download All Datasets"
              options={datasets?.['Download All Datasets'] ?? {}}
              hasTitle={true}
              source="[data source]"
              content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            />
          </div>
          <div className="m-auto mt-[10.5rem] mb-4 container h-[1px] bg-black"></div>
          <div>
            <h1 className="mb-6 font-semibold text-headline">Weather Station Profiles</h1>
            <div>
              <DatasetDownloadRow
                options={datasets?.['Weather Station Profiles'] ?? {}}
                source="[data source]"
                content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                hasStation={true}
              />
            </div>
          </div>
          <div className="m-auto mt-[10.5rem] mb-4 container h-[1px] bg-black"></div>
          <div className="mb-[6.25rem]">
            <h1 className="mb-6 font-semibold text-headline">Community District Profiles</h1>
            <DatasetDownloadRow
              options={datasets?.['Community District Profiles'] ?? {}}
              source="[data source]"
              content="Dataset description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              hasDistrict={true}
            />
          </div>
        </div>
      </div>


    </>
  )
}

export default DownloadPage