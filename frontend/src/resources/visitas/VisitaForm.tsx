import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { LuChurch } from "react-icons/lu";
import BackToLauncherButton from "../../shared/BackToLauncherButton";
import InfoButton from "../../shared/InfoButton";
import SearchableSelect from "../../shared/SearchableSelect";
import { proximaVisita } from "./visitaProgress";

const TOTAL_VISITAS = 31;

export default function VisitaForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const serieCompletada = Boolean(
    (location.state as { serieCompletada?: boolean } | null)?.serieCompletada
  );

  const [visitaSeleccionada, setVisitaSeleccionada] = useState<number>(() =>
    proximaVisita()
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/visitas/${visitaSeleccionada}`);
  };

  return (
    <div className="card-container">
      <form onSubmit={submit} className="verse-card">
        <h1>Visitas al Santísimo</h1>

        {serieCompletada && (
          <p className="visita-serie-completada">
            ¡Completaste las 31 visitas! La serie se reinició.
          </p>
        )}

        <label>
          Número de visita
          <SearchableSelect
            value={String(visitaSeleccionada)}
            onChange={(value) => setVisitaSeleccionada(Number(value))}
            numeric
            options={Array.from({ length: TOTAL_VISITAS }, (_, i) => ({
              value: String(i + 1),
              label: String(i + 1),
            }))}
            placeholder="Número de visita"
            searchPlaceholder="Buscar número…"
          />
        </label>

        <p className="visita-anchor-hint">
          Elige el número de visita. Por defecto aparece la siguiente que te
          toca; márcala como completada al terminar para avanzar.
        </p>

        <div className="form-actions">
          <BackToLauncherButton />
          <button type="submit" className="primary-button">
            <LuChurch size={18} />
            <span>Comenzar visita</span>
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
