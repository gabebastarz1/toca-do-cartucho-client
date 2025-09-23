
import React, { useState, useRef } from "react";
import {
  useFloating,
  useHover,
  useInteractions,
  useRole,
  useDismiss,
  autoUpdate,
  offset,
  shift,
  arrow,
  FloatingArrow,
  Placement,
} from "@floating-ui/react";

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: Placement; // Ex: 'top', 'bottom', 'top-start'
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  // coordenadas (x, y) e as refs para conectar aos elementos.
  const { x, y, strategy, refs, context } = useFloating({
    placement: position,
    open: isOpen,
    onOpenChange: setIsOpen,
   
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
  
      

      shift({ padding: 8 }), 

      arrow({ element: arrowRef }),
    ],
  });

  // 3. Hooks para controlar a interatividade (hover, foco, etc.)
  const hover = useHover(context, { move: false, delay: { open: 300 } });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  // Junta todas as interações em props para os elementos
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    dismiss,
    role,
  ]);

  return (

    <div className={`inline-block ${className}`}>

      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>

      {/* O Tooltip flutuante */}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          className="z-[9999]"
          {...getFloatingProps()}
        >
          <div className=" ease-in-out duration-300 bg-gray-800 text-white text-xs rounded-md px-3 py-2 shadow-lg whitespace-normal max-w-xs text-center">
            {content}
            {/* A setinha, posicionada dinamicamente */}
            <FloatingArrow ref={arrowRef} context={context} fill="#2d3748" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;