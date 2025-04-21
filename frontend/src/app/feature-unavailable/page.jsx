'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Construction, Instagram, Twitter, Github, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LeftSideBar from '@/components/ui/LeftSideBar';

// Create a custom wrapper for LeftSideBar that prevents conflicts
const FeaturePageSidebar = () => {
  // Custom options to prevent create popup from opening
  const options = {
    disableCreatePopup: true
  };
  
  return <LeftSideBar options={options} />;
};

const UnavailableFeaturePage = () => {
  const router = useRouter();

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23000000" fill-opacity="0.4" fill-rule="evenodd"/%3E%3C/svg%3E")',
             backgroundSize: '30px 30px'
           }}>
      </div>
      
      <div className="w-1/4 relative">
        <FeaturePageSidebar />
      </div>
      
      <div className="w-3/4 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-white/30">
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-8 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute left-20 top-40 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"></div>
            
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-1 mb-6 text-white/90 hover:text-white transition-colors group z-10 relative"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Go back</span>
            </button>
            
            <div className="relative z-10">
              <Construction className="w-20 h-20 mb-5 animate-pulse" />
              <h1 className="text-3xl font-bold mb-3">Feature Coming Soon!</h1>
              <p className="opacity-90 text-lg">
                We're working hard to bring this feature to you. Please check back later.
              </p>
            </div>
          </div>
          
          <div className="p-8 bg-white">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r">
              <p className="text-yellow-800 font-medium">
                This feature is currently unavailable and will be added soon by the Admin.
              </p>
            </div>
            
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-gray-800">Follow for updates</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <a 
                  href="https://www.instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center py-4 px-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 hover:border-pink-200 transition-all hover:shadow-sm"
                >
                  <Instagram className="h-8 w-8 text-pink-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-pink-500 transition-colors">Instagram</span>
                </a>
                
                <a
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center py-4 px-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-200 transition-all hover:shadow-sm"
                >
                  <Twitter className="h-8 w-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-blue-500 transition-colors">Twitter</span>
                </a>
                
                <a
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center py-4 px-4 border border-gray-200 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-slate-100 hover:border-gray-300 transition-all hover:shadow-sm"
                >
                  <Github className="h-8 w-8 text-gray-700 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">GitHub</span>
                </a>
              </div>
              
              <div className="mt-8 text-center">
                <Link 
                  href="/home" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnavailableFeaturePage; 