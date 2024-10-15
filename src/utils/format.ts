export const formatDateString = (dateString: string) => {
    if(dateString.length === 4){
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