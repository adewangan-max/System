"use client";
import { AuthProvider } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";
import ProtectedRoute from "./ProtectedRoute";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-black">
        <Sidebar />
        <main className="flex-1 w-full overflow-x-clip bg-black">
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </div>
    </AuthProvider>
  );
}
