
'use client'; 

import RegisterForm from '@/components/organisms/RegisterForm';
import { Sidebar } from '@/components/organisms/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]); 

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#020618]"> 
      
      <div className="w-16 sm:w-20 md:w-128 lg:w-144 xl:w-144 border-r border-gray-800 hidden md:flex md:flex-col">
        <Sidebar />
      </div>
    
      <div className="flex-1 flex items-center justify-center bg-[#020618]"> 
        <RegisterForm />
      </div>

    </div>
  );
}