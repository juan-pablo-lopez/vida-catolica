import { useEffect, useMemo, useState } from "react";
import { LiaScrollSolid, LiaBibleSolid } from "react-icons/lia";

export type Testamento = "A" | "N";

export type BookIndexEntry = {
  libro: string;
  slug: string;
  testamento: Testamento;
  capitulos: number;
};

type Props = {
  books: BookIndexEntry[];
  libro: string;
  capitulo: string;
  versiculos: string;
  onTestamentoChange: (testamento: Testamento | "") => void;
  onLibroChange: (libro: string) => void;
  onCapituloChange: (capitulo: string) => void;
  onVersiculosChange: (versiculos: string) => void;
};

type Step = 1 | 2 | 3 | 4;

const TESTAMENTO_LABELS: Record<Testamento, string> = {
  A: "Antiguo Testamento",
  N: "Nuevo Testamento",
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export default function CitationSelector({
  books,
  libro,
  capitulo,
  versiculos,
  onTestamentoChange,
  onLibroChange,
  onCapituloChange,
  onVersiculosChange,
}: Props) {
  const selectedBook = books.find((book) => book.slug === libro);

  const [testamento, setTestamento] = useState<Testamento | "">(
    selectedBook?.testamento || ""
  );

 const [activeStep, setActiveStep] = useState<Step>(() => {
    const lastLibro = localStorage.getItem("last_libro");
    const lastCapitulo = localStorage.getItem("last_capitulo");

    if (lastLibro && lastCapitulo) {
      return 4;
    }

    if (lastLibro) {
      return 3;
    }

    return 1;
  });

  const [bookQuery, setBookQuery] = useState("");
  const [chapterQuery, setChapterQuery] = useState("");

  const booksForTestamento = useMemo(() => {
    if (!testamento) return [];

    const query = normalize(bookQuery);

    return books.filter(
      (book) =>
        book.testamento === testamento &&
        (!query || normalize(book.libro).includes(query))
    );
  }, [books, bookQuery, testamento]);

  const chapters = useMemo(() => {
    if (!selectedBook) return [];

    const query = chapterQuery.trim();

    return Array.from(
      { length: selectedBook.capitulos },
      (_, index) => String(index + 1)
    ).filter((chapter) => !query || chapter.includes(query));
  }, [selectedBook, chapterQuery]);

  useEffect(() => {
    if (selectedBook) {
      setTestamento(selectedBook.testamento);
    }
  }, [selectedBook]);

  const chooseTestamento = (value: Testamento) => {
    setTestamento(value);
    onTestamentoChange(value);

    setBookQuery("");
    setChapterQuery("");
    setActiveStep(2);
  };

  const chooseLibro = (slug: string) => {
    onLibroChange(slug);
    setChapterQuery("");
    setActiveStep(3);
  };

  const chooseCapitulo = (chapter: string) => {
    onCapituloChange(chapter);
    setActiveStep(4);
  };

  const changeTestamento = () => {
    setTestamento("");
    onTestamentoChange("");

    setBookQuery("");
    setChapterQuery("");
    setActiveStep(1);
  };

  const changeLibro = () => {
    onLibroChange("");
    setChapterQuery("");
    setActiveStep(2);
  };

  const changeCapitulo = () => {
    onCapituloChange("");
    setActiveStep(3);
  };

  return (
    <div className="citation-selector">
      {testamento && activeStep !== 1 ? (
        <div className="citation-summary">
          <div className="citation-summary-row">
            <div>
              <span className="citation-summary-label">Testamento</span>
              <strong>{TESTAMENTO_LABELS[testamento]}</strong>
            </div>
            <button
              type="button"
              className="citation-change-button"
              onClick={changeTestamento}
            >
              Cambiar
            </button>
          </div>
        </div>
      ) : (
        <section className="citation-step">
          <h2>Testamento</h2>
          <p className="citation-step-help">
            Elige el testamento que quieres consultar.
          </p>

          <div className="citation-testament-options">
            <button
              type="button"
              className="citation-testament-card"
              onClick={() => chooseTestamento("A")}
            >
              <LiaScrollSolid className="citation-card-icon" aria-hidden />
              <span>Antiguo Testamento</span>
            </button>

            <button
              type="button"
              className="citation-testament-card"
              onClick={() => chooseTestamento("N")}
            >
              <LiaBibleSolid className="citation-card-icon" aria-hidden />
              <span>Nuevo Testamento</span>
            </button>
          </div>
        </section>
      )}

      {testamento && (
        <>
          {libro && activeStep > 2 ? (
            <div className="citation-summary">
              <div className="citation-summary-row">
                <div>
                  <span className="citation-summary-label">Libro</span>
                  <strong>{selectedBook?.libro}</strong>
                </div>
                <button
                  type="button"
                  className="citation-change-button"
                  onClick={changeLibro}
                >
                  Cambiar
                </button>
              </div>
            </div>
          ) : (
            activeStep === 2 && (
              <section className="citation-step">
                <h2>Libro</h2>
                <p className="citation-step-help">
                  Elige el libro que quieres consultar.
                </p>

                <div className="citation-search-wrapper">
                  <label htmlFor="citation-book-search">Buscar libro</label>
                  <input
                    id="citation-book-search"
                    type="search"
                    value={bookQuery}
                    onChange={(e) => setBookQuery(e.target.value)}
                    placeholder="Ej. Génesis, Mateo..."
                  />
                </div>

                <div className="citation-book-grid">
                  {booksForTestamento.map((book) => (
                    <button
                      key={book.slug}
                      type="button"
                      className="citation-book-card"
                      onClick={() => chooseLibro(book.slug)}
                    >
                      {book.libro}
                    </button>
                  ))}

                  {booksForTestamento.length === 0 && (
                    <p className="citation-no-results">
                      No encontramos libros con ese nombre.
                    </p>
                  )}
                </div>
              </section>
            )
          )}

          {libro && (
            <>
              {capitulo && activeStep === 4 ? (
                <div className="citation-summary">
                  <div className="citation-summary-row">
                    <div>
                      <span className="citation-summary-label">Capítulo</span>
                      <strong>{capitulo}</strong>
                    </div>
                    <button
                      type="button"
                      className="citation-change-button"
                      onClick={changeCapitulo}
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              ) : (
                activeStep === 3 && (
                  <section className="citation-step">
                    <h2>Capítulo</h2>
                    <p className="citation-step-help">
                      Elige el capítulo que quieres consultar.
                    </p>

                    <div className="citation-search-wrapper">
                      <label htmlFor="citation-chapter-search">
                        Buscar capítulo
                      </label>
                      <input
                        id="citation-chapter-search"
                        type="search"
                        inputMode="numeric"
                        value={chapterQuery}
                        onChange={(e) => setChapterQuery(e.target.value)}
                        placeholder="Ej. 23"
                      />
                    </div>

                    <div className="citation-chapter-grid">
                      {chapters.map((chapter) => (
                        <button
                          key={chapter}
                          type="button"
                          className={
                            "citation-chapter-button" +
                            (chapter === capitulo
                              ? " is-selected"
                              : "")
                          }
                          onClick={() => chooseCapitulo(chapter)}
                        >
                          {chapter}
                        </button>
                      ))}

                      {chapters.length === 0 && (
                        <p className="citation-no-results">
                          No encontramos ese capítulo.
                        </p>
                      )}
                    </div>
                  </section>
                )
              )}

              {capitulo && activeStep === 4 && (
                <section className="citation-step">
                  <h2>Versículos</h2>
                  <p className="citation-step-help">
                    Escribe los versículos que quieres consultar. Puedes
                    indicar uno, varios o un rango.
                  </p>

                  <input
                    type="text"
                    placeholder="Ej. 1-3,5"
                    value={versiculos}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9,-]/g, "");
                      onVersiculosChange(value);
                    }}
                    aria-label="Versículos"
                  />
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
