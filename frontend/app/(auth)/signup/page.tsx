"use client"
import Link from "next/link";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

const Register = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;

export default function SignUp() {
  const [register, { error }] = useMutation(Register);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirm: ""
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", email: "", password: "", confirm: "" };

    if(!username){
      newErrors.username = "Username is required";
      isValid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is not valid";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    // Confirm password validation
    if(!password && password == confirmPassword) {
      newErrors.confirm = "Password is not identical";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        return; // Do not submit if validation fails
    }
    try {
      const { data } = await register({ variables: { username, email, password,  } });
      if(data?.register)
      {
        const registerData = JSON.parse(data.register);
        localStorage.setItem("accessToken", registerData.accessToken);
        if(registerData.refreshToken){
          localStorage.setItem("refreshToken", registerData.refreshToken);
        }
        router.push("/dashboard");
      }
    } catch (error) {
      const newErrors = { username: "Error", email: "Error", password: "Error", confirm: "Error" };
      setErrors(newErrors);
      console.error("Login Error:", error);
    }
  };
  const resetErrors = () => setErrors({ username: "", email: "", password: "", confirm: "" });

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      <h1 className="text-center text-4xl font-bold text-black">
        Welcome!
      </h1>
      {error && <p>Error: {error.message}</p>}
      <div className="space-y-4">
        <input
          value={username} onChange={(e) => {setUsername(e.target.value); resetErrors();}}
          type="text"
          placeholder="Username"
          className={`w-full p-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#552020] ${errors.username ? 'border-red-500 border-2' : 'border-gray-300'}`}
        />
        <input
          value={email} onChange={(e) => {setEmail(e.target.value); resetErrors();}}
          type="email"
          placeholder="Email"
          className={`w-full p-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#552020] ${errors.email ? 'border-red-500 border-2' : 'border-gray-300'}`}
        />
        <input
          value={password} onChange={(e) => {setPassword(e.target.value); resetErrors();}}
          type="password"
          placeholder="Password"
          className={`w-full p-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#552020] ${errors.password ? 'border-red-500 border-2' : 'border-gray-300'}`}
        />
        <input
          value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); resetErrors();}}
          type="password"
          placeholder="Confirm Password"
          className={`w-full p-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#552020] ${errors.confirm ? 'border-red-500 border-2' : 'border-gray-300'}`}
        />
      </div>
      {/* <div className="space-y-2">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          I agree to the terms and conditions
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          I would like to receive marketing emails
        </label>
      </div> */}
      <button className="w-full p-3 bg-[#552020] text-white rounded-md font-bold hover:bg-[#3f1515]">
        Sign Up
      </button>
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="text-[#552020] font-bold hover:underline">
          Log In
        </Link>
      </p>
    </form>
  );
};
