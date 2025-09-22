import { useState, useCallback } from "react";
import { api } from "../services/api";
import {
  AdvertisementForCreationDTO,
  AdvertisementCreationResponse,
  AdvertisementFormData,
} from "../api/advertisementTypes";
import {
  FrontendFormData,
  FrontendVariationData,
  convertFormDataToBackend,
  extractValidImages,
} from "../utils/formDataConverter";

class AdvertisementCreationService {
  private baseUrl = "/api/advertisements";

  // Criar anúncio com dados JSON (sem imagens)
  async createAdvertisement(
    advertisement: AdvertisementForCreationDTO
  ): Promise<AdvertisementCreationResponse> {
    try {
      console.log("=== DADOS ENVIADOS PARA O BACKEND ===");
      console.log("URL:", `${api.defaults.baseURL}${this.baseUrl}`);
      console.log("Dados completos:", JSON.stringify(advertisement, null, 2));
      console.log("=====================================");

      const response = await api.post(this.baseUrl, advertisement);
      return response.data;
    } catch (error: any) {
      console.error("=== ERRO AO CRIAR ANÚNCIO ===");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Response Data:", error.response?.data);
      console.error("Request Data:", error.config?.data);
      console.error("==============================");

      if (error.response?.data?.error) {
        const backendError = error.response.data.error;

        if (backendError.includes("CPF")) {
          throw new Error(
            "Para vender produtos, você precisa cadastrar seu CPF no perfil. Acesse a página de perfil para completar seu cadastro."
          );
        }

        if (
          backendError.includes("authentication") ||
          backendError.includes("unauthorized")
        ) {
          throw new Error("Sua sessão expirou. Faça login novamente.");
        }

        throw new Error(backendError);
      }

      throw error;
    }
  }

  // Testar dados antes de criar anúncio
  async testAdvertisement(
    advertisement: AdvertisementForCreationDTO
  ): Promise<any> {
    try {
      console.log("Testando dados do anúncio:", advertisement);
      const response = await api.post(`${this.baseUrl}/test`, advertisement);
      return response.data;
    } catch (error) {
      console.error("Erro ao testar anúncio:", error);
      throw error;
    }
  }

  // Criar anúncio com dados dos formulários existentes (MultiPartForm)
  async createAdvertisementFromExistingForm(
    formData: FrontendFormData,
    variations: FrontendVariationData[] = [],
    referenceData?: {
      preservationStates: Array<{ id: number; name: string }>;
      cartridgeTypes: Array<{ id: number; name: string }>;
      regions: Array<{ id: number; name?: string; identifier?: string }>;
      languages: Array<{ id: number; name: string }>;
    }
  ): Promise<AdvertisementCreationResponse> {
    try {
      // 1. Converter todos os dados do formulário para o formato que o backend espera
      const gameLocalizationId = await this.getGameLocalizationId(
        parseInt(formData.jogo),
        formData.regiao,
        referenceData
      );
      const languageSupportsIds = await this.getLanguageSupportsIds(
        parseInt(formData.jogo),
        formData.idiomaAudio,
        formData.idiomaLegenda,
        formData.idiomaInterface
      );

      const backendData = await convertFormDataToBackend(
        formData,
        variations,
        referenceData,
        gameLocalizationId,
        languageSupportsIds,
        this.getLanguageSupportsIds.bind(this)
      );

      const validationErrors = this.validateAdvertisementData(backendData);
      if (validationErrors.length > 0) {
        throw new Error(`Dados inválidos: ${validationErrors.join(", ")}`);
      }

      // 2. Criar o anúncio principal e suas variações de uma só vez.
      //    A resposta deve conter os IDs reais de tudo que foi criado.
      const advertisement = await this.createAdvertisement(backendData);

      // 3. Fazer upload das imagens do anúncio principal
      const mainImages = extractValidImages(formData.imagens);
      if (mainImages.length > 0) {
        await this.uploadImages(advertisement.id, mainImages);
      }

      // 4. Fazer upload das imagens de cada variação, usando os IDs reais retornados pelo backend
      if (
        advertisement.variations &&
        advertisement.variations.length === variations.length
      ) {
        for (let i = 0; i < variations.length; i++) {
          const frontendVariation = variations[i];
          const createdVariation = advertisement.variations[i]; // Variação com ID real do backend

          const variationImages = extractValidImages(frontendVariation.imagens);

          if (variationImages.length > 0) {
            console.log(
              `Fazendo upload de imagens para a variação ID: ${createdVariation.id}`
            );

            // SOLUÇÃO: Usar o ID da variação como advertisementId para vincular as imagens diretamente à variação
            // Como as variações são anúncios separados no backend, podemos usar o ID da variação como advertisementId
            await this.uploadImages(
              createdVariation.id, // Usar o ID da variação como advertisementId
              variationImages
              // Não precisamos mais do variationId pois estamos usando o ID da variação diretamente
            );
          }
        }
      } else {
        console.warn(
          "A resposta do backend não continha as variações criadas ou o número de variações não corresponde. O upload de imagens das variações foi ignorado."
        );
      }

      return advertisement;
    } catch (error) {
      console.error(
        "Erro ao criar anúncio a partir do formulário existente:",
        error
      );
      throw error;
    }
  }

  // Criar anúncio com formulário (com imagens)
  async createAdvertisementWithForm(
    formData: AdvertisementFormData
  ): Promise<AdvertisementCreationResponse> {
    try {
      const advertisementData: AdvertisementForCreationDTO = {
        title: formData.title,
        description: formData.description,
        availableStock: formData.availableStock,
        preservationStateId: formData.preservationStateId,
        cartridgeTypeId: formData.cartridgeTypeId,
        gameLocalizationId: formData.gameLocalizationId,
        languageSupportsIds: formData.languageSupportsIds,
        gameId: formData.gameId,
        price: formData.price,
        isTrade: formData.isTrade,
        acceptedTradeGameIds: formData.acceptedTradeGameIds,
        acceptedTradeCartridgeTypeIds: formData.acceptedTradeCartridgeTypeIds,
        acceptedTradePreservationStateIds:
          formData.acceptedTradePreservationStateIds,
        acceptedTradeLanguageSupportIds:
          formData.acceptedTradeLanguageSupportIds,
        acceptedTradeRegionIds: formData.acceptedTradeRegionIds,
        variations: formData.variations.map((variation) => ({
          title: variation.title,
          description: variation.description,
          availableStock: variation.availableStock,
          preservationStateId: variation.preservationStateId,
          cartridgeTypeId: variation.cartridgeTypeId,
          gameLocalizationId: variation.gameLocalizationId,
          languageSupportsIds: variation.languageSupportsIds,
          price: variation.price,
          isTrade: variation.isTrade,
          acceptedTradeGameIds: variation.acceptedTradeGameIds,
          acceptedTradeCartridgeTypeIds:
            variation.acceptedTradeCartridgeTypeIds,
          acceptedTradePreservationStateIds:
            variation.acceptedTradePreservationStateIds,
          acceptedTradeLanguageSupportIds:
            variation.acceptedTradeLanguageSupportIds,
          acceptedTradeRegionIds: variation.acceptedTradeRegionIds,
        })),
      };

      await this.testAdvertisement(advertisementData);
      const advertisement = await this.createAdvertisement(advertisementData);

      if (formData.images && formData.images.length > 0) {
        await this.uploadImages(advertisement.id, formData.images);
      }

      return advertisement;
    } catch (error) {
      console.error("Erro ao criar anúncio com formulário:", error);
      throw error;
    }
  }

  /**
   * Faz upload de imagens para um anúncio.
   * @param advertisementId - O ID do anúncio (pode ser anúncio principal ou variação).
   * @param images - Um array de arquivos de imagem.
   */
  async uploadImages(advertisementId: number, images: File[]): Promise<void> {
    try {
      const formData = new FormData();
      images.forEach((image) => formData.append("images", image));

      const url = `${this.baseUrl}/${advertisementId}/images`;
      console.log(`=== DEBUG: Enviando imagens para ${url} ===`);

      // Debug: Log do FormData
      console.log("=== DEBUG: Conteúdo do FormData ===");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      console.log("=================================");

      await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(`=== DEBUG: Upload concluído para ${url} ===`);
    } catch (error) {
      console.error(
        `Erro ao fazer upload de imagens para o anúncio ${advertisementId}:`,
        error
      );
      throw error;
    }
  }

  // Upload de uma única imagem
  async uploadImage(advertisementId: number, image: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("image", image);

      await api.post(`${this.baseUrl}/${advertisementId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    }
  }

  // Deletar imagem
  async deleteImage(imageId: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/images/${imageId}`);
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      throw error;
    }
  }

  // Obter imagens de um anúncio
  async getImages(advertisementId: number): Promise<any[]> {
    try {
      const response = await api.get(
        `${this.baseUrl}/${advertisementId}/images`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao obter imagens:", error);
      throw error;
    }
  }

  // Métodos privados para buscar IDs de referência
  private async getLanguageSupportsIds(
    gameId: number,
    audioLanguage?: string,
    subtitleLanguage?: string,
    interfaceLanguage?: string
  ): Promise<number[]> {
    try {
      console.log("=== DEBUG getLanguageSupportsIds ===");
      console.log("gameId:", gameId);
      console.log("audioLanguage:", audioLanguage);
      console.log("subtitleLanguage:", subtitleLanguage);
      console.log("interfaceLanguage:", interfaceLanguage);

      const languageSupportsIds: number[] = [];
      const languageSupportTypes = { audio: 1, subtitles: 2, interface: 3 };

      if (audioLanguage) {
        console.log(
          `Buscando suporte de áudio para gameId=${gameId}, languageId=${audioLanguage}`
        );
        const audioSupport = await this.findLanguageSupport(
          gameId,
          parseInt(audioLanguage),
          languageSupportTypes.audio
        );
        console.log("audioSupport encontrado:", audioSupport);
        if (audioSupport) languageSupportsIds.push(audioSupport.id);
      }
      if (subtitleLanguage) {
        console.log(
          `Buscando suporte de legenda para gameId=${gameId}, languageId=${subtitleLanguage}`
        );
        const subtitleSupport = await this.findLanguageSupport(
          gameId,
          parseInt(subtitleLanguage),
          languageSupportTypes.subtitles
        );
        console.log("subtitleSupport encontrado:", subtitleSupport);
        if (subtitleSupport) languageSupportsIds.push(subtitleSupport.id);
      }
      if (interfaceLanguage) {
        console.log(
          `Buscando suporte de interface para gameId=${gameId}, languageId=${interfaceLanguage}`
        );
        const interfaceSupport = await this.findLanguageSupport(
          gameId,
          parseInt(interfaceLanguage),
          languageSupportTypes.interface
        );
        console.log("interfaceSupport encontrado:", interfaceSupport);
        if (interfaceSupport) languageSupportsIds.push(interfaceSupport.id);
      }

      console.log("languageSupportsIds finais:", languageSupportsIds);
      console.log("=====================================");
      return languageSupportsIds;
    } catch (error) {
      console.error("Erro ao buscar LanguageSupports:", error);
      return [];
    }
  }

  private async findLanguageSupport(
    gameId: number,
    languageId: number,
    supportTypeId: number
  ): Promise<any> {
    try {
      console.log(`=== findLanguageSupport ===`);
      console.log(
        `gameId: ${gameId}, languageId: ${languageId}, supportTypeId: ${supportTypeId}`
      );

      const response = await api.get("/api/language-supports", {
        params: { GameId: gameId, LanguageSupportTypeId: supportTypeId },
      });

      console.log(`Resposta da API /api/language-supports:`, response.data);
      console.log(`Status da resposta:`, response.status);
      console.log(`Tipo de dados:`, typeof response.data);
      console.log(`É array?`, Array.isArray(response.data));
      console.log(`Length:`, response.data?.length);
      console.log(`Procurando por language.id === ${languageId}`);

      if (response.data && Array.isArray(response.data)) {
        console.log("Primeiro item da resposta:", response.data[0]);
        console.log("Estrutura do language:", response.data[0]?.language);
      }

      const result =
        response.data.find((ls: any) => ls.language.id === languageId) || null;
      console.log("Resultado encontrado:", result);
      console.log("===========================");

      return result;
    } catch (error) {
      console.error("Erro ao buscar LanguageSupport específico:", error);
      return null;
    }
  }

  private async getGameLocalizationId(
    gameId: number,
    regionValue: string,
    referenceData?: {
      regions: Array<{ id: number; name?: string; identifier?: string }>;
    }
  ): Promise<number | undefined> {
    try {
      console.log("=== DEBUG getGameLocalizationId ===");
      console.log("gameId:", gameId);
      console.log("regionValue:", regionValue);
      console.log("referenceData?.regions:", referenceData?.regions);

      // Se não há região selecionada (campo não visível), buscar sem filtro de região
      if (!regionValue || regionValue.trim() === "") {
        console.log(
          "Nenhuma região selecionada, buscando gameLocalization sem filtro de região"
        );

        const response = await api.get("/api/game-localizations", {
          params: {
            GameId: gameId,
          },
        });

        console.log(
          "Resposta da API /api/game-localizations (sem região):",
          response.data
        );
        const gameLocalizationId = response.data?.[0]?.id;
        console.log(
          "gameLocalizationId encontrado (sem região):",
          gameLocalizationId
        );
        console.log("====================================");

        return gameLocalizationId;
      }

      if (!referenceData?.regions) {
        console.log("Nenhum referenceData.regions fornecido");
        return undefined;
      }

      const region = referenceData.regions.find(
        (r) =>
          r.id.toString() === regionValue ||
          r.name === regionValue ||
          r.identifier === regionValue
      );

      console.log("Região encontrada:", region);
      if (!region) {
        console.log("Nenhuma região correspondente encontrada");
        return undefined;
      }

      const regionParam =
        region.identifier || region.name || region.id.toString();
      console.log(
        `Fazendo requisição para /api/game-localizations com GameId=${gameId}, Region=${regionParam}`
      );

      const response = await api.get("/api/game-localizations", {
        params: {
          GameId: gameId,
          Region: regionParam,
        },
      });

      console.log("Resposta da API /api/game-localizations:", response.data);
      console.log("Status da resposta:", response.status);
      console.log("Tipo de dados:", typeof response.data);
      console.log("É array?", Array.isArray(response.data));
      console.log("Length:", response.data?.length);

      const gameLocalizationId = response.data?.[0]?.id;
      console.log("gameLocalizationId encontrado:", gameLocalizationId);
      console.log("====================================");

      return gameLocalizationId;
    } catch (error) {
      console.error("Erro ao buscar GameLocalization:", error);
      return undefined;
    }
  }

  // Validador de dados
  private validateAdvertisementData(
    data: AdvertisementForCreationDTO
  ): string[] {
    const errors: string[] = [];
    if (!data.title?.trim()) errors.push("Título é obrigatório");
    if (!data.gameId || data.gameId <= 0)
      errors.push("GameId deve ser maior que 0");
    if (!data.preservationStateId || data.preservationStateId <= 0)
      errors.push("PreservationStateId deve ser maior que 0");
    if (!data.cartridgeTypeId || data.cartridgeTypeId <= 0)
      errors.push("CartridgeTypeId deve ser maior que 0");
    if (data.availableStock < 1) errors.push("Estoque deve ser pelo menos 1");
    if ((!data.price || data.price <= 0) && !data.isTrade)
      errors.push("Anúncio deve ter preço OU permitir troca");

    data.variations?.forEach((variation, index) => {
      if (!variation.title?.trim())
        errors.push(`Variação ${index + 1}: Título é obrigatório`);
      if (!variation.preservationStateId || variation.preservationStateId <= 0)
        errors.push(
          `Variação ${index + 1}: PreservationStateId deve ser maior que 0`
        );
      if (!variation.cartridgeTypeId || variation.cartridgeTypeId <= 0)
        errors.push(
          `Variação ${index + 1}: CartridgeTypeId deve ser maior que 0`
        );
      if (variation.availableStock < 1)
        errors.push(`Variação ${index + 1}: Estoque deve ser pelo menos 1`);
      if ((!variation.price || variation.price <= 0) && !variation.isTrade)
        errors.push(`Variação ${index + 1}: Deve ter preço OU permitir troca`);
    });

    return errors;
  }
}

export const advertisementCreationService = new AdvertisementCreationService();

// React Hook for advertisement creation

interface UseAdvertisementCreationOptions {
  onSuccess?: (advertisement: AdvertisementCreationResponse) => void;
  onError?: (error: Error) => void;
}

export const useAdvertisementCreation = (
  options?: UseAdvertisementCreationOptions
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAdvertisementFromExistingForm = useCallback(
    async (
      formData: FrontendFormData,
      variations: FrontendVariationData[] = [],
      referenceData?: {
        preservationStates: Array<{ id: number; name: string }>;
        cartridgeTypes: Array<{ id: number; name: string }>;
        regions: Array<{ id: number; name?: string; identifier?: string }>;
        languages: Array<{ id: number; name: string }>;
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const result =
          await advertisementCreationService.createAdvertisementFromExistingForm(
            formData,
            variations,
            referenceData
          );

        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar anúncio";
        setError(errorMessage);
        options?.onError?.(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return {
    createAdvertisementFromExistingForm,
    loading,
    error,
  };
};
