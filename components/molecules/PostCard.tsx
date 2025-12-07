'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Heart } from 'lucide-react';
import { createLike, deleteLike, getLikes } from '@/lib/api/likes';
import { useAuth } from '@/context/AuthContext';
import { deletePost, updatePost } from '@/lib/api/posts';
import { Trash2, Edit } from 'lucide-react';


interface PostCardProps {
  id: string;
  userId: string;
  content: string;
  username: string;
  createdAt: string;
  likesCount?: number;
  commentCount?: number;
}

export default function PostCard({
  id,
  userId,
  content,
  username,
  createdAt,
  likesCount = 0,
  commentCount = 0,
}: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editContent, setEditContent] = useState(content);

  

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user) return;
      try {
        const res = await getLikes({ post_id: id, user_id: user.id });
        setIsLiked(res?.items?.length > 0);
      } catch (err) {
        console.error('Errore nel controllo like:', err);
      }
    };

    checkIfLiked();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return alert('Devi essere loggato per mettere mi piace!');
    try {
      if (isLiked) {
        await deleteLike(id);
        setLikes((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        await createLike(id);
        setLikes((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Errore like:', err);
    }
  };

  const handleUpdate = async () => {
  try {
    await updatePost(id, { content: editContent });
    setShowEditModal(false);
    window.location.reload();
  } catch (err) {
    console.error('Errore durante la modifica:', err);
  }
};

const handleDelete = async () => {
  try {
    await deletePost(id);
    setShowDeleteModal(false);
    window.location.reload();
  } catch (err) {
    console.error('Errore durante l\'eliminazione:', err);
  }
};


  return (
    <div className="border-b border-gray-800 p-4 hover:bg-[#0b1224] transition-colors w-full">
      {/* HEADER */}
    <div className="flex items-center justify-between mb-2">
  <Link
    href={`/profile/${userId}`}
    className="font-semibold text-white hover:text-blue-400 transition-colors mb-1 sm:mb-0"
  >
    @{username}
  </Link>
  <span className="text-xs text-gray-500 sm:ml-2">
    {new Date(createdAt).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}
  </span>

  {user?.id === userId && (
  <div className="flex gap-2 text-gray-400">
    <button
      onClick={() => setShowEditModal(true)}
      className="hover:text-blue-400"
      title="Modifica post"
    >
      <Edit size={16} />
    </button>
    <button
      onClick={() => setShowDeleteModal(true)}
      className="hover:text-red-500"
      title="Elimina post"
    >
      <Trash2 size={16} />
    </button>
  </div>
)}

</div>


      {/* CONTENUTO */}
      <div className="text-gray-200 prose prose-invert max-w-none mb-3">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>

      {/* AZIONI */}
      <div className="flex items-center gap-6 text-gray-400 text-sm">
        {/* LIKE */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 cursor-pointer transition-colors ${
            isLiked ? 'text-pink-500' : 'hover:text-pink-400'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likes}</span>
        </button>

        {/* COMMENTI */}
        <Link
          href={`/post/${id}`}
          className="flex items-center gap-1 cursor-pointer hover:text-blue-400 transition-colors"
        >
          <MessageCircle size={18} />
          <span>{commentCount}</span>
        </Link>
      </div>
      {/* MODAL MODIFICA */}
{showEditModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#0b1224] border border-gray-700 rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-2">Modifica post</h2>
      <p className="text-sm text-gray-400 mb-4">
        Puoi aggiornare il contenuto del tuo post qui sotto.
      </p>

      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowEditModal(false)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Annulla
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Salva
        </button>
      </div>
    </div>
  </div>
)}

{/* MODAL ELIMINA */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#0b1224] border border-gray-700 rounded-xl p-6 w-full max-w-md text-center">
      <h2 className="text-xl font-bold mb-2">Elimina post</h2>
      <p className="text-sm text-gray-400 mb-6">
        Sei sicuro di voler eliminare questo post? Questa azione non può essere annullata.
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Annulla
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Elimina
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
