import React from 'react'
import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/auth";
import { toast } from "react-hot-toast";
export default function useSignup() {
    const{mutate:signup,isPending}=useMutation({
        mutationFn:signupApi,
        onSuccess:(user)=>{
            console.log(user);
            toast.success("Login Successful please verify the new account from user's email address");
        },
        onError:error=>{console.log(error.message);toast.error("provided email or password is incorrect");}});return({signup,isPending})}
