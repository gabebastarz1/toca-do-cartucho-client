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
  CreateAdvertisementSaleAndTrade,
  CreateAdvertisementSaleOnly,
  ProductListing,
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
          <Route
            path="/criar-anuncio/apenas-troca"
            element={<CreateAdvertisementOnlyTrade />}
          />
          <Route
            path="/criar-anuncio/venda-e-troca"
            element={<CreateAdvertisementSaleAndTrade />}
          />
          <Route
            path="/criar-anuncio/apenas-venda"
            element={<CreateAdvertisementSaleOnly />}
          />
          <Route path="/produtos" element={<ProductListing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
