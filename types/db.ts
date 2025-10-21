
export type Overlay = {
  id: string;
  title: string;
  overlay_url: string;
  place_name?: string | null;
  lat?: number | null;
  lon?: number | null;
  created_at?: string;
  user_id?: string | null;
};

export type Pose = {
  id?: string;
  overlay_id: string;
  recorded_at?: string;
  lat?: number | null;
  lon?: number | null;
  alt?: number | null;
  accuracy_m?: number | null;
  heading_deg?: number | null;
  speed_mps?: number | null;
  alpha_yaw_deg?: number | null;
  beta_pitch_deg?: number | null;
  gamma_roll_deg?: number | null;
  tilt_deg?: number | null;
  overlay_scale?: number;
  overlay_rotation_deg?: number;
  overlay_offset_x?: number;
  overlay_offset_y?: number;
  overlay_opacity?: number;
  device_model?: string | null;
  viewport_w?: number | null;
  viewport_h?: number | null;
  stream_w?: number | null;
  stream_h?: number | null;
  zoom_factor?: number | null;
  fov_deg?: number | null;
  notes?: string | null;
  user_id?: string | null;
};

// This is a placeholder for Supabase generated types.
// In a real project, you would use `supabase gen types typescript > types/db.ts`
export interface Database {
  public: {
    Tables: {
      overlays: {
        Row: Overlay;
        // FIX: Explicitly define Insert type to not include database-generated `id`.
        Insert: {
          title: string;
          overlay_url: string;
          place_name?: string | null;
          lat?: number | null;
          lon?: number | null;
          created_at?: string;
          user_id?: string | null;
        };
        Update: Partial<Overlay>;
      };
      poses: {
        Row: Pose;
        // FIX: Explicitly define Insert type to not include database-generated columns.
        Insert: {
          overlay_id: string;
          lat?: number | null;
          lon?: number | null;
          alt?: number | null;
          accuracy_m?: number | null;
          heading_deg?: number | null;
          speed_mps?: number | null;
          alpha_yaw_deg?: number | null;
          beta_pitch_deg?: number | null;
          gamma_roll_deg?: number | null;
          tilt_deg?: number | null;
          overlay_scale?: number;
          overlay_rotation_deg?: number;
          overlay_offset_x?: number;
          overlay_offset_y?: number;
          overlay_opacity?: number;
          device_model?: string | null;
          viewport_w?: number | null;
          viewport_h?: number | null;
          stream_w?: number | null;
          stream_h?: number | null;
          zoom_factor?: number | null;
          fov_deg?: number | null;
          notes?: string | null;
          user_id?: string | null;
        };
        Update: Partial<Pose>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
