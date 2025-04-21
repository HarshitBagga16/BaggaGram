import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost , posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  useEffect(() => {
    if(selectedPost)
    {
      setComment(selectedPost.comments);
    }
  },[selectedPost])
  const sendMessageHandler = async () => {
    if (!text.trim()) {
      toast.error("Please enter a comment before submitting");
      return;
    }
  
    console.log("inside handler");
    try {
      console.log("inside try");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${selectedPost._id}/comment`,
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
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log("error aagaya");
      if (isAxiosError(error)) {
        console.log(error.response);
      }
      console.log(error.message);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[1000] p-0"
      >
        <DialogTitle className="sr-only">Comment Section</DialogTitle>

        {/* Close Button for Main Dialog */}
        <DialogClose
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition"
        >
          <X size={20} />
        </DialogClose>

        <div className="flex bg-white max-w-4xl w-full h-[600px] rounded-lg shadow-lg overflow-hidden">
          <div className="w-1/2 bg-black flex items-center justify-center">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="w-1/2 flex flex-col bg-white">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex gap-3 items-center">
                <Link href="/loginPage">
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <Link href="" className="font-semibold text-sm">
                  {selectedPost?.author?.username}
                </Link>
              </div>

              {/* More Options Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-black" />
                </DialogTrigger>
                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded-lg p-4 w-40 text-center border">
                  <DialogTitle className="sr-only">More Options</DialogTitle>

                  {/* Close Button for Inner Dialog */}
                  <DialogClose className="absolute top-2 right-2 p-1 text-gray-500 hover:text-black">
                    <X size={18} />
                  </DialogClose>

                  <div className="cursor-pointer w-full text-[#ED4956] font-bold p-2 hover:bg-gray-100">
                    Unfollow
                  </div>
                  <hr />
                  <div className="cursor-pointer w-full p-2 hover:bg-gray-100">
                    Add to Favorites
                  </div>
                  <hr />
                  <div className="cursor-pointer w-full p-2 hover:bg-gray-100">
                    Report
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Comment Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm text-gray-700">
              {selectedPost?.comments.map((comment, index) => (
                <Comment key={comment._id || index} comment={comment} />
              ))}
            </div>

            {/* Add Comment Input */}
            <div className="p-3 border-t flex items-center gap-2">
              <input
                onChange={changeEventHandler}
                value={text}
                onClick={sendMessageHandler}
                type="text"
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none"
              />
              <Button disabled={!text.trim()} variant="outline">
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
