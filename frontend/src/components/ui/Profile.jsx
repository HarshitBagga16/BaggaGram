"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./button";
import { Badge } from "./badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser, updateFollowStatus } from "@/redux/authSlice";

const Profile = ({ userId }) => {
  const router = useRouter();
  const { isLoading: profileLoading, refetch } = useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // Derive following status directly from Redux state
  const isFollowing = user?.following?.includes(userProfile?._id);
  
  // Force refresh profile data when following status changes
  useEffect(() => {
    if (userProfile && user) {
      refetch();
    }
  }, [user?.following?.length]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const followUnfollowHandler = async () => {
    if (!userProfile?._id) return;
    
    try {
      setIsLoading(true);
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/followorUnfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update all related state in Redux with one action
        dispatch(updateFollowStatus({ 
          targetUserId: userProfile._id,
          isFollowing: !isFollowing
        }));
        
        // Refresh the profile data to ensure counts are up to date
        refetch();
        
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error processing follow request");
    } finally {
      setIsLoading(false);
    }
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts || [] : userProfile?.bookmarks || [];

  if (profileLoading || !userProfile) {
    return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  }

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture || null}
                alt="Profile Picture"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                  <Link href="../../account/edit">
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button 
                      onClick={followUnfollowHandler}
                      variant="secondary" 
                      className="h-8"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Unfollow"}
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={followUnfollowHandler}
                    className="bg-[#0095F6] hover:bg-[#3192d2] h-8"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Follow"}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts?.length || 0}
                  </span>
                  {" "}Posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers?.length || 0}
                  </span>
                  {" "}Followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following?.length || 0}
                  </span>
                  {" "}Following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span>
                  Yadd rakhna jhan daulat wahn aurat or jhan dard whn mard
                </span>
                <span>Mard ko humesha uski pasandida aurat ni milti</span>
                <span>Pyaar kia to wafa ka bhi guroor rakhna</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer uppercase ${
                activeTab === "reels" ? "font-bold" : ""
              }`}
            >
              Reels
            </span>
            <span
              className={`py-3 cursor-pointer uppercase ${
                activeTab === "tags" ? "font-bold" : ""
              }`}
            >
              Tags
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
  {displayedPost.map((post, index) => {
    return (
      <div
        key={post?._id || index}
        className="relative group cursor-pointer overflow-hidden"
      >
        <img
          src={post.image}
          alt="postImage"
          className="w-full h-full aspect-square object-cover transition duration-300 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
          <div className="flex items-center gap-6 text-white text-lg font-semibold">
            <div className="flex items-center gap-1">
              <Heart className="w-5 h-5" />
              <span>{post?.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-5 h-5" />
              <span>{post?.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
