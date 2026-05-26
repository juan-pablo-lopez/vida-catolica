import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import CitationForm from "./resources/citas-biblicas/CitationForm";
import CitationPage from "./resources/citas-biblicas/CitationPage";
import VisitaForm from "./resources/visitas/VisitaForm";
import VisitaPage from "./resources/visitas/VisitaPage";
import RosarioPage from "./resources/rosario/RosarioPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/citas-biblicas" element={<CitationForm />} />
      <Route path="/citas-biblicas/:libro/:capitulo" element={<CitationPage />} />
      <Route path="/visitas" element={<VisitaForm />} />
      <Route path="/visitas/:dia" element={<VisitaPage />} />
      <Route path="/rosario" element={<RosarioPage />} />
      <Route path="*" element={<p>Página no encontrada</p>} />
    </Routes>
  );
}
