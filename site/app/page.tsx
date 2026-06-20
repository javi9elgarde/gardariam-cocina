"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import RecipePanel from "@/components/RecipePanel";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/lib/auth";
import { getRecipes, onStorageChange } from "@/lib/storage";
import type { Recipe } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Home() {
  const { isAdmin } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selected, setSelected] = useState<Recipe | null | "new">(null);

  useEffect(() => {
    setRecipes(getRecipes());
    return onStorageChange(() => setRecipes(getRecipes()));
  }, []);

  return (
    <>
      <TopNav />

      <main className="relative min-h-screen w-full px-6 pb-24 pt-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(168,90,30,0.16) 0%, rgba(7,11,23,0) 60%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
            className="mx-auto"
            style={{ width: "clamp(140px, 18vw, 220px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Gardariam" style={{ width: "100%", display: "block" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="text-gold-glow font-display mt-4 text-2xl font-bold uppercase tracking-[0.18em] text-imperial-gold-bright sm:text-3xl"
          >
            🔥 Cocina Gardariam
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-display mt-2 text-xs italic tracking-[0.06em] text-parchment-dim"
          >
            &ldquo;Nuestro fuego, nuestro amor&rdquo;
          </motion.p>

          {isAdmin && (
            <button
              onClick={() => setSelected("new")}
              className="font-display mt-6 rounded-full border border-imperial-gold/30 bg-imperial-gold/10 px-4 py-2 text-[0.6rem] uppercase tracking-[0.14em] text-imperial-gold-bright transition-colors hover:bg-imperial-gold/20"
            >
              + Añadir receta
            </button>
          )}
        </div>

        <div className="relative z-10 mx-auto mt-12 max-w-5xl">
          {recipes.length === 0 ? (
            <p className="text-center text-sm italic text-parchment-faint">
              Aún no hay recetas en el recetario.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {recipes.map((r) => (
                <RecipeCard key={r.id} recipe={r} onClick={() => setSelected(r)} />
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selected !== null && (
          <RecipePanel
            key={selected === "new" ? "new" : selected.id}
            recipe={selected === "new" ? null : selected}
            isAdmin={isAdmin}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
