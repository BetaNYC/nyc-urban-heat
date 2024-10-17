// import { useState, useEffect, useContext } from "react";
// import { MapLayersContext, MapLayersContextType } from '../contexts/mapLayersContext.tsx';
// import { useQuery } from 'react-query';
// import { fetchNTAHeatData } from '../api/api.ts';
// import { FeatureCollection } from "geojson";

const useNTALayer = () => {

    // const ntaDataQuery = useQuery({ queryKey: ['cool roofs'], queryFn: fetchNTAHeatData });
    // const { layer, layerData } = useContext(MapLayersContext) as MapLayersContextType;

    // useEffect(() => {
    //     if (ntaDataQuery.isSuccess && ntaDataQuery.data) {

    //         const features = ntaDataQuery.data.features;

    //         let maxPctAreaCoolRoof = -Infinity;
    //         let minPctAreaCoolRoof = Infinity;

    //         features.forEach(feature => {
    //             const value = feature.properties?.pct_permeable;

    //             if (value !== undefined && value !== null) {
    //                 if (value > maxPctAreaCoolRoof) {
    //                     maxPctAreaCoolRoof = value;
    //                 }
    //                 if (value < minPctAreaCoolRoof) {
    //                     minPctAreaCoolRoof = value;
    //                 }
    //             }
    //         });
            

    //         if (!map?.getSource('nta')) {
    //             map?.addSource('nta', {
    //                 type: 'geojson',
    //                 data: ntaDataQuery.data as FeatureCollection
    //             });
    //         }



    //         const addNtaOutlineLayer = () => {
    //             if (map?.getLayer('nta_outline')) map.removeLayer('nta_outline');

    //             map?.addLayer({
    //                 id: 'nta_outline',
    //                 type: 'line',
    //                 source: 'nta',
    //                 paint: {
    //                     "line-color": 'rgba(255,255,255,0.6)',
    //                     'line-width': 1,
    //                 }
    //             });
    //         };

    //         if (layer === 'Cool Roofs') {
    //             if (layerData['Cool Roofs'] === 'nta') {
    //                 if (map!.getLayer('nta')) map!.removeLayer('nta');

    //                 map?.addLayer({
    //                     id: 'nta',
    //                     type: 'fill',
    //                     source: 'nta',
    //                     paint: {
    //                         'fill-color': [
    //                             "interpolate",
    //                             ["linear"],
    //                             ["get", "pct_Area_coolRoof"],
    //                             3,
    //                             "#b3cde0",
    //                             76.5,
    //                             "#03396c"
    //                         ],
    //                         'fill-opacity': 1,
    //                     },
    //                 });
    //                 addNtaOutlineLayer();
    //             } else {
    //                 if (map!.getLayer('nta')) map!.removeLayer('nta');
    //             }
    //         }

    //         if (layer === "Parks") {
    //             if (layerData['Parks'] === 'nta') {
    //                 if (map!.getLayer('nta')) map!.removeLayer('nta');

    //                 map?.addLayer({
    //                     id: 'nta',
    //                     type: 'fill',
    //                     source: 'nta',
    //                     paint: {
    //                         'fill-color': [
    //                             "interpolate",
    //                             ["linear"],
    //                             ["get", "Avg_dist_to_parks_ft"],
    //                             222,
    //                             "#295f48",
    //                             6144,
    //                             "#b3d5c7",
    //                         ],
    //                     }
    //                 });
    //                 addNtaOutlineLayer();
    //             } else {
    //                 if (map!.getLayer('nta')) map!.removeLayer('nta');
    //             }
    //         }

    //         if (layer === 'Premeable Surfaces') {
    //             if (layerData['Premeable Surfaces'] === 'nta') {
    //                 if (map!.getLayer('nta')) map!.removeLayer('nta');

    //                 map?.addLayer({
    //                     id: 'nta',
    //                     type: 'fill',
    //                     source: 'nta',
    //                     paint: {
    //                         'fill-color': [
    //                             "interpolate",
    //                             ["linear"],
    //                             ["get", "pct_permeable"],
    //                             0.74,
    //                             "#c68642",
    //                             70.4,
    //                             "#ffdbac",
    //                         ],
    //                     }
    //                 });
    //                 addNtaOutlineLayer();
    //             } else {
    //                 if (map!.getLayer('nta')) map!.removeLayer('nta');
    //             }
    //         }
    //     }
    // }, [map, layer, layerData]);
};

export default useNTALayer;