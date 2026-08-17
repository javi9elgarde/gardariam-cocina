"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  addComment,
  deleteComment,
  deletePhoto,
  uploadPhoto,
  watchComments,
  watchPhotos,
  type Comment,
  type GuestPhoto,
} from "@/lib/social";

interface Props {
  recipeId: string;
}

export default function RecipeSocial({ recipeId }: Props) {
  const { user, isAdmin, signIn } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => watchComments(recipeId, setComments), [recipeId]);
  useEffect(() => watchPhotos(recipeId, setPhotos), [recipeId]);

  const myPhoto = user ? photos.find((p) => p.uid === user.uid) : undefined;

  async function send() {
    if (!user || !text.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      await addComment(recipeId, user, text);
      setText("");
    } catch {
      setErr("No se pudo publicar. Inténtalo de nuevo.");
    }
    setBusy(false);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 8 * 1024 * 1024) {
      setErr("La foto es muy grande (máx. 8 MB).");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await uploadPhoto(recipeId, user, file);
    } catch {
      setErr("No se pudo subir la foto.");
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <section className="soc">
      <h4 className="rd-h">💬 Vuestros comentarios y fotos</h4>

      {!user ? (
        <div className="soc-login">
          <p>Entra con tu cuenta de Google para comentar y subir tu foto.</p>
          <button className="book-btn" onClick={signIn}>
            Entrar con Google
          </button>
        </div>
      ) : (
        <>
          {/* --- Escribir comentario --- */}
          <div className="soc-form">
            <textarea
              className="book-input"
              rows={2}
              maxLength={500}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="¿Qué tal te salió? Cuéntanoslo..."
            />
            <div className="soc-form-row">
              <button className="book-btn" onClick={send} disabled={busy || !text.trim()}>
                Publicar
              </button>
              <button
                className="book-btn book-btn-ghost"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
              >
                📷 {myPhoto ? "Cambiar mi foto" : "Subir mi foto"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onFile}
              />
            </div>
            <p className="soc-note">Solo se guarda una foto por persona y receta.</p>
          </div>
        </>
      )}

      {err && <p className="soc-err">{err}</p>}
      {busy && <p className="soc-note">Trabajando…</p>}

      {/* --- Galería --- */}
      {photos.length > 0 && (
        <div className="soc-gallery">
          {photos.map((p) => (
            <figure key={p.id} className="soc-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`Foto de ${p.name}`} />
              <figcaption>{p.name}</figcaption>
              {(isAdmin || p.uid === user?.uid) && (
                <button
                  className="soc-del"
                  onClick={() => deletePhoto(p)}
                  aria-label="Borrar foto"
                >
                  ✕
                </button>
              )}
            </figure>
          ))}
        </div>
      )}

      {/* --- Comentarios --- */}
      <ul className="soc-list">
        {comments.map((c) => (
          <li key={c.id} className="soc-item">
            {c.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="soc-avatar" src={c.photo} alt="" referrerPolicy="no-referrer" />
            ) : (
              <span className="soc-avatar soc-avatar--empty">👤</span>
            )}
            <div className="soc-body">
              <b>{c.name}</b>
              <p>{c.text}</p>
            </div>
            {(isAdmin || c.uid === user?.uid) && (
              <button
                className="soc-del soc-del--inline"
                onClick={() => deleteComment(c.id)}
                aria-label="Borrar comentario"
              >
                ✕
              </button>
            )}
          </li>
        ))}
        {comments.length === 0 && (
          <li className="soc-empty">Todavía no hay comentarios. ¡Sé el primero!</li>
        )}
      </ul>
    </section>
  );
}
