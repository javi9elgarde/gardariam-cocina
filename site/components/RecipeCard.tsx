"use client";

import { motion } from "framer-motion";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const stars = Math.max(1, Math.min(5, recipe.rating || 5));
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rcard"
    >
      {recipe.favorite && <span className="rcard-fav">♥</span>}

      {recipe.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="rcard-img" src={recipe.photoUrl} alt={recipe.title} />
      ) : (
        <div className="rcard-img rcard-img-empty">🍲</div>
      )}

      <div className="rcard-body">
        <h3 className="rcard-title">{recipe.title || "Sin título"}</h3>
        <div className="rcard-stars">{"★".repeat(stars) + "☆".repeat(5 - stars)}</div>
        <div className="rcard-meta">
          <span>⏱ {recipe.prepMinutes || 0} min</span>
          <span>👤 {recipe.persons || 2} pers.</span>
        </div>
      </div>
    </motion.button>
  );
}
