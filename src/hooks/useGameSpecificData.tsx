import { useState, useCallback } from "react";
import { api } from "../services/api";

interface GameLocalizationDTO {
  id: number;
  gameId: number;
  region: {
    id: number;
    name: string;
    identifier: string;
  };
}

interface LanguageSupportDTO {
  id: number;
  gameId: number;
  languageSupport: {
    id: number;
    languageSupportType: {
      id: number;
      name: string;
    };
    language: {
      id: number;
      name: string;
    };
  };
}

interface GameSpecificData {
  gameLocalizations: GameLocalizationDTO[];
  languageSupports: LanguageSupportDTO[];
  loading: boolean;
  error: string | null;
}

export const useGameSpecificData = () => {
  const [data, setData] = useState<GameSpecificData>({
    gameLocalizations: [],
    languageSupports: [],
    loading: false,
    error: null,
  });

  const fetchGameData = useCallback(async (gameId: number) => {
    if (!gameId || gameId <= 0) {
      setData({
        gameLocalizations: [],
        languageSupports: [],
        loading: false,
        error: null,
      });
      return;
    }

    setData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      console.log(`🔍 Buscando dados específicos para o jogo ID: ${gameId}`);

      // Buscar localizações do jogo
      const gameLocalizationsResponse = await api.get(
        "/api/game-localizations",
        {
          params: { GameId: gameId },
        }
      );

      // Buscar suportes de idioma do jogo
      const languageSupportsResponse = await api.get("/api/language-supports", {
        params: { GameId: gameId },
      });

      console
        .log
        //"📍 Game Localizations encontradas:",
        // gameLocalizationsResponse.data
        ();
      console
        .log
        // "🌐 Language Supports encontrados:",
        // languageSupportsResponse.data
        ();

      setData({
        gameLocalizations: gameLocalizationsResponse.data || [],
        languageSupports: languageSupportsResponse.data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("❌ Erro ao buscar dados específicos do jogo:", error);
      setData({
        gameLocalizations: [],
        languageSupports: [],
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar dados do jogo",
      });
    }
  }, []);

  const clearData = useCallback(() => {
    setData({
      gameLocalizations: [],
      languageSupports: [],
      loading: false,
      error: null,
    });
  }, []);

  // Funções para obter opções filtradas
  const getAvailableRegions = useCallback(() => {
    // Verificar se há dados
    if (!data.gameLocalizations || data.gameLocalizations.length === 0) {
      //console.log("🔍 Nenhuma gameLocalization disponível");
      return [];
    }

    // console.log("🔍 Analisando gameLocalizations:", data.gameLocalizations);
    // console.log("🔍 Primeiro item:", data.gameLocalizations[0]);

    return data.gameLocalizations
      .map((gl) => {
        try {
          // Verificar diferentes estruturas possíveis
          const region = gl.region || gl;

          // console.log("🔍 GameLocalization item:", gl);
          // console.log("🔍 Region:", region);

          return {
            id: region.id,
            name: (region as any).region?.name || (region as any).name,
            identifier: (region as any).region?.name || (region as any).name,
          };
        } catch (error) {
          console.error("❌ Erro ao processar gameLocalization:", error, gl);
          return null;
        }
      })
      .filter(Boolean); // Remove valores null/undefined
  }, [data.gameLocalizations]);

  const getAvailableLanguages = useCallback(
    (supportType: "audio" | "subtitle" | "interface") => {
      const typeMap = {
        audio: 1,
        subtitle: 2,
        interface: 3,
      };

      // Verificar se há dados
      if (!data.languageSupports || data.languageSupports.length === 0) {
        // console.log("🔍 Nenhum languageSupport disponível");
        return [];
      }

      //console.log("🔍 Analisando languageSupports:", data.languageSupports);
      // console.log("🔍 Primeiro item:", data.languageSupports[0]);

      return data.languageSupports
        .filter((ls) => {
          try {
            // Verificar diferentes estruturas possíveis
            const languageSupport = ls.languageSupport || ls;
            const languageSupportType = (languageSupport as any)
              .languageSupportType;

            //console.log("🔍 Item sendo analisado:", ls);
            // console.log("🔍 languageSupport:", languageSupport);
            //console.log("🔍 languageSupportType:", languageSupportType);

            // Tentar diferentes formas de acessar o tipo
            const typeId = languageSupportType?.id || languageSupportType;

            return typeId === typeMap[supportType];
          } catch (error) {
            console.error("❌ Erro ao processar languageSupport:", error, ls);
            return false;
          }
        })
        .map((ls) => {
          try {
            const languageSupport = ls.languageSupport || ls;
            const language = (languageSupport as any).language;

            return {
              id: languageSupport.id,
              name: language,
            };
          } catch (error) {
            console.error("❌ Erro ao mapear languageSupport:", error, ls);
            return null;
          }
        })
        .filter(Boolean); // Remove valores null/undefined
    },
    [data.languageSupports]
  );

  const getAvailableAudioLanguages = useCallback(
    () => getAvailableLanguages("audio"),
    [getAvailableLanguages]
  );
  const getAvailableSubtitleLanguages = useCallback(
    () => getAvailableLanguages("subtitle"),
    [getAvailableLanguages]
  );
  const getAvailableInterfaceLanguages = useCallback(
    () => getAvailableLanguages("interface"),
    [getAvailableLanguages]
  );

  return {
    ...data,
    fetchGameData,
    clearData,
    getAvailableRegions,
    getAvailableAudioLanguages,
    getAvailableSubtitleLanguages,
    getAvailableInterfaceLanguages,
  };
};
