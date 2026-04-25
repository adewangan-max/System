"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[] | null;
  likes: number | null;
}

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-zinc-400 text-xl">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button
        className="mb-6 text-blue-400 hover:underline"
        onClick={() => router.back()}
      >
        ← Back to Posts
      </button>
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="mb-4 text-zinc-400">Post #{post.id}</div>
        <div className="mb-20 text-lg text-zinc-200 whitespace-pre-line">
          {post.content}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            <div className="mb-5">
              <span className="font-semibold text-zinc-200">Tags</span>
              <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full mt-1 mb-2" />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="text-zinc-500 text-sm">
          {post.likes || 0} {post.likes === 1 ? "Like" : "Likes"}
        </div>
      </div>
    </div>
  );
}
