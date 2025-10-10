import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  Auth,
  Advertisement,
  CreateAdvertisement,
  Profile,
  NotFound,
  CadastroParaAnunciar,
  CreateAdvertisementOnlyTrade,
  CreateAdvertisementSaleAndTrade,
  CreateAdvertisementSaleOnly,
  ProductListing,
  Login,
  Register,
} from "./pages";
import MeusDados from "./pages/MeusDados";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import { CategoryDataProvider } from "./components/CategoryDataProvider";
import { AuthProvider } from "./hooks/useAuth";
import PWAInstallBanner from "./components/PWAInstallBanner";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CategoryDataProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/favoritos" element={<Favorites />} />
              {/* <Route path="/auth" element={<Auth />} /> */}
              <Route path="/auth" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/anuncio/:id" element={<Advertisement />} />
              <Route path="/criar-anuncio" element={<CreateAdvertisement />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/meus-dados" element={<MeusDados />} />
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

            <PWAInstallBanner />
          </div>
        </Router>
      </CategoryDataProvider>
    </AuthProvider>
  );
}

export default App;
