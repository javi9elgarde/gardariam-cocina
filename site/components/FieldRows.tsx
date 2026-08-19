"use client";

/**
 * Listas editables con varias columnas por fila (ingredientes y pasos).
 * Se puede añadir, borrar y mover arriba/abajo.
 */

interface Columna<T> {
  clave: keyof T;
  etiqueta: string;
  /** ancho relativo dentro de la fila */
  peso?: number;
  multilinea?: boolean;
}

interface Props<T> {
  label: string;
  items: T[];
  columnas: Columna<T>[];
  nuevo: () => T;
  onChange: (items: T[]) => void;
  numerado?: boolean;
  ayuda?: string;
}

export default function FieldRows<T extends object>({
  label,
  items,
  columnas,
  nuevo,
  onChange,
  numerado,
  ayuda,
}: Props<T>) {
  function set(i: number, clave: keyof T, valor: string) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, [clave]: valor } : it)));
  }

  function borrar(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function mover(i: number, d: number) {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const copia = [...items];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    onChange(copia);
  }

  return (
    <div className="fr">
      <label className="book-label">{label}</label>
      {ayuda && <p className="fr-help">{ayuda}</p>}

      {items.length === 0 && <p className="fr-vacio">— vacío —</p>}

      <ul className="fr-list">
        {items.map((it, i) => (
          <li key={i} className="fr-row">
            {numerado && <span className="fr-num">{i + 1}</span>}
            <div className="fr-fields">
              {columnas.map((c) => (
                <span key={String(c.clave)} className="fr-field" style={{ flex: c.peso ?? 1 }}>
                  {c.multilinea ? (
                    <textarea
                      className="book-input"
                      rows={3}
                      value={String((it as Record<string, unknown>)[c.clave as string] ?? "")}
                      placeholder={c.etiqueta}
                      onChange={(e) => set(i, c.clave, e.target.value)}
                    />
                  ) : (
                    <input
                      className="book-input"
                      value={String((it as Record<string, unknown>)[c.clave as string] ?? "")}
                      placeholder={c.etiqueta}
                      onChange={(e) => set(i, c.clave, e.target.value)}
                    />
                  )}
                </span>
              ))}
            </div>
            <span className="fr-acciones">
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} title="Subir">
                ▲
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === items.length - 1}
                title="Bajar"
              >
                ▼
              </button>
              <button type="button" className="fr-del" onClick={() => borrar(i)} title="Quitar">
                ✕
              </button>
            </span>
          </li>
        ))}
      </ul>

      <button type="button" className="fr-add" onClick={() => onChange([...items, nuevo()])}>
        ＋ Añadir
      </button>
    </div>
  );
}
