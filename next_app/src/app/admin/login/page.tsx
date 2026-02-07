"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    console.log("Attempting admin login:", form.email);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        type: "admin",
        redirect: false,
      });

      console.log("SignIn response:", res);

      if (!res || res.error) {
        setError("Invalid credentials");
        console.error("Login failed:", res?.error);
        return;
      }

      console.log("Login successful — waiting for session...");

    } catch (err) {
      console.error("Login exception:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Session debug + redirect
  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);

    if (status === "authenticated") {
      if (session?.user?.role === "ADMIN") {
        console.log("Redirecting ADMIN → /admin");
        router.push("/admin");
      }

      if (session?.user?.role === "MANAGER") {
        console.log("Redirecting MANAGER → /manager");
        router.push("/manager");
      }
    }
  }, [session, status, router]);

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
        </form>
    </div>
);
}
