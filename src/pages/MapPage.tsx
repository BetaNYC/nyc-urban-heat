import { useEffect, useRef, useContext } from 'react'


import Nav from "../components/Nav"
import mapboxgl from "mapbox-gl"

import { MapContext, MapContextType } from "../contexts/mapContexts"


const MapPage = () => {

  const mapContainer = useRef<HTMLInputElement>(null)
  // const { setMap } = useContext(MapContext) as MapContextType

  useEffect(() => {

  })



  return (
    <div className='relative w-full h-full'>
      <Nav />
      <div className='w-full h-[calc(100%_-_3.125rem)]' ref={mapContainer} >

      </div>
    </div>

  )
}

export default MapPage