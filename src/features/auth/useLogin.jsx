import React from 'react'
import { useNavigate } from "react-router-dom";
import { useMutation,useQueryClient} from "@tanstack/react-query";
import {login as loginapi} from "../../services/auth";
import { toast } from "react-hot-toast";
export default function useLogin() {const queryClient=useQueryClient();
  const navigate=useNavigate();
  const {mutate:login,isPending}=useMutation({
    mutationFn:({email,password})=>loginapi({
      email,password
    }),
    onSuccess:(user)=>{
      queryClient.setQueryData(["users"],user.user)
    //   navigate("/dashboard",{replace:true});
      toast.success("Login Successful");
    },
    onError:error=>{console.log(error.message);toast.error("provided email or password is incorrect");},})
  return {login,isPending};}
