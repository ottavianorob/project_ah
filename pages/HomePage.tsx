
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-teal-400">Welcome to the Pose-Only AR Helper</h1>
      <p className="max-w-2xl text-lg text-gray-300 mb-8">
        This tool helps you align your camera with a historical photo. Upload an overlay image, go to the capture screen, and line up your shot. The app saves only the metadata of your pose—not the photo.
      </p>
      <Link
        to="/overlays"
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 transform hover:scale-105"
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        Get Started
      </Link>
    </div>
  );
};

export default HomePage;
