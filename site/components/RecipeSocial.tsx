"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { addComment, deleteComment, watchComments, type Comment } from "@/lib/social";

interface Props {
  recipeId: string;
}

export default function RecipeSocial({ recipeId }: Props) {
  const { user, isAdmin, signIn } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => watchComments(recipeId, setComments), [recipeId]);

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

  return (
    <section className="soc">
      <h4 className="rd-h">💬 Vuestros comentarios</h4>

      {!user ? (
        <div className="soc-login">
          <p>Entra con tu cuenta de Google para dejar un comentario.</p>
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
            </div>
          </div>
        </>
      )}

      {err && <p className="soc-err">{err}</p>}
      {busy && <p className="soc-note">Publicando…</p>}

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
