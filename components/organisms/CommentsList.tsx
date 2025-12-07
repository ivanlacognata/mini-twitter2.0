'use client';

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/context/AuthContext';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user?: {
    id: string;
    username?: string;
  };
}

interface CommentsListProps {
  comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  const { user } = useAuth();
  const [likedComments, setLikedComments] = useState<string[]>([]);

  useEffect(() => {
    const savedLikes = localStorage.getItem('likedComments');
    if (savedLikes) {
      setLikedComments(JSON.parse(savedLikes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('likedComments', JSON.stringify(likedComments));
  }, [likedComments]);

  const toggleLike = (commentId: string) => {
    if (!user) {
      alert('Devi essere loggato per mettere mi piace ai commenti!');
      return;
    }

    setLikedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  if (!comments || comments.length === 0)
    return <p className="text-gray-400 p-4">Nessun commento disponibile.</p>;

  return (
    <div className="divide-y divide-gray-800">
      {comments.map((comment) => {
        const isLiked = likedComments.includes(comment.id);

        return (
          <div key={comment.id} className="p-4 flex flex-col">
            {/* USER */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-white">
                @{comment.user?.username || 'Utente'}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString('it-IT')}
              </span>
            </div>

            {/* CONTENT con Markdown */}
            <div className="text-gray-300 mb-2 prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {comment.content}
              </ReactMarkdown>
            </div>

            <button
              onClick={() => toggleLike(comment.id)}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked
                  ? 'text-pink-500'
                  : 'text-gray-400 hover:text-pink-400'
              }`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{isLiked ? '1' : '0'}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
