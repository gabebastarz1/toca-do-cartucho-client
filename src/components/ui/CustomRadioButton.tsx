import React from "react";
import { Check } from "lucide-react";

interface CustomRadioButtonProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
  label?: string;
  labelClassName?: string;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  id,
  name,
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
          type="radio"
          id={id}
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          required={required}
        />
        <label
          htmlFor={id}
          className={`
            w-5 h-5 rounded-full border-2 border-gray-300 cursor-pointer
            flex items-center justify-center transition-all duration-200
            ${
              checked
                ? "bg-[#8B5CF6] border-[#8B5CF6]"
                : "bg-white hover:border-[#8B5CF6] hover:bg-gray-50"
            }
          `}
        >
          {checked && <div className="w-2 h-2 bg-white rounded-full"></div>}
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

export default CustomRadioButton;






