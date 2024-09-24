import { format } from 'd3-format';

export const formatDateString = (dateString: string) => {
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