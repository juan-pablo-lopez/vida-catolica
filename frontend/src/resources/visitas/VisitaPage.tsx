import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuArrowLeft, LuCheck } from "react-icons/lu";
import CopyLinkButton from "../../shared/CopyLinkButton";
import QrCodeButton from "../../shared/QrCodeButton";
import InfoButton from "../../shared/InfoButton";
import { marcarCompletada } from "./visitaProgress";

const TOTAL_VISITAS = 31;

type SeccionDiario = {
  secuencia: number;
  titulo: string;
  oracion: string;
};

type SeccionVisita = {
  secuencia: number;
  oracion: string;
  jaculatoria?: string;
};

type Visita = {
  dia: number;
  titulo: string;
  oraciones: SeccionVisita[];
};

type VisitasData = {
  diario: SeccionDiario[];
  visitas: Visita[];
};

const TITULOS_ESPECIFICOS: Record<number, string> = {
  2: "Visita a Jesús Sacramentado",
  4: "Visita a María Santísima",
};

function paragraphs(text: string) {
  return text.split("\n").filter((p) => p.trim().length > 0);
}

export default function VisitaPage() {
  const { dia } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<VisitasData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/visitas/visitas.json`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las visitas");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Cargando…</p>;

  const diaNum = Number(dia);
  const visita = data.visitas.find((v) => v.dia === diaNum);

  if (!visita) {
    return (
      <div className="card-container">
        <div className="verse-card">
          <h1>Visita no encontrada</h1>
          <p>El día {dia} no existe (rango válido: 1–31).</p>
        </div>
      </div>
    );
  }

  const completarVisita = () => {
    marcarCompletada(diaNum);
    if (diaNum >= TOTAL_VISITAS) {
      navigate("/visitas", { state: { serieCompletada: true } });
    } else {
      navigate("/visitas");
    }
  };

  const diarioBySeq = Object.fromEntries(data.diario.map((s) => [s.secuencia, s]));
  const oracionesBySeq = Object.fromEntries(
    visita.oraciones.map((o) => [o.secuencia, o])
  );

  const secciones: Array<{
    key: string;
    titulo: string;
    oracion: string;
    jaculatoria?: string;
  }> = [
    {
      key: "diario-1",
      titulo: diarioBySeq[1].titulo,
      oracion: diarioBySeq[1].oracion,
    },
    {
      key: "visita-2",
      titulo: TITULOS_ESPECIFICOS[2],
      oracion: oracionesBySeq[2].oracion,
      jaculatoria: oracionesBySeq[2].jaculatoria,
    },
    {
      key: "diario-3",
      titulo: diarioBySeq[3].titulo,
      oracion: diarioBySeq[3].oracion,
    },
    {
      key: "visita-4",
      titulo: TITULOS_ESPECIFICOS[4],
      oracion: oracionesBySeq[4].oracion,
      jaculatoria: oracionesBySeq[4].jaculatoria,
    },
    {
      key: "diario-5",
      titulo: diarioBySeq[5].titulo,
      oracion: diarioBySeq[5].oracion,
    },
  ];

  return (
    <div className="card-container">
      <div className="detail-card is-tall">
        <div className="card-header">
          <h1>Visita {visita.dia}</h1>
          <h2>{visita.titulo}</h2>
        </div>

        <div className="card-body">
          {secciones.map((sec) => (
            <section key={sec.key} className="visita-section">
              <h3>{sec.titulo}</h3>
              {paragraphs(sec.oracion).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {sec.jaculatoria && (
                <p className="visita-jaculatoria">
                  <span className="visita-jaculatoria-label">{sec.jaculatoria}</span>
                </p>
              )}
            </section>
          ))}
        </div>

        <div className="card-footer">
          <button
            type="button"
            className="primary-button visita-completar-button"
            onClick={completarVisita}
          >
            <LuCheck size={18} />
            <span>Completar visita</span>
          </button>
          <div className="card-actions">
            <button
              type="button"
              className="icon-button"
              onClick={() => navigate("/visitas")}
              title="Volver al formulario"
            >
              <LuArrowLeft size={20} />
            </button>
            <CopyLinkButton />
            <QrCodeButton title={`Visita ${visita.dia}`} />
          </div>
          <InfoButton
            url="https://es.wikipedia.org/wiki/Alfonso_Mar%C3%ADa_de_Ligorio"
            title="Fuente: San Alfonso María de Ligorio"
          />
        </div>
      </div>
    </div>
  );
}
