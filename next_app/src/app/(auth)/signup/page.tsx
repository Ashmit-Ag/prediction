"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // await fetch("/api/auth/signup", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(form),
        // });

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">

            {/* Background glow */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute w-125 h-125 bg-purple-600 opacity-20 blur-[140px] rounded-full top-10 left-10" />
                <div className="absolute w-125 h-125 bg-pink-500 opacity-20 blur-[140px] rounded-full bottom-10 right-10" />
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-zinc-900/70 backdrop-blur-lg border border-zinc-700 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]"
            >
                <h1 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Create Account
                </h1>

                {/* Inputs */}
                <div className="flex flex-col items-center gap-2 w-full">

                    <input
                        name="fullName"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-purple-500 transition"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-purple-500 transition"
                    />

                    <input
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        required
                        className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-purple-500 transition"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-purple-500 transition"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    className="w-full mt-4 py-2 rounded-lg font-semibold bg-linear-to-r from-purple-500 to-pink-500 hover:opacity-90 transition shadow-lg shadow-purple-500/30">
                    Sign Up
                </button>

                {/* Login link */}
                <p className="text-sm text-center mt-5 text-zinc-400">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-pink-400 hover:text-purple-400 transition"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
