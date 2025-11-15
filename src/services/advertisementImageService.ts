import { api } from './api';
import { AdvertisementImageDTO } from '../api/types';

class AdvertisementImageService {
  private baseUrl = '/api/advertisements';

  // Upload múltiplas imagens para um anúncio
  async uploadImages(advertisementId: number, images: File[]): Promise<AdvertisementImageDTO[]> {
    try {
      const formData = new FormData();
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await api.post(`${this.baseUrl}/${advertisementId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error);
      throw error;
    }
  }

  // Upload de uma única imagem
  async uploadImage(advertisementId: number, image: File): Promise<AdvertisementImageDTO> {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await api.post(`${this.baseUrl}/${advertisementId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  // Obter imagens de um anúncio
  async getImages(advertisementId: number): Promise<AdvertisementImageDTO[]> {
    try {
      const response = await api.get(`${this.baseUrl}/${advertisementId}/images`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter imagens:', error);
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

  // Validar arquivo de imagem
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de arquivo não suportado. Use JPG, PNG ou WEBP.'
      };
    }

    // Verificar tamanho (3MB máximo)
    const maxSize = 3 * 1024 * 1024; // 3MB em bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Arquivo muito grande. Tamanho máximo permitido: 3MB'
      };
    }

    return { isValid: true };
  }

  // Gerar URL de preview para arquivo local
  generatePreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  // Limpar URL de preview
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  // Verificar se URL de imagem expirou
  isImageUrlExpired(image: AdvertisementImageDTO): boolean {
    if (!image.urlExpiresIn) return false;
    
    try {
      // urlExpiresIn é um número que representa timestamp em milissegundos
      const expiresAt = image.urlExpiresIn;
      const now = new Date().getTime();
      return now >= expiresAt;
    } catch (error) {
      // Se houver erro ao verificar, assumir que não expirou
      console.warn('Erro ao verificar expiração da URL:', error);
      return false;
    }
  }

  // Obter URL válida para exibição
  getDisplayUrl(image: AdvertisementImageDTO): string {
    // Priorizar preSignedUrl se disponível e não expirado
    if (image.preSignedUrl) {
      // Se não tem urlExpiresIn ou não expirou, usar preSignedUrl
      if (!image.urlExpiresIn || !this.isImageUrlExpired(image)) {
        return image.preSignedUrl;
      }
    }
    
    // Fallback para URL normal (sempre disponível)
    return image.url || "";
  }
}

export const advertisementImageService = new AdvertisementImageService();
