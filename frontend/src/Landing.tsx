import { Link } from "react-router-dom";
import { LuBookOpen, LuChurch, LuCircleDot } from "react-icons/lu";

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
    disabled: true,
  },
  {
    slug: "rosario",
    titulo: "Rosario",
    descripcion: "Próximamente.",
    icon: <LuCircleDot size={28} />,
    disabled: true,
  },
];

export default function Landing() {
  return (
    <div className="card-container">
      <div className="verse-card">
        <h1>Vida Católica</h1>
        <p className="landing-subtitle">Recursos para la oración y la lectura</p>

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
