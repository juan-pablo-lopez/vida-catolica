import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import CitationForm from "./resources/citas-biblicas/CitationForm";
import CitationPage from "./resources/citas-biblicas/CitationPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/citas-biblicas" element={<CitationForm />} />
      <Route path="/citas-biblicas/:libro/:capitulo" element={<CitationPage />} />
      <Route path="*" element={<p>Página no encontrada</p>} />
    </Routes>
  );
}
