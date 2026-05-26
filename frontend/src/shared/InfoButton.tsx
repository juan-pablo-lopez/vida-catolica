import { LuInfo } from "react-icons/lu";

type Props = {
  url: string;
  title: string;
};

export default function InfoButton({ url, title }: Props) {
  return (
    <button
      type="button"
      className="icon-button info-button"
      title={title}
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    >
      <LuInfo size={18} />
    </button>
  );
}
