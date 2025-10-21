
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import type { Overlay, Pose } from '../../types/db';
import { useCameraStream } from '../../hooks/useCameraStream';
import { useGeo } from '../../hooks/useGeo';
import { useOrientation } from '../../hooks/useOrientation';
import StatusBar from '../../components/StatusBar';
import OverlayControls, { ControlState } from '../../components/OverlayControls';

export default function CapturePage() {
  const params = useParams();
  const overlayId = params.overlayId as string;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { videoRef, dimensions: streamDimensions, error: cameraError } = useCameraStream();
  const geo = useGeo();
  const orientation = useOrientation();

  const [controls, setControls] = useState<ControlState | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const getInitialState = useCallback((): Partial<ControlState> => {
    const initialState: Partial<ControlState> = {};
    const params = {
      opacity: searchParams.get('opacity'),
      scale: searchParams.get('scale'),
      rotation: searchParams.get('rotation'),
      offsetX: searchParams.get('offsetX'),
      offsetY: searchParams.get('offsetY'),
    };
    if (params.opacity) initialState.opacity = parseFloat(params.opacity);
    if (params.scale) initialState.scale = parseFloat(params.scale);
    if (params.rotation) initialState.rotation = parseFloat(params.rotation);
    if (params.offsetX) initialState.offsetX = parseFloat(params.offsetX);
    if (params.offsetY) initialState.offsetY = parseFloat(params.offsetY);
    return initialState;
  }, [searchParams]);
  
  const [initialStateFromUrl] = useState(getInitialState());

  useEffect(() => {
    const fetchOverlay = async () => {
      if (!overlayId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('overlays')
        .select('*')
        .eq('id', overlayId)
        .single();
      
      if (error) {
        setError(`Failed to load overlay: ${error.message}`);
      } else {
        setOverlay(data);
      }
      setLoading(false);
    };
    fetchOverlay();
  }, [overlayId]);

  const handleRecordPose = useCallback(async () => {
    if (!overlayId || !controls || isRecording) return;
    
    setIsRecording(true);
    
    // FIX: Removed the `: Pose` type annotation to allow TypeScript to infer the correct type for an insert operation.
    const posePayload = {
      overlay_id: overlayId,
      lat: geo.position?.coords.latitude,
      lon: geo.position?.coords.longitude,
      alt: geo.position?.coords.altitude,
      accuracy_m: geo.position?.coords.accuracy,
      heading_deg: geo.position?.coords.heading,
      speed_mps: geo.position?.coords.speed,
      alpha_yaw_deg: orientation.orientation.alpha,
      beta_pitch_deg: orientation.orientation.beta,
      gamma_roll_deg: orientation.orientation.gamma,
      overlay_scale: controls.scale,
      overlay_rotation_deg: controls.rotation,
      overlay_offset_x: controls.offsetX,
      overlay_offset_y: controls.offsetY,
      overlay_opacity: controls.opacity,
      device_model: navigator.userAgent,
      viewport_w: window.innerWidth,
      viewport_h: window.innerHeight,
      stream_w: streamDimensions?.width,
      stream_h: streamDimensions?.height,
    };

    const { error } = await supabase.from('poses').insert([posePayload]);

    if (error) {
      alert(`Failed to save pose: ${error.message}`);
    } else {
      alert('Pose recorded successfully!');
      router.push(`/library/${overlayId}`);
    }
    setIsRecording(false);
  }, [overlayId, controls, geo.position, orientation.orientation, streamDimensions, isRecording, router]);

  if (loading) return <p>Loading overlay...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!overlay) return <p>Overlay not found.</p>;
  if (cameraError) return <p className="text-red-400 p-4">{cameraError}</p>;

  return (
    <div className="fixed inset-0 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <OverlayControls imageUrl={overlay.overlay_url} onControlsChange={setControls} initialState={initialStateFromUrl} />
      
      <div className="absolute top-4 left-4 z-20 space-y-2">
        {orientation.isIOS && orientation.permissionState !== 'granted' && (
          <button
            onClick={orientation.requestPermission}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
            style={{ minHeight: '44px' }}
          >
            Enable Sensors (iOS)
          </button>
        )}
        <button
          onClick={handleRecordPose}
          disabled={isRecording}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg disabled:bg-gray-500"
          style={{ minHeight: '44px' }}
        >
          {isRecording ? 'Recording...' : 'Record Pose'}
        </button>
      </div>

      <StatusBar geo={geo} orientation={orientation.orientation} />
    </div>
  );
}
