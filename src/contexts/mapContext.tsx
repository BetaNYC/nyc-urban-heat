import { createContext, useState, Dispatch, SetStateAction, ReactNode } from "react";


import mapboxgl from 'mapbox-gl';


export type MapContextType = {
    map: mapboxgl.Map | null,
    setMap: Dispatch<SetStateAction<mapboxgl.Map | null>>
}



type Props = {
    children: ReactNode
}

const MapContext = createContext<MapContextType | null>(null)

const MapProvider = ({ children }: Props) => {

    const [map, setMap] = useState<mapboxgl.Map | null>(null)



    return <MapContext.Provider value={{ map, setMap}} >
        {children}
    </MapContext.Provider>
}

export { MapContext, MapProvider }