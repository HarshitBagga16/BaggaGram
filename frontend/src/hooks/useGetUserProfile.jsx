'use client'

import { setUserProfile } from "@/redux/authSlice";
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector(state => state.auth);
    
    // Track following changes to trigger profile refresh
    const followingCount = user?.following?.length || 0;
    
    const fetchUserProfile = async () => {
        if (!userId) return;
        
        try {
            setIsLoading(true);
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${userId}/profile`, 
                { withCredentials: true }
            );
            
            if(res.data.success) {
                dispatch(setUserProfile(res.data.user));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch on component mount or userId change
    useEffect(() => {
        fetchUserProfile();
    }, [userId, followingCount]); // Re-fetch when following changes
    
    return { isLoading, refetch: fetchUserProfile };
};

export default useGetUserProfile;