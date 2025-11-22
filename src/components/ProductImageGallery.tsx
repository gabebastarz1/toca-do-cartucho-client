// src/components/ProductImageGallery.tsx
import React, { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { AdvertisementImageDTO } from "../api/types";
import { advertisementImageService } from "../services/advertisementImageService";
import { useLocation, useNavigate } from "react-router-dom";

interface ProductImageGalleryProps {
  images?: AdvertisementImageDTO[];
  fallbackImage?: string;
}
const fallbackimage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <span className="text-gray-400 text-xs">Sem imagem</span>
    </div>
  );
};

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images = [],
  fallbackImage = fallbackimage,
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Converter imagens do anúncio para URLs de exibição
  const imageUrls = images.map((image) =>
    advertisementImageService.getDisplayUrl(image)
  );

  const allImages = imageUrls.length > 0 ? imageUrls : [fallbackImage];
  const selectedImage = allImages[currentIndex];

  const findVariationForImage = (imageIndex: number) => {
    if (!images || images.length === 0) return null;

    // Se a imagem está nas primeiras imagens do anúncio principal, retorna null
    const mainAdImages = images.filter(
      (img) =>
        !img.advertisementId ||
        img.advertisementId === images[0]?.advertisementId
    );
    if (imageIndex < mainAdImages.length) {
      return null; // É imagem do anúncio principal
    }

    // Encontrar a variação correspondente
    let currentImageCount = mainAdImages.length;
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (
        image.advertisementId &&
        image.advertisementId !== images[0]?.advertisementId
      ) {
        if (imageIndex < currentImageCount + 1) {
          return image.advertisementId.toString();
        }
        currentImageCount++;
      }
    }

    return null;
  };

  const handleImageClick = (imageIndex: number) => {
    setCurrentIndex(imageIndex);

    const variationId = findVariationForImage(imageIndex);
    const urlParams = new URLSearchParams(location.search);

    if (variationId) {
      // Se é imagem de uma variação, adicionar/atualizar parâmetro variation
      urlParams.set("variation", variationId);
    } else {
      // Se é imagem do anúncio principal, remover parâmetro variation
      urlParams.delete("variation");
    }

    const newUrl = `${location.pathname}${
      urlParams.toString() ? "?" + urlParams.toString() : ""
    }`;
    navigate(newUrl, { replace: true });
  };

  // ✅ NOVO: Sincronizar com mudanças na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const variationId = urlParams.get("variation");

    if (variationId) {
      // Encontrar a primeira imagem da variação especificada
      const variationImageIndex = images.findIndex(
        (img) =>
          img.advertisementId && img.advertisementId.toString() === variationId
      );

      if (variationImageIndex !== -1) {
        setCurrentIndex(variationImageIndex);
      }
    } else {
      // Se não há variation na URL, mostrar primeira imagem do anúncio principal
      setCurrentIndex(0);
    }
  }, [location.search, images]);

  // Funções para navegação no carrossel mobile
  const goToNext = () => {
    const isLastImage = currentIndex === allImages.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    handleImageClick(newIndex);
  };

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? allImages.length - 1 : currentIndex - 1;
    handleImageClick(newIndex);
  };

  // Renderiza o carrossel horizontal para mobile
  if (isMobile) {
    return (
      <div className="relative w-full aspect-square">
        {/* Botão Anterior */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Imagem Principal */}
        {typeof selectedImage === "string" ? (
          <img
            src={selectedImage}
            alt="Main Product"
            className="w-full h-full object-contain bg-white rounded-lg shadow-md"
          />
        ) : (
          typeof selectedImage === "function" && selectedImage()
        )}

        {/* Botão Próximo */}
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Indicadores (bolinhas) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {allImages.map((_, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${
                currentIndex === index ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Renderiza a galeria com thumbnails verticais para desktop
  return (
    <div className="flex flex-row gap-4 p-4 max-w-4xl mx-auto">
      {/* Coluna do Carrossel Vertical */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-2 max-h-[420px]">
        {allImages.map((image, index) =>
          typeof image === "string" ? (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`
                w-16 h-16
                object-contain
                bg-white
                rounded-md
                border-2
                cursor-pointer
                transition-colors
                hover:border-blue-400
                ${
                  currentIndex === index
                    ? "border-blue-500"
                    : "border-transparent"
                }
              `}
              onClick={() => handleImageClick(index)}
            />
          ) : (
            <div
              key={index}
              className={`
                w-16 h-16
                bg-white
                rounded-md
                border-2
                cursor-pointer
                transition-colors
                hover:border-blue-400
                ${
                  currentIndex === index
                    ? "border-blue-500"
                    : "border-transparent"
                }
              `}
              onClick={() => handleImageClick(index)}
            >
              {typeof image === "function" && image()}
            </div>
          )
        )}
      </div>

      {/* Container da Imagem Principal */}
      <div className="flex-1 flex items-center justify-center">
        {typeof selectedImage === "string" ? (
          <img
            src={selectedImage}
            alt="Main Product"
            className="w-full h-auto max-h-[420px] object-contain rounded-lg shadow-md"
          />
        ) : (
          typeof selectedImage === "function" && selectedImage()
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
