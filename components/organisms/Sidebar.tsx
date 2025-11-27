'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface SidebarItemProps {
  href: string;
  label: string;
  onClick?: () => void;
  bgColor?: string;
  hoverColor?: string;
  borderColor?: string;
}

export function SidebarItem({ href, label, onClick, bgColor, hoverColor, borderColor }: SidebarItemProps) {
  return (
    <li
      style={{ backgroundColor: bgColor || 'transparent' }}
      className={`w-52 flex items-center p-3 mb-3 rounded-full cursor-pointer transition-colors ${bgColor} ${hoverColor} ${borderColor}`}
      onClick={onClick}
    >
      <Link href={href} className="w-full justify-center flex items-center">
        <span className="text-xs text-white font-semibold">{label}</span>
      </Link>
    </li>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth(); 

  return (
    <nav className="p-4 flex flex-col items-end lg:items-end h-full sticky top-0">
      
      <div className="p-3 mb-4 text-xl font-black text-white transition-colors cursor-pointer">
        Partecipa alla <p>conversazione</p>
      </div> 
      
      <ul className="space-y-1 w-full flex flex-col items-end">
        {user ? (
          <>
            <SidebarItem 
              href={`/profile/${user.id}`} 
              label="Profilo" 
              bgColor="black"
            />
            <SidebarItem
              href="#" 
              label="Logout" 
              onClick={logout}
              bgColor="black"
            />
          </>
        ) : (
          <>
            <SidebarItem 
            href="/register" 
            label="Crea Account" 
            bgColor="bg-blue-500"
            hoverColor="hover:bg-blue-600"
            />

            <SidebarItem 
              href="/login" 
              label="Accedi" 
              bgColor="bg-slate-950"
              hoverColor="hover:bg-slate-900"
              borderColor="border border-gray-800"
            />
          </>
        )}
      </ul>

      {/* Pulsante per il Post (Visibile solo se loggato) */}
      {user && (
        <button className="mt-6 bg-blue-500 text-white font-bold py-3 px-6 rounded-full w-full max-w-[200px] hover:bg-blue-600 transition-colors hidden lg:block">
          Posta
        </button>
      )}

      {/* Placeholder dell'utente loggato in basso (se loggato) */}
      {user && (
        <div className="mt-auto p-3 rounded-full hover:bg-gray-900 cursor-pointer w-full hidden lg:flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full" />
          <div className="text-sm">
            <p className="font-bold">{user.username}</p>
            <p className="text-gray-500">@{user.username}</p>
          </div>
        </div>
      )}
    </nav>
  );
}
