const STORAGE_KEY = "visita_progreso";
const TOTAL_VISITAS = 31;

function readUltimaCompletada(): number {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return 0;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed >= TOTAL_VISITAS) {
    return 0;
  }
  return parsed;
}

/**
 * Marca una visita como completada. Al completar la última (31) se borra el
 * progreso para reiniciar la serie desde la 1.
 */
export function marcarCompletada(dia: number): void {
  if (dia >= TOTAL_VISITAS) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, String(dia));
}

/**
 * Siguiente visita pendiente según el progreso guardado: 1 si no hay nada,
 * o (última completada + 1) acotado a 31.
 */
export function proximaVisita(): number {
  return Math.min(readUltimaCompletada() + 1, TOTAL_VISITAS);
}
