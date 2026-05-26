const ORDINALES = ["Primer", "Segundo", "Tercer", "Cuarto", "Quinto"];

const TIPOS_SINGULAR: Record<string, string> = {
  gozosos: "gozoso",
  dolorosos: "doloroso",
  gloriosos: "glorioso",
  luminosos: "luminoso",
};

export function formatAnuncio(index: number, misterioKey: string, titulo: string): string {
  const ordinal = ORDINALES[index] ?? `${index + 1}.°`;
  const tipo = TIPOS_SINGULAR[misterioKey] ?? "";
  return `${ordinal} misterio ${tipo} — ${titulo}`;
}

export type Misterios = Record<
  string,
  { titulo: string; dias: number[]; decenas: string[] }
>;

export function getDefaultMisterioKey(misterios: Misterios, today: Date = new Date()): string {
  const day = today.getDay();
  for (const [key, m] of Object.entries(misterios)) {
    if (m.dias.includes(day)) return key;
  }
  return Object.keys(misterios)[0];
}
