const STORAGE_KEY = "manto_progreso";
const TOTAL_DIAS = 46;

function readUltimoCompletado(): number {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return 0;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed >= TOTAL_DIAS) return 0;
  return parsed;
}

export function marcarCompletado(dia: number): void {
  if (dia >= TOTAL_DIAS) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, String(dia));
}

export function proximoDia(): number {
  return Math.min(readUltimoCompletado() + 1, TOTAL_DIAS);
}

export function ultimoCompletado(): number {
  return readUltimoCompletado();
}
