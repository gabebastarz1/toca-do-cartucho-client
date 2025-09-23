// components/FilterSidebar/CheckboxFilterGroup.tsx
import React, { memo } from "react";
import CustomCheckbox from "../ui/CustomCheckbox"; // Seu componente de checkbox

interface Option {
  id: string;
  label: string;
}

interface CheckboxFilterGroupProps {
  options: Option[];
  selectedIds: Set<string>;
  onCheckboxChange: (optionId: string) => void;
  sectionId?: string; // Adicionar sectionId para criar IDs únicos
}

const CheckboxFilterGroup: React.FC<CheckboxFilterGroupProps> = ({
  options,
  selectedIds,
  onCheckboxChange,
  sectionId = "",
}) => {
  if (!options || options.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma opção disponível.</p>;
  }

  return (
    // Se a lista for muito grande, adicione uma altura máxima e overflow.
    // className="max-h-60 overflow-y-auto"
    <>
      {options.map((option) => {
        // Criar ID único combinando sectionId + optionId
        const uniqueId = sectionId ? `${sectionId}_${option.id}` : option.id;

        return (
          <CustomCheckbox
            key={option.id}
            id={uniqueId}
            label={option.label}
            checked={selectedIds.has(option.id)}
            onChange={() => onCheckboxChange(option.id)}
            labelClassName="text-sm text-gray-700"
          />
        );
      })}
    </>
  );
};

export default memo(CheckboxFilterGroup);
