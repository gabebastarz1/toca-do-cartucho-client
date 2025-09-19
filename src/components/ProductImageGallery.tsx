// src/components/ProductImageGallery.tsx
import React, { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile"; // Importe o hook

interface ProductImageGalleryProps {
  data?: {
    main: string;
    thumbnails: string[];
  };
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  data = {
    main: "https://via.placeholder.com/400x400?text=Main+Image",
    thumbnails: [
      "https://via.placeholder.com/150x150?text=Thumb1",
      "https://via.placeholder.com/150x150?text=Thumb2",
      "https://via.placeholder.com/150x150?text=Thumb3",
      "https://via.placeholder.com/150x150?text=Thumb4",
      "https://via.placeholder.com/150x150?text=Thumb5",
      "https://via.placeholder.com/150x150?text=Thumb6",
    ],
  },
}) => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);

  const allImages = [data.main, ...data.thumbnails];
  const selectedImage = allImages[currentIndex];

  // Funções para navegação no carrossel mobile
  const goToNext = () => {
    const isLastImage = currentIndex === allImages.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? allImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
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
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Imagem Principal */}
        <img
          src={selectedImage}
          alt="Main Product"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
        
        {/* Botão Próximo */}
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Indicadores (bolinhas) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, index) => (
                <div
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
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
        {allImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={`
              w-16 h-16
              object-cover
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
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Container da Imagem Principal */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={selectedImage}
          alt="Main Product"
          className="w-full h-auto max-h-[420px] object-contain rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;