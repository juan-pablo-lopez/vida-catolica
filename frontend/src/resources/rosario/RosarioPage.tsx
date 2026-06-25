import { useEffect, useState } from "react";
import CopyLinkButton from "../../shared/CopyLinkButton";
import QrCodeButton from "../../shared/QrCodeButton";
import InfoButton from "../../shared/InfoButton";
import BackToLauncherButton from "../../shared/BackToLauncherButton";
import RosaryBeads from "./RosaryBeads";
import { formatAnuncio, getDefaultMisterioKey, type Misterios } from "./rosarioFormat";

type Antifona = Array<{ guia: string; comunidad?: string }>;

type Oracion = {
  titulo: string;
  texto?: string;
  role?: "todos" | "guia";
  antifona?: Antifona;
  intro?: string;
  role_intro?: "guia";
  rezos?: string[];
};

type Letanias = {
  titulo: string;
  kyrie: string[];
  trinidad: { respuesta: string; invocaciones: string[] };
  marianas: { respuesta: string; grupos: string[][] };
  cordero: Array<{ invocacion: string; respuesta: string }>;
};

type RosarioData = {
  oraciones: Record<string, Oracion>;
  letanias: Letanias;
  misterios: Misterios;
};

const ROLE_LABEL: Record<string, string> = {
  todos: "Todos",
  guia: "Guía",
};

function PrayerBlock({ oracion }: { oracion: Oracion }) {
  return (
    <div className="prayer-block">
      <h4>{oracion.titulo}</h4>
      {oracion.role && oracion.texto && (
        <p>
          <span className="role-label">{ROLE_LABEL[oracion.role]}:</span> {oracion.texto}
        </p>
      )}
      {!oracion.role && oracion.texto && <p>{oracion.texto}</p>}
      {oracion.antifona && <AntifonaBlock antifona={oracion.antifona} />}
    </div>
  );
}

function AntifonaBlock({ antifona }: { antifona: Antifona }) {
  return (
    <div className="antifona">
      {antifona.map((line, i) => (
        <div key={i} className="antifona-line">
          <p>
            <span className="role-label">Guía:</span> {line.guia}
          </p>
          {line.comunidad && (
            <p>
              <span className="role-label">Comunidad:</span> {line.comunidad}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function IntencionesPapa({
  oracion,
  oraciones,
}: {
  oracion: Oracion;
  oraciones: Record<string, Oracion>;
}) {
  if (!oracion.intro || !oracion.rezos) return null;
  return (
    <div className="prayer-block">
      <h4>{oracion.titulo}</h4>
      <p>
        <span className="role-label">Guía:</span> {oracion.intro}
      </p>
      {oracion.rezos.map((id) => {
        const ref = oraciones[id];
        if (!ref) return null;
        return (
          <p key={id} className="prayer-inline">
            <span className="role-label">Todos:</span> <strong>{ref.titulo}:</strong> {ref.texto}
          </p>
        );
      })}
    </div>
  );
}

function LetaniasBlock({ data }: { data: Letanias }) {
  return (
    <section className="visita-section letanias">
      <h3>{data.titulo}</h3>

      <ul className="letania-lista">
        {data.kyrie.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>

      <p className="letania-respuesta">
        A cada invocación: <em>{data.trinidad.respuesta}</em>
      </p>
      <ul className="letania-lista">
        {data.trinidad.invocaciones.map((inv) => (
          <li key={inv}>{inv}</li>
        ))}
      </ul>

      <p className="letania-respuesta">
        A cada invocación: <em>{data.marianas.respuesta}</em>
      </p>
      {data.marianas.grupos.map((grupo, idx) => (
        <ul key={idx} className="letania-lista letania-grupo">
          {grupo.map((inv) => (
            <li key={inv}>{inv}</li>
          ))}
        </ul>
      ))}

      <div className="letania-cordero">
        {data.cordero.map((c, i) => (
          <p key={i}>
            {c.invocacion} <em>— {c.respuesta}.</em>
          </p>
        ))}
      </div>
    </section>
  );
}

function MysterySelector({
  misterios,
  current,
  todayKey,
  onChange,
}: {
  misterios: Misterios;
  current: string;
  todayKey: string;
  onChange: (key: string) => void;
}) {
  const SHORT_LABELS: Record<string, string> = {
    gozosos: "Gozosos",
    dolorosos: "Dolorosos",
    gloriosos: "Gloriosos",
    luminosos: "Luminosos",
  };
  return (
    <div className="mystery-selector" role="tablist" aria-label="Misterios">
      {Object.keys(misterios).map((key) => {
        const isActive = key === current;
        const isToday = key === todayKey;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={
              "mystery-chip" +
              (isActive ? " is-active" : "") +
              (isToday ? " is-today" : "")
            }
            onClick={() => onChange(key)}
            title={isToday ? "Misterio de hoy" : SHORT_LABELS[key]}
          >
            {SHORT_LABELS[key] ?? key}
          </button>
        );
      })}
    </div>
  );
}

export default function RosarioPage() {
  const [data, setData] = useState<RosarioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [misterioKey, setMisterioKey] = useState<string>("");
  const [todayKey, setTodayKey] = useState<string>("");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/rosario/rosario.json`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el rosario");
        return res.json();
      })
      .then((d: RosarioData) => {
        setData(d);
        const today = getDefaultMisterioKey(d.misterios);
        setTodayKey(today);
        setMisterioKey(today);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (!data || !misterioKey) return <p>Cargando…</p>;

  const misterio = data.misterios[misterioKey];
  const o = data.oraciones;

  return (
    <div className="card-container">
      <div className="detail-card is-tall">
        <div className="card-header">
          <h1>Santo Rosario</h1>
          <h2>{misterio.titulo}</h2>
          <MysterySelector
            misterios={data.misterios}
            current={misterioKey}
            todayKey={todayKey}
            onChange={setMisterioKey}
          />
        </div>

        <div className="card-body">
          <section className="visita-section">
            <h3>Inicio</h3>
            <PrayerBlock oracion={o["senal-cruz"]} />
            <PrayerBlock oracion={o["abre-labios"]} />
            <PrayerBlock oracion={o["contricion"]} />
            <PrayerBlock oracion={o["espiritu-santo"]} />
            <PrayerBlock oracion={o["ofrecimiento"]} />
          </section>

          {misterio.decenas.map((decenaTitulo, idx) => (
            <section key={`${misterioKey}-${idx}`} className="visita-section">
              <h3>{formatAnuncio(idx, misterioKey, decenaTitulo)}</h3>
              <PrayerBlock oracion={o["padrenuestro"]} />
              <div className="prayer-block">
                <h4>{o["avemaria"].titulo}</h4>
                <p>{o["avemaria"].texto}</p>
                <p className="ave-maria-hint">Rezar 10 veces:</p>
                <RosaryBeads key={`${misterioKey}-${idx}`} />
              </div>
              <PrayerBlock oracion={o["gloria"]} />
              <PrayerBlock oracion={o["maria-madre-gracia"]} />
              <PrayerBlock oracion={o["fatima"]} />
            </section>
          ))}

          <section className="visita-section">
            <h3>Final</h3>
            <IntencionesPapa oracion={o["intenciones-papa"]} oraciones={o} />
            <PrayerBlock oracion={o["avemaria-fe"]} />
            <PrayerBlock oracion={o["avemaria-esperanza"]} />
            <PrayerBlock oracion={o["avemaria-caridad"]} />
            <PrayerBlock oracion={o["avemaria-trinidad"]} />
            <PrayerBlock oracion={o["salve"]} />
          </section>

          <LetaniasBlock data={data.letanias} />

          <section className="visita-section">
            <h3>Después de las letanías</h3>
            <PrayerBlock oracion={o["oracion-final"]} />
            <PrayerBlock oracion={o["san-miguel"]} />
            <PrayerBlock oracion={o["oh-madre"]} />
            <PrayerBlock oracion={o["dulce-madre"]} />
          </section>
        </div>

        <div className="card-footer">
          <div className="card-actions">
            <BackToLauncherButton />
            <CopyLinkButton />
            <QrCodeButton title={`Santo Rosario · ${misterio.titulo}`} />
          </div>
          <InfoButton
            url="https://www.es.catholic.net/op/articulos/13325/el-santo-rosario"
            title="Fuente: catholic.net"
          />
        </div>
      </div>
    </div>
  );
}
