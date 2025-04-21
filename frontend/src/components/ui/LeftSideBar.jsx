"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { clearNotifications } from "@/redux/rtnSlice";
import CreatePost from "./createPost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Button } from "./button";

const LeftSideBar = ({ options = {} }) => {
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Determine if the create popup should be disabled
  const { disableCreatePopup = false } = options;

  // Update notification count whenever notifications change
  useEffect(() => {
    if (Array.isArray(likeNotification)) {
      setNotificationCount(likeNotification.length);
      console.log("Current notification count:", likeNotification.length);
    }
  }, [likeNotification]);

  const sideBarItems = [
    { icon: <Home className="w-6 h-6" />, text: "Home" },
    { icon: <Search className="w-6 h-6" />, text: "Search" },
    { icon: <TrendingUp className="w-6 h-6" />, text: "Explore" },
    { icon: <MessageCircle className="w-6 h-6" />, text: "Messages" },
    { icon: <Heart className="w-6 h-6" />, text: "Notifications" },
    { icon: <PlusSquare className="w-6 h-6" />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6 rounded-full">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut className="w-6 h-6" />, text: "Logout" },
  ];

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        dispatch(setAuthUser(null));
        dispatch(clearNotifications());
        router.push("../loginPage");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const clearAllNotifications = () => {
    dispatch(clearNotifications());
    setNotificationOpen(false);
  };

  const homeHandler = () => {
    router.push("../home");
  }

  const sidebarHandler = (text) => {
    if (text === "Logout") {
      logoutHandler();
    } else if (text === "Create") {
      // Only open create popup if not disabled
      if (!disableCreatePopup) {
        setOpen(true);
      } else {
        toast.info("Create feature is not available on this page. Please go to home page to create a post.");
      }
    } else if (text === "Profile") {
      router.push(`../profile/${user?._id}`);
    } else if (text === "Home") {
      router.push("../home");
    } else if (text === "Messages") {
      router.push("../chat");
    } else if (text === "Notifications") {
      setNotificationOpen(!notificationOpen);
    } else if (text === "Search" || text === "Explore") {
      router.push("../feature-unavailable");
    }
  };

  // Safe notification access
  const hasNotifications = notificationCount > 0;
  
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col gap-4">
        <h1 onClick={homeHandler} className="my-8 pl-3 font-bold text-xl cursor-crosshair">BₐggₐGᵣₐₘ</h1>
        <div className="flex flex-col gap-3">
          {sideBarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer relative"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.text}</span>
              
              {/* Notification Badge */}
              {item.text === "Notifications" && hasNotifications && (
                <div className="absolute -top-1 right-0">
                  <div className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notificationCount}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notification Popover */}
      {notificationOpen && (
        <div className="fixed left-48 top-40 bg-white shadow-lg rounded-lg p-4 w-72 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Notifications</h3>
            <div className="flex gap-2">
              <button 
                onClick={clearAllNotifications}
                className="text-xs text-blue-500 hover:underline"
              >
                Clear all
              </button>
              <X 
                className="w-4 h-4 cursor-pointer" 
                onClick={() => setNotificationOpen(false)} 
              />
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {!hasNotifications ? (
              <p className="text-gray-500 text-sm text-center py-4">No notifications</p>
            ) : (
              likeNotification.map((notification, idx) => (
                notification && (
                  <div 
                    key={`${notification.userId || ''}-${notification.postId || ''}-${idx}`} 
                    className="flex items-center gap-3 p-2 border-b hover:bg-gray-50"
                    onClick={() => {
                      router.push(`../profile/${notification.userId}`);
                      setNotificationOpen(false);
                    }}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.userDetails?.profilePicture} />
                      <AvatarFallback>
                        {notification.userDetails?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">
                          {notification.userDetails?.username}
                        </span>
                        {" "}liked your post
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        </div>
      )}
      
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSideBar;
