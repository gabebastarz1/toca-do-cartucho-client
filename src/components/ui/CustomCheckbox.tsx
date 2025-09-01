import React from "react";
import { Check } from "lucide-react";

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
  label?: string;
  labelClassName?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  checked,
  onChange,
  required = false,
  className = "",
  label,
  labelClassName = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          required={required}
        />
        <label
          htmlFor={id}
          className={`
            w-5 h-5 rounded-sm border-2 border-gray-300 cursor-pointer
            flex items-center justify-center transition-all duration-200
            ${
              checked
                ? "bg-[#8B5CF6] border-[#8B5CF6]"
                : "bg-white hover:border-[#8B5CF6] hover:bg-gray-50"
            }
          `}
        >
          {checked && (
            <Check size={14} className="text-white font-bold" strokeWidth={3} />
          )}
        </label>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm text-black cursor-pointer ${labelClassName}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default CustomCheckbox;
