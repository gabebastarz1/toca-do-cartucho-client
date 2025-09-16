import { api } from './api';
import { 
  AdvertisementForCreationDTO, 
  AdvertisementCreationResponse,
  AdvertisementFormData 
} from '../api/advertisementTypes';
import { FrontendFormData, FrontendVariationData, convertFormDataToBackend, extractValidImages } from '../utils/formDataConverter';

class AdvertisementCreationService {
  private baseUrl = '/api/advertisements';

  // Criar anúncio com dados JSON (sem imagens)
  async createAdvertisement(advertisement: AdvertisementForCreationDTO): Promise<AdvertisementCreationResponse> {
    try {
      console.log('=== DADOS ENVIADOS PARA O BACKEND ===');
      console.log('URL:', `${api.defaults.baseURL}${this.baseUrl}`);
      console.log('Dados completos:', JSON.stringify(advertisement, null, 2));
      console.log('=====================================');
      
      const response = await api.post(this.baseUrl, advertisement);
      return response.data;
    } catch (error: any) {
      console.error('=== ERRO AO CRIAR ANÚNCIO ===');
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Response Data:', error.response?.data);
      console.error('Request Data:', error.config?.data);
      console.error('==============================');
      
      // Tratar erros específicos do backend
      if (error.response?.data?.error) {
        const backendError = error.response.data.error;
        
        if (backendError.includes('CPF')) {
          throw new Error('Para vender produtos, você precisa cadastrar seu CPF no perfil. Acesse a página de perfil para completar seu cadastro.');
        }
        
        if (backendError.includes('authentication') || backendError.includes('unauthorized')) {
          throw new Error('Sua sessão expirou. Faça login novamente.');
        }
        
        // Usar a mensagem do backend se disponível
        throw new Error(backendError);
      }
      
      throw error;
    }
  }

  // Testar dados antes de criar anúncio
  async testAdvertisement(advertisement: AdvertisementForCreationDTO): Promise<any> {
    try {
      console.log('Testando dados do anúncio:', advertisement);
      const response = await api.post(`${this.baseUrl}/test`, advertisement);
      return response.data;
    } catch (error) {
      console.error('Erro ao testar anúncio:', error);
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
      console.log('=== CONVERTENDO DADOS DO FORMULÁRIO ===');
      console.log('FormData:', formData);
      console.log('Variations:', variations);
      console.log('ReferenceData:', referenceData);
      
      // Buscar gameLocalizationId correto
      const gameLocalizationId = await this.getGameLocalizationId(
        parseInt(formData.jogo), 
        formData.regiao, 
        referenceData
      );
      
      console.log('=== GAME LOCALIZATION ID ENCONTRADO ===');
      console.log('GameLocalizationId:', gameLocalizationId);
      
      // Buscar languageSupportsIds corretos
      const languageSupportsIds = await this.getLanguageSupportsIds(
        parseInt(formData.jogo),
        formData.idiomaAudio,
        formData.idiomaLegenda,
        formData.idiomaInterface
      );
      
      console.log('=== LANGUAGE SUPPORTS IDS ENCONTRADOS ===');
      console.log('LanguageSupportsIds:', languageSupportsIds);
      
      // Converter dados do formulário para formato do backend
      const backendData = convertFormDataToBackend(formData, variations, referenceData, gameLocalizationId, languageSupportsIds);
      
      console.log('=== DADOS CONVERTIDOS ===');
      console.log('Backend Data:', backendData);
      
      // Validar dados antes do envio
      const validationErrors = this.validateAdvertisementData(backendData);
      if (validationErrors.length > 0) {
        console.error('=== ERROS DE VALIDAÇÃO ===');
        validationErrors.forEach(error => console.error('-', error));
        throw new Error(`Dados inválidos: ${validationErrors.join(', ')}`);
      }
      
      // Criar anúncio sem imagens primeiro
      const advertisement = await this.createAdvertisement(backendData);

      // Se há imagens, fazer upload delas
      const mainImages = extractValidImages(formData.imagens);
      if (mainImages.length > 0) {
        await this.uploadImages(advertisement.id, mainImages);
      }

      // Upload de imagens das variações (se houver)
      for (let i = 0; i < variations.length; i++) {
        const variationImages = extractValidImages(variations[i].imagens);
        if (variationImages.length > 0) {
          // Note: O backend pode precisar de ajustes para suportar imagens por variação
          // Por enquanto, vamos fazer upload para o anúncio principal
          await this.uploadImages(advertisement.id, variationImages);
        }
      }

      return advertisement;
    } catch (error) {
      console.error('Erro ao criar anúncio a partir do formulário existente:', error);
      throw error;
    }
  }

  // Criar anúncio com formulário (com imagens)
  async createAdvertisementWithForm(formData: AdvertisementFormData): Promise<AdvertisementCreationResponse> {
    try {
      // Primeiro, criar o anúncio sem imagens
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
        acceptedTradePreservationStateIds: formData.acceptedTradePreservationStateIds,
        acceptedTradeLanguageSupportIds: formData.acceptedTradeLanguageSupportIds,
        acceptedTradeRegionIds: formData.acceptedTradeRegionIds,
        variations: formData.variations.map(variation => ({
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
          acceptedTradeCartridgeTypeIds: variation.acceptedTradeCartridgeTypeIds,
          acceptedTradePreservationStateIds: variation.acceptedTradePreservationStateIds,
          acceptedTradeLanguageSupportIds: variation.acceptedTradeLanguageSupportIds,
          acceptedTradeRegionIds: variation.acceptedTradeRegionIds,
        }))
      };

      // Testar dados primeiro
      console.log('Testando dados antes de criar anúncio...');
      await this.testAdvertisement(advertisementData);
      console.log('Dados validados com sucesso!');

      const advertisement = await this.createAdvertisement(advertisementData);

      // Se há imagens, fazer upload delas
      if (formData.images && formData.images.length > 0) {
        await this.uploadImages(advertisement.id, formData.images);
      }

      return advertisement;
    } catch (error) {
      console.error('Erro ao criar anúncio com formulário:', error);
      throw error;
    }
  }

  // Upload de imagens para um anúncio
  async uploadImages(advertisementId: number, images: File[]): Promise<void> {
    try {
      const formData = new FormData();
      
      images.forEach((image, index) => {
        formData.append('images', image);
      });

      await api.post(`${this.baseUrl}/${advertisementId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error);
      throw error;
    }
  }

  // Upload de uma única imagem
  async uploadImage(advertisementId: number, image: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('image', image);

      await api.post(`${this.baseUrl}/${advertisementId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  // Deletar imagem
  async deleteImage(imageId: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/images/${imageId}`);
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw error;
    }
  }

  // Obter imagens de um anúncio
  async getImages(advertisementId: number): Promise<any[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${advertisementId}/images`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter imagens:', error);
      throw error;
    }
  }

  // Buscar languageSupportsIds baseado no gameId e tipos de idioma
  private async getLanguageSupportsIds(
    gameId: number,
    audioLanguage?: string,
    subtitleLanguage?: string,
    interfaceLanguage?: string
  ): Promise<number[]> {
    try {
      const languageSupportsIds: number[] = [];

      // Mapear tipos de suporte de idioma
      const languageSupportTypes = {
        audio: 1,      // Audio
        subtitles: 2,  // Subtitles  
        interface: 3   // Interface
      };

      // Buscar LanguageSupport para cada tipo de idioma selecionado
      if (audioLanguage) {
        const audioSupport = await this.findLanguageSupport(gameId, parseInt(audioLanguage), languageSupportTypes.audio);
        if (audioSupport) languageSupportsIds.push(audioSupport.id);
      }

      if (subtitleLanguage) {
        const subtitleSupport = await this.findLanguageSupport(gameId, parseInt(subtitleLanguage), languageSupportTypes.subtitles);
        if (subtitleSupport) languageSupportsIds.push(subtitleSupport.id);
      }

      if (interfaceLanguage) {
        const interfaceSupport = await this.findLanguageSupport(gameId, parseInt(interfaceLanguage), languageSupportTypes.interface);
        if (interfaceSupport) languageSupportsIds.push(interfaceSupport.id);
      }

      console.log('LanguageSupportsIds encontrados:', languageSupportsIds);
      return languageSupportsIds;
    } catch (error) {
      console.error('Erro ao buscar LanguageSupports:', error);
      return [];
    }
  }

  // Buscar um LanguageSupport específico
  private async findLanguageSupport(gameId: number, languageId: number, supportTypeId: number): Promise<any> {
    try {
      console.log(`Buscando LanguageSupport para GameId: ${gameId}, LanguageId: ${languageId}, SupportTypeId: ${supportTypeId}`);
      
      const response = await api.get('/api/language-supports', {
        params: {
          GameId: gameId,
          LanguageSupportTypeId: supportTypeId
        }
      });

      const languageSupports = response.data;
      console.log('LanguageSupports encontrados:', languageSupports);

      // Encontrar o LanguageSupport que corresponde ao idioma selecionado
      const languageSupport = languageSupports.find((ls: any) => ls.language.id === languageId);
      
      if (languageSupport) {
        console.log('LanguageSupport encontrado:', languageSupport);
        return languageSupport;
      }

      console.log('Nenhum LanguageSupport encontrado para o idioma selecionado');
      return null;
    } catch (error) {
      console.error('Erro ao buscar LanguageSupport específico:', error);
      return null;
    }
  }

  // Buscar gameLocalizationId baseado no gameId e regionId
  private async getGameLocalizationId(
    gameId: number, 
    regionValue: string, 
    referenceData?: { 
      regions: Array<{ id: number; name?: string; identifier?: string }>;
    }
  ): Promise<number | undefined> {
    try {
      // Se não temos dados de referência, retornar undefined
      if (!referenceData?.regions) {
        console.log('Sem dados de região disponíveis');
        return undefined;
      }

      // Encontrar o regionId baseado no valor da região
      const region = referenceData.regions.find(r => 
        r.id.toString() === regionValue || 
        r.name === regionValue || 
        r.identifier === regionValue
      );

      if (!region) {
        console.log('Região não encontrada:', regionValue);
        return undefined;
      }

      console.log('Buscando GameLocalization para GameId:', gameId, 'RegionId:', region.id);

      // Buscar game localizations para este jogo e região
      const response = await api.get('/api/game-localizations', {
        params: {
          GameId: gameId,
          Region: region.identifier || region.name || region.id.toString()
        }
      });

      const gameLocalizations = response.data;
      console.log('GameLocalizations encontrados:', gameLocalizations);

      if (gameLocalizations && gameLocalizations.length > 0) {
        const gameLocalization = gameLocalizations[0]; // Pegar o primeiro
        console.log('GameLocalization selecionado:', gameLocalization);
        return gameLocalization.id;
      }

      console.log('Nenhum GameLocalization encontrado');
      return undefined;
    } catch (error) {
      console.error('Erro ao buscar GameLocalization:', error);
      return undefined;
    }
  }

  // Validar dados do anúncio antes do envio
  private validateAdvertisementData(data: AdvertisementForCreationDTO): string[] {
    const errors: string[] = [];

    // Validar campos obrigatórios
    if (!data.title || data.title.trim() === '') {
      errors.push('Título é obrigatório');
    }

    if (!data.gameId || data.gameId <= 0) {
      errors.push('GameId deve ser maior que 0');
    }

    if (!data.preservationStateId || data.preservationStateId <= 0) {
      errors.push('PreservationStateId deve ser maior que 0');
    }

    if (!data.cartridgeTypeId || data.cartridgeTypeId <= 0) {
      errors.push('CartridgeTypeId deve ser maior que 0');
    }

    if (data.availableStock < 1) {
      errors.push('Estoque deve ser pelo menos 1');
    }

    // Validar regra de negócio: deve ter preço OU ser troca
    if ((!data.price || data.price <= 0) && !data.isTrade) {
      errors.push('Anúncio deve ter preço OU permitir troca');
    }

    // Validar variações
    if (data.variations && data.variations.length > 0) {
      data.variations.forEach((variation, index) => {
        if (!variation.title || variation.title.trim() === '') {
          errors.push(`Variação ${index + 1}: Título é obrigatório`);
        }
        if (!variation.preservationStateId || variation.preservationStateId <= 0) {
          errors.push(`Variação ${index + 1}: PreservationStateId deve ser maior que 0`);
        }
        if (!variation.cartridgeTypeId || variation.cartridgeTypeId <= 0) {
          errors.push(`Variação ${index + 1}: CartridgeTypeId deve ser maior que 0`);
        }
        if (variation.availableStock < 1) {
          errors.push(`Variação ${index + 1}: Estoque deve ser pelo menos 1`);
        }
        if ((!variation.price || variation.price <= 0) && !variation.isTrade) {
          errors.push(`Variação ${index + 1}: Deve ter preço OU permitir troca`);
        }
      });
    }

    return errors;
  }
}

export const advertisementCreationService = new AdvertisementCreationService();
