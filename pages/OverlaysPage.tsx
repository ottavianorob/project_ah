import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabaseClient';
import type { Overlay } from '../types/db';

const OverlaysPage: React.FC = () => {
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchOverlays = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('overlays')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      setError(`Failed to fetch overlays: ${error.message}`);
    } else {
      setOverlays(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOverlays();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!title) {
      setFormError('Title is required.');
      return;
    }
    if (!file && !externalUrl) {
      setFormError('Either an image file or an external URL is required.');
      return;
    }

    setUploading(true);
    let overlayUrl = externalUrl;

    if (file) {
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = `public/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('bucket') // Corrected bucket name
        .upload(filePath, file);

      if (uploadError) {
        setFormError(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }
      
      const { data } = supabase.storage
        .from('bucket') // Corrected bucket name
        .getPublicUrl(filePath);
        
      overlayUrl = data.publicUrl;
    }

    const { error: insertError } = await supabase.from('overlays').insert({
      title,
      overlay_url: overlayUrl,
    });

    if (insertError) {
      setFormError(`Failed to create overlay: ${insertError.message}`);
    } else {
      // Reset form and refresh list
      setTitle('');
      setFile(null);
      setExternalUrl('');
      await fetchOverlays();
    }
    setUploading(false);
  };

  if (loading) return <div className="text-center">Loading overlays...</div>;
  if (error) return <div className="text-center text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-teal-400">Overlays</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Overlay</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Overlay Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          
          <div>
            <label className="block mb-2 text-sm font-medium">Upload Image</label>
            <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600" />
          </div>
          <div className="text-center text-gray-400">OR</div>
          <input type="url" placeholder="Paste External Image URL" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          
          {formError && <p className="text-red-400 text-sm">{formError}</p>}

          <button type="submit" disabled={uploading} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500" style={{minHeight: '44px'}}>
            {uploading ? 'Creating...' : 'Create Overlay'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overlays.map(overlay => (
          <div key={overlay.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <img src={overlay.overlay_url} alt={overlay.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{overlay.title}</h3>
              <Link to={`/capture/${overlay.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md" style={{minHeight: '44px', display: 'flex', alignItems: 'center'}}>
                Open Capture
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverlaysPage;