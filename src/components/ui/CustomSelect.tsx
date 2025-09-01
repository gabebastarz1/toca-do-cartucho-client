import { Listbox } from "@headlessui/react";
import { useState } from "react";

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
  placeholder = "Selecione...",
  className,
  required = false,
  showValidation = false,
}: CustomSelectProps) {
  const [selected, setSelected] = useState<Option | null>(value || null);
  const [query, setQuery] = useState("");

  const handleChange = (val: Option) => {
    setSelected(val);
    onChange?.(val);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`w-full ${className || ""}`}>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative w-full">
          <Listbox.Button
            className={`w-full opacity-70 border rounded-md bg-white py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 ${
              (required && showValidation && !value) ||
              className?.includes("border-red-500")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            {selected ? selected.label : placeholder}
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg overflow-hidden z-10 max-h-60 overflow-y-auto">
            <div className="p-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar..."
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Spacebar") {
                    e.stopPropagation(); // evita que o espaço feche o select
                  }
                }}
              />
            </div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <Listbox.Option
                  key={option.value}
                  value={option}
                  className={({ active }) =>
                    `cursor-pointer px-4 py-2 text-sm ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } ${active ? "bg-blue-100" : ""} hover:bg-blue-50`
                  }
                >
                  {option.label}
                </Listbox.Option>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                Nenhum resultado encontrado
              </div>
            )}
          </Listbox.Options>
        </div>
      </Listbox>

      {/* Mensagem de validação */}
      {required && showValidation && !value && (
        <p className="text-red-500 text-xs mt-1">*Campo obrigatório</p>
      )}
    </div>
  );
}
