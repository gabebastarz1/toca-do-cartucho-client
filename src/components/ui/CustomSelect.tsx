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
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  className,
}: CustomSelectProps) {
  const [selected, setSelected] = useState<Option | null>(value || null);

  const handleChange = (val: Option) => {
    setSelected(val);
    onChange?.(val);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative w-full">
          <Listbox.Button className="w-full opacity-70 border border-gray-300 rounded-md bg-white py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400">
            {selected ? selected.label : placeholder}
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg overflow-hidden z-10">
            {options.map((option, idx) => (
              <Listbox.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  `cursor-pointer px-4 py-3 text-sm ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } ${active ? "bg-blue-100" : ""} hover:bg-blue-50`
                }
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
