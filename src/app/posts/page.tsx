"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, X, Heart } from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[] | null;
  likes: number | null;
}

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [likingPosts, setLikingPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number, currentLikes: number | null) => {
    if (likingPosts.has(postId)) return; // Prevent multiple clicks

    try {
      setLikingPosts((prev) => new Set(prev).add(postId));

      const newLikeCount = (currentLikes || 0) + 1;

      const { error } = await supabase
        .from("posts")
        .update({ likes: newLikeCount })
        .eq("id", postId);

      if (error) throw error;

      // Update local state
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
          likes: 0, // Initialize likes to 0 for new posts
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-white/10 p-6 flex justify-between items-center">
        <div>
          <h1
            className="text-xl md:text-4xl font-bold mb-4 leading-tight tracking-tight"
            style={{
              backgroundImage: "url(/pageWrinkle.jpg)",
              backgroundSize: "100%",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow:
                "0 0 10px rgba(255,255,255,0.6), 0 0 16px rgba(255,255,255,0.6)",
            }}
          >
            Your Posts
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Explore and share your content
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${showForm
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {showForm ? (
            <>
              <X size={20} /> Cancel
            </>
          ) : (
            <>
              <Plus size={20} /> New Post
            </>
          )}
        </button>
      </div>

      <div className="p-8">
        {/* Form Modal */}
        {showForm && (
          <div className="mb-12 bg-zinc-900 border border-blue-500/30 rounded-lg p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">
              Create New Post
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Share your thoughts..."
                  rows={6}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g. tech, design, development"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 text-white rounded-lg font-semibold transition-all"
              >
                {submitting ? "Publishing..." : "Publish Post"}
              </button>
            </form>
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-zinc-400 text-xl">No posts yet</p>
            <p className="text-zinc-500 text-sm mt-2">
              Create your first post to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 border border-zinc-800 hover:border-zinc-700 block"
                prefetch={false}
              >
                <div
                  className="relative w-full h-40 flex items-end p-4 overflow-hidden group"
                  style={{ background: GRADIENTS[idx % GRADIENTS.length] }}
                >
                  {/* Overlay Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-20" />
                  {/* Content */}
                  <div className="relative z-30 w-full">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-blue-200 text-xs line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                </div>
                <div className="bg-zinc-900 px-4 py-3">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag, tidx) => (
                        <span
                          key={tidx}
                          className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-zinc-400">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLike(post.id, post.likes);
                      }}
                      disabled={likingPosts.has(post.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all group/like"
                    >
                      <Heart
                        size={18}
                        className="text-zinc-400 group-hover/like:text-red-500 transition-colors"
                      />
                      <span className="text-sm font-medium text-zinc-300">
                        {post.likes || 0} {post.likes === 1 ? "Like" : "Likes"}
                      </span>
                    </button>
                    <div className="text-xs text-zinc-500">Post #{post.id}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
