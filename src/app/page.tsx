"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Play, Clock, LogOut, Sparkles } from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  category: string;
  image: string;
  duration?: string;
  description?: string;
}

const FEATURED_CONTENT: ContentItem[] = [
  {
    id: 1,
    title: "NoBrakes",
    category: "Live",
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    duration: "Live",
    description: "Premium streaming experience",
  },
  {
    id: 2,
    title: "Development Tutorials",
    category: "Educational",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    description: "Master modern development",
  },
  {
    id: 3,
    title: "Code Walkthrough",
    category: "Tech",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    description: "Deep dive into coding",
  },
  {
    id: 4,
    title: "Design System",
    category: "Design",
    image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    description: "Building scalable design",
  },
  {
    id: 5,
    title: "Backend Mastery",
    category: "Backend",
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    description: "Advanced backend concepts",
  },
  {
    id: 6,
    title: "Frontend Basics",
    category: "Frontend",
    image: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    description: "Foundations of frontend",
  },
];

export default function Home() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [time, setTime] = useState("");
  const [isVisible, setIsVisible] = useState(false);

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

      {/* Header with Time and Featured Content */}
      <div
        className={`relative pt-8 px-8 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {/* Featured Hero Section */}
        <div
          className="w-full h-96 rounded-2xl overflow-hidden group cursor-pointer relative shadow-2xl"
          style={{ background: FEATURED_CONTENT[0].image }}
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
                {FEATURED_CONTENT[0].category}
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex-1 pr-8">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight tracking-tight">
                  {FEATURED_CONTENT[0].title}
                </h1>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Play size={16} className="fill-current" />
                    <span className="text-sm font-medium">
                      {FEATURED_CONTENT[0].duration}
                    </span>
                  </div>
                  <span className="text-sm text-white/70">
                    {FEATURED_CONTENT[0].description}
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
                  Thursday, April 24
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

      {/* Content Grid Section */}
      <div
        className={`px-8 py-16 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles size={24} className="text-violet-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Browse Content
            </h2>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_CONTENT.slice(1).map((item, index) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              style={{
                animation: isVisible
                  ? `fadeInUp 0.6s ease-out ${0.1 * (index + 1)}s both`
                  : "none",
              }}
            >
              <div className="relative rounded-xl overflow-hidden h-56 shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Background */}
                <div
                  className="absolute inset-0 group-hover:scale-110 transition-transform duration-500"
                  style={{ background: item.image }}
                />

                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10 group-hover:from-black/50 transition-all duration-300" />

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-20" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  <span className="inline-block w-fit px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/20 group-hover:bg-white/25 transition-all duration-300">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>

                {/* Play Button on Hover */}
                <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    <Play size={28} className="fill-white text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
