import {createSlice} from "@reduxjs/toolkit"


const authSlice = createSlice({
    name : "auth",
    initialState : {
        user:null,
        SuggestedUsers : [],
        userProfile:null,
        selectedUser:null,
    },
    reducers:{
        setAuthUser:(state,action) => {
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action)=>{
            state.SuggestedUsers = action.payload;
        },
        setUserProfile:(state,action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser:(state,action) => {
            state.selectedUser = action.payload;
        },
        updateFollowStatus: (state, action) => {
            const { targetUserId, isFollowing } = action.payload;
            
            // Update the current user's following list
            if (state.user) {
                if (isFollowing) {
                    // Add to following if not already there
                    if (!state.user.following.includes(targetUserId)) {
                        state.user.following.push(targetUserId);
                    }
                } else {
                    // Remove from following
                    state.user.following = state.user.following.filter(id => id !== targetUserId);
                }
            }
            
            // Update userProfile if it matches the target user
            if (state.userProfile && state.userProfile._id === targetUserId) {
                if (isFollowing) {
                    // Add current user to followers if not already there
                    if (state.user && !state.userProfile.followers.includes(state.user._id)) {
                        state.userProfile.followers.push(state.user._id);
                    }
                } else {
                    // Remove current user from followers
                    if (state.user) {
                        state.userProfile.followers = state.userProfile.followers.filter(
                            id => id !== state.user._id
                        );
                    }
                }
            }
            
            // Update the suggested users list if any match the target
            if (state.SuggestedUsers.length > 0) {
                state.SuggestedUsers = state.SuggestedUsers.map(user => {
                    if (user._id === targetUserId) {
                        return {
                            ...user,
                            followers: isFollowing 
                                ? [...(user.followers || []), state.user?._id].filter(Boolean)
                                : (user.followers || []).filter(id => id !== state.user?._id)
                        };
                    }
                    return user;
                });
            }
        }
    }
});

export const {setAuthUser , setSuggestedUsers , setUserProfile , setSelectedUser , updateFollowStatus} = authSlice.actions;
export default authSlice.reducer;