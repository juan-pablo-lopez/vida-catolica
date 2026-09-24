import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBookOpen } from "react-icons/lu";
import InfoButton from "../../shared/InfoButton";
import BackToLauncherButton from "../../shared/BackToLauncherButton";
import CitationSelector, {
  type BookIndexEntry,
  type Testamento,
} from "./CitationSelector";

export default function CitationForm() {
  const navigate = useNavigate();

  const [books, setBooks] = useState<BookIndexEntry[]>([]);

  const [libro, setLibro] = useState<string>(() =>
    localStorage.getItem("last_libro") || ""
  );

  const [capitulo, setCapitulo] = useState<string>(() =>
    localStorage.getItem("last_capitulo") || ""
  );

  const [versiculos, setVersiculos] = useState<string>(() =>
    localStorage.getItem("last_versiculos") || ""
  );

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/citas-biblicas/index.json`)
      .then((res) => res.json())
      .then((data: BookIndexEntry[]) => {
        setBooks(data);

        if (data.length > 0 && !libro) {
          setLibro(data[0].slug);
          setCapitulo("");
          setVersiculos("");
        }
      })
      .catch(console.error);
  }, []);

  const selectedBook = books.find((book) => book.slug === libro);

  const selectedTestamento: Testamento | "" =
    selectedBook?.testamento || "";

  const handleTestamentoChange = (testamento: Testamento | "") => {
    if (!testamento) {
      setLibro("");
      setCapitulo("");
      setVersiculos("");

      localStorage.removeItem("last_libro");
      localStorage.removeItem("last_capitulo");
      localStorage.removeItem("last_versiculos");
      return;
    }

    setLibro("");
    setCapitulo("");
    setVersiculos("");

    localStorage.removeItem("last_libro");
    localStorage.removeItem("last_capitulo");
    localStorage.removeItem("last_versiculos");
  };

  const handleLibroChange = (value: string) => {
    setLibro(value);
    setCapitulo("");
    setVersiculos("");

    localStorage.removeItem("last_capitulo");
    localStorage.removeItem("last_versiculos");
  };

  const handleCapituloChange = (value: string) => {
    setCapitulo(value);
    setVersiculos("");

    localStorage.removeItem("last_versiculos");
  };

  const submit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const cleanVerses = versiculos
      .replace(/--+/g, "-")
      .replace(/,,+/g, ",")
      .replace(/[-,]+$/, "")
      .replace(/^[, ]+/, "");

    setVersiculos(cleanVerses);

    localStorage.setItem("last_libro", libro);
    localStorage.setItem("last_capitulo", capitulo);
    localStorage.setItem("last_versiculos", cleanVerses);

    const query = cleanVerses ? `?${cleanVerses}` : "";

    navigate(`/citas-biblicas/${libro}/${capitulo}${query}`);
  };

  return (
    <div className="card-container">
      <form onSubmit={submit} className="verse-card">
        <h1>Citas Bíblicas</h1>

        <CitationSelector
          books={books}
          libro={libro}
          capitulo={capitulo}
          versiculos={versiculos}
          onTestamentoChange={handleTestamentoChange}
          onLibroChange={handleLibroChange}
          onCapituloChange={handleCapituloChange}
          onVersiculosChange={setVersiculos}
        />

        <div className="form-actions">
          <BackToLauncherButton />

          <button
            type="submit"
            className="primary-button"
            disabled={!selectedTestamento || !libro || !capitulo}
          >
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
