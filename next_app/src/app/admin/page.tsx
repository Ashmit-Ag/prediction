'use client'

import React from 'react'
import { signOut } from "next-auth/react";

const page = () => {
  return (
    <div>
      {/* <button className='bg-red-500' onClick={signOut}>LOG OUT</button>
       */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full
            py-3 rounded-xl bg-red-500/90 hover:bg-red-600
            font-semibold shadow-lg"
      >
        Log Out
      </button>
    </div>
  )
}

export default page
