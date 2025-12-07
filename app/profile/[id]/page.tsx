'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/organisms/MainLayout';
import { useParams, useRouter } from 'next/navigation';
import { getUserById } from '@/lib/api/users';
import { getPosts, getPostById } from '@/lib/api/posts';
import { getComments } from '@/lib/api/comments';
import { getLikes } from '@/lib/api/likes';
import PostCard from '@/components/molecules/PostCard';
import { useAuth } from '@/context/AuthContext';
import { MessageCircle, Heart, FileText } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  created_at?: string;
}

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'likes'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ posts: 0, comments: 0, likes: 0 });
  const [loading, setLoading] = useState(true);

  const isCurrentUser = user?.id === profile?.id;

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getUserById(id as string);
        setProfile(userData);

        const userPostsRes = await getPosts({ user_id: id });
        const userPosts = userPostsRes.items || [];

        const commentsRes = await getComments();
        const userComments =
        commentsRes.items?.filter((c: any) => String(c.user_id) === String(id)) || [];

        const likesRes = await getLikes({ user_id: id });
        const likedPostsData = await Promise.all(
          likesRes.items.map(async (like: any) => {
            try {
              const post = await getPostById(like.post_id);
              const likesRes = await getLikes({ post_id: like.post_id });
              const commentsRes = await getComments({ post_id: like.post_id });

              return {
                id: post.id,
                content: post.content,
                username: post.users?.username || 'Utente sconosciuto',
                user_id: post.user_id,
                created_at: post.created_at,
                likesCount:
                  likesRes?.count ??
                  likesRes?.items?.length ??
                  (Array.isArray(likesRes) ? likesRes.length : 0),
                commentCount:
                  commentsRes?.count ??
                  commentsRes?.items?.length ??
                  (Array.isArray(commentsRes) ? commentsRes.length : 0),
              };
            } catch {
              return null;
            }
          })
        );

        setPosts(userPosts);
        setComments(userComments);
        setLikedPosts(likedPostsData.filter(Boolean));

        if (user?.id !== id) {
          setStats({
            posts: userPosts.length,
            comments: userComments.length,
            likes: likesRes.items?.length || 0,
          });
        }
      } catch (err) {
        console.error('Errore caricando il profilo:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadData();
  }, [id, user]);

  if (loading)
    return (
      <MainLayout>
        <p className="p-4 text-center text-gray-400">Caricamento profilo...</p>
      </MainLayout>
    );

  if (!profile)
    return (
      <MainLayout>
        <p className="p-4 text-center text-red-500">Profilo non trovato.</p>
      </MainLayout>
    );

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return posts.length ? (
          posts.map((p) => (
            <PostCard
              key={p.id}
              id={p.id}
              userId={p.user_id}
              content={p.content}
              username={p.username || profile.username}
              createdAt={p.created_at}
              likesCount={p.likesCount}
              commentCount={p.commentCount}
            />
          ))
        ) : (
          <p className="text-gray-400">Nessun post pubblicato.</p>
        );

      case 'comments':
        return comments.length ? (
          comments.map((c) => (
            <div key={c.id} className="border-b border-gray-800 p-4">
              <p className="text-gray-300 mb-2">{c.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(c.created_at).toLocaleString('it-IT')}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Non hai ancora scritto commenti.</p>
        );

      case 'likes':
        return likedPosts.length ? (
          [...new Map(likedPosts.map(p => [p.id, p])).values()].map((p) => (
            <PostCard
              key={`${p.id}-${p.user_id || Math.random()}`} 
              id={p.id}
              userId={p.user_id}
              content={p.content}
              username={p.username}
              createdAt={p.created_at}
              likesCount={p.likesCount}
              commentCount={p.commentCount}
            />
          ))
        ) : (
          <p className="text-gray-400">Non hai ancora messo Mi piace.</p>
        );
    }
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* HEADER UTENTE */}
        <div className="bg-[#0b1224] p-6 rounded-2xl shadow-md mb-8 border border-gray-800">
          <h1 className="text-2xl font-bold mb-1">@{profile.username}</h1>
          <p className="text-gray-400 mb-4">
            Si è unito il{' '}
            {new Date(profile.created_at || '').toLocaleDateString('it-IT', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="text-gray-300 mb-4">
            {profile.bio || 'Nessuna bio aggiunta.'}
          </p>

          {isCurrentUser && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push(`/profile/${profile.id}/edit`)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto"
              >
                Modifica profilo
              </button>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto"
              >
                Esci dall’account
              </button>
            </div>
          )}
        </div>

        {/* PROFILO DI ALTRI UTENTI */}
        {!isCurrentUser && (
          <div className="border-b border-gray-800 pb-4 mb-6 text-center">
            <div className="flex justify-center gap-10">
              <div>
                <p className="font-bold text-lg">{stats.posts}</p>
                <p className="text-gray-400 text-sm">Post</p>
              </div>
              <div>
                <p className="font-bold text-lg">{stats.comments}</p>
                <p className="text-gray-400 text-sm">Commenti</p>
              </div>
              <div>
                <p className="font-bold text-lg">{stats.likes}</p>
                <p className="text-gray-400 text-sm">Mi piace</p>
              </div>
            </div>

            <h2 className="text-center text-lg font-semibold mt-6 mb-4">
              Post pubblicati
            </h2>
            <div className="flex flex-col gap-4">
              {posts.length ? (
                posts.map((p) => (
                  <PostCard
                    key={p.id}
                    id={p.id}
                    userId={p.user_id}
                    content={p.content}
                    username={p.username || profile.username}
                    createdAt={p.created_at}
                    likesCount={p.likesCount}
                    commentCount={p.commentCount}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-center">
                  Nessun post pubblicato da questo utente.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TABS SOLO PER IL PROPRIO PROFILO */}
        {isCurrentUser && (
          <>
            <div className="flex justify-around border-b border-gray-800 mb-6">
              <button
                className={`pb-2 font-medium ${
                  activeTab === 'posts'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('posts')}
              >
                <FileText className="inline mr-1" size={16} />
                Post ({posts.length})
              </button>
              <button
                className={`pb-2 font-medium ${
                  activeTab === 'comments'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('comments')}
              >
                <MessageCircle className="inline mr-1" size={16} />
                Commenti ({comments.length})
              </button>
              <button
                className={`pb-2 font-medium ${
                  activeTab === 'likes'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('likes')}
              >
                <Heart className="inline mr-1" size={16} />
                Mi piace ({likedPosts.length})
              </button>
            </div>

            <div>{renderContent()}</div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
