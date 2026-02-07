"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!form.fullName.trim()) return "Full name is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email";
        if (!/^\d{10}$/.test(form.phone)) return "Phone must be 10 digits";
        if (form.password.length < 6)
            return "Password must be at least 6 characters";

        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Signup failed");
                return;
            }

            const login = await signIn("credentials", {
                email: form.email,
                password: form.password,
                type:"user",
                redirect: false,
              });
        
              if (login?.error) {
                setError("Account created, but login failed");
                return;
              }

            // ✅ Redirect after successful signup
            router.push("/user/home");

        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-zinc-900/70 backdrop-blur-lg border border-zinc-700 rounded-2xl p-8"
            >
                <h1 className="text-3xl font-bold text-center mb-6">
                    Create Account
                </h1>

                {error && (
                    <p className="text-red-400 text-sm mb-3 text-center">
                        {error}
                    </p>
                )}

                <input
                    name="fullName"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                    className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800"
                />

                <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    required
                    className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-2 rounded-lg font-semibold bg-linear-to-r from-purple-500 to-pink-500"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>

                <p className="text-sm text-center mt-5 text-zinc-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-pink-400">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
