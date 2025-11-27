
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createPost } from '@/lib/api'; 

interface NewPostFormProps {
  onPostCreated?: () => void; 
}

export default function NewPostForm({ onPostCreated }: NewPostFormProps) {
  const { user, token } = useAuth(); // 

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const cleanedContent = content.trim();
  
  const isDisabled = !user || loading || cleanedContent === '';
  const buttonClass = isDisabled
    ? 'bg-blue-300 cursor-not-allowed'
    : 'bg-blue-500 hover:bg-blue-600 transition-colors';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isDisabled) return;
    
    if (!user || !user.id) {
      console.error("Auth user:", user);
      setError("ID utente non trovato. Effettua nuovamente il login.");
      setLoading(false);
      return;
    }

    if (!token) {
        setError("Token di autenticazione mancante. Effettua il login.");
        return;
    }
    
    setLoading(true);

    try {
      const postData = { user_id: user.id, content: cleanedContent };
      console.log("Creating post with user_id:", user.id, "content:", cleanedContent);
      
      await createPost(postData, token); 

      setContent('');
      if (onPostCreated) {
        onPostCreated();
      }

    } catch (err) {
      console.error("Errore nella creazione del post:", err);
      setError((err as Error).message || "Impossibile pubblicare il post.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 border-b border-gray-800">
      {error && (
        <div className="text-red-500 mb-2 p-2 border border-red-500 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0" />

        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cosa sta succedendo?"
            rows={2}
            className="w-full bg-transparent text-white text-xl resize-none focus:outline-none placeholder-gray-500"
          />

          <div className="flex justify-end pt-2 border-t border-gray-800">
            <button
              type="submit"
              disabled={isDisabled}
              className={`text-white font-bold py-2 px-4 rounded-full ${buttonClass}`}
            >
              {loading ? 'Pubblicazione...' : 'Posta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}