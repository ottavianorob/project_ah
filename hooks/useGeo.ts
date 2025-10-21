
import { useState, useEffect } from 'react';

export const useGeo = () => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const handleSuccess = (pos: GeolocationPosition) => {
      setPosition(pos);
      setError(null);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(`Geolocation error: ${err.message}`);
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    // Cleanup function to clear the watch
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { position, error };
};
