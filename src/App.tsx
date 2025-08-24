import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  Auth,
  AdvertisementDetail,
  CreateAdvertisement,
  Profile,
  NotFound,
  CadastroParaAnunciar,
  CreateAdvertisementOnlyTrade,
} from "./pages";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/anuncio/:id" element={<AdvertisementDetail />} />
          <Route path="/criar-anuncio" element={<CreateAdvertisement />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/criar-conta" element={<CadastroParaAnunciar />} />
          <Route path="/criar-anuncio/apenas-troca" element={<CreateAdvertisementOnlyTrade />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
