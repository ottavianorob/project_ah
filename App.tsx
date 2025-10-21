
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OverlaysPage from './pages/OverlaysPage';
import CapturePage from './pages/CapturePage';
import LibraryPage from './pages/LibraryPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <header className="bg-gray-800 p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-teal-400 hover:text-teal-300">
              Pose-Only AR Helper
            </Link>
            <Link to="/overlays" className="text-lg text-gray-300 hover:text-white">
              Overlays
            </Link>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/overlays" element={<OverlaysPage />} />
            <Route path="/capture/:overlayId" element={<CapturePage />} />
            <Route path="/library/:overlayId" element={<LibraryPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
