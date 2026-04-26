"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  likes: number | null;
}

export default function PostDetailClient({ 
  initialPost, 
  initialTrending 
}: { 
  initialPost: Post | null, 
  initialTrending: Post[] 
}) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(initialPost);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>(initialTrending);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial data is passed from Server Component
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-clip relative">
      <div className="pt-6 pb-20 relative z-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-14">
          <button
            className="mb-6 text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
            onClick={() => router.back()}
          >
            ← Back to Posts
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column: Main Post */}
            <div className="lg:col-span-4">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="mb-6 text-zinc-500 text-sm border-b border-zinc-800/50 pb-4">
                  Post ID: <span className="font-mono text-zinc-400">{post.id}</span>
                </div>

                <div className="mb-16 text-md text-zinc-200 whitespace-pre-line leading-relaxed">
                  {post.content}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="mb-4">
                      <span className="font-semibold text-zinc-300 text-sm uppercase tracking-wider">Tags</span>
                      <div className="h-0.5 w-12 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full mt-2" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1.5 bg-zinc-800/80 text-zinc-300 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center pt-6 border-t border-zinc-800/50">
                  <div className="text-zinc-400 text-sm flex items-center gap-2">
                    <Heart size={18} className={post.likes ? "fill-red-500/20 text-red-500" : ""} />
                    <span className="font-medium">{post.likes || 0}</span> {post.likes === 1 ? "Like" : "Likes"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Trending */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                    Trendings
                  </span>
                  🔥

                </h3>
                <div className="h-1 w-32 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full mb-4" />
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-2">
                    <div className="flex flex-col">
                      {trendingPosts.map((p) => (
                        <Link
                          href={`/posts/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${p.id}`}
                          key={`trending-${p.id}`}
                          className="group block py-2 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 -mx-4 px-4 transition-all"
                        >
                          <h4 className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors line-clamp-2 text-sm leading-snug mb-1">
                            {p.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                              <Heart size={12} className="group-hover:fill-red-500/20 group-hover:text-red-500 transition-colors" /> {p.likes || 0}
                            </span>
                          </div>
                        </Link>
                      ))}
                      {trendingPosts.length === 0 && (
                        <p className="text-sm text-zinc-500 italic p-2">No trending posts yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
