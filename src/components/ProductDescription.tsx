import React from "react";

interface ProductDescriptionProps {
  data?: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  data = `Olá, fã do clássico Super Nintendo (SNES)!

Temos à disposição uma ampla variedade de cartuchos para Super Nintendo, todos com chips originais da Nintendo, conforme ilustrado nas fotos do anúncio. Os cartuchos foram reprogramados e contam com a função de salvamento de progresso funcionando perfeitamente.

Não perca a oportunidade de reviver momentos nostálgicos inesquecíveis! Estamos a disposição para esclarecer quaisquer dúvidas.

Boa compra!

Produto sem garantia.`,
}) => {
  return (
    <div className="mx-0 p-4 mt-6 px-[0px]">
      <div className="bg-white p-6 rounded-lg shadow-sm text-gray-700 leading-relaxed">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Descrição</h2>
        {data.split("\n").map((paragraph, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "mb-4"
                : index === data.split("\n").length - 1
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
