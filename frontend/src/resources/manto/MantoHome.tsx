import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuSparkles } from "react-icons/lu";
import BackToLauncherButton from "../../shared/BackToLauncherButton";
import { proximoDia, ultimoCompletado } from "./mantoProgress";

const TOTAL_DIAS = 46;

export default function MantoHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const serieCompletada = Boolean(
    (location.state as { serieCompletada?: boolean } | null)?.serieCompletada
  );

  const [ultimo, setUltimo] = useState<number>(0);

  useEffect(() => {
    setUltimo(ultimoCompletado());
  }, []);

  const siguiente = proximoDia();

  return (
    <div className="card-container">
      <div className="verse-card">
        <div className="manto-home-header">
          <LuSparkles size={28} className="manto-home-icon" />
          <h1>Manto de María</h1>
        </div>

        <p className="manto-rosario-hint">
          Cada meditación se hace después de rezar el Santo Rosario del día.
        </p>

        {serieCompletada && (
          <p className="manto-serie-completada">
            ¡Completaste los 46 días de consagración! La serie se reinició.
          </p>
        )}

        <div className="manto-star-grid">
          {Array.from({ length: TOTAL_DIAS }, (_, i) => {
            const dia = i + 1;
            const completada = dia <= ultimo;
            const esSiguiente = dia === siguiente && ultimo < TOTAL_DIAS;
            return (
              <button
                key={dia}
                type="button"
                className={`manto-star${completada ? " is-completed" : ""}${esSiguiente ? " is-current" : ""}`}
                onClick={() => navigate(`/manto/${dia}`)}
                aria-label={`Día ${dia}`}
                title={`Día ${dia}`}
              >
                {completada || esSiguiente ? "★" : "☆"}
              </button>
            );
          })}
        </div>

        <p className="manto-progress-label">
          {ultimo === 0
            ? "Ningún día completado aún"
            : `${ultimo} de ${TOTAL_DIAS} días completados`}
        </p>

        <div className="form-actions">
          <BackToLauncherButton />
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate(`/manto/${siguiente}`)}
          >
            <LuSparkles size={18} />
            <span>Día {siguiente}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
