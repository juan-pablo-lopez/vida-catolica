import { useState } from "react";
import { LuQrCode, LuX } from "react-icons/lu";
import { QRCodeSVG } from "qrcode.react";
import { getShareUrl } from "./shareUrl";

type Props = {
  title?: string;
};

export default function QrCodeButton({ title }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="icon-button"
        onClick={() => setOpen(true)}
        title="Generar código QR"
      >
        <LuQrCode size={18} />
      </button>

      {open && (
        <div className="qr-overlay" onClick={() => setOpen(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="qr-close-button"
              onClick={() => setOpen(false)}
              title="Cerrar"
            >
              <LuX size={24} />
            </button>
            <div className="qr-content">
              {title && <h3>{title}</h3>}
              <QRCodeSVG value={getShareUrl()} size={300} level="H" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
