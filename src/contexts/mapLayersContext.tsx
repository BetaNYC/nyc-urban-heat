import { createContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

export type LayersType =
    "Outdoor Heat Exposure Index"
    | "Air Temperature"
    | "Air Heat Index"
    | "Mean Radiant Temperature"
    | "Surface Temperature"
    | "Weather Stations"
    | "Tree Canopy"
    | "Cool Roofs"
    | "Premeable Surfaces"
    | "Parks"

export type MapLayersContextType = {
    layer: LayersType | null,
    setLayer: Dispatch<SetStateAction<LayersType | null>>
}


type Props = {
    children: ReactNode
}

const MapLayersContext = createContext<MapLayersContextType | null>(null)

const MapLayersProvider = ({ children }: Props) => {

    const [layer, setLayer] = useState<LayersType | null>(null)


    return <MapLayersContext.Provider value={{ layer, setLayer }} >
        {children}
    </MapLayersContext.Provider>
}

export { MapLayersContext, MapLayersProvider }