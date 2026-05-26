import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import VerseCard from "./VerseCard";
import { parseVerseRange } from "./verseParser";

type BibleData = {
  libro: string;
  capitulos: {
    [cap: string]: {
      [verse: string]: string;
    };
  };
  subtitulos?: {
    [cap: string]: {
      [verse: string]: string;
    };
  };
  prologos?: {
    [cap: string]: {
      [verse: string]: string;
    };
  };
};

export default function CitationPage() {
  const { libro, capitulo } = useParams();
  const location = useLocation();

  const [data, setData] = useState<BibleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verseQuery = location.search.replace("?", "");

  useEffect(() => {
    if (!libro) return;

    fetch(`${import.meta.env.BASE_URL}data/citas-biblicas/${libro}.json`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el libro");
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, [libro]);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Cargando…</p>;

  const chapterData = data.capitulos[capitulo ?? ""];

  if (!chapterData) {
    return <p>Capítulo no encontrado</p>;
  }

  const verses = parseVerseRange(chapterData, verseQuery);
  const subtitulos = data.subtitulos?.[capitulo ?? ""] ?? {};
  const prologos = data.prologos?.[capitulo ?? ""] ?? {};

  return (
    <VerseCard
      libro={data.libro}
      capitulo={capitulo!}
      verses={verses}
      subtitulos={subtitulos}
      prologos={prologos}
    />
  );
}
