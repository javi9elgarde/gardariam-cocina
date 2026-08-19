"use client";

import { useEffect, useRef } from "react";
import { sfx } from "@/lib/sfx";

interface Chispa {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
  color: string;
}

const COLORES = ["#ffd75e", "#ff8f5e", "#8fe08a", "#7ec8ff", "#e79bff", "#fff3c9"];

/** Fuegos artificiales a pantalla completa. No intercepta clics. */
export default function Fireworks({ duracion = 6000 }: { duracion?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const medir = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();
    window.addEventListener("resize", medir);

    const chispas: Chispa[] = [];
    const suave = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function estallar(x: number, y: number) {
      const color = COLORES[Math.floor(Math.random() * COLORES.length)];
      const n = suave ? 26 : 54;
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + Math.random() * 0.2;
        const vel = 1.6 + Math.random() * 3.4;
        chispas.push({
          x,
          y,
          vx: Math.cos(ang) * vel,
          vy: Math.sin(ang) * vel,
          vida: 1,
          color,
        });
      }
      sfx.cohete();
    }

    const lanzar = () => {
      estallar(
        window.innerWidth * (0.15 + Math.random() * 0.7),
        window.innerHeight * (0.12 + Math.random() * 0.4),
      );
    };

    lanzar();
    const int = window.setInterval(lanzar, suave ? 1400 : 750);
    const fin = window.setTimeout(() => window.clearInterval(int), duracion);

    let raf = 0;
    const pintar = () => {
      g.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = chispas.length - 1; i >= 0; i--) {
        const c = chispas[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.045; // gravedad
        c.vx *= 0.985;
        c.vy *= 0.985;
        c.vida -= 0.012;
        if (c.vida <= 0) {
          chispas.splice(i, 1);
          continue;
        }
        g.globalAlpha = Math.max(0, c.vida);
        g.fillStyle = c.color;
        g.fillRect(c.x, c.y, 3, 3);
      }
      g.globalAlpha = 1;
      raf = requestAnimationFrame(pintar);
    };
    raf = requestAnimationFrame(pintar);

    return () => {
      window.removeEventListener("resize", medir);
      window.clearInterval(int);
      window.clearTimeout(fin);
      cancelAnimationFrame(raf);
    };
  }, [duracion]);

  return <canvas ref={ref} className="fireworks" aria-hidden />;
}
