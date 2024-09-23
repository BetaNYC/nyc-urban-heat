import { useEffect } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import DownloadPage from './pages/DownloadPage';



function App() {
  useEffect(() => {
    document.title = 'NYC Urban Heat Portal'
  })

  return (
    <main className=' w-[100vw] h-[100vh] overflow-x-hidden overflow-y-scroll'>
      <BrowserRouter>
        <Routes>
          <Route path='/nyc-urban-heat/' element={<MapPage />} />
          <Route path='/nyc-urban-heat/resources' element={<ResourcesPage />} />
          <Route path='/nyc-urban-heat/about' element={<AboutPage />} />
          <Route path='/nyc-urban-heat/download' element={<DownloadPage />} />
        </Routes>
      </BrowserRouter>
    </main >
  );
}

export default App;
