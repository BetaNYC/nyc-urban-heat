// Simple hash function
const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36); // Convert to base 36 (numbers + letters)
};

export const cachedFetch = async (url: string, options = {}) => {
    const hashedUrl = hashString(url);
    const cacheKey = `cached_fetch_${hashedUrl}`;
    const cachedResponse = localStorage.getItem(cacheKey);

    if (cachedResponse) {
        const { timestamp, data } = JSON.parse(cachedResponse);
        const now = new Date().getTime();
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

        if (now - timestamp < oneWeek) {
            return JSON.parse(data);
        }
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        const cacheData = JSON.stringify({
            timestamp: new Date().getTime(),
            data: JSON.stringify(data)
        });

        localStorage.setItem(cacheKey, cacheData);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

