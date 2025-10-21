
import { useState, useEffect, useRef } from 'react';

interface StreamDimensions {
  width: number;
  height: number;
}

export const useCameraStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [dimensions, setDimensions] = useState<StreamDimensions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const startStream = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          activeStream = mediaStream;
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } else {
          setError('Camera API not supported on this device.');
        }
      } catch (err) {
        if (err instanceof Error) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setError("Camera permission denied. Please enable it in your browser settings.");
            } else {
                setError(`Error accessing camera: ${err.message}`);
            }
        } else {
            setError("An unknown error occurred while accessing the camera.");
        }
      }
    };

    startStream();

    const handleMetadata = () => {
      if (videoRef.current) {
        setDimensions({
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });
      }
    };

    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.addEventListener('loadedmetadata', handleMetadata);
    }

    return () => {
      // Cleanup: stop the stream when the component unmounts
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (videoEl) {
        videoEl.removeEventListener('loadedmetadata', handleMetadata);
      }
    };
  }, []);

  return { videoRef, stream, dimensions, error };
};
