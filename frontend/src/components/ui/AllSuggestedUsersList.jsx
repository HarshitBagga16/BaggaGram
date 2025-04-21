import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { updateFollowStatus } from '@/redux/authSlice';
import { UserPlus, UserMinus } from 'lucide-react';

const AllSuggestedUsersList = () => {
  const { SuggestedUsers, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loadingStates, setLoadingStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = SuggestedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(SuggestedUsers.length / usersPerPage);

  const followHandler = async (userId) => {
    try {
      // Set loading state for this specific user
      setLoadingStates(prev => ({ ...prev, [userId]: true }));
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/followorUnfollow/${userId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        // Determine if this is a follow or unfollow action
        const isCurrentlyFollowing = user?.following?.includes(userId);
        const isFollowing = !isCurrentlyFollowing;
        
        // Use the reducer to update all related state in one action
        dispatch(updateFollowStatus({
          targetUserId: userId,
          isFollowing: isFollowing
        }));
        
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error following user");
    } finally {
      // Clear loading state for this user
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!SuggestedUsers || SuggestedUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm">
        <div className="text-gray-400 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div className="text-center text-gray-500">No suggested users found</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4">
        {currentUsers.map((suggestedUser) => {
          const isFollowing = user?.following?.includes(suggestedUser._id);
          const isLoading = loadingStates[suggestedUser._id];
          
          return (
            <div 
              key={suggestedUser._id} 
              className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden relative"
            >
              {/* Decorative gradient side */}
              <div className={`absolute left-0 top-0 w-1.5 h-full ${isFollowing ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-gradient-to-b from-blue-400 to-purple-600'}`}></div>
              
              <div className="flex items-center gap-4 ml-2">
                <Link href={`/profile/${suggestedUser?._id}`}>
                  <Avatar className="w-14 h-14 ring-2 ring-offset-2 ring-gray-100 group-hover:ring-blue-100 transition-all">
                    <AvatarImage
                      src={suggestedUser?.profilePicture}
                      alt={`${suggestedUser?.username}'s profile`}
                      className="h-full w-full object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 text-center font-medium">
                      {suggestedUser?.username?.slice(0, 2).toUpperCase() || "CN"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <Link href={`/profile/${suggestedUser?._id}`} className="group-hover:text-blue-600 transition-colors">
                    <h2 className="font-semibold text-gray-800 text-lg">
                      {suggestedUser?.username}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-500">
                    {suggestedUser?.bio || "No bio available"}
                  </p>
                  {suggestedUser?.followers?.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {suggestedUser.followers.length} {suggestedUser.followers.length === 1 ? 'follower' : 'followers'}
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => followHandler(suggestedUser._id)} 
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isLoading 
                    ? "bg-gray-100 text-gray-400 cursor-wait" 
                    : isFollowing 
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md hover:from-blue-600 hover:to-indigo-700"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading
                  </span>
                ) : isFollowing ? (
                  <>
                    <UserMinus size={16} />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Follow
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <button 
              onClick={() => changePage(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                currentPage === 1 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => changePage(number)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                    currentPage === number
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => changePage(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                currentPage === totalPages 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSuggestedUsersList; 