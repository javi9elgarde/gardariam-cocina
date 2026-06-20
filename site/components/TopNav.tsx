"use client";

import { useAuth } from "@/lib/auth";

export default function TopNav() {
  const { user, isAdmin, loading, signIn, signOutUser } = useAuth();

  return (
    <nav className="glass-panel fixed left-1/2 top-4 z-[900] flex -translate-x-1/2 items-center gap-2 rounded-full px-3 py-1.5">
      <a
        href="https://gardariam.com"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"
        style={{ boxShadow: "0 0 0 1px rgba(200,144,40,0.4)" }}
        aria-label="Gardariam"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Gardariam" className="h-full w-full object-cover" />
      </a>
      <span className="font-display px-2 text-[0.62rem] uppercase tracking-[0.14em] text-parchment-faint">
        Cocina Gardariam
      </span>
      {!loading && (
        <button
          onClick={() => (user ? signOutUser() : signIn())}
          title={user ? `Sesión: ${user.email}` : "Iniciar sesión"}
          className={`font-display rounded-full px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.1em] transition-colors ${
            isAdmin
              ? "bg-imperial-gold/20 text-imperial-gold-bright"
              : "text-parchment-faint hover:bg-imperial-gold/10 hover:text-imperial-gold-bright"
          }`}
        >
          {user ? (isAdmin ? "⚜ Admin" : "Salir") : "Iniciar sesión"}
        </button>
      )}
    </nav>
  );
}
