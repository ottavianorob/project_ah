
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Overlay, Pose } from '@/types/db';

export default function LibraryPage() {
  const params = useParams();
  const overlayId = params.overlayId as string;
  const router = useRouter();

  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!overlayId) return;
      setLoading(true);
      
      const overlayPromise = supabase.from('overlays').select('*').eq('id', overlayId).single();
      const posesPromise = supabase.from('poses').select('*').eq('overlay_id', overlayId).order('recorded_at', { ascending: false });
      
      const [overlayResult, posesResult] = await Promise.all([overlayPromise, posesPromise]);
      
      let fetchError = '';
      if (overlayResult.error) fetchError += `Overlay: ${overlayResult.error.message}\n`;
      if (posesResult.error) fetchError += `Poses: ${posesResult.error.message}\n`;
      
      if (fetchError) {
        setError(fetchError);
      } else {
        setOverlay(overlayResult.data);
        setPoses(posesResult.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [overlayId]);

  const openInCapture = (pose?: Pose) => {
    let url = `/capture/${overlayId}`;
    if (pose) {
      const params = new URLSearchParams();
      if(pose.overlay_opacity) params.set('opacity', pose.overlay_opacity.toString());
      if(pose.overlay_scale) params.set('scale', pose.overlay_scale.toString());
      if(pose.overlay_rotation_deg) params.set('rotation', pose.overlay_rotation_deg.toString());
      if(pose.overlay_offset_x) params.set('offsetX', pose.overlay_offset_x.toString());
      if(pose.overlay_offset_y) params.set('offsetY', pose.overlay_offset_y.toString());
      url += `?${params.toString()}`;
    }
    router.push(url);
  };
  
  if (loading) return <p>Loading library...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-teal-400">Pose Library</h1>
      <h2 className="text-xl text-gray-300 mb-6">For Overlay: {overlay?.title}</h2>
      
      <button 
        onClick={() => openInCapture(poses[0])}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mb-8 text-lg"
        style={{ minHeight: '44px' }}
      >
        {poses.length > 0 ? "Re-open with Latest Pose" : "Open in Capture"}
      </button>

      {poses.length === 0 ? (
        <p>No poses have been recorded for this overlay yet.</p>
      ) : (
        <div className="space-y-4">
          {poses.map(pose => (
            <div key={pose.id} className="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-semibold">{new Date(pose.recorded_at!).toLocaleString()}</p>
                <div className="text-sm text-gray-400 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 mt-2">
                  <p>Lat: {pose.lat?.toFixed(6) ?? 'N/A'}</p>
                  <p>Lon: {pose.lon?.toFixed(6) ?? 'N/A'}</p>
                  <p>Acc: {pose.accuracy_m?.toFixed(1) ?? 'N/A'}m</p>
                  <p>Yaw: {pose.alpha_yaw_deg?.toFixed(1) ?? 'N/A'}°</p>
                  <p>Pitch: {pose.beta_pitch_deg?.toFixed(1) ?? 'N/A'}°</p>
                  <p>Roll: {pose.gamma_roll_deg?.toFixed(1) ?? 'N/A'}°</p>
                </div>
              </div>
              <button 
                onClick={() => openInCapture(pose)}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md whitespace-nowrap"
                style={{ minHeight: '44px' }}
              >
                Use These Settings
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
