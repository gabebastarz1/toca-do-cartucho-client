import { Listbox } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  value?: Option;
  onChange?: (value: Option) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  showValidation?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione um item...",
  className,
  required = false,
  showValidation = false,
}: CustomSelectProps) {
  // Garantir que options é um array válido
  const validOptions = Array.isArray(options)
    ? options.filter((opt) => {
        const isValid =
          opt &&
          typeof opt === "object" &&
          typeof opt.label === "string" &&
          typeof opt.value === "string";
        if (!isValid && opt) {
          console.error("Invalid option in CustomSelect:", opt);
        }
        return isValid;
      })
    : [];

  if (!Array.isArray(options)) {
    console.error(
      "CustomSelect: options must be an array, received:",
      typeof options
    );
  }

  const [selected, setSelected] = useState<Option | null>(value || null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Hook para detectar cliques fora do componente
  const selectRef = useOutsideClick<HTMLDivElement>(() => {
    setIsOpen(false);
    setQuery(""); // Limpa a pesquisa ao fechar
  });

  // Sincroniza o estado interno com o valor externo
  useEffect(() => {
    setSelected(value || null);
  }, [value]);

  const handleChange = (val: Option) => {
    setSelected(val);
    setQuery(""); // Limpa a pesquisa ao selecionar
    setIsOpen(false); // Fecha o dropdown
    onChange?.(val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true); // Abre o dropdown quando começa a pesquisar
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    } else if (e.key === "Enter" && filteredOptions.length === 1) {
      // Se há apenas uma opção filtrada, seleciona ela
      handleChange(filteredOptions[0]);
    }
  };

  const filteredOptions = validOptions.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={selectRef} className={`w-full ${className || ""}`}>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative w-full">
          <Listbox.Button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full opacity-70 border rounded-md bg-white py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 ${
              (required && showValidation && !value) ||
              className?.includes("border-red-500")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            {selected ? selected.label : placeholder}
          </Listbox.Button>

          {isOpen && (
            <div className="absolute mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg overflow-hidden z-10 max-h-44 overflow-y-auto">
              <div className="p-2">
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Pesquisar..."
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, idx) => (
                  <div
                    key={option.value}
                    onClick={() => handleChange(option)}
                    className={`cursor-pointer px-4 py-2 text-sm ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 ${
                      selected?.value === option.value ? "bg-blue-100" : ""
                    }`}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </Listbox>

      {/* Mensagem de validação */}
      {required && showValidation && !value && (
        <p className="text-red-500 text-xs mt-1">*Campo obrigatório</p>
      )}
    </div>
  );
}
