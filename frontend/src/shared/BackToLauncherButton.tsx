import { useNavigate } from "react-router-dom";
import { LuHouse } from "react-icons/lu";

export default function BackToLauncherButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="icon-button back-to-launcher"
      title="Volver a Vida Católica"
      onClick={() => navigate("/")}
    >
      <LuHouse size={20} />
    </button>
  );
}
