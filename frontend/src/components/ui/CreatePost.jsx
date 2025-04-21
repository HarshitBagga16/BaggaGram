import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { Button } from "./button";
import { readFileAsDataURL } from "@/lib/utils";
import { X, ImagePlus, Loader2 } from "lucide-react"; // Importing icons
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import {Textarea} from "./textarea"

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imgPreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store => store.auth)
  const {posts} = useSelector(store=>store.post)
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append("caption" , caption);
    if(imgPreview) formData.append("image",file);
    // console.log(file, caption);
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/post/addpost` , formData , {
        headers:{
          'Content-Type' : 'multipart/form-data'
        },
        withCredentials : true,
      });
      if(res.data.success)
      {
        console.log("Before update:", posts);
dispatch(setPosts([res.data.post, ...posts]));
console.log("After update:", [res.data.post, ...posts]);
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message)
      // setLoading(false);
    }
    finally
    {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative">
          {/* X Close Icon */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <DialogTitle className="text-lg text-center font-semibold">
            Create New Post
          </DialogTitle>

          {/* Profile */}
          <div className="flex gap-3 items-center my-3">
            <Avatar>
              <AvatarImage src="" alt="img" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xs">username</h1>
              <span className="text-gray-600 text-xs">bio here</span>
            </div>
          </div>

          {/* Image Preview (if exists) */}
          {imgPreview ? (
            <div className="w-full h-64 flex items-center justify-center border rounded-md overflow-hidden">
              <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            // Upload Image Placeholder
            <div
              className="w-full h-64 flex flex-col items-center justify-center border border-dashed rounded-md bg-gray-100 cursor-pointer"
              onClick={() => imageRef.current.click()}
            >
              <ImagePlus size={40} className="text-gray-400" />
              <p className="text-gray-600 text-sm">Click to upload an image</p>
            </div>
          )}

          {/* Upload Image Input (Hidden) */}
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileChangeHandler}
          />

          {/* Caption Input */}
          <Textarea
            className="w-full border p-2 rounded mt-3 focus:outline-none focus:ring-0"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Upload & Post Buttons */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <Button
              onClick={() => imageRef.current.click()}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Upload Picture From Your Computer
            </Button>
            {imgPreview && (
              <Button
                onClick={createPostHandler}
                type="submit"
                className="w-full bg-green-500 text-white hover:bg-green-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
