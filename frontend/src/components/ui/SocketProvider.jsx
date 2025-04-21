// src/components/SocketProvider.jsx
"use client"

import { setOnlineUsers } from "@/redux/chatSlice";
import { setlikeNotification, clearNotifications } from "@/redux/rtnSlice";
import { setSocket } from "@/redux/socketSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { toast } from "sonner";

let socketio;

const SocketProvider = () => {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();
  const notificationRef = useRef(false);

  useEffect(() => {
    // We don't want to clear notifications on every mount/user change
    // Only clear notifications on initial mount
    if (!notificationRef.current) {
      dispatch(clearNotifications());
      notificationRef.current = true;
    }
    
    if (user) {
      // Initialize socket connection
      socketio = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      
      dispatch(setSocket(socketio));

      // Handle online users
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // Handle socket connection issues
      socketio.on('connect', () => {
        console.log('Socket connected successfully');
      });

      socketio.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // Handle notifications with error handling
      socketio.on('notification', (notification) => {
        console.log("Received notification:", notification);
        
        if (notification && (notification.type === 'like' || notification.type === 'dislike')) {
          try {
            dispatch(setlikeNotification(notification));
            
            // Show toast for new likes
            if (notification.type === 'like') {
              toast(`${notification.userDetails?.username || 'Someone'} liked your post`, {
                duration: 3000,
                position: 'bottom-right',
              });
            }
          } catch (error) {
            console.error("Error handling notification:", error);
          }
        }
      });

      // Cleanup function
      return () => {
        if (socketio) {
          socketio.disconnect();
          socketio.close();
        }
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.disconnect();
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return null; // This component doesn't render anything
};

export default SocketProvider;
