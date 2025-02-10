import { useEffect } from 'react';
import { csv } from "d3";
import { signal } from '@preact/signals-react'
import { HashRouter, Route, Routes } from 'react-router-dom';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import DownloadPage from './pages/DownloadPage';

export const nta_dataset_info = signal<any[]>([])
export const out_door_heat_index = signal<any[]>([])

function App() {
  useEffect(() => {
    document.title = 'NYC Urban Heat Portal'
    // ${import.meta.env.BASE_URL}
    Promise.all([
      csv("/datasets.csv"),
      csv("/NTA_Outdoor_Heat_Index.csv")
    ]).then(([ntaRows, heatIndexRows]) => {

      out_door_heat_index.value = heatIndexRows;

      const filteredOutDoorHeatIndex = heatIndexRows.map(({ ntacode, ntaname, Outdooor_Heat_Volnerability_Index }) => ({
        ntacode,
        ntaname,
        Outdooor_Heat_Volnerability_Index
      }));

      const filterRelativeSurfaceTemp = heatIndexRows.map(({ ntacode, ntaname, Relative_ST_Average}) => ({
        ntacode,
        ntaname,
        Relative_ST_Average
      }));



      // console.log("Outdoor Heat Index:", out_door_heat_index.value);
      const heatVulnerabilityMap = new Map(
        filteredOutDoorHeatIndex.map(item => [item.ntacode, item.Outdooor_Heat_Volnerability_Index])
      );

      const relativeSurfaceTemperatureMap = new Map(
        filterRelativeSurfaceTemp.map(item => [item.ntacode, item.Relative_ST_Average])
      )

      const OutDoorHeatIndexData = {
        "": "33",
        "metric": "Outdooor_Heat_Volnerability_Index",
        "date": "",
        "type": "",
        "downloads": "",
        "downloads_2": "",
      };
    
      const relativeSurfaceTemperatureData = {
        "": "34",
        "metric": "Relative_ST_Average",
        "date": "",
        "type": "",
        "downloads": "",
        "downloads_2": "",
      }

      Object.keys(ntaRows[0]).forEach(ntacode => {
        if (!["", "metric", "date", "type", "downloads", "downloads_2"].includes(ntacode)) {
              //@ts-ignore
          OutDoorHeatIndexData[ntacode] = +heatVulnerabilityMap.get(ntacode) || null;
        }
        if (!["", "metric", "date", "type", "downloads", "downloads_2"].includes(ntacode)) {
              //@ts-ignore
          relativeSurfaceTemperatureData[ntacode] = +relativeSurfaceTemperatureMap.get(ntacode) || null;
        }

      });

      ntaRows.push(OutDoorHeatIndexData, relativeSurfaceTemperatureData)
      nta_dataset_info.value = ntaRows;




      // console.log("NTA Dataset:", nta_dataset_info.value);


      // 這裡可以執行合併數據的邏輯
    });


  }, [])


  return (
    <main className='w-[100vw] h-[100vh] overflow-x-hidden overflow-y-scroll'>
      <HashRouter>
        <Routes>
          <Route path='/' element={<MapPage />} />
          <Route path='/resources' element={<ResourcesPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/download' element={<DownloadPage />} />
        </Routes>
      </HashRouter>
    </main>
  );
}

export default App;