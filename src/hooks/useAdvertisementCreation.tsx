import { useState, useCallback } from "react";
import { advertisementCreationService } from "../services/advertisementCreationService";
import {
  AdvertisementFormData,
  AdvertisementCreationResponse,
} from "../api/advertisementTypes";
import {
  FrontendFormData,
  FrontendVariationData,
} from "../utils/formDataConverter";

interface UseAdvertisementCreationOptions {
  onSuccess?: (advertisement: AdvertisementCreationResponse) => void;
  onError?: (error: Error) => void;
}

interface UseAdvertisementCreationReturn {
  createAdvertisement: (formData: AdvertisementFormData) => Promise<void>;
  createAdvertisementFromExistingForm: (
    formData: FrontendFormData,
    variations?: FrontendVariationData[],
    referenceData?: {
      preservationStates: Array<{ id: number; name: string }>;
      cartridgeTypes: Array<{ id: number; name: string }>;
      regions: Array<{ id: number; name?: string; identifier?: string }>;
      languages: Array<{ id: number; name: string }>;
    }
  ) => Promise<void>;
  uploadImages: (advertisementId: number, images: File[]) => Promise<void>;
  uploadImage: (advertisementId: number, image: File) => Promise<void>;
  deleteImage: (imageId: number) => Promise<void>;
  getImages: (advertisementId: number) => Promise<any[]>;
  loading: boolean;
  error: string | null;
  success: boolean;
  createdAdvertisement: AdvertisementCreationResponse | null;
  reset: () => void;
}

export const useAdvertisementCreation = (
  options: UseAdvertisementCreationOptions = {}
): UseAdvertisementCreationReturn => {
  const { onSuccess, onError } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdAdvertisement, setCreatedAdvertisement] =
    useState<AdvertisementCreationResponse | null>(null);

  const createAdvertisement = useCallback(
    async (formData: AdvertisementFormData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setCreatedAdvertisement(null);

      try {
        const advertisement =
          await advertisementCreationService.createAdvertisementWithForm(
            formData
          );

        setCreatedAdvertisement(advertisement);
        setSuccess(true);
        onSuccess?.(advertisement);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar anúncio";
        setError(errorMessage);

        // Se for erro de CPF, mostrar opção de ir para perfil
        if (errorMessage.includes("CPF")) {
          console.log("Erro de CPF detectado. Usuário precisa cadastrar CPF.");
          // Aqui você pode adicionar lógica para mostrar um modal ou redirecionar
        }

        onError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

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
      setSuccess(false);
      setCreatedAdvertisement(null);

      try {
        const advertisement =
          await advertisementCreationService.createAdvertisementFromExistingForm(
            formData,
            variations,
            referenceData
          );

        setCreatedAdvertisement(advertisement);
        setSuccess(true);
        onSuccess?.(advertisement);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar anúncio";
        setError(errorMessage);

        // Se for erro de CPF, mostrar opção de ir para perfil
        if (errorMessage.includes("CPF")) {
          console.log("Erro de CPF detectado. Usuário precisa cadastrar CPF.");
          // Aqui você pode adicionar lógica para mostrar um modal ou redirecionar
        }

        onError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  const uploadImages = useCallback(
    async (advertisementId: number, images: File[]) => {
      setLoading(true);
      setError(null);

      try {
        await advertisementCreationService.uploadImages(
          advertisementId,
          images
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao fazer upload das imagens";
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setLoading(false);
      }
    },
    [onError]
  );

  const uploadImage = useCallback(
    async (advertisementId: number, image: File) => {
      setLoading(true);
      setError(null);

      try {
        await advertisementCreationService.uploadImage(advertisementId, image);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao fazer upload da imagem";
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setLoading(false);
      }
    },
    [onError]
  );

  const deleteImage = useCallback(
    async (imageId: number) => {
      setLoading(true);
      setError(null);

      try {
        await advertisementCreationService.deleteImage(imageId);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao deletar imagem";
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setLoading(false);
      }
    },
    [onError]
  );

  const getImages = useCallback(
    async (advertisementId: number) => {
      setLoading(true);
      setError(null);

      try {
        const images = await advertisementCreationService.getImages(
          advertisementId
        );
        return images;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao obter imagens";
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
        return [];
      } finally {
        setLoading(false);
      }
    },
    [onError]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setCreatedAdvertisement(null);
  }, []);

  return {
    createAdvertisement,
    createAdvertisementFromExistingForm,
    uploadImages,
    uploadImage,
    deleteImage,
    getImages,
    loading,
    error,
    success,
    createdAdvertisement,
    reset,
  };
};
