import { useState, useEffect, useCallback } from "react";
import { AdvertisementImageDTO } from "../api/types";
import { advertisementImageService } from "../services/advertisementImageService";

interface UseAdvertisementImagesProps {
  advertisementId?: number;
  autoLoad?: boolean;
}

interface UseAdvertisementImagesReturn {
  images: AdvertisementImageDTO[];
  loading: boolean;
  error: string | null;
  uploadImages: (files: File[]) => Promise<void>;
  deleteImage: (imageId: number) => Promise<void>;
  refreshImages: () => Promise<void>;
}

export const useAdvertisementImages = ({
  advertisementId,
  autoLoad = true,
}: UseAdvertisementImagesProps = {}): UseAdvertisementImagesReturn => {
  const [images, setImages] = useState<AdvertisementImageDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    if (!advertisementId) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedImages = await advertisementImageService.getImages(
        advertisementId
      );
      setImages(fetchedImages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar imagens";
      setError(errorMessage);
      console.error("Erro ao carregar imagens:", err);
    } finally {
      setLoading(false);
    }
  }, [advertisementId]);

  const uploadImages = useCallback(
    async (files: File[]) => {
      if (!advertisementId) {
        throw new Error("ID do anúncio é obrigatório para upload de imagens");
      }

      setLoading(true);
      setError(null);

      try {
        // Validar arquivos antes do upload
        const validationErrors: string[] = [];
        files.forEach((file, index) => {
          const validation = advertisementImageService.validateImageFile(file);
          if (!validation.isValid) {
            validationErrors.push(`Arquivo ${index + 1}: ${validation.error}`);
          }
        });

        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join("; "));
        }

        const uploadedImages = await advertisementImageService.uploadImages(
          advertisementId,
          files
        );
        setImages((prev) => [...prev, ...uploadedImages]);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao fazer upload das imagens";
        setError(errorMessage);
        console.error("Erro ao fazer upload das imagens:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [advertisementId]
  );

  const deleteImage = useCallback(async (imageId: number) => {
    setLoading(true);
    setError(null);

    try {
      await advertisementImageService.deleteImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar imagem";
      setError(errorMessage);
      console.error("Erro ao deletar imagem:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshImages = useCallback(async () => {
    await loadImages();
  }, [loadImages]);

  // Carregar imagens automaticamente quando advertisementId mudar
  useEffect(() => {
    if (autoLoad && advertisementId) {
      loadImages();
    }
  }, [advertisementId, autoLoad, loadImages]);

  return {
    images,
    loading,
    error,
    uploadImages,
    deleteImage,
    refreshImages,
  };
};
