import React, { useState } from "react";

// --- Componente de Botão de Opção Estilizado ---
interface OptionButtonProps {
  label: string;
  value: string;
  selectedValue: string;
  onClick: (value: string) => void;
  disabled?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  value,
  selectedValue,
  onClick,
  disabled = false,
}) => {
  const isSelected = selectedValue === value && !disabled;

  // Define as classes de estilo com base no estado do botão
  const baseClasses = "px-3 py-2 text-sm  border flex-grow flex items-center justify-center transition-colors duration-200";
  let stateClasses = "";

  if (disabled) {
    stateClasses = "border-dashed border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed";
  } else if (isSelected) {
    // Estilo para o botão selecionado
    stateClasses = "border-[#4f43ae] text-[#4f43ae] font-semibold bg-white";
  } else {
    // Estilo para o botão padrão (não selecionado)
    stateClasses = "border-gray-300 text-gray-800 bg-white hover:border-gray-500";
  }

  return (
    <button
      className={`${baseClasses} ${stateClasses}`}
      onClick={() => !disabled && onClick(value)}
      disabled={disabled}
    >
      {label}

    </button>
  );
};


// --- Componente Principal de Variações do Produto ---
const ProductVariations: React.FC = () => {
    // Dados de exemplo, incluindo opções desabilitadas para corresponder à imagem
    const data = {
        options: {
            preservation: ["Novo", "Seminovo", "Bom", "Normal", "Danificado"],
            cartridgeType: ["Retrô", "Repro"],
            region: ["Australia", "Brazil", "Europe", "North America", "Korea"],
            audioLanguages: ["Inglês", "Português BR", "Japonês"],
            legendLanguages: ["Inglês", "Português BR", "Japonês"],
            interfaceLanguages: ["Inglês", "Português BR", "Japonês"],
        },
        disabledOptions: {
            preservation: ["Novo", "Normal", "Danificado"],
            cartridgeType: ["Retrô"],
            region: ["Australia", "Brazil", "North America", "Korea"],
        },
        stock: 1, // Estoque conforme a imagem
    };

  // Estados iniciais para corresponder às seleções na imagem
  const [selectedPreservation, setSelectedPreservation] = useState<string>("Bom");
  const [selectedType, setSelectedType] = useState<string>("Repro");
  const [selectedRegion, setSelectedRegion] = useState<string>("Europe");
  const [selectedAudioLang, setSelectedAudioLang] = useState<string>("Português BR");
  const [selectedLegendLang, setSelectedLegendLang] = useState<string>("Português BR");
  const [selectedInterfaceLang, setSelectedInterfaceLang] = useState<string>("Português BR");
  const [quantity, setQuantity] = useState<number>(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(event.target.value));
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Cartuchos disponíveis:</h2>

      {/* Estado de Preservação */}
      <div className="mb-4">
        <p className="text-sm text-gray-800 mb-2">Estado de Preservação:</p>
        <div className="grid grid-cols-3 gap-2">
          {data.options.preservation.map((p) => (
            <OptionButton
              key={p} label={p} value={p}
              selectedValue={selectedPreservation}
              onClick={setSelectedPreservation}
              disabled={data.disabledOptions.preservation.includes(p)}
            />
          ))}
        </div>
      </div>

      {/* Tipo de Cartucho */}
      <div className="mb-4">
        <p className="text-sm text-gray-800 mb-2 flex items-center">
          Tipo de cartucho
           <span className="ml-1.5 text-gray-400 border border-gray-400 rounded-full w-4 h-4 flex items-center justify-center text-xs font-mono select-none">?</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {data.options.cartridgeType.map((type) => (
            <OptionButton
              key={type} label={type} value={type}
              selectedValue={selectedType}
              onClick={setSelectedType}
              disabled={data.disabledOptions.cartridgeType.includes(type)}
            />
          ))}
        </div>
      </div>

      {/* Região */}
      <div className="mb-4">
        <p className="text-sm text-gray-800 mb-2">Região:</p>
        <div className="grid grid-cols-3 gap-2">
          {data.options.region.map((region) => (
            <OptionButton
              key={region} label={region} value={region}
              selectedValue={selectedRegion}
              onClick={setSelectedRegion}
              disabled={data.disabledOptions.region.includes(region)}
            />
          ))}
        </div>
      </div>

      {/* Idiomas do Áudio */}
      <div className="mb-4">
        <p className="text-sm text-gray-800 mb-2">Idiomas do Áudio:</p>
        <div className="grid grid-cols-3 gap-2">
          {data.options.audioLanguages.map((lang) => (
            <OptionButton
              key={lang} label={lang} value={lang}
              selectedValue={selectedAudioLang}
              onClick={setSelectedAudioLang}
            />
          ))}
        </div>
      </div>

      {/* Idiomas da Legenda (Adicionado para corresponder à imagem) */}
      <div className="mb-4">
        <p className="text-sm text-gray-800 mb-2">Idiomas da Legenda:</p>
        <div className="grid grid-cols-3 gap-2">
          {data.options.legendLanguages.map((lang) => (
            <OptionButton
              key={lang} label={lang} value={lang}
              selectedValue={selectedLegendLang}
              onClick={setSelectedLegendLang}
            />
          ))}
        </div>
      </div>

      {/* Idiomas da Interface */}
      <div className="mb-5">
        <p className="text-sm text-gray-800 mb-2">Idiomas da Interface:</p>
        <div className="grid grid-cols-3 gap-2">
          {data.options.interfaceLanguages.map((lang) => (
            <OptionButton
              key={lang} label={lang} value={lang}
              selectedValue={selectedInterfaceLang}
              onClick={setSelectedInterfaceLang}
            />
          ))}
        </div>
      </div>

      {/* Estoque Disponível */}
      <div className="mb-5">
        <label htmlFor="quantity" className="text-sm text-gray-800 block mb-2">
          Estoque Disponível:
        </label>
        <div className="relative">
          <select
            id="quantity"
            className="block w-full px-3 py-2.5 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none"
            value={quantity}
            onChange={handleQuantityChange}
          >
            {Array.from({ length: data.stock }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Quantidade: {i + 1}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="space-y-2">
        <button className="w-full border border-[#2B2560] bg-[#483d9e] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#2B2560] transition duration-200">
          Comprar pelo Whatsapp
        </button>
        <button className="w-full bg-[#DDDDF3] text-black font-semibold py-3 px-4 rounded-lg hover:bg-indigo-200 transition duration-200">
          Ver no IGDB
        </button>
      </div>
    </div>
  );
};

export default ProductVariations;