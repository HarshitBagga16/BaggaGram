"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Loader2 } from "lucide-react";
import { setAuthUser } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [input,setInput] = useState({
    profilePhoto : user?.profilePicture,
    bio: user?.bio,
    gender:user?.gender,
  });

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if(file) {
        setInput({...input,profilePhoto:file});
    }
  }

  const selectChangeHandler = (value) => {
    setInput({...input,gender:value});
  }


  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePhoto) {
      formData.append("profilePicture", input.profilePhoto);
    }
  
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedData));
        router.push(`../profile/${user?._id}`);
        toast.success(res.data.message); // ✅ fixed
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={user?.profilePicture}
                alt="post image"
                className="h-full w-full object-cover"
              />
              <AvatarFallback className="bg-gray-200 text-center">
                CN
              </AvatarFallback>
            </Avatar>
            <div className="">
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">{user?.bio || "Bio here"}</span>
            </div>
          </div>

          <input onChange={fileChangeHandler} ref={imageRef} type="file" className="hidden" />
          <Button
            onClick={() => imageRef.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">
            Bio
            <Textarea value={input.bio} onChange = {(e) => setInput({...input,bio: e.target.value})} name="bio" className="focus-visible:ring-transparent" />
          </h1>
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <Select defaultValue = {input.gender} onValueChange = {selectChangeHandler}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={input.gender}/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
            {
                loading ? (
                    <Button className="w-fit bg-[#0095f6] hover:bg-[#2a8ccd]">Please wait <Loader2 className="mr-2 h-4 w-4 animate-spin"/> </Button>
                ) : (
                    <Button onClick={editProfileHandler} className="w-fit bg-[#0095f6] hover:bg-[#2a8ccd]">Submit</Button>
                )
            }
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
