import { useEffect } from 'react';

import Nav from './components/Nav';
import MapContainer from './components/MapContainer';
import LayerSelections from './components/LayerSelections';

function App() {

  useEffect(() => {
    document.title = 'NYC Urban Heat Portal'
  })

  return (
    <main className='relative w-[100vw] h-[100vh]'>
      <Nav />
      <MapContainer />
      <LayerSelections />
    </main>
  );
}

export default App;
