import React from "react";

interface FormattedFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (field: string, value: string | boolean) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  formatFunction?: (value: string) => string;
  error?: string | null;
}

export const FormattedField: React.FC<FormattedFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  className = "",
  placeholder,
  required = false,
  formatFunction,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    

    if (formatFunction) {
      const formattedValue = formatFunction(inputValue);
    
      onChange(name, formattedValue);
    } else {
      onChange(name, inputValue);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-lg font-normal text-black font-lexend">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full opacity-70 border rounded-md bg-white py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 font-lexend ${
          error || (required && !value) ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
    </div>
  );
};
