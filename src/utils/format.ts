export const formatDateString = (dateString: string) => {
    if (dateString.length === 4) {
        return dateString
    }

    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);

    return `${month}/${day}/${year}`;
};

export const boroughExpand = {
    'MN': 'Manhattan',
    'BX': 'The Bronx',
    'BK': 'Brooklyn',
    'QN': 'Queens',
    'SI': 'Staten Island'
}

interface BoroExtent {
    center: [number, number];
    zoom: number;
    bounds?: [[number, number], [number, number]];
    name: string;
}

export const BORO_EXTENTS: Record<string, BoroExtent> = {
    'Staten Island': {
        name: 'Staten Island',
        center: [-74.1502, 40.5795],
        zoom: 12,
        bounds: [
            [-74.2558, 40.4959],
            [-74.0522, 40.6517]
        ]
    },
    'Brooklyn': {
        name: 'Brooklyn',
        center: [-73.9442, 40.6526],
        zoom: 11.5,
        bounds: [
            [-74.0424, 40.5708],
            [-73.8334, 40.7395]
        ]
    },
    'Queens': {
        name: 'Queens',
        center: [-73.7949, 40.7282],
        zoom: 11.5,
        bounds: [
            [-73.9620, 40.5431],
            [-73.7004, 40.8129]
        ]
    },
    'Manhattan': {
        name: 'Manhattan',
        center: [-73.9712, 40.7831],
        zoom: 12,
        bounds: [
            [-74.0479, 40.6829],
            [-73.9070, 40.8820]
        ]
    },
    'Bronx': {
        name: 'Bronx',
        center: [-73.8648, 40.8448],
        zoom: 12,
        bounds: [
            [-73.9338, 40.7855],
            [-73.7654, 40.9176]
        ]
    }
};