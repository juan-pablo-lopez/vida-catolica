import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuCheck, LuYoutube } from "react-icons/lu";
import CopyLinkButton from "../../shared/CopyLinkButton";
import QrCodeButton from "../../shared/QrCodeButton";
import InfoButton from "../../shared/InfoButton";
import { marcarCompletado } from "./mantoProgress";

const TOTAL_DIAS = 46;

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "prayer"; text: string }
  | { type: "scripture"; reference: string; url_consulta: string | null; text: string }
  | { type: "reflection"; text: string };

type Video = {
  id: string;
  title: string;
  url: string;
};

type DayReading = {
  day: number;
  star: number;
  title: string;
  subtitle: string | null;
  videos: string[];
  content: ContentBlock[];
};

type SpecialSection = {
  title: string;
  subtitle?: string | null;
  videos?: string[];
  content: ContentBlock[];
};

type ConsagracionData = {
  videos: Video[];
  opening_prayer: SpecialSection;
  daily_readings: DayReading[];
  final_consecration: SpecialSection;
};

function splitText(text: string): string[] {
  return text
    .split(/<br\s*\/?>\s*<br\s*\/?>/i)
    .flatMap((s) => s.split("\n"))
    .map((s) => s.replace(/<br\s*\/?>/gi, "").trim())
    .filter(Boolean);
}

function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <div key={i} className="manto-block">
              {splitText(block.text).map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          );
        }
        if (block.type === "prayer") {
          return (
            <div key={i} className="manto-block manto-prayer">
              {splitText(block.text).map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          );
        }
        if (block.type === "scripture") {
          const lines = splitText(block.text);
          return (
            <blockquote key={i} className="manto-scripture">
              {lines.map((l, j) => (
                <p key={j}>{l}</p>
              ))}
              <cite>{block.reference}</cite>
            </blockquote>
          );
        }
        if (block.type === "reflection") {
          return (
            <div key={i} className="manto-reflection">
              {splitText(block.text).map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

function VideoLinks({
  ids,
  videoMap,
}: {
  ids: string[];
  videoMap: Record<string, Video>;
}) {
  const videos = ids.map((id) => videoMap[id]).filter(Boolean);
  if (!videos.length) return null;
  return (
    <div className="manto-videos">
      {videos.map((v) => (
        <a
          key={v.id}
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          className="manto-video-link"
        >
          <LuYoutube size={16} />
          <span>{v.title}</span>
        </a>
      ))}
    </div>
  );
}

export default function MantoDay() {
  const { dia } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ConsagracionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/manto/consagracion.json`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la consagración");
        return res.json();
      })
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Cargando…</p>;

  const diaNum = Number(dia);
  const reading = data.daily_readings.find((r) => r.day === diaNum);

  if (!reading) {
    return (
      <div className="card-container">
        <div className="verse-card">
          <h1>Día no encontrado</h1>
          <p>El día {dia} no existe (rango válido: 1–46).</p>
        </div>
      </div>
    );
  }

  const videoMap = Object.fromEntries(data.videos.map((v) => [v.id, v]));

  const completarDia = () => {
    marcarCompletado(diaNum);
    if (diaNum >= TOTAL_DIAS) {
      navigate("/manto", { state: { serieCompletada: true } });
    } else {
      navigate("/manto");
    }
  };

  return (
    <div className="card-container">
      <div className="detail-card is-tall">
        <div className="card-header">
          <h1>Día {reading.day}</h1>
          <h2>{reading.title}</h2>
          {reading.subtitle && (
            <p className="manto-day-subtitle">{reading.subtitle}</p>
          )}
        </div>

        <div className="card-body">
          {diaNum === 1 && (
            <section className="manto-special-section">
              <h3>{data.opening_prayer.title}</h3>
              <ContentBlocks blocks={data.opening_prayer.content} />
            </section>
          )}

          <section className={diaNum === 1 ? "manto-special-section" : ""}>
            <VideoLinks ids={reading.videos} videoMap={videoMap} />
            <ContentBlocks blocks={reading.content} />
          </section>

          {diaNum === TOTAL_DIAS && (
            <section className="manto-special-section">
              <h3>{data.final_consecration.title}</h3>
              {data.final_consecration.subtitle && (
                <p className="manto-special-subtitle">
                  {data.final_consecration.subtitle}
                </p>
              )}
              <VideoLinks
                ids={data.final_consecration.videos ?? []}
                videoMap={videoMap}
              />
              <ContentBlocks blocks={data.final_consecration.content} />
            </section>
          )}
        </div>

        <div className="card-footer">
          <button
            type="button"
            className="primary-button manto-completar-button"
            onClick={completarDia}
          >
            <LuCheck size={18} />
            <span>Completar día</span>
          </button>
          <div className="card-actions">
            <button
              type="button"
              className="icon-button"
              onClick={() => navigate("/manto")}
              title="Volver al Manto de María"
            >
              <LuArrowLeft size={20} />
            </button>
            <CopyLinkButton />
            <QrCodeButton title={`Manto de María – Día ${reading.day}`} />
          </div>
          <InfoButton
            url="https://www.queenofpeacemedia.com/el-manto-de-maria/"
            title="Fuente: El Manto de María — Queen of Peace Media"
          />
        </div>
      </div>
    </div>
  );
}
