import { api } from './api';
import {
  GameDTO,
  PreservationStateDTO,
  CartridgeTypeDTO,
  RegionDTO,
  LanguageDTO,
  LanguageSupportDTO,
  LanguageSupportTypeDTO,
  GameLocalizationDTO,
  GameForFilteringDTO,
  LanguageSupportForFilteringDTO,
  GameLocalizationForFilteringDTO,
  LanguageForFilteringDTO,
  FormReferenceData,
} from '../api/referenceDataTypes';

class ReferenceDataService {
  // Carregar todos os jogos
  async getGames(filter?: GameForFilteringDTO): Promise<GameDTO[]> {
    try {
      const params = new URLSearchParams();
      
      if (filter?.name) {
        params.append('name', filter.name);
      }
      if (filter?.genreIds) {
        filter.genreIds.forEach(id => params.append('genreIds', id.toString()));
      }
      if (filter?.themeIds) {
        filter.themeIds.forEach(id => params.append('themeIds', id.toString()));
      }
      if (filter?.gameModeIds) {
        filter.gameModeIds.forEach(id => params.append('gameModeIds', id.toString()));
      }
      if (filter?.franchiseIds) {
        filter.franchiseIds.forEach(id => params.append('franchiseIds', id.toString()));
      }

      const response = await api.get(`/api/games?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      throw error;
    }
  }

  // Carregar estados de conservação
  async getPreservationStates(): Promise<PreservationStateDTO[]> {
    try {
      const response = await api.get('/api/preservation-states');
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar estados de conservação:', error);
      throw error;
    }
  }

  // Carregar tipos de cartucho
  async getCartridgeTypes(): Promise<CartridgeTypeDTO[]> {
    try {
      const response = await api.get('/api/cartridge-types');
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar tipos de cartucho:', error);
      throw error;
    }
  }

  // Carregar regiões através das localizações de jogos
  async getRegions(): Promise<RegionDTO[]> {
    try {
      const gameLocalizations = await this.getGameLocalizations();
      // Extrair regiões únicas das localizações
      const regionsMap = new Map<number, RegionDTO>();
      gameLocalizations.forEach(localization => {
        if (localization.region && !regionsMap.has(localization.region.id)) {
          regionsMap.set(localization.region.id, localization.region);
        }
      });
      return Array.from(regionsMap.values());
    } catch (error) {
      console.error('Erro ao carregar regiões:', error);
      throw error;
    }
  }

  // Carregar idiomas
  async getLanguages(filter?: LanguageForFilteringDTO): Promise<LanguageDTO[]> {
    try {
      const params = new URLSearchParams();
      
      if (filter?.name) {
        params.append('name', filter.name);
      }
      if (filter?.locale) {
        params.append('locale', filter.locale);
      }

      const response = await api.get(`/api/languages?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar idiomas:', error);
      throw error;
    }
  }

  // Carregar suportes de idioma
  async getLanguageSupports(filter?: LanguageSupportForFilteringDTO): Promise<LanguageSupportDTO[]> {
    try {
      const params = new URLSearchParams();
      
      if (filter?.gameId) {
        params.append('gameId', filter.gameId.toString());
      }
      if (filter?.languageId) {
        params.append('languageId', filter.languageId.toString());
      }
      if (filter?.languageSupportTypeId) {
        params.append('languageSupportTypeId', filter.languageSupportTypeId.toString());
      }

      const response = await api.get(`/api/language-supports?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar suportes de idioma:', error);
      throw error;
    }
  }

  // Carregar tipos de suporte de idioma
  async getLanguageSupportTypes(): Promise<LanguageSupportTypeDTO[]> {
    try {
      const response = await api.get('/api/language_support_types');
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar tipos de suporte de idioma:', error);
      throw error;
    }
  }

  // Carregar localizações de jogos
  async getGameLocalizations(filter?: GameLocalizationForFilteringDTO): Promise<GameLocalizationDTO[]> {
    try {
      const params = new URLSearchParams();
      
      if (filter?.gameId) {
        params.append('gameId', filter.gameId.toString());
      }
      if (filter?.regionId) {
        params.append('regionId', filter.regionId.toString());
      }

      const response = await api.get(`/api/game-localizations?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar localizações de jogos:', error);
      throw error;
    }
  }

  // Carregar todos os dados de referência necessários para os formulários
  async getAllReferenceData(): Promise<FormReferenceData> {
    try {
      const [
        games,
        preservationStates,
        cartridgeTypes,
        regions,
        languages,
        languageSupportTypes,
      ] = await Promise.all([
        this.getGames(),
        this.getPreservationStates(),
        this.getCartridgeTypes(),
        this.getRegions(),
        this.getLanguages(),
        this.getLanguageSupportTypes(),
      ]);

      return {
        games,
        preservationStates,
        cartridgeTypes,
        regions,
        languages,
        languageSupportTypes,
      };
    } catch (error) {
      console.error('Erro ao carregar dados de referência:', error);
      throw error;
    }
  }

  // Buscar jogos por nome (para autocomplete)
  async searchGames(query: string): Promise<GameDTO[]> {
    try {
      return await this.getGames({ name: query });
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      throw error;
    }
  }

  // Obter localizações de um jogo específico
  async getGameLocalizationsByGameId(gameId: number): Promise<GameLocalizationDTO[]> {
    try {
      return await this.getGameLocalizations({ gameId });
    } catch (error) {
      console.error('Erro ao carregar localizações do jogo:', error);
      throw error;
    }
  }

  // Obter suportes de idioma de um jogo específico
  async getLanguageSupportsByGameId(gameId: number): Promise<LanguageSupportDTO[]> {
    try {
      return await this.getLanguageSupports({ gameId });
    } catch (error) {
      console.error('Erro ao carregar suportes de idioma do jogo:', error);
      throw error;
    }
  }

  // Carregar modos de jogo
  async getGameModes(): Promise<any[]> {
    try {
      const response = await api.get('/api/gamemodes');
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar modos de jogo:', error);
      throw error;
    }
  }
}

export const referenceDataService = new ReferenceDataService();
