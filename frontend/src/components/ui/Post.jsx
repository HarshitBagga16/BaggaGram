"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@radix-ui/react-dialog";
import { Bookmark, BookmarkFilled, MessageCircle, MoreHorizontal, Send, Share } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import CommentDialog from "./CommentDialog";
import { FaHeart, FaRegHeart, FaBookmark as FaBookmarkSolid } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "@/components/ui/badge"; // make sure Badge is imported
import { useRouter } from "next/navigation";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const router = useRouter();
  const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes?.length || 0);
  const [comment, setComment] = useState(post.comments || []);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  useEffect(() => {
    if (user && post) {
      setLiked(post.likes?.includes(user._id) || false);
      setPostLike(post.likes?.length || 0);
      
      // Check if post is bookmarked by the current user
      const isPostBookmarked = user.bookmarks?.includes(post._id);
      setIsBookmarked(isPostBookmarked || false);
    }
  }, [user, post]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const shareHandler = () => {
    router.push("/feature-unavailable");
  };

  const likeOrDislikeHandler = async () => {
    if (!user || isLikeLoading) return;
    
    try {
      setIsLikeLoading(true);
      const action = liked ? "dislike" : "like";
      
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("Like/dislike error:", error);
      toast.error("Failed to update like status");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const commentHandler = async () => {
    console.log("inside handler");
    try {
      console.log("inside try");
      console.log(post._id);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("after fetch");

      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.message];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log("error aagaya");

      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const bookmarkHandler = async() => {
    if (!user || isBookmarkLoading) return;
    
    try {
      setIsBookmarkLoading(true);
      
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      
      if(res.data.success) {
        // Toggle the bookmarked state locally
        setIsBookmarked(!isBookmarked);
        
        // Update user bookmarks in Redux
        const updatedUser = { ...user };
        
        if (res.data.type === 'saved') {
          // Add to bookmarks if not already there
          if (!updatedUser.bookmarks?.includes(post._id)) {
            updatedUser.bookmarks = [...(updatedUser.bookmarks || []), post._id];
          }
        } else {
          // Remove from bookmarks
          updatedUser.bookmarks = updatedUser.bookmarks?.filter(id => id !== post._id) || [];
        }
        
        // Update user in Redux
        dispatch({ type: 'auth/setAuthUser', payload: updatedUser });
        
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsBookmarkLoading(false);
    }
  }
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post Image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
          <h1>{post.author?.username}</h1>
          {
            user?._id === post.author._id && <Badge variant="secondary">
            <span className="text-blue-500">Author</span>
          </Badge>
          }
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white w-[90%] max-w-[500px] h-auto p-6 rounded-lg shadow-lg flex flex-col items-center gap-3">
              <DialogTitle className="text-lg font-bold">
                Post Options
              </DialogTitle>
              <DialogClose asChild>
                {
                  post.author?._id !== user?._id &&
                <Button
                  variant="ghost"
                  className="w-full text-red-500 font-bold"
                >
                  Unfollow
                </Button>
                }
              </DialogClose>
              <DialogClose asChild>
                <Button variant="ghost" className="w-full font-bold">
                  Add To Fav
                </Button>
              </DialogClose>

              <DialogClose asChild>
                {user && user?._id === post?.author._id && (
                  <Button
                    onClick={deletePostHandler}
                    variant="ghost"
                    className="w-full text-gray-600"
                  >
                    Delete
                  </Button>
                )}
              </DialogClose>
              <DialogClose asChild>
                <Button variant="ghost" className="w-full text-gray-600">
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_image"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"24"}
              className={`cursor-pointer text-red-600 ${isLikeLoading ? 'opacity-50' : ''}`}
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              className={`cursor-pointer hover:text-gray-500 ${isLikeLoading ? 'opacity-50' : ''}`}
              size={"22px"}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-500"
          />
          <div className="relative group">
            <Send 
              onClick={shareHandler} 
              className="cursor-pointer hover:text-gray-500"
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Share post
            </div>
          </div>
        </div>
        
        {/* Show filled or outlined bookmark based on bookmark status */}
        {isBookmarked ? (
          <FaBookmarkSolid 
            onClick={bookmarkHandler} 
            className={`cursor-pointer text-gray-800 ${isBookmarkLoading ? 'opacity-50' : ''}`}
            size={"22px"}
          />
        ) : (
          <Bookmark 
            onClick={bookmarkHandler} 
            className={`cursor-pointer hover:text-gray-500 ${isBookmarkLoading ? 'opacity-50' : ''}`}
            size={22}
          />
        )}
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p className="">
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          className="cursor-pointer text-sm text-gray-400"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
        >
          View All {comment.length} Comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment"
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
