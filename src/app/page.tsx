"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Play, LogOut, Sparkles, Heart, ArrowRight, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  likes: number | null;
}

const GRADIENTS = [
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
];

function getPostSlug(post: Post) {
  return `/posts/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${post.id}`;
}

export default function Home() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [time, setTime] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      setPostsLoading(true);
      const { data } = await supabase
        .from("posts")
        .select("id, title, content, tags, likes")
        .order("likes", { ascending: false })
        .limit(6);
      if (data) setTrendingPosts(data);
      setPostsLoading(false);
    };
    fetchTrending();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full blur-lg opacity-50 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 border-r-cyan-500 animate-spin" />
          </div>
          <p className="text-slate-400 text-sm font-light tracking-wide">
            Loading your content...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full blur-lg opacity-50 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 border-r-cyan-500 animate-spin" />
          </div>
          <p className="text-slate-400 text-sm font-light tracking-wide">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header with Time and Featured Content — UNTOUCHED */}
      <div
        className={`relative pt-8 px-8 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {/* Featured Hero Section */}
        <div
          className="w-full h-96 rounded-2xl overflow-hidden group cursor-pointer relative shadow-2xl"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          {/* Overlay Effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />

          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-20" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-12 z-20">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold mb-6 border border-white/20">
                Live
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex-1 pr-8">
                <h1 className="text-6xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight"
                  style={{
                    backgroundImage: "url(/pageWrinkle.jpg)",
                    backgroundSize: "100%",
                    backgroundPosition: "center",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow:
                      "0 0 2px rgba(255,255,255,0.5), 0 0 8px rgba(255,255,255,0.5)",
                  }}>
                  NoBrakes
                </h1>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Play size={16} className="fill-current" />
                    <span className="text-sm font-medium">Live</span>
                  </div>
                  <span className="text-sm text-white/70">
                    Premium streaming experience
                  </span>
                </div>
              </div>

              {/* Time Section */}
              <div className="text-right flex flex-col items-end gap-2">
                <div className="flex items-baseline gap-1">
                  <div className="text-7xl font-bold tracking-tighter leading-none">
                    {time}
                  </div>
                </div>
                <div className="text-xs text-white/60 font-light">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </div>
                <div className="flex items-center gap-2 text-white/70 mt-2">
                  <span>🌤️</span>
                  <span className="text-sm">13°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Posts Section */}
      <div
        className={`px-8 py-16 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp size={24} className="text-violet-400" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Trending Posts
              </h2>
              <span className="text-xl">🔥</span>
            </div>
            <div className="h-1 w-48 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
          </div>
          <Link
            href="/posts"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-sm font-semibold transition-all duration-300 group"
          >
            View All Posts
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Posts Grid */}
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl h-56 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : trendingPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Sparkles size={40} className="text-zinc-600 mb-4" />
            <p className="text-zinc-400 text-xl font-medium">No posts yet</p>
            <p className="text-zinc-500 text-sm mt-2">Be the first to share something amazing</p>
            <Link
              href="/posts"
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm transition-all"
            >
              Create a Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts.map((post, index) => (
              <Link
                key={post.id}
                href={getPostSlug(post)}
                className="group cursor-pointer"
                style={{
                  animation: isVisible
                    ? `fadeInUp 0.6s ease-out ${0.1 * (index + 1)}s both`
                    : "none",
                }}
              >
                <div className="relative rounded-xl overflow-hidden h-56 shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Background Gradient */}
                  <div
                    className="absolute inset-0 group-hover:scale-110 transition-transform duration-500"
                    style={{ background: GRADIENTS[index % GRADIENTS.length] }}
                  />

                  {/* Overlay Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10 group-hover:from-black/50 transition-all duration-300" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-20" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <span className="inline-block w-fit px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/20 group-hover:bg-white/25 transition-all duration-300">
                        #{post.tags[0]}
                      </span>
                    )}
                    <h3 className="font-bold text-xl mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                      {post.content}
                    </p>

                    {/* Likes */}
                    <div className="flex items-center gap-1.5 mt-3 text-white/60 text-xs">
                      <Heart size={12} className="fill-white/40" />
                      <span>{post.likes || 0} likes</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Go to All Posts CTA */}
        {trendingPosts.length > 0 && (
          <div className="flex justify-center mt-12">
            <Link
              href="/posts"
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg shadow-violet-500/25 group"
            >
              <Sparkles size={16} />
              Explore All Posts
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      {/* User Profile Card */}
      <div
        className={`fixed bottom-8 right-8 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 shadow-2xl group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-cyan-500/5 pointer-events-none" />

          <div className="relative z-10">
            <p className="text-xs text-white/50 font-light tracking-widest uppercase mb-3">
              Authenticated User
            </p>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {(user.user_metadata?.username ||
                    user.email ||
                    "A")[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white truncate">
                  {user.user_metadata?.username || user.email || "Admin"}
                </p>
                <p className="text-xs text-white/50 truncate">Premium Access</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-lg transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-2 group/btn"
            >
              <LogOut
                size={16}
                className="group-hover/btn:scale-110 transition-transform"
              />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
