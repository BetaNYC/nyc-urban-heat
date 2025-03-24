import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
      gtag: (...args: any[]) => void;
    }
  }
  
  export function useGtagPageView() {
    const location = useLocation();
  
    useEffect(() => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_path: location.pathname,
        });
      }
    }, [location.pathname]);
  }
  
