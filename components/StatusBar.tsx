
'use client';

import React from 'react';
import type { OrientationState } from '@/hooks/useOrientation';

interface StatusBarProps {
  geo: {
    position: GeolocationPosition | null;
    error: string | null;
  };
  orientation: OrientationState;
}

const StatusBar: React.FC<StatusBarProps> = ({ geo, orientation }) => {
  const formatCoord = (num: number | null | undefined) => num?.toFixed(6) ?? 'N/A';
  const formatAngle = (num: number | null) => num?.toFixed(1) ?? 'N/A';
  const formatAcc = (num: number | null | undefined) => num?.toFixed(1) ?? 'N/A';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 z-20 backdrop-blur-sm">
      <div className="flex justify-around items-center">
        <div className="text-center">
          <p className="font-bold">GPS</p>
          {geo.error ? (
            <p className="text-red-400">{geo.error}</p>
          ) : (
            <>
              <p>Lat: {formatCoord(geo.position?.coords.latitude)}</p>
              <p>Lon: {formatCoord(geo.position?.coords.longitude)}</p>
              <p>Acc: {formatAcc(geo.position?.coords.accuracy)}m</p>
            </>
          )}
        </div>
        <div className="text-center">
          <p className="font-bold">Orientation</p>
          <p>Yaw: {formatAngle(orientation.alpha)}°</p>
          <p>Pitch: {formatAngle(orientation.beta)}°</p>
          <p>Roll: {formatAngle(orientation.gamma)}°</p>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
