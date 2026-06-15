import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuBookOpen } from "react-icons/lu";
import InfoButton from "../../shared/InfoButton";
import BackToLauncherButton from "../../shared/BackToLauncherButton";
import SearchableSelect from "../../shared/SearchableSelect";

type BookIndexEntry = {
  libro: string;
  slug: string;
  capitulos: number;
};

export default function CitationForm() {
  const navigate = useNavigate();

  const [books, setBooks] = useState<BookIndexEntry[]>([]);
  const [libro, setLibro] = useState<string>(() => 
    localStorage.getItem("last_libro") || ""
  );
  const [capitulo, setCapitulo] = useState<string>(() => 
    localStorage.getItem("last_capitulo") || "1"
  );
  const [versiculos, setVersiculos] = useState<string>(() => 
    localStorage.getItem("last_versiculos") || ""
  );

  // cargar index.json
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/citas-biblicas/index.json`)
      .then(res => res.json())
      .then((data: BookIndexEntry[]) => {
        setBooks(data);
        if (data.length > 0 && !libro) {
          setLibro(data[0].slug);
          setCapitulo("1");
        }
      })
      .catch(console.error);
  }, [libro]);

  const selectedBook = books.find(b => b.slug === libro);

  const submit = (e: React.SubmitEvent) => {
    e.preventDefault();

    // 1. Limpieza automática con Regex
    const cleanVerses = versiculos
      .replace(/--+/g, "-")      // No permite guiones dobles --
      .replace(/,,+/g, ",")      // No permite comas dobles ,,
      .replace(/[-,]+$/, "")     // Elimina comas o guiones al final del texto (ej: "1-3," -> "1-3")
      .replace(/^[, ]+/, "");    // Elimina comas al inicio

    // 2. Actualizamos el estado para que el usuario vea lo que se procesó
    setVersiculos(cleanVerses);

    // 3. Guardar en LocalStorage
    localStorage.setItem("last_libro", libro);
    localStorage.setItem("last_capitulo", capitulo);
    localStorage.setItem("last_versiculos", cleanVerses);

    // 4. Navegar
    const query = cleanVerses ? `?${cleanVerses}` : "";
    navigate(`/citas-biblicas/${libro}/${capitulo}${query}`);
  };

  return (
    <div className="card-container">
      <form onSubmit={submit} className="verse-card">
        <h1>Citas Bíblicas</h1>

        <label>
          Libro
          <SearchableSelect
            value={libro}
            onChange={value => {
              setLibro(value);
              setCapitulo("1");
            }}
            options={books.map(b => ({ value: b.slug, label: b.libro }))}
            placeholder="Elige un libro"
            searchPlaceholder="Buscar libro…"
          />
        </label>

        <label>
          Capítulo
          <SearchableSelect
            value={capitulo}
            onChange={setCapitulo}
            disabled={!selectedBook}
            numeric
            options={
              selectedBook
                ? Array.from({ length: selectedBook.capitulos }, (_, i) => ({
                    value: String(i + 1),
                    label: String(i + 1),
                  }))
                : []
            }
            placeholder="Capítulo"
            searchPlaceholder="Buscar capítulo…"
          />
        </label>

        <label>
          Versículos
          <input
            type="text"
            placeholder="Ej. 1-3,5"
            value={versiculos}
            onChange={e => {
              const val = e.target.value.replace(/[^0-9,-]/g, "");
              setVersiculos(val);
            }}
          />
        </label>

        <div className="form-actions">
          <BackToLauncherButton />
          <button type="submit" className="primary-button">
            <LuBookOpen size={18} />
            <span>Leer</span>
          </button>
        </div>

        <InfoButton
          url="https://labiblialatinoamerica.com/"
          title="Fuente: La Biblia Latinoamérica"
        />
      </form>
    </div>
  );
}
