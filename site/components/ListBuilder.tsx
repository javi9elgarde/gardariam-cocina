"use client";

import { useState } from "react";

interface ListBuilderProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  numbered?: boolean;
  placeholder?: string;
}

const inputCls =
  "flex-1 rounded border border-white/10 bg-imperial-charcoal-2 px-2.5 py-1.5 text-sm text-parchment outline-none focus:border-imperial-gold";
const labelCls =
  "font-display mb-1 block text-[0.56rem] uppercase tracking-[0.12em] text-parchment-faint";

export default function ListBuilder({
  label,
  items,
  onChange,
  numbered,
  placeholder,
}: ListBuilderProps) {
  const [draft, setDraft] = useState("");

  function add() {
    const text = draft.trim();
    if (!text) return;
    onChange([...items, text]);
    setDraft("");
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="mb-3">
      <label className={labelCls}>{label}</label>
      <div className="mb-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={inputCls}
        />
        <button
          type="button"
          onClick={add}
          className="font-display rounded border border-imperial-gold/30 bg-imperial-gold/10 px-3 text-[0.7rem] text-imperial-gold-bright transition-colors hover:bg-imperial-gold/20"
        >
          +
        </button>
      </div>
      {items.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded border border-white/10 bg-imperial-charcoal-2 px-2.5 py-1.5 text-[0.8rem] text-parchment-dim"
            >
              <span>
                {numbered ? `${i + 1}. ` : "• "}
                {item}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex-shrink-0 text-parchment-faint transition-colors hover:text-red-300"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
