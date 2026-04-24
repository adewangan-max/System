"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const { login, user, error, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      window.location.href = "/";
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900/20 to-black flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="relative z-10 bg-black/70 backdrop-blur border border-blue-500/20 rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-blue-500/20 rounded-lg mr-3">
            <LogIn className="text-blue-400" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white">Login</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border border-zinc-700 rounded-lg px-4 py-3 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-zinc-400 mt-1">
              💡 Demo: admin@gmail.com
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-zinc-700 rounded-lg px-4 py-3 bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-zinc-400 mt-1">💡 Demo: admin1</p>
          </div>
        </div>

        {(formError || error) && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">{formError || error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg shadow-blue-500/20"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        <div className="text-sm text-center text-zinc-400">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Sign up here
          </a>
        </div>
      </form>
    </div>
  );
}
