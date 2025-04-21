'use client'

import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

const useGetAllMessage = () => {
    const {selectedUser} = useSelector(store=>store.auth);
    const {socket} = useSelector(store=> store.socketio);
    const dispatch = useDispatch();

    useEffect(() => {
        const getMessages = async () => {
            try {
                if(selectedUser && selectedUser._id) {
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/message/all/${selectedUser._id}`, 
                        { withCredentials: true }
                    );
                    
                    if(res.data.success) {
                        dispatch(setMessages(res.data.messages));
                    }
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        getMessages();

        // Set up real-time message listening
        if(socket && selectedUser) {
            socket.on('newMessage', (message) => {
                console.log("New message received:", message);
                dispatch(setMessages(message));
            });

            // Clean up
            return () => {
                socket.off('newMessage');
            };
        }

    }, [selectedUser, socket, dispatch]);
};

export default useGetAllMessage;
