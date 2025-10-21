
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

  // Effect 1: Manages the stream's lifecycle (requesting and stopping).
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isCancelled = false;

    const startStream = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });

          if (isCancelled) {
            mediaStream.getTracks().forEach(track => track.stop());
            return;
          }

          activeStream = mediaStream;
          setStream(mediaStream);
        } else {
          setError('Camera API not supported on this device.');
        }
      } catch (err) {
        if (isCancelled) return;
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

    return () => {
      isCancelled = true;
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Runs once on mount.

  // Effect 2: Connects the stream to the video element and ensures it plays.
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !stream) return;

    if (videoEl.srcObject !== stream) {
      videoEl.srcObject = stream;
    }

    const handleMetadata = () => {
      if (videoEl.videoWidth > 0) {
        setDimensions({
          width: videoEl.videoWidth,
          height: videoEl.videoHeight,
        });
      }
    };

    // FIX: Explicitly call play() to counter strict browser autoplay policies.
    // The video element is muted, so this should be allowed.
    videoEl.play().catch(playError => {
      console.warn("Video play() failed, possibly due to autoplay restrictions.", playError);
      setError("Could not automatically play camera feed. Please interact with the page.");
    });

    videoEl.addEventListener('loadedmetadata', handleMetadata);

    return () => {
      videoEl.removeEventListener('loadedmetadata', handleMetadata);
    };
  }, [stream]); // Re-runs when the stream object changes.

  return { videoRef, dimensions, error };
};
