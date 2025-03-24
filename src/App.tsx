import { useState, useEffect } from 'react';
import { csv } from "d3";
import { signal } from '@preact/signals-react'
import { HashRouter, Route, Routes } from 'react-router-dom';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import DownloadPage from './pages/DownloadPage';


export const nta_dataset_info = signal<any[]>([])
export const out_door_heat_index = signal<any[]>([])
export const air_temp_nta = signal<any[]>([])
// export const air_temp_raster = signal<any[]>([])

function App() {

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });


  useEffect(() => {
    document.title = 'NYC Urban Heat Portal'
    // ${import.meta.env.BASE_URL}
    Promise.all([
      csv("/datasets.csv"),
      csv("/NTA_Outdoor_Heat_Index.csv"),
      csv("/air_temp_nta.csv"),
      csv("/air_temp_raster.csv")
    ]).then(([ntaRows, heatIndexRows, airTempNTA ]) => {


      const ntaCodeMap = Object.fromEntries(
        heatIndexRows.map(row => [row.NTA_Unq_ID, row.ntacode])
      );

      const ntaCodedAirTempNTA = airTempNTA.map(row => ({
        ...row,
        ntacode: ntaCodeMap[row.NTA_Unq_ID] || ""
      }));

      const aggregatedData: Record<string, Record<string, string>> = {};


    ntaCodedAirTempNTA.forEach(ntaData => {
        const ntacode = ntaData.ntacode; // 取得該 NTA 的 ntacode
    
        Object.entries(ntaData)
            .filter(([key]) => key.startsWith("Air_temp_raster_") || key.startsWith("Air_Heat_Index_outputs"))
            .forEach(([key, value]) => {
                const type = key.startsWith("Air_temp_raster_") ? "air_temp" : "air_heat_index";
                const date = key.replace("Air_temp_raster_", "").replace("Air_Heat_Index_outputs", "");
                const downloads = `https://urban-heat-portal-tiles.s3.us-east-1.amazonaws.com/${key}.tif`
      
                // 如果這個 metric 尚未在 aggregatedData 創建，則初始化
                if (!aggregatedData[key]) {
                    aggregatedData[key] = {
                        "": "10",
                        metric: key,
                        date,
                        type,
                        downloads,
                        downloads_2: "tda"
                    };
                }
    
                // 把該 NTA 的值放到對應的 metric object
                aggregatedData[key][ntacode] = value || "";
            });
    });
    
    const airTemperatureData = Object.values(aggregatedData);
    
    

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

      ntaRows.push(OutDoorHeatIndexData, relativeSurfaceTemperatureData, ...airTemperatureData);
      nta_dataset_info.value = ntaRows;




      // console.log("NTA Dataset:", nta_dataset_info.value);


    });


  }, [])

  useEffect(() => {

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
      {
          (windowSize.width < 820) &&
          <div className='absolute top-0 left-0 flex justify-center items-center w-full h-full leading-[1.2] font-bold text-headline text-white bg-[#1B1B1B] z-[1000000]'>
            This website is best viewed on desktop
          </div>
        }
    </main>
  );
}

export default App;