"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 Change password API call (example)
    /*
    await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: password,
        newPassword,
      }),
    });
    */

    setPassword("");
    setNewPassword("");
  };

  return (
    <div className="h-screen flex flex-col text-white">
      {/* Header */}
      <div className="bg-zinc-900/90 backdrop-blur px-6 pt-5 pb-4 border-b border-zinc-800">
        <h1 className="text-3xl text-center font-bold bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Profile
        </h1>
      </div>

      <div className="w-full px-5 mt-6 flex flex-col items-center justify-between h-full pb-20">

        <div>

          {/* Profile Card */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6 mt-6 mb-8">
            <p className="text-zinc-400 text-sm">Logged in user</p>
            <p className="text-lg font-semibold">user@email.com</p>
          </div>

          {/* Change Password */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Change Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700
                focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-purple-500"
                />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700
                focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-purple-500"
                />

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500
                font-semibold shadow-lg shadow-purple-500/20 hover:opacity-90 transition"
                >
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Logout Button */}
        <div className="w-[90%] max-w-md">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full
            py-3 rounded-xl bg-red-500/90 hover:bg-red-600
            font-semibold shadow-lg"
            >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
