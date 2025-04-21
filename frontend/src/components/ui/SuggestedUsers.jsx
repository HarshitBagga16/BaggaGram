import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser, updateFollowStatus } from "@/redux/authSlice";

const SuggestedUsers = () => {
  const { SuggestedUsers, user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loadingStates, setLoadingStates] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Force update after certain operations
  const refreshComponent = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Refresh data when following status changes
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/suggested`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch({ 
            type: "auth/setSuggestedUsers", 
            payload: res.data.users 
          });
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    if (user) {
      fetchSuggestedUsers();
    }
  }, [user?.following?.length, refreshTrigger, dispatch, user]);

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
        
        // If we're viewing this user's profile, refresh it
        if (userProfile && userProfile._id === userId) {
          // Fetch fresh user data
          const profileRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${userId}/profile`,
            { withCredentials: true }
          );
          
          if (profileRes.data.success) {
            dispatch({ 
              type: "auth/setUserProfile", 
              payload: profileRes.data.user 
            });
          }
        }
        
        toast.success(res.data.message);
        refreshComponent();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error following user");
    } finally {
      // Clear loading state for this user
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (!SuggestedUsers || SuggestedUsers.length === 0) {
    return null;
  }

  // Only show first 5 suggested users in the sidebar
  const displayUsers = SuggestedUsers.slice(0, 5);

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <Link href="/allSuggestedUsers" className="font-medium cursor-pointer text-blue-500 hover:text-blue-700">See All</Link>
      </div>
      {displayUsers.map((suggestedUser) => {
        const isFollowing = user?.following?.includes(suggestedUser._id);
        const isLoading = loadingStates[suggestedUser._id];
        
        return (
          <div key={suggestedUser._id} className="flex items-center justify-between my-5">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${suggestedUser?._id}`}>
                <Avatar>
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt="post image"
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback className="bg-gray-200 text-center">
                    CN
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="">
                <h1 className="font-semibold text-sm">
                  <Link href={`/profile/${suggestedUser?._id}`}>{suggestedUser?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {suggestedUser?.bio || "Bio here"}
                </span>
              </div>
            </div>
            <button 
              onClick={() => followHandler(suggestedUser._id)} 
              className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : (isFollowing ? "Unfollow" : "Follow")}
            </button>
          </div>
        );
      })}
      {SuggestedUsers.length > 5 && (
        <div className="text-center mt-4">
          <Link 
            href="/allSuggestedUsers" 
            className="text-blue-500 text-sm hover:underline"
          >
            View {SuggestedUsers.length - 5} more suggested users
          </Link>
        </div>
      )}
    </div>
  );
};

export default SuggestedUsers;
