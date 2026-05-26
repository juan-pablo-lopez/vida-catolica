export type VisitaAnchor = {
  visitaAncla: number;
  fechaAncla: string;
};

const STORAGE_KEY = "visita_anchor";
const TOTAL_VISITAS = 31;

export function readAnchor(): VisitaAnchor | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as VisitaAnchor;
    if (
      typeof parsed.visitaAncla !== "number" ||
      typeof parsed.fechaAncla !== "string" ||
      parsed.visitaAncla < 1 ||
      parsed.visitaAncla > TOTAL_VISITAS
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeAnchor(anchor: VisitaAnchor): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(anchor));
}

function parseLocalDate(yyyymmdd: string): Date {
  const [y, m, d] = yyyymmdd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(yyyymmdd: string, days: number): string {
  const date = parseLocalDate(yyyymmdd);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatFechaLarga(yyyymmdd: string): string {
  return parseLocalDate(yyyymmdd).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export type VisitaHoyResult =
  | { estado: "ok"; dia: number }
  | { estado: "terminada" }
  | { estado: "pendiente"; diasFaltantes: number; fechaPrimera: string };

export function computeVisitaDeHoy(
  anchor: VisitaAnchor,
  today: string = todayIsoDate()
): VisitaHoyResult {
  const fechaAnclaDate = parseLocalDate(anchor.fechaAncla);
  const hoyDate = parseLocalDate(today);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diasTranscurridos = Math.floor(
    (hoyDate.getTime() - fechaAnclaDate.getTime()) / msPerDay
  );
  const visita = anchor.visitaAncla + diasTranscurridos;

  if (visita < 1) {
    const diasFaltantes = 1 - visita;
    return {
      estado: "pendiente",
      diasFaltantes,
      fechaPrimera: addDays(today, diasFaltantes),
    };
  }
  if (visita > TOTAL_VISITAS) {
    return { estado: "terminada" };
  }
  return { estado: "ok", dia: visita };
}
