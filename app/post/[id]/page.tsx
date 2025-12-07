'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PostCard from '@/components/molecules/PostCard';
import { getPostById } from '@/lib/api/posts';
import { getComments } from '@/lib/api/comments';
import { getLikes } from '@/lib/api/likes';
import CommentsList from '@/components/organisms/CommentsList';
import NewCommentForm from '@/components/organisms/NewCommentForm';

interface Post {
  id: string;
  content: string;
  username?: string;
  created_at: string;
  user_id: string;
  users?: {
    id: string;
    username: string;
  };
  likesCount?: number;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user?: {
    id: string;
    username?: string;
  };
  user_id?: string;
}

export default function PostPage() {
  const router = useRouter();
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPostAndComments() {
      try {
        const postData = await getPostById(id as string);

        const likesRes = await getLikes({ post_id: id });
        const likesCount =
          likesRes?.count ??
          likesRes?.items?.length ??
          (Array.isArray(likesRes) ? likesRes.length : 0);

        const normalizedPost: Post = {
          ...postData,
          username: postData.username || postData.users?.username || 'Utente',
          user_id: postData.user_id || postData.users?.id || '',
          likesCount,
        };
        setPost(normalizedPost);

        const commentsData = await getComments({ post_id: id });
        const normalizedComments = (commentsData.items || []).map((c: any) => ({
          ...c,
          user: {
            id: c.user_id || c.users?.id || '',
            username: c.username || c.users?.username || 'Utente',
          },
        }));
        setComments(normalizedComments);
      } catch (err: any) {
        console.error('Errore caricando post o commenti:', err);
        setError(err.message || 'Errore nel caricamento del post');
      } finally {
        setLoading(false);
      }
    }

    if (id) loadPostAndComments();
  }, [id]);

  const handleAddComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  if (loading)
    return <p className="p-4 text-center text-gray-400">Caricamento post...</p>;

  if (error)
    return <p className="p-4 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-[#020618] text-white">
      {/* HEADER */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <button
          onClick={() => router.back()}
          className="mr-4 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      {/* POST PRINCIPALE */}
      {post && (
        <PostCard
          id={post.id}
          userId={post.user_id}
          content={post.content}
          username={post.username}
          createdAt={post.created_at}
          likesCount={post.likesCount ?? 0}
          commentCount={comments.length}
        />
      )}

      {/* FORM NUOVO COMMENTO */}
      <NewCommentForm postId={id as string} onNewComment={handleAddComment} />

      {/* LISTA COMMENTI */}
      <div className="mt-4">
        <CommentsList comments={comments} />
      </div>
    </div>
  );
}
