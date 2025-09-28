// components/FilterSidebar/RadioFilterGroup.tsx
import React, { memo } from "react";
import CustomRadioButton from "../ui/CustomRadioButton";

interface Option {
  id: string;
  label: string;
}

interface RadioFilterGroupProps {
  options: Option[];
  selectedId: string | null;
  onRadioChange: (optionId: string) => void;
  sectionId: string;
}

const RadioFilterGroup: React.FC<RadioFilterGroupProps> = ({
  options,
  selectedId,
  onRadioChange,
  sectionId,
}) => {
  if (!options || options.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma opção disponível.</p>;
  }

  return (
    <>
      {options.map((option) => {
        // Criar ID único combinando sectionId + optionId
        const uniqueId = `${sectionId}_${option.id}`;

        return (
          <CustomRadioButton
            key={option.id}
            id={uniqueId}
            name={sectionId}
            label={option.label}
            checked={selectedId === option.id}
            onChange={() => onRadioChange(option.id)}
            labelClassName="text-sm text-gray-700"
          />
        );
      })}
    </>
  );
};

export default memo(RadioFilterGroup);


