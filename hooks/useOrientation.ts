import { useState, useEffect, useCallback } from 'react';

export interface OrientationState {
  alpha: number | null; // yaw
  beta: number | null;  // pitch
  gamma: number | null; // roll
}

type PermissionState = 'default' | 'granted' | 'denied';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<OrientationState>({ alpha: null, beta: null, gamma: null });
  const [error, setError] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState>('default');

  useEffect(() => {
    // Detect if the device is iOS
    const iOS = typeof (DeviceOrientationEvent as any).requestPermission === 'function';
    setIsIOS(iOS);
    if (!iOS) {
        setPermissionState('granted'); // Non-iOS devices don't require permission
    }
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });
  };

  useEffect(() => {
    if (permissionState === 'granted') {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [permissionState]);

  const requestPermission = useCallback(async () => {
    if (!isIOS) {
        return;
    }
    try {
        // iOS-specific permission request
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      if (permission === 'granted') {
        setPermissionState('granted');
      } else {
        setPermissionState('denied');
        setError('Orientation permission was denied.');
      }
    } catch (err) {
      setError('Error requesting orientation permission.');
      console.error(err);
    }
  }, [isIOS]);

  return { orientation, error, isIOS, permissionState, requestPermission };
};
