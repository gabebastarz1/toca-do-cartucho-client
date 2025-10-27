import React, { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
}

interface CustomMultiSelectProps {
  options: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Selecione...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const handleRemove = (optionValue: string) => {
    const newValue = value.filter((v) => v !== optionValue);
    onChange?.(newValue);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Botão principal */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-md bg-white py-2 px-3 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4f43ae] min-h-[42px]"
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 bg-[#4f43ae] text-white text-xs px-2 py-1 rounded"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(option.value);
                  }}
                  className="hover:bg-[#3d3487] rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg z-50 max-h-60 overflow-hidden">
          {/* Campo de busca */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f43ae]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Lista de opções */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                  className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                    value.includes(option.value) ? "bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => {}}
                    className="rounded border-gray-300 text-[#4f43ae] focus:ring-[#4f43ae]"
                  />
                  <span>{option.label}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                Nenhum resultado encontrado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;

