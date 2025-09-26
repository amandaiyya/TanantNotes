"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <div className='w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center flex-wrap '>
      <Link href='/' className='text-base xs:text-lg sm:text-xl font-bold cursor-pointer'>TenantNotes</Link>
      <Button className='sm:text-lg bg-black hover:bg-gray-800 cursor-pointer rounded-md text-white py-1 px-3 sm:py-1 sm:px-2'>
        Login
      </Button>
    </div>
  )
}

export default Navbar
