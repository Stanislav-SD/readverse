"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function SignIn() {
    const { login } = useAuth()!;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const validateForm = () => {
        let isValid = true;
        setError("");
        const newErrors = { email: "", password: "" };

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

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);

        if (!validateForm()) {
            return; // Do not submit if validation fails
        }
        
        try {
            const some = await login(email, password, refresh);
        } catch (error) {
            const newErrors = { email: "Email is not valid", password: "Password is not valid" };
            setErrors(newErrors);
            setError("Wrong email or password!");
            //console.error("Login Error:", error);
        }
        setAuthLoading(false);
    };
    const resetErrors = () => setErrors({ email: "", password: "" });

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-[#D9D9D9] bg-opacity-0 space-y-6 select-none lg:w-full">
            <h1 className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black via-[#261B13] to-black">
                Hey again<span className="italic">!</span>
            </h1>

            
            {error != "" && <p style={{ color: 'red' }}>{error}</p>}
            
            {/* {error && <p>Error: {error.message}</p>} */}
            <div className="space-y-4">
                <div className="relative">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => {setEmail(e.target.value); resetErrors();}}
                        className={`w-full p-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#552020] ${errors.email ? 'border-red-500 border-2' : 'border-gray-300'}`}/>
                </div>
                <div className="relative">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value); resetErrors();}}
                        className={`w-full p-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#552020] ${errors.password ? 'border-red-500 border-2' : 'border-gray-300'}`}/>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center">
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" onChange={(e) => setRefresh(e.target.checked)} />
                        Remember me
                    </label>
                </div>
                <div className="relative">
                    <Link href="#" className="text-[#552020] hover:underline">
                        Forgot password?
                    </Link>
                </div>
            </div>
            <button className="w-full p-3 bg-[#552020] text-white rounded-md font-bold hover:bg-[#3f1515]" disabled={authLoading}>
                Log In
            </button>
            <p className="text-center text-sm">
                Don’t have an account?{" "}
                <Link href="/signup" className="text-[#552020] font-bold hover:underline">
                Sign Up
                </Link>
            </p>
        </form>
    );
}
