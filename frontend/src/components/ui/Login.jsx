"use client";

import { Label } from "../ui/label";
import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";


const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`,
        input,
        {
          header: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        // router.push('/dashboard');
        router.push("../home");
        setInput({
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
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signUpHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">BₐggₐGᵣₐₘ</h1>
          <p className="text-sm text-center">
            Login to see photos and videos from your friends
          </p>
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
        {
            loading ? (
                <Button>
                    <Loader2 className="mr-2 h-4 animate-spin"/>
                    Please Waot
                </Button>
            ) : (
                <Button type="submit">Login</Button>
            )
        }
        <span className="text-center">Dont Have An Account? <Link className="text-blue-400" href="/signupPage">SignUp</Link></span>

      </form>
    </div>
  );
};

export default Login;
