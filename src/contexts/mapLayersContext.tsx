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

export type LayerDataType = {
    "Outdoor Heat Exposure Index": 'nta' | 'raw',
    "Weather Stations": 'nta' | 'raw',
    "Air Temperature": 'nta' | 'raw',
    "Air Heat Index": 'nta' | 'raw',
    "Mean Radiant Temperature": 'nta' | 'raw',
    "Surface Temperature": 'nta' | 'raw',
    "Tree Canopy": 'nta' | 'raw',
    "Cool Roofs": 'nta' | 'raw',
    "Premeable Surfaces": 'nta' | 'raw',
    "Parks": 'nta' | 'raw'
}


export type MapLayersContextType = {
    layer: LayersType | null,
    setLayer: Dispatch<SetStateAction<LayersType | null>>
    layerData: LayerDataType,
    setLayerData: Dispatch<SetStateAction<LayerDataType>>
}


type Props = {
    children: ReactNode
}

const MapLayersContext = createContext<MapLayersContextType | null>(null)

const MapLayersProvider = ({ children }: Props) => {

    const [layer, setLayer] = useState<LayersType | null>(null)
    const [layerData, setLayerData] = useState<LayerDataType>({
        "Outdoor Heat Exposure Index": 'nta',
        "Weather Stations": 'nta',
        "Air Temperature": 'nta',
        "Air Heat Index": 'nta',
        "Mean Radiant Temperature": 'nta',
        "Surface Temperature": 'nta',
        "Tree Canopy": 'nta',
        "Cool Roofs": 'nta',
        "Premeable Surfaces": 'nta',
        "Parks": 'nta'
      })


    return <MapLayersContext.Provider value={{ layer, setLayer, layerData, setLayerData}} >
        {children}
    </MapLayersContext.Provider>
}

export { MapLayersContext, MapLayersProvider }