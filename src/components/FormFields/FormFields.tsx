import React from "react";
import CustomSelect from "../ui/CustomSelect";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (field: string, value: string | boolean) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  className = "",
  placeholder,
  required = false,
}) => {
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
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={`w-full opacity-70 border rounded-md bg-white py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 font-lexend ${
          required && !value ? "border-red-500" : "border-gray-300"
        }`}
      />
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (field: string, value: string | boolean) => void;
  options: string[];
  className?: string;
  placeholder?: string;
  required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  className = "",
  placeholder = "Selecione uma opção",
  required = false,
}) => {
  const selectOptions = options.map((option) => ({
    label: option,
    value: option,
  }));

  const selectedOption = selectOptions.find((option) => option.value === value);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-lg font-normal text-black font-lexend">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <CustomSelect
        options={selectOptions}
        value={selectedOption}
        onChange={(option) => onChange(name, option.value)}
        placeholder={placeholder}
        required={required}
        className="h-14"
      />
    </div>
  );
};
