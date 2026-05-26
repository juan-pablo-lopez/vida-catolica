import { useState } from "react";
import { LuLink } from "react-icons/lu";

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      className="icon-button"
      onClick={copy}
      title={copied ? "Copiado" : "Copiar enlace"}
    >
      <LuLink size={20} />
    </button>
  );
}
