"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

type Tab = "posts" | "users" | "comments";

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

export default function ApiDemoPage() {
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/${activeTab}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.slice(0, 12));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch API data", err);
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">API Explorer</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Live data from JSONPlaceholder API
            </p>
          </div>
          <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
            <Search size={18} className="text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent ml-2 outline-none w-48 text-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-800">
          {(["posts", "users", "comments"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold capitalize transition-all border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item: any, idx: number) => (
              <div
                key={item.id}
                className="group cursor-pointer rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 border border-zinc-800 hover:border-zinc-700"
              >
                {activeTab === "posts" && (
                  <div
                    className="w-full h-40 flex items-end p-4 relative overflow-hidden"
                    style={{ background: GRADIENTS[idx % GRADIENTS.length] }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="relative z-10 w-full">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-blue-200 text-xs line-clamp-2">
                        {item.body}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "users" && (
                  <>
                    <div
                      className="w-full h-32 flex items-end p-4 relative overflow-hidden"
                      style={{ background: GRADIENTS[idx % GRADIENTS.length] }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                      <div className="relative z-10 w-full">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-blue-200 text-sm">
                          @{item.username}
                        </p>
                      </div>
                    </div>
                    <div className="bg-zinc-900 p-4 space-y-2">
                      <p className="text-sm text-zinc-300">📧 {item.email}</p>
                      <p className="text-sm text-zinc-300">
                        🏢 {item.company?.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        📍 {item.address?.city}
                      </p>
                    </div>
                  </>
                )}

                {activeTab === "comments" && (
                  <>
                    <div
                      className="w-full h-32 flex items-end p-4 relative overflow-hidden"
                      style={{ background: GRADIENTS[idx % GRADIENTS.length] }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                      <div className="relative z-10 w-full">
                        <h3 className="font-bold text-lg line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-blue-300 text-xs">{item.email}</p>
                      </div>
                    </div>
                    <div className="bg-zinc-900 p-4">
                      <p className="text-sm text-zinc-300 line-clamp-3">
                        "{item.body}"
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
