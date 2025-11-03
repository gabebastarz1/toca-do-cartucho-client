import { api } from './api';
import { AdvertisementDTO } from '../api/types';

// Tipos para filtros baseados no backend
export interface AdvertisementFilteringDTO {
  title?: string;
  description?: string;
  maxPrice?: number;
  minPrice?: number;
  status?: string;
  sellerStatus?: string;
  preservationStateIds?: number[];
  cartridgeTypeIds?: number[];
  sellerIds?: string[];
  gameIds?: number[];
  genreIds?: number[];
  themeIds?: number[];
  franchiseIds?: number[];
  gameModeIds?: number[];
  languageAudioIds?: number[];
  languageSubtitleIds?: number[];
  languageInterfaceIds?: number[];
  regionIds?: number[];
  isTrade?: boolean;
  isSale?: boolean;
}

export interface AdvertisementForPaginationDTO {
  page?: number;
  pageSize?: number;
}

export interface AdvertisementOrdering {
  ordering?: string;
}

export interface AdvertisementResponse {
  advertisements: AdvertisementDTO[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class AdvertisementService {
  private baseUrl = '/api/advertisements';

  async getAll(
    filter?: AdvertisementFilteringDTO,
    pagination?: AdvertisementForPaginationDTO,
    ordering?: AdvertisementOrdering
  ): Promise<AdvertisementResponse> {
    try {
      const params = new URLSearchParams();
      
      // Adicionar filtros
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(item => params.append(key, item.toString()));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      // Adicionar paginação
      if (pagination) {
        if (pagination.page !== undefined) {
          params.append('page', pagination.page.toString());
        }
        if (pagination.pageSize !== undefined) {
          params.append('pageSize', pagination.pageSize.toString());
        }
      }

      // Adicionar ordenação
      if (ordering && ordering.ordering) {
        params.append('ordering', ordering.ordering);
      }

      const response = await api.get(`${this.baseUrl}?${params.toString()}`);
      
      {/*console.log("=== RAW API RESPONSE ===");
      console.log("URL chamada:", `${this.baseUrl}?${params.toString()}`);
      console.log("Response status:", response.status);
      console.log("Response data completa:", response.data);
      console.log("=========================");*/}
      
      // A API retorna um objeto com advertisements, page, pageSize, totalNumberOfPages
      const data = response.data;
      
      // Se a resposta tem a estrutura esperada da API real
      if (data && data.advertisements && Array.isArray(data.advertisements)) {
        const currentPage = data.page || pagination?.page || 1;
        const currentPageSize = data.pageSize || pagination?.pageSize || 12;
        const totalPages = data.totalNumberOfPages || Math.ceil(data.advertisements.length / currentPageSize);
        
        // Usar o totalNumberOfAdvertisements retornado pela API diretamente
        const totalCount = data.totalNumberOfAdvertisements || 0;
        
        return {
          advertisements: data.advertisements,
          totalCount: totalCount,
          page: currentPage,
          pageSize: currentPageSize,
          totalPages: totalPages
        };
      }
      
      // Fallback: se a resposta é um array diretamente
      if (Array.isArray(data)) {
        return {
          advertisements: data,
          totalCount: data.length,
          page: pagination?.page || 1,
          pageSize: pagination?.pageSize || 12,
          totalPages: Math.ceil(data.length / (pagination?.pageSize || 12))
        };
      }
      
      // Se já tem a estrutura esperada, retornar como está
      return data;
    } catch (error) { 
      return error;
    }
  }

  async getById(id: number): Promise<AdvertisementDTO> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar anúncio ${id}:`, error);
      throw error;
    }
  }

  async create(advertisement: any): Promise<AdvertisementDTO> {
    try {
      const response = await api.post(this.baseUrl, advertisement);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      throw error;
    }
  }

  async update(id: number, advertisement: any): Promise<AdvertisementDTO> {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}`, advertisement);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar anúncio ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar anúncio ${id}:`, error);
      throw error;
    }
  }
}

export const advertisementService = new AdvertisementService();
