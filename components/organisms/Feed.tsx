
'use client'

import React, { useState, useEffect } from 'react';
import { getPosts, NormalizedPost } from '@/lib/api';
import PostCard from '@/components/molecules/PostCard';

const mockPosts = [
  { 
    id: '1', 
    content: "Ciao mondo! Questo è il mio primo post in Next.js con Tailwind. L'accesso ospite mi permette di leggere, ma non di agire!" 
  },
  { 
    id: '2', 
    content: "L'architettura dei componenti è la chiave. Mantenere Atomi, Molecole e Organismi separati rende il codice pulito e manutenibile." 
  },
  { 
    id: '3', 
    content: "Testing l'accesso ospite. Se sono loggato, i pulsanti Like/Commento su queste card si attiveranno automaticamente, grazie a useAuth." 
  },
];

const Feed: React.FC = () => {
  return (
    <div className="w-full">
      {mockPosts.map(post => (
        <PostCard key={post.id} id={post.id} content={post.content} />
      ))}
    </div>
  );
};

const loadPosts = async () => {
  setLoading(true);
  setError(null);
  try {
    const postsData = await getPosts(userId ? { user_id: userId } : {});
    setPosts(postsData);
  } catch (err) {
    console.error("Errore nel caricamento posts:", err);
    setError("Errore nel caricamento dei post");
  } finally {
    setLoading(false);
  }
}

export default Feed;