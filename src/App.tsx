import { useEffect } from 'react';
import { csv } from "d3";
import { signal } from '@preact/signals-react'
import { HashRouter, Route, Routes } from 'react-router-dom';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import DownloadPage from './pages/DownloadPage';

export const nta_dataset_info = signal<any[]>([])

function App() {
  useEffect(() => {
    document.title = 'NYC Urban Heat Portal'
    // ${import.meta.env.BASE_URL}
    csv(`/datasets.csv`).then(rows => {
      nta_dataset_info.value = rows
    })
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