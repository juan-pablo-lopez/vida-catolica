import { Link } from "react-router-dom";
import { LuBookOpen, LuChurch, LuLasso, LuSparkles } from "react-icons/lu";

type Resource = {
  slug: string;
  titulo: string;
  descripcion: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

const RESOURCES: Resource[] = [
  {
    slug: "citas-biblicas",
    titulo: "Citas Bíblicas",
    descripcion: "Consulta pasajes de la Biblia Latinoamérica.",
    icon: <LuBookOpen size={28} />,
  },
  {
    slug: "visitas",
    titulo: "Visitas al Santísimo",
    descripcion: "31 visitas de San Alfonso María de Ligorio.",
    icon: <LuChurch size={28} />,
  },
  {
    slug: "rosario",
    titulo: "Santo Rosario",
    descripcion: "Misterios del día con guía completa.",
    icon: <LuLasso size={28} />,
  },
  {
    slug: "manto",
    titulo: "Manto de María",
    descripcion: "Consagración mariana en 46 días.",
    icon: <LuSparkles size={28} />,
  },
];

export default function Landing() {
  return (
    <div className="card-container">
      <div className="verse-card">
        <div className="launcher-header">
          <img
            src={`${import.meta.env.BASE_URL}vida-catolica.svg`}
            alt=""
            className="launcher-logo"
          />
          <div className="launcher-titles">
            <h1>Vida Católica</h1>
            <p className="landing-subtitle">Recursos para la oración y la lectura</p>
          </div>
        </div>

        <ul className="resource-list">
          {RESOURCES.map((r) => {
            const inner = (
              <>
                <span className="resource-icon">{r.icon}</span>
                <span className="resource-text">
                  <span className="resource-title">{r.titulo}</span>
                  <span className="resource-desc">{r.descripcion}</span>
                </span>
              </>
            );
            return (
              <li key={r.slug} className={`resource-item${r.disabled ? " is-disabled" : ""}`}>
                {r.disabled ? (
                  <div className="resource-link">{inner}</div>
                ) : (
                  <Link to={`/${r.slug}`} className="resource-link">
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
