import { useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export type SelectOption = { value: string; label: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  /** Muestra teclado numérico en móvil para el campo de búsqueda. */
  numeric?: boolean;
};

/** Quita acentos y normaliza para comparar (ej. "genesis" ≈ "Génesis"). */
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export default function SearchableSelect({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Selecciona…",
  searchPlaceholder = "Buscar…",
  numeric = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = query
    ? options.filter((o) => normalize(o.label).includes(normalize(query)))
    : options;

  // Cerrar al hacer clic fuera.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  // Al abrir, enfocar el input de búsqueda (sincronización con el DOM).
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Mantener la opción resaltada visible al navegar con el teclado.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[highlight] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const openMenu = () => {
    setQuery("");
    const idx = options.findIndex((o) => o.value === value);
    setHighlight(idx >= 0 ? idx : 0);
    setOpen(true);
  };

  const choose = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[highlight]) {
        e.preventDefault();
        choose(filtered[highlight].value);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className="searchable-select" ref={rootRef}>
      <button
        type="button"
        className="searchable-select-trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (disabled) return;
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={(e) => {
          if (disabled || open) return;
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openMenu();
          }
        }}
      >
        <span className={selected ? undefined : "searchable-select-placeholder"}>
          {selected ? selected.label : placeholder}
        </span>
        <LuChevronDown
          size={18}
          className="searchable-select-chevron"
          aria-hidden
        />
      </button>

      {open && (
        <div className="searchable-select-popup">
          <input
            ref={inputRef}
            type="text"
            className="searchable-select-search"
            placeholder={searchPlaceholder}
            value={query}
            inputMode={numeric ? "numeric" : "text"}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            onKeyDown={onSearchKeyDown}
          />
          <ul
            className="searchable-select-list"
            role="listbox"
            ref={listRef}
          >
            {filtered.length === 0 ? (
              <li className="searchable-select-empty">Sin resultados</li>
            ) : (
              filtered.map((o, i) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  className={
                    "searchable-select-option" +
                    (i === highlight ? " is-highlighted" : "") +
                    (o.value === value ? " is-selected" : "")
                  }
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => choose(o.value)}
                >
                  {o.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
