
# Pose-Only AR Helper

An augmented reality web application to align your camera view with a historical photo overlay. This app records only pose metadata (GPS, orientation, overlay settings) to Supabase, without saving any images from the camera.

## Local Setup

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env.local` file** in the root of the project and add your Supabase credentials:
    ```
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Vercel Deployment

1.  Push your code to a GitHub/GitLab/Bitbucket repository.
2.  Connect your repository to a new Vercel project.
3.  In the Vercel project settings, go to "Environment Variables" and add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the same values from your `.env.local` file.
4.  Deploy. Vercel will automatically build and deploy your Next.js application.

## Important Notes for iOS Users

Due to Apple's security policies, access to device orientation sensors (for yaw, pitch, roll) requires explicit user permission. This permission can only be requested in response to a direct user action, such as a button tap. In the Capture view, an "Enable Sensors (iOS)" button will appear if needed. The user must tap this button to enable orientation tracking.

## Supabase Configuration

This application assumes that your Supabase project is already configured with the necessary tables and storage bucket.

*   **Tables:** `public.overlays`, `public.poses`
*   **Storage Bucket:** `overlays` (must be set to public for this MVP)
*   **Row Level Security (RLS):** Policies should be enabled on both tables.
*   **CORS:** You must add your development and production URLs to the Supabase CORS configuration to allow image uploads from the browser.
    *   Go to `Dashboard > Project Settings > API > CORS Configuration`.
    *   Add `http://localhost:3000` (for local development) and your Vercel deployment URL (e.g., `https://your-project-name.vercel.app`).

## Known Limitations (MVP)

*   **No Photo Saving:** The app is designed *not* to save any photos to respect privacy and simplify storage. Only metadata is saved.
*   **GPS Accuracy:** The accuracy of geolocation data is dependent on the device and environmental factors.
*   **No WebXR:** This version uses standard browser APIs (`getUserMedia`, `DeviceOrientationEvent`) for simplicity. It is not a true WebXR application.
*   **Public Bucket:** For the MVP, the Supabase storage bucket for overlays is assumed to be public. For a production app, you should use signed URLs for private buckets.

## Short-Term Roadmap

*   **Supabase Authentication:** Implement user sign-up and login to associate overlays and poses with specific users.
*   **RPC for Nearby Poses:** Create a PostgreSQL function to find poses near a given GPS coordinate.
*   **Overlay Sharing:** Allow users to share a link to a specific overlay.
*   **Signed URLs:** Move to a private storage bucket and use signed URLs for secure image uploads and access.
