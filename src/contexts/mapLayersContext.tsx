import { createContext, useState, Dispatch, SetStateAction, ReactNode } from "react";


export type mapLayersContextType = {

}


type Props = {
    children: ReactNode
}

const MapLayersContext = createContext<mapLayersContextType | null>(null)

const MapLayersProvider = ({ children }: Props) => {


    return <MapLayersContext.Provider value={{}} >
        {children}
    </MapLayersContext.Provider>
}

export {MapLayersContext, MapLayersProvider}