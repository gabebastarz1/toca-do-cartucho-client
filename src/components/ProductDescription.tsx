import React from "react";
import { AdvertisementDTO } from "../api/types";

interface ProductDescriptionProps {
  advertisement?: AdvertisementDTO;
  data?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  advertisement,
  data = `Sem descrição.`,
}) => {
  // Usar descrição do advertisement se disponível
  const description = advertisement?.description || data;

  return (
    <div className="mx-0 p-4 px-[0px]">
      <div className="bg-white p-6 rounded-lg shadow-sm text-gray-700 leading-relaxed">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Descrição</h2>
        {description.split("\n").map((paragraph, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "mb-4"
                : index === description.split("\n").length - 1
                ? ""
                : "mb-4"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ProductDescription;
