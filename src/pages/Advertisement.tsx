import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import AdDetails from "../components/AdDetails";
import RecommendedProducts from "../components/RecommendedProducts";
import { AdvertisementDTO } from "../api/types";
import { advertisementService } from "../services/advertisementService";

const Advertisement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advertisement, setAdvertisement] = useState<AdvertisementDTO | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAdvertisement = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const ad = await advertisementService.getById(parseInt(id));
  
        // 🕵️ ÁREA DE INVESTIGAÇÃO
        console.log("Objeto cru recebido:", ad); 
  
        try {
          // Tenta transformar em string. Se for circular, isso VAI falhar aqui.
          JSON.stringify(ad); 
          console.log("✅ JSON Válido e Seguro");
        } catch (jsonError) {
          console.error("🚨 ERRO CRÍTICO: O JSON RETORNADO É CIRCULAR!", jsonError);
          console.warn("Campos suspeitos:", Object.keys(ad));
          // Interrompe para não travar o React
          setError("Erro de dados: O anúncio contém referências circulares.");
          setLoading(false);
          return; 
        }
  
        setAdvertisement(ad); // Só seta o estado se passar no teste
      } catch (err) {
        // ... seu tratamento de erro padrão
      } finally {
        setLoading(false);
      }
    };
    loadAdvertisement();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F3F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando anúncio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F3F5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro ao carregar anúncio
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (advertisement) {
    try {
       JSON.stringify(advertisement); // Se travar aqui, seus dados são circulares
       console.log("Dados seguros:", advertisement);
    } catch(e) {
       console.error("DADOS CIRCULARES DETECTADOS!", e);
    }
  }

  // Função para remover referências circulares e dados desnecessários que travam a tela
const sanitizeAdvertisement = (ad: any): AdvertisementDTO => {
  if (!ad) return ad;

  // 1. Clonagem rasa inicial para não mutar o original
  const cleanAd = { ...ad };

  // 2. Limpeza do objeto GAME principal (Quebra ciclo Game -> Theme -> Game)
  if (cleanAd.game) {
    cleanAd.game = {
      ...cleanAd.game,
      themes: cleanAd.game.themes?.map((t: any) => ({
        id: t.id,
        theme: { id: t.theme?.id, name: t.theme?.name } // Pega só o necessário, remove vínculos de volta
      })) || [],
      genres: cleanAd.game.genres?.map((g: any) => ({
        id: g.id,
        genre: { id: g.genre?.id, name: g.genre?.name }
      })) || [],
      gameGameModes: cleanAd.game.gameGameModes?.map((gm: any) => ({
        id: gm.id,
        gameModes: { id: gm.gameModes?.id, name: gm.gameModes?.name }
      })) || []
    };
  }

  // 3. Limpeza do objeto TRADE (O Vilão do ID 534)
  if (cleanAd.trade) {
    cleanAd.trade = {
      ...cleanAd.trade,
      // Mapeamos os jogos aceitos removendo a complexidade deles
      acceptedGames: cleanAd.trade.acceptedGames?.map((ag: any) => ({
        id: ag.id,
        game: {
          id: ag.game?.id,
          name: ag.game?.name,
          slug: ag.game?.slug,
          image: ag.game?.image, // Se tiver imagem
          // IMPORTANTE: Removemos themes, genres e detalhes profundos do jogo aceito na troca
          // pois isso não costuma ser exibido com detalhes na lista de troca
        }
      })) || [],
      // Limpamos também outros arrays se existirem
      acceptedCartridgeTypes: cleanAd.trade.acceptedCartridgeTypes || [],
      acceptedPreservationStates: cleanAd.trade.acceptedPreservationStates || []
    };
  }

  // 4. Limpeza de Variações e Pai (Segurança extra baseada no erro anterior)
  if (cleanAd.variations) {
    cleanAd.variations = cleanAd.variations.map((v: any) => ({
      id: v.id,
      title: v.title,
      // Removemos recursividade
    }));
  }
  
  // Remove o objeto pai completo, mantendo só o ID
  if (cleanAd.parentAdvertisement) {
    delete cleanAd.parentAdvertisement; 
  }

  return cleanAd;
};

  return (
    <>
      <TopBar
        logoPosition="left"
        showSearchBar
        searchPlaceholder="Pesquisa na Toca do Cartucho"
        showUserMenu
      />
      <FilterTopBar />
      <div className="min-h-screen bg-[#F4F3F5] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <AdDetails advertisement={advertisement || undefined} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecommendedProducts
            currentAdvertisement={advertisement || undefined}
            onProductClick={(
              productId: string,
              parentAdvertisementId?: number
            ) => {
              if (parentAdvertisementId) {
                navigate(
                  `/anuncio/${parentAdvertisementId}?variation=${productId}`
                );
              } else {
                navigate(`/anuncio/${productId}`);
              }
            }}
          />
        </div>
      </div>

      <Footer
        showBackToTopButton={true}
        onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </>
  );
  
};

export default Advertisement;
