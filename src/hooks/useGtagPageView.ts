import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[]; // Updated for dataLayer
  }
}

export function useGtagPageView() {
  const location = useLocation();

  useEffect(() => {
    window.dataLayer = window.dataLayer || []; // Ensure dataLayer exists
    window.dataLayer.push({
      event: 'virtualPageview', // Custom event name for GTM
      pagePath: location.pathname + location.search, // Send full path
      // title: document.title, // Optional: send page title
    });
    // console.log('GTM virtualPageview pushed:', location.pathname + location.search); // For debugging
  }, [location.pathname, location.search]); // Trigger on full path change
}
  
