
import React from 'react';
import PostHeader from './PostHeader';
import PostActions from './PostActions';

interface PostCardProps {
  id: string;
  content: string;
}

const PostCard: React.FC<PostCardProps> = ({ content }) => {
  return (
    <div className="p-4 border-b border-gray-800 hover:bg-gray-950 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        {/* Avatar fittizio (potrebbe essere un Atom) */}
        <div className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0" />
        
        <div className="flex-1">
          <PostHeader 
            username="fittizio"
            handle="fittizio123" 
            time="2h" 
          />
          
          <p className="mt-1 text-white whitespace-pre-wrap">{content}</p>
          
          <PostActions />
        </div>
      </div>
    </div>
  );
};

export default PostCard;