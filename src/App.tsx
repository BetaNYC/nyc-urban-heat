import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import DownloadPage from './pages/DownloadPage';

function App() {
  useEffect(() => {
    document.title = 'NYC Urban Heat Portal'
  })

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