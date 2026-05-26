import { useNavigate, useLocation } from "react-router-dom";
import { Fragment, useState } from "react";
import { LuArrowLeft, LuInfo, LuLink, LuQrCode, LuX } from "react-icons/lu";
import { QRCodeSVG } from "qrcode.react";

type VerseCardProps = {
  libro: string;
  capitulo: string;
  verses: { [key: string]: string };
  subtitulos: { [key: string]: string };
  prologos: { [key: string]: string };
};

export default function VerseCard({ libro, capitulo, verses, subtitulos, prologos }: VerseCardProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const queryString = useLocation().search.replace("?", "");
  console.log("Query String:", queryString);

  const getShareUrl = () => {
    let url = window.location.href;
    if (url.includes("localhost")) {
      url = url.replace(/http:\/\/localhost:\d+/, "https://juan-pablo-lopez.github.io");
    }
    return url;
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-container">
      <div className="verse-card">
        <h1>{libro}</h1>
        <h2>Capítulo {capitulo}</h2>

        <ul className="verses">
          {Object.entries(verses).map(([num, text]) => (
            <Fragment key={num}>
              {prologos[num] && (
                <li className="verse-prologue">
                  {prologos[num].split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </li>
              )}
              {subtitulos[num] && (
                <li className="verse-subtitle">
                  {subtitulos[num].split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </li>
              )}
              <li>
                <span className="verse-num">{num}</span>
                <span className="verse-text">{text}</span>
              </li>
            </Fragment>
          ))}
        </ul>

        <div className="card-actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => navigate("/citas-biblicas")}
            title="Volver al formulario"
          >
            <LuArrowLeft size={20} />
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={copyLink}
            title={copied ? "Copiado" : "Copiar enlace"}
          >
            <LuLink size={20} />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => setShowQrCode(true)}
            title="Generar código QR"
          >
            <LuQrCode size={18} />
          </button>
        </div>
        <button
          type="button"
          className="icon-button info-button"
          title="Fuente: La Biblia Latinoamérica"
          onClick={() =>
            window.open(
              "https://labiblialatinoamerica.com/",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <LuInfo size={18} />
        </button>
      </div>

      {showQrCode && (
        <div className="qr-overlay" onClick={() => setShowQrCode(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="qr-close-button"
              onClick={() => setShowQrCode(false)}
              title="Cerrar"
            >
              <LuX size={24} />
            </button>
            <div className="qr-content">
              <h3>{libro} {capitulo}:{queryString}</h3>
              <QRCodeSVG value={getShareUrl()} size={300} level="H" title="getShareUrl()" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
