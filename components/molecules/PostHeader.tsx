import React from 'react';

interface PostHeaderProps {
  username: string;
  handle: string;
  time: string;
}

export default function PostHeader({ handle, time }: PostHeaderProps) {
  return (
    <div>
      <p className="text-white-500">@{handle}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  );
}
