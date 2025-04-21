"use client";

import { Label } from "../ui/label";
import React, { useEffect, useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useSelector } from "react-redux";
import store from "@/redux/store";
import { useRouter } from "next/navigation";


const Signup = () => {
  const {user} = useSelector(store=>store.auth);
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/register`,
        input,
        {
          header: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // router.push('/dashboard');
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();
  useEffect(()=>{
        if(user)
        {
          router.push("../home")
        }
      },[])
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signUpHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">
            SignUp to see photos and videos from your friends
          </p>
        </div>
        <div>
          <Label className="py-1 font-medium">username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            className="focus-visible:ring-transparent my-2"
            onChange={changeEventHandler}
          ></Input>
        </div>
        <div>
          <Label className="py-1 font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            className="focus-visible:ring-transparent my-2"
            onChange={changeEventHandler}
          ></Input>
        </div>
        <div>
          <Label className="py-1 font-medium">Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            className="focus-visible:ring-transparent my-2"
            onChange={changeEventHandler}
          ></Input>
        </div>
        <Button type="submit">SignUp</Button>
        <span className="text-center">Already Have An Account? <Link className="text-blue-400" href="/loginPage">Login</Link></span>
      </form>
    </div>
  );
};

export default Signup;
