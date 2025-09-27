"use client";

import React, { useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useUserContext } from '@/context/UserContext';

function page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {login} = useUserContext();

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    
    axios.post("/api/login",{
      email,
      password
    })
    .then(({data}) => {
      if(data.success) {
        setEmail("");
        setPassword("");
        login(data.user, data.tenant);
        localStorage.setItem("user",JSON.stringify(data.user));
        localStorage.setItem("tenant", JSON.stringify(data.tenant));
        toast.success(data.message)
        router.replace("/notes");
      }
    })
    .catch(({response}) => {
        const errorMessage = response.data.message;
        toast.error(errorMessage);
    })
    .finally(() => setLoading(false));
  }

  return (
    <div className='w-full h-full p-5'>
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-sm mx-auto my-5">
          <CardHeader>
            <CardTitle className="text-center text-xl">Login to TenantNotes</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button 
              type="submit"
              className='w-full sm:text-lg bg-black hover:bg-gray-800 cursor-pointer rounded-md text-white py-1 px-3 sm:py-1 sm:px-2'
            >
              {loading ? (
                <>
                  <Loader2 className='animate-spin' />{' '}
                  Loading
                </>
              ) : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default page;
