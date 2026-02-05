"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, User } from "lucide-react";

const navItems = [
  { href: "/user/home", icon: Home, label: "Home" },
  { href: "/user/wallet", icon: Wallet, label: "Wallet" },
  { href: "/user/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-125 bg-zinc-900/90 backdrop-blur border-t border-zinc-800">
        <div className="flex justify-around py-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center text-xs transition
                  ${
                    active
                      ? "text-pink-400"
                      : "text-zinc-400 hover:text-purple-400"
                  }`}
              >
                <Icon
                  size={22}
                  className={
                    active
                      ? "drop-shadow-[0_0_6px_rgba(236,72,153,0.8)]"
                      : ""
                  }
                />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
