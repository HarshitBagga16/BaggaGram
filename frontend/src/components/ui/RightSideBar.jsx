// import * as Avatar from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {Avatar ,AvatarFallback, AvatarImage } from "./avatar";
import SuggestedUsers from "./SuggestedUsers"

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link href={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post image" className="h-full w-full object-cover" />
            <AvatarFallback className="bg-gray-200 text-center">CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="">
          <h1 className="font-semibold text-sm"><Link href={`/profile/${user?.id}`}>{user?.username}</Link></h1>
          <span className="text-gray-600 text-sm">{user?.bio || "Bio here"}</span>
        </div>
      </div>

      <SuggestedUsers/>

    </div>
  );
};

export default RightSideBar;
