import React from 'react';
import {Sidebar} from '@/components/organisms/Sidebar'; 

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex justify-center min-h-screen bg-[#020618] text-white">
      <div className="w-16 sm:w-20 md:w-128 lg:w-144 xl:w-144 border-r border-gray-800 hidden md:flex md:flex-col">
        <Sidebar />
      </div>

      <main className="w-full md:max-w-xl lg:max-w-2xl border-x border-gray-800">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;