"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useUserContext } from '@/context/UserContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Navbar() {
  const [loading, setLoading] = useState(false);
  const {user, tenant, upgradeSubscription, logout} = useUserContext();

  const showUpgradeButton = (user?.role === "admin") && (tenant?.plan === "free");

  const router = useRouter();

  const handleUpgrade = () => {
    setLoading(true);

    axios.post(`/api/tenants/${tenant?.slug}/upgrade`)
    .then(({data}) => {
      if(data.success) {
        toast.success("Subscription Upgraded Successfully");
        upgradeSubscription();
      }
    })
    .catch(({response}) => {
      const errorMessage = response.data.message;
      toast.error(errorMessage);
    })
    .finally(() => setLoading(false));
  }

  const handleLogout = () => {
    setLoading(true);

    axios.post("/api/logout")
    .then(({data}) => {
      if(data.success){
        logout();
        toast.success(data.message);
        router.replace("/login");
      }
    })
    .catch((error) => toast.error("Logout Failed"))
    .finally(() => setLoading(false));
  }

  return (
    <div className='w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center flex-wrap '>
      <Link href='/' className='text-base xs:text-lg sm:text-xl font-bold cursor-pointer'>TenantNotes</Link>

      <div className="space-x-2">
        {showUpgradeButton && 
        <Button 
          onClick={handleUpgrade}
          className='sm:text-lg bg-yellow-400 hover:bg-yellow-500 cursor-pointer rounded-md text-black py-1 px-3 sm:py-1 sm:px-2'>
            {loading ? (
                <>
                  <Loader2 className='animate-spin' />{' '}
                  Loading
                </>
              ) : "Upgrade"}
        </Button>}

        {user ? (
          <Button
            onClick={handleLogout}
            className='sm:text-lg bg-black hover:bg-gray-800 cursor-pointer rounded-md text-white py-1 px-3 sm:py-1 sm:px-2'>
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => router.replace("/login")}
            className='sm:text-lg bg-black hover:bg-gray-800 cursor-pointer rounded-md text-white py-1 px-3 sm:py-1 sm:px-2'
          >
            Login
          </Button>
        )}
        
      </div>
    </div>
  )
}

export default Navbar;
