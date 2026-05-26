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
} from "./visitaAnchor";

const TOTAL_VISITAS = 31;

export default function VisitaForm() {
  const navigate = useNavigate();

  const [visitaAncla, setVisitaAncla] = useState<number>(1);
  const [fechaAncla, setFechaAncla] = useState<string>(todayIsoDate());
  const [hasAnchor, setHasAnchor] = useState<boolean>(false);

  useEffect(() => {
    const anchor = readAnchor();
    if (anchor) {
      setVisitaAncla(anchor.visitaAncla);
      setFechaAncla(anchor.fechaAncla);
      setHasAnchor(true);
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const anchor = { visitaAncla, fechaAncla };
    writeAnchor(anchor);
    setHasAnchor(true);
    const dia = computeVisitaDeHoy(anchor);
    navigate(`/visitas/${dia}`);
  };

  const handleVisitaDeHoy = () => {
    const anchor = readAnchor();
    if (!anchor) return;
    const dia = computeVisitaDeHoy(anchor);
    navigate(`/visitas/${dia}`);
  };

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
