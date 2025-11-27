'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext'; 
import { ShareIcon, HeartIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

export default function PostActions() {
  const { user } = useAuth();

  const isDisabled = !user;
  const disabledClass = isDisabled
    ? 'text-gray-600 cursor-default'
    : 'text-gray-400 hover:text-blue-500 hover:bg-gray-900';

  function ActionButton({ icon, count }: { icon: React.ReactNode; count: number }) {
    return (
      <button
        className={`flex items-center space-x-1 p-2 rounded-full transition-colors ${disabledClass}`}
        disabled={isDisabled}
      >
        {icon}
        <span className="text-xs">{count}</span>
      </button>
    );
  }

  return (
    <div className="flex justify-between mt-3 max-w-lg">
      <ActionButton icon={<ChatBubbleBottomCenterTextIcon className="w-5 h-5" />} count={12} />
      <ActionButton icon={<HeartIcon className="w-5 h-5" />} count={25} />
      <ActionButton icon={<ShareIcon className="w-5 h-5" />} count={3} />
    </div>
  );
}
