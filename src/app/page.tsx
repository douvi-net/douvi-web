"use client";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
      alert("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F8F7] p-6">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-black text-[#168768]">Douvi</h1>

          <p className="mt-4 text-slate-500">
            Ví chat dành cho cá nhân và cặp đôi
          </p>
        </div>

        {!user ? (
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#168768] px-5 py-4 text-lg font-bold text-white transition hover:bg-[#0F6F55]"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}
          </button>
        ) : (
          <div>
            <div className="rounded-2xl bg-[#F6F8F7] p-5 text-center">
              <img
                src={user.photoURL || ""}
                alt="avatar"
                className="mx-auto h-20 w-20 rounded-full"
              />

              <h2 className="mt-4 text-2xl font-black">
                {user.displayName}
              </h2>

              <p className="mt-2 text-slate-500">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="mt-5 w-full rounded-2xl border border-red-200 px-5 py-4 font-bold text-red-500 transition hover:bg-red-50"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </main>
  );
}