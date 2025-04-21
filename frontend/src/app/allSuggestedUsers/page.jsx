'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import AllSuggestedUsersList from '@/components/ui/AllSuggestedUsersList';
import LeftSideBar from '@/components/ui/LeftSideBar';
import axios from 'axios';
import { setSuggestedUsers } from '@/redux/authSlice';

// Create a custom wrapper for LeftSideBar that prevents conflicts
const FeaturePageSidebar = () => {
  // Custom options to prevent create popup from opening
  const options = {
    disableCreatePopup: true
  };
  
  return <LeftSideBar options={options} />;
};

const AllSuggestedUsersPage = () => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/suggested`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.error('Error fetching suggested users:', error);
      }
    };

    fetchSuggestedUsers();
  }, [dispatch]);

  if (!user) {
    return null;
  }

  const handleGoBack = () => {
    router.push('/');
  };

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
      
      <div className="w-3/4 p-6 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 h-full backdrop-blur-sm border border-white/30 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-blue-100/50"></div>
          <div className="absolute left-1/2 -bottom-16 w-32 h-32 rounded-full bg-purple-100/50"></div>
          
          <button 
            onClick={handleGoBack}
            className="fixed top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-50 cursor-pointer"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
          
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Suggested Users
              </h1>
            </div>
            
            <AllSuggestedUsersList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSuggestedUsersPage; 