"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, X, Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  likes: number | null;
  created_by_user_id: string | null;
  users?: {
    username: string;
  } | null;
}

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

export default function PostsClient({ initialPosts }: { initialPosts: Post[] }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // We already have initialPosts, so we only need to fetch if we want to refresh
    // For now we just use the initial ones
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          users:created_by_user_id (
            username
          )
        `)
        .order("id", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string, currentLikes: number | null) => {
    if (likingPosts.has(postId)) return;

    try {
      setLikingPosts((prev) => new Set(prev).add(postId));
      const newLikeCount = (currentLikes || 0) + 1;

      const { error } = await supabase
        .from("posts")
        .update({ likes: newLikeCount })
        .eq("id", postId);

      if (error) throw error;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: newLikeCount } : post,
        ),
      );
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Failed to like post");
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);

      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const { error } = await supabase.from("posts").insert([
        {
          title: formData.title,
          content: formData.content,
          tags: tagsArray.length > 0 ? tagsArray : null,
          likes: 0,
          created_by_user_id: user?.id || null,
        },
      ]);

      if (error) throw error;

      setFormData({ title: "", content: "", tags: "" });
      setShowForm(false);
      await fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-clip relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Sticky Header - Compact and Adjustable */}
        <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14 md:h-16">
              {/* Logo / Brand */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Posts
                </h1>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md mx-4 hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-1.5 bg-zinc-900/50 border border-white/10 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder-zinc-500"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowForm(!showForm)}
                className={`
                  flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-semibold text-sm transition-all
                  ${showForm
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                  }
                `}
              >
                {showForm ? (
                  <>
                    <X size={16} /> <span className="hidden sm:inline">Cancel</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} /> <span className="hidden sm:inline">New Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-6 pb-20">
          <div className="max-w-8xl mx-auto px-4 sm:px-14">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column: Feed */}
              <div className="lg:col-span-4">
                {/* Create Post Form Modal - Floating Card */}
                {showForm && (
                  <div className="mb-8 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Plus size={20} className="text-blue-500" />
                        Create new post
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Post title"
                            className="w-full px-4 py-3 bg-black/40 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            placeholder="What's on your mind?"
                            rows={4}
                            className="w-full px-4 py-3 bg-black/40 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="Tags (comma-separated) e.g. tech, design"
                            className="w-full px-4 py-3 bg-black/40 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-blue-500/25"
                          >
                            {submitting ? "Publishing..." : "Publish"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Posts Feed - Professional Card Layout */}
                {loading ? (
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-purple-500/30 animate-pulse"></div>
                    </div>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                      <Plus size={32} className="text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 text-xl font-medium">No posts yet</p>
                    <p className="text-zinc-500 text-sm mt-2">
                      Be the first to share something amazing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts
                      .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((post, idx) => (
                        <div
                          key={post.id}
                          className="group bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all duration-200 overflow-hidden"
                        >
                          {/* Post Header with Gradient Bar */}
                          <div
                            className="h-1 w-full"
                            style={{ background: GRADIENTS[idx % GRADIENTS.length] }}
                          />

                          <div className="p-5">
                            {/* Title and Meta */}
                            <Link href={`/posts/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${post.id}`} className="block">
                              <h2 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors line-clamp-2">
                                {post.title}
                              </h2>
                              <p className="text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                                {post.content}
                              </p>
                            </Link>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.slice(0, 4).map((tag, tidx) => (
                                  <span
                                    key={tidx}
                                    className="text-xs px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 cursor-pointer transition-colors"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {post.tags.length > 4 && (
                                  <span className="text-xs px-2.5 py-1 text-zinc-500">
                                    +{post.tags.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-3 mb-4 mt-2">
                              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs shadow-inner">
                                {post.users?.username?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <span className="text-sm text-zinc-400">
                                Post is posted by <span className="text-zinc-200 font-semibold hover:text-blue-400 transition-colors cursor-pointer">{post.users?.username || 'Unknown User'}</span>
                              </span>
                            </div>
                            {/* Actions Bar - X/Twitter Inspired */}
                            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleLike(post.id, post.likes);
                                  }}
                                  disabled={likingPosts.has(post.id)}
                                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all group/like disabled:opacity-50"
                                >
                                  <Heart
                                    size={18}
                                    className={`transition-all ${likingPosts.has(post.id) ? 'fill-red-500 text-red-500' : 'group-hover/like:fill-red-500/20'}`}
                                  />
                                  <span className="text-xs font-medium">
                                    {post.likes || 0}
                                  </span>
                                </button>

                                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all">
                                  <MessageCircle size={18} />
                                  <span className="text-xs font-medium">0</span>
                                </button>

                                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-zinc-400 hover:text-green-500 hover:bg-green-500/10 transition-all">
                                  <Repeat2 size={18} />
                                </button>

                                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                                  <Share size={18} />
                                </button>
                              </div>

                              <button className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {posts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                          <Search size={24} className="text-zinc-600" />
                        </div>
                        <p className="text-zinc-400 text-lg font-medium">No results found</p>
                        <p className="text-zinc-500 text-sm mt-1">
                          No posts match your search for "{searchQuery}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Most Popular */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                      Trending
                    </span>
                    🔥
                  </h3>
                  <div className="h-1 w-32 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full mb-4" />
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-2">
                      <div className="flex flex-col">
                        {posts.slice(0, 4).map((post) => (
                          <Link
                            href={`/posts/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${post.id}`}
                            key={`trending-${post.id}`}
                            className="group block py-2 border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 -mx-4 px-4 transition-all"
                          >
                            <h4 className="font-medium text-zinc-200 group-hover:text-blue-400 transition-colors line-clamp-2 text-sm leading-snug mb-1">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                                <Heart size={12} className="group-hover:fill-red-500/20 group-hover:text-red-500 transition-colors" /> {post.likes || 0}
                              </span>
                            </div>
                          </Link>
                        ))}
                        {posts.length === 0 && (
                          <p className="text-sm text-zinc-500 italic">No trending posts yet.</p>
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
    </div>
  );
}