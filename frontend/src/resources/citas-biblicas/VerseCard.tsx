import { useNavigate, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { LuArrowLeft } from "react-icons/lu";
import CopyLinkButton from "../../shared/CopyLinkButton";
import QrCodeButton from "../../shared/QrCodeButton";
import InfoButton from "../../shared/InfoButton";

type VerseCardProps = {
  libro: string;
  capitulo: string;
  verses: { [key: string]: string };
  subtitulos: { [key: string]: string };
  prologos: { [key: string]: string };
};

export default function VerseCard({ libro, capitulo, verses, subtitulos, prologos }: VerseCardProps) {
  const navigate = useNavigate();
  const queryString = useLocation().search.replace("?", "");

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
          <CopyLinkButton />
          <QrCodeButton title={`${libro} ${capitulo}:${queryString}`} />
        </div>
        <InfoButton
          url="https://labiblialatinoamerica.com/"
          title="Fuente: La Biblia Latinoamérica"
        />
      </div>
    </div>
  );
}
