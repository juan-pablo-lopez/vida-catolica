// src/utils/verseParser.ts

type Chapter = Record<string, string>;

/**
 * Parsea un string tipo "1-3,5,7-9" y devuelve
 * solo los versículos existentes en el capítulo.
 */
export function parseVerseRange(
  chapter: Chapter,
  range?: string
): Chapter {
  // Si no hay rango, devolver todo el capítulo ordenado
  if (!range || range.trim() === "") {
    return sortChapter(chapter);
  }

  const result: Chapter = {};
  const verseNumbers = Object.keys(chapter).map(Number);
  const maxVerse = Math.max(...verseNumbers);

  const parts = range.split(",");

  for (const part of parts) {
    const trimmed = part.trim().replaceAll(/\s+/g, "").replaceAll("%20", "");
    if (!trimmed) continue;

    // Rango tipo "a-b"
    if (trimmed.includes("-")) {
      const [startRaw, endRaw] = trimmed.split("-");

      const start = Number(startRaw);
      const end = endRaw ? Number(endRaw) : maxVerse;

      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start < 1 ||
        end < start
      ) {
        continue;
      }

      for (let i = start; i <= end; i++) {
        const key = String(i);
        if (chapter[key]) {
          result[key] = chapter[key];
        }
      }
    }
    // Versículo individual
    else {
      const num = Number(trimmed);
      if (Number.isNaN(num)) continue;

      const key = String(num);
      if (chapter[key]) {
        result[key] = chapter[key];
      }
    }
  }

  return sortChapter(result);
}

/**
 * Ordena un capítulo por número de versículo
 */
function sortChapter(chapter: Chapter): Chapter {
  const ordered: Chapter = {};

  Object.keys(chapter)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(num => {
      ordered[String(num)] = chapter[String(num)];
    });

  return ordered;
}
