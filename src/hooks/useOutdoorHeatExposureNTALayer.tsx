import { useState, useEffect, useContext, Dispatch, SetStateAction } from "react"
import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext'
import { MapMouseEvent, EventData } from 'mapbox-gl'
import { useQuery } from 'react-query';

import { fetchNTAHeatData } from "../api/api.ts"

const useOutdoorHeatExposureNTALayer = (map: mapboxgl.Map | null, setNtaProfileData: Dispatch<SetStateAction<{}>>) => {
    const ntaQuery = useQuery({ queryKey: ['nta'], queryFn: fetchNTAHeatData });
    const { layer } = useContext(MapLayersContext) as MapLayersContextType;

    useEffect(() => {
        if (layer === "Outdoor Heat Exposure Index") {
            if (ntaQuery.isSuccess && ntaQuery.data) {
                console.log(ntaQuery.data)
            }
        }
    }, [map, layer]);
};


export default useOutdoorHeatExposureNTALayer;