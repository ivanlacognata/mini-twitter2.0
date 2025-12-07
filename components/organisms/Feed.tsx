'use client';

import React, { useEffect, useState } from 'react';
import PostCard from '@/components/molecules/PostCard';
import { getPosts } from '@/lib/api/posts';
import { getComments } from '@/lib/api/comments';
import { getLikes } from '@/lib/api/likes';

interface FeedProps {
  posts: any[];
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
}

const Feed: React.FC<FeedProps> = ({ posts, setPosts }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostsWithCounts = async () => {
      try {
        setLoading(true);

        const data = await getPosts({ limit: 20, offset: 0 });
        const postsList = data.items || [];

        const postsWithCounts = await Promise.all(
          postsList.map(async (post: any) => {
            try {
              const [likesRes, commentsRes] = await Promise.all([
                getLikes({ post_id: post.id, count: true }),
                getComments({ post_id: post.id, count: true }),
              ]);

              const likesCount =
                likesRes?.count ?? likesRes?.items?.length ?? 0;

              const commentCount =
                commentsRes?.count ?? commentsRes?.items?.length ?? 0;

              return {
                ...post,
                likes_count: likesCount,
                comment_count: commentCount,
              };
            } catch {
              return { ...post, likes_count: 0, comment_count: 0 };
            }
          })
        );

        setPosts(postsWithCounts);
      } catch (err: any) {
        console.error('Errore caricamento feed:', err);
        setError(err.message || 'Errore nel caricamento dei post');
      } finally {
        setLoading(false);
      }
    };

    if (posts.length === 0) fetchPostsWithCounts();
  }, [posts.length, setPosts]);

  if (loading)
    return <p className="text-center p-4 text-gray-400">Caricamento post...</p>;

  if (error)
    return <p className="text-center p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          userId={post.user_id}
          content={post.content}
          username={post.username || post.users?.username || 'Utente'}
          createdAt={post.created_at}
          likesCount={post.likes_count || 0}
          commentCount={post.comment_count || 0}
        />
      ))}
    </div>
  );
};

export default Feed;
