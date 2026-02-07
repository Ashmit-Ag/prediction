"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email address";
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email: form.email,
                password: form.password,
                type:"user",
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password");
                return;
            }

            // ✅ Redirect after successful login
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
                    Log In
                </h1>

                {error && (
                    <p className="text-red-400 text-sm mb-3 text-center">
                        {error}
                    </p>
                )}

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
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
                    {loading ? "Logging in..." : "Log In"}
                </button>

                <p className="text-sm text-center mt-5 text-zinc-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-pink-400">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
