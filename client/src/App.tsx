import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import BuilderPage from './pages/BuilderPage';
import SurveyPage from './pages/SurveyPage';
import StatisticsPage from "./pages/StatisticsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/builder/:id?" element={<BuilderPage />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
        <Route path="/statistics/:id" element={<StatisticsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;