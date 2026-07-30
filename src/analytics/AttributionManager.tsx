import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureAttribution } from './attribution';

export function AttributionManager() {
  const location = useLocation();

  useEffect(() => {
    captureAttribution();
  }, [location.pathname, location.search]);

  return null;
}
