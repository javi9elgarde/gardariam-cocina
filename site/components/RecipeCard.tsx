"use client";

import { motion } from "framer-motion";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.4 }}
      className="glass-panel flex flex-col overflow-hidden rounded-xl text-left transition-shadow hover:shadow-[0_0_30px_rgba(200,144,40,0.18)]"
    >
      <div className="aspect-video w-full overflow-hidden bg-imperial-charcoal-2">
        {recipe.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.photoUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🍲</div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-display text-sm font-bold text-parchment">{recipe.title}</h3>
        <div className="mt-1.5 flex items-center justify-between">
          {recipe.category && (
            <span className="rounded border border-imperial-gold/20 bg-imperial-gold/10 px-1.5 py-0.5 text-[0.6rem] text-imperial-gold-text">
              {recipe.category}
            </span>
          )}
          <span className="text-[0.62rem] text-parchment-faint">
            {"🔥".repeat(Math.max(1, Math.min(5, recipe.rating)))}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
