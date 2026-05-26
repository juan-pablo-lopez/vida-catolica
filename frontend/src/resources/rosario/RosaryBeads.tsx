import { useState } from "react";

type Props = { count?: number };

export default function RosaryBeads({ count = 10 }: Props) {
  const [marked, setMarked] = useState<boolean[]>(() => Array(count).fill(false));

  const toggle = (i: number) => {
    setMarked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <div className="rosary-beads" role="group" aria-label="Contador de Ave Marías">
      {marked.map((m, i) => (
        <button
          key={i}
          type="button"
          className="bead"
          aria-pressed={m}
          aria-label={`Ave María ${i + 1}${m ? " (marcada)" : ""}`}
          onClick={() => toggle(i)}
        />
      ))}
    </div>
  );
}
