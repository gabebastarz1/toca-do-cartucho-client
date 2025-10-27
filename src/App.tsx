import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  Advertisement,
  CreateAdvertisement,
  Profile,
  PublicProfile,
  NotFound,
  CadastroParaAnunciar,
  CreateAdvertisementOnlyTrade,
  CreateAdvertisementSaleAndTrade,
  CreateAdvertisementSaleOnly,
  ProductListing,
  Login,
  Register,
  EditarAnuncio,
  TwoFactor,
  Security,
  CancelAccount,
} from "./pages";
import MeusDados from "./pages/MeusDados";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import MyAds from "./pages/MyAds";
import { CategoryDataProvider } from "./components/CategoryDataProvider";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import PWAInstallBanner from "./components/PWAInstallBanner";
//import TwoFactorAlert from "./components/TwoFactorAlert";

import "./App.css";

function AppContent() {
  //const { show2FAAlert, hide2FAAlert } = useAuth();

  return (
    <>
      {/*show2FAAlert && <TwoFactorAlert onClose={hide2FAAlert} />*/}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/favoritos" element={<Favorites />} />
        {/* <Route path="/auth" element={<Auth />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/anuncio/:id" element={<Advertisement />} />
        <Route path="/anuncio/:id/editar" element={<EditarAnuncio />} />
        <Route path="/criar-anuncio" element={<CreateAdvertisement />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/usuario/:identifier" element={<PublicProfile />} />
        <Route path="/meus-dados" element={<MeusDados />} />
        <Route path="/meus-anuncios" element={<MyAds />} />
        <Route path="/criar-conta" element={<CadastroParaAnunciar />} />
        <Route path="/autenticacao-2fa" element={<TwoFactor />} />
        <Route path="/seguranca" element={<Security />} />
        <Route path="/cancelar-conta" element={<CancelAccount />} />
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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CategoryDataProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </CategoryDataProvider>
    </AuthProvider>
  );
}

export default App;
