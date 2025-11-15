import { useState, useCallback } from "react";
import { api } from "../services/api";
import { RegionDTO } from "../api/types";
import { LanguageSupportDTO } from "../api/referenceDataTypes";

interface GameLocalizationDTO {
  id: number;
  gameId: number;
  region:
    | RegionDTO
    | {
        id: number;
        name: string;
        identifier?: string;
        region?: RegionDTO;
      };
}

// Tipo auxiliar para lidar com diferentes estruturas de region
type RegionLike =
  | RegionDTO
  | {
      id: number;
      name?: string;
      identifier?: string;
      region?: RegionDTO;
    };

// Tipo auxiliar para lidar com diferentes estruturas de languageSupport
type LanguageSupportLike =
  | LanguageSupportDTO
  | {
      id: number;
      languageSupport?: {
        id: number;
        languageSupportType?:
          | {
              id: number;
              name?: string;
            }
          | number;
        language?:
          | {
              id: number;
              name: string;
            }
          | string;
      };
      language?: {
        id: number;
        name: string;
      };
      languageSupportType?:
        | {
            id: number;
            name?: string;
          }
        | number;
    };

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
          const region = (gl.region || gl) as RegionLike;

          // Extrair nome de forma segura
          const getName = (r: RegionLike): string => {
            if (
              "region" in r &&
              r.region &&
              typeof r.region === "object" &&
              "name" in r.region
            ) {
              return r.region.name;
            }
            if ("name" in r && typeof r.name === "string") {
              return r.name;
            }
            return "";
          };

          return {
            id: region.id,
            name: getName(region),
            identifier: getName(region),
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      })
      .filter(Boolean) as Array<{
      id: number;
      name: string;
      identifier: string;
    }>; // Remove valores null/undefined
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
            const languageSupport = (
              "languageSupport" in ls && ls.languageSupport
                ? ls.languageSupport
                : ls
            ) as LanguageSupportLike;

            // Extrair languageSupportType de forma segura
            const getLanguageSupportType = (
              lsItem: LanguageSupportLike
            ): number | null => {
              // Verificar se é LanguageSupportDTO (tem languageSupportType diretamente)
              if (
                "languageSupportType" in lsItem &&
                lsItem.languageSupportType
              ) {
                if (
                  typeof lsItem.languageSupportType === "object" &&
                  "id" in lsItem.languageSupportType
                ) {
                  return lsItem.languageSupportType.id;
                }
                if (typeof lsItem.languageSupportType === "number") {
                  return lsItem.languageSupportType;
                }
              }
              // Verificar estrutura aninhada (languageSupport.languageSupportType)
              if ("languageSupport" in lsItem && lsItem.languageSupport) {
                const ls = lsItem.languageSupport;
                if ("languageSupportType" in ls && ls.languageSupportType) {
                  if (
                    typeof ls.languageSupportType === "object" &&
                    "id" in ls.languageSupportType
                  ) {
                    return ls.languageSupportType.id;
                  }
                  if (typeof ls.languageSupportType === "number") {
                    return ls.languageSupportType;
                  }
                }
              }
              return null;
            };

            const typeId = getLanguageSupportType(languageSupport);
            return typeId === typeMap[supportType];
          } catch (error) {
            console.error(error, ls);
            return false;
          }
        })
        .map((ls) => {
          try {
            // Verificar diferentes estruturas possíveis
            const languageSupport = (
              "languageSupport" in ls && ls.languageSupport
                ? ls.languageSupport
                : ls
            ) as LanguageSupportLike;

            // Extrair language de forma segura
            const getLanguageName = (lsItem: LanguageSupportLike): string => {
              // Verificar se é LanguageSupportDTO (tem language diretamente)
              if ("language" in lsItem && lsItem.language) {
                if (
                  typeof lsItem.language === "object" &&
                  "name" in lsItem.language
                ) {
                  return lsItem.language.name;
                }
                if (typeof lsItem.language === "string") {
                  return lsItem.language;
                }
              }
              // Verificar estrutura aninhada (languageSupport.language)
              if ("languageSupport" in lsItem && lsItem.languageSupport) {
                const ls = lsItem.languageSupport;
                if ("language" in ls && ls.language) {
                  if (
                    typeof ls.language === "object" &&
                    "name" in ls.language
                  ) {
                    return ls.language.name;
                  }
                  if (typeof ls.language === "string") {
                    return ls.language;
                  }
                }
              }
              return "";
            };

            return {
              id: languageSupport.id,
              name: getLanguageName(languageSupport),
            };
          } catch (error) {
            console.error(error, ls);
            return null;
          }
        })
        .filter(Boolean) as Array<{ id: number; name: string }>; // Remove valores null/undefined
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
