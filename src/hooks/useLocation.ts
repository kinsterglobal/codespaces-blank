import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationError {
  code: number;
  message: string;
}

interface UseLocationReturn {
  location: LocationData | null;
  error: LocationError | null;
  isLoading: boolean;
  getCurrentLocation: () => Promise<LocationData | null>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = (): Promise<LocationData | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const err = {
          code: 0,
          message: 'Geolocation is not supported by this browser.'
        };
        setError(err);
        setIsLoading(false);
        resolve(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          setLocation(locationData);
          setError(null);
          setIsLoading(false);
          resolve(locationData);
        },
        (error) => {
          const err: LocationError = {
            code: error.code,
            message: error.message
          };
          setError(err);
          setLocation(null);
          setIsLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    error,
    isLoading,
    getCurrentLocation
  };
};
