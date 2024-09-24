import { Geometry, Feature, GeoJsonProperties, } from 'geojson';

export const GeoJSONTransformHandler = (data: Feature[]): Feature<Geometry, GeoJsonProperties>[] => {
    return data.map((d: Feature): Feature<Geometry, GeoJsonProperties> => {
      // create a deep copy of coordinates
      const { geometry, properties } = d;
      let coordinates: any[] = [];
      if (geometry && 'coordinates' in geometry) {
        coordinates = JSON.parse(JSON.stringify((geometry as any).coordinates));
      }
  
      return {
        type: "Feature",
        properties: properties as GeoJsonProperties,
        geometry: {
          coordinates,
          type: geometry.type,
        } as Geometry,
      };
    });
  };
  