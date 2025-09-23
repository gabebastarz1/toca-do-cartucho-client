// components/FilterSidebar/FilterAccordion.tsx
import React, { useState, memo } from "react";
import { ChevronDown } from "lucide-react";

interface FilterAccordionProps {
  title: string;
  children: React.ReactNode;
  badgeCount?: number;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  title,
  children,
  badgeCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {badgeCount > 0 && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
              {badgeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="mt-4 pr-2 space-y-2">{children}</div>}
    </div>
  );
};

// React.memo impede a re-renderização se as props não mudarem.
export default memo(FilterAccordion);