import { useEffect } from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MapProvider } from './contexts/mapContext';
import { MapLayersProvider } from './contexts/mapLayersContext';

import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import DownloadPage from './pages/DownloadPage';



function App() {

  const queryClient = new QueryClient()

  useEffect(() => {
    document.title = 'NYC Urban Heat Portal'
  })

  return (
    <QueryClientProvider client={queryClient}>
      <main className=' w-[100vw] h-[100vh] overflow-x-hidden overflow-y-scroll'>
        <MapProvider>
          <MapLayersProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/nyc-urban-heat/' element={<MapPage />} />
                <Route path='/nyc-urban-heat/resources' element={<ResourcesPage />} />
                <Route path='/nyc-urban-heat/about' element={<AboutPage />} />
                <Route path='/nyc-urban-heat/download' element={<DownloadPage />} />
              </Routes>
            </BrowserRouter>
          </MapLayersProvider>
        </MapProvider>
      </main >
    </QueryClientProvider>
  );
}

export default App;
