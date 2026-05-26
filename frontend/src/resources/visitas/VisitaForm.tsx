import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuCalendar, LuChurch } from "react-icons/lu";
import BackToLauncherButton from "../../shared/BackToLauncherButton";
import InfoButton from "../../shared/InfoButton";
import {
  readAnchor,
  writeAnchor,
  todayIsoDate,
  computeVisitaDeHoy,
  formatFechaLarga,
  type VisitaHoyResult,
} from "./visitaAnchor";

const TOTAL_VISITAS = 31;

export default function VisitaForm() {
  const navigate = useNavigate();

  const [visitaAncla, setVisitaAncla] = useState<number>(1);
  const [fechaAncla, setFechaAncla] = useState<string>(todayIsoDate());
  const [hasAnchor, setHasAnchor] = useState<boolean>(false);
  const [sinVisita, setSinVisita] = useState<
    Exclude<VisitaHoyResult, { estado: "ok" }> | null
  >(null);

  useEffect(() => {
    const anchor = readAnchor();
    if (anchor) {
      setVisitaAncla(anchor.visitaAncla);
      setFechaAncla(anchor.fechaAncla);
      setHasAnchor(true);
    }
  }, []);

  const resolveVisita = (result: VisitaHoyResult) => {
    if (result.estado === "ok") {
      navigate(`/visitas/${result.dia}`);
    } else {
      setSinVisita(result);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const anchor = { visitaAncla, fechaAncla };
    writeAnchor(anchor);
    setHasAnchor(true);
    resolveVisita(computeVisitaDeHoy(anchor));
  };

  const handleVisitaDeHoy = () => {
    const anchor = readAnchor();
    if (!anchor) return;
    resolveVisita(computeVisitaDeHoy(anchor));
  };

  if (sinVisita) {
    return (
      <div className="card-container">
        <div className="verse-card">
          <h1>Visitas al Santísimo</h1>
          <p className="sin-visita-mensaje">No hay visita para hoy.</p>
          {sinVisita.estado === "terminada" ? (
            <p className="sin-visita-detalle">
              La serie de 31 visitas ya terminó. Programa una nueva serie para
              continuar.
            </p>
          ) : (
            <p className="sin-visita-detalle">
              La primera visita será el {formatFechaLarga(sinVisita.fechaPrimera)}{" "}
              (faltan {sinVisita.diasFaltantes}{" "}
              {sinVisita.diasFaltantes === 1 ? "día" : "días"}).
            </p>
          )}

          <div className="form-actions">
            <BackToLauncherButton />
            <button
              type="button"
              className="primary-button"
              onClick={() => setSinVisita(null)}
            >
              <LuCalendar size={18} />
              <span>Programar nueva serie</span>
            </button>
          </div>

          <InfoButton
            url="https://es.wikipedia.org/wiki/Alfonso_Mar%C3%ADa_de_Ligorio"
            title="Fuente: San Alfonso María de Ligorio"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="card-container">
      <form onSubmit={submit} className="verse-card">
        <h1>Visitas al Santísimo</h1>

        <label>
          Número de visita
          <select
            value={visitaAncla}
            onChange={(e) => setVisitaAncla(Number(e.target.value))}
          >
            {Array.from({ length: TOTAL_VISITAS }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha
          <input
            type="date"
            value={fechaAncla}
            onChange={(e) => setFechaAncla(e.target.value)}
          />
        </label>

        <p className="visita-anchor-hint">
          Establece la visita y la fecha en que la harás. Luego, "Visita de hoy"
          calcula la del día actual.
        </p>

        <div className="form-actions">
          <BackToLauncherButton />
          <button type="submit" className="primary-button">
            <LuCalendar size={18} />
            <span>Guardar fecha inicial</span>
          </button>
          <button
            type="button"
            className="primary-button"
            disabled={!hasAnchor}
            onClick={handleVisitaDeHoy}
          >
            <LuChurch size={18} />
            <span>Visita de hoy</span>
          </button>
        </div>

        <InfoButton
          url="https://es.wikipedia.org/wiki/Alfonso_Mar%C3%ADa_de_Ligorio"
          title="Fuente: San Alfonso María de Ligorio"
        />
      </form>
    </div>
  );
}
