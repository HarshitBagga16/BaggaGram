import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name : 'realTimeNotification',
    initialState : {
        likeNotification:[],
    },
    reducers : {
        setlikeNotification : (state,action) => {
            if (!state.likeNotification) {
                state.likeNotification = [];
            }
            
            if (action.payload.type === 'like')
            {
                const exists = state.likeNotification.some(
                    notification => notification && 
                    notification.userId === action.payload.userId && 
                    notification.postId === action.payload.postId
                );
                
                if (!exists) {
                    state.likeNotification.unshift(action.payload);
                    
                    console.log("New notification added, count:", state.likeNotification.length);
                }
            }
            else if (action.payload.type === 'dislike')
            {
                if (Array.isArray(state.likeNotification)) {
                    state.likeNotification = state.likeNotification.filter(
                        item => !(item && 
                            item.userId === action.payload.userId && 
                            item.postId === action.payload.postId)
                    );
                    
                    console.log("Notification removed, count:", state.likeNotification.length);
                }
            }
        },
        clearNotifications: (state) => {
            state.likeNotification = [];
        }
    }
})

export const {setlikeNotification, clearNotifications} = rtnSlice.actions;
export default rtnSlice.reducer;