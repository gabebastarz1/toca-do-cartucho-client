import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import BackButton from "./ui/BackButton";

const StepHeader = ({ title, subtitle, step, steps, onBack }) => {
  const isMobile = useIsMobile();
  const totalSteps = steps.length;
  const progress = (step / totalSteps) * 100;

  if (isMobile) {
    return (
      <div className="bg-[#2b2560] ">
        {/* Header Mobile */}
        <div className="flex items-center justify-between p-4 pt-14 pb-6 h-full">
          <BackButton onBack={onBack} />

          {/* Conteúdo central */}

          <div
            className={`flex-1 flex flex-row gap-5 ${
              step > steps.length ? "justify-center" : "items-center"
            }`}
          >
            {step > steps.length ? null : (
              <>
                {/* Círculo de progresso */}
                <div className="relative max-w-[100px] h-auto ml-2">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* círculo de fundo */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* progresso */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="white"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-300 ease-in-out"
                    />
                  </svg>

                  {/* Texto central */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      Step {step}/{totalSteps}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Título e descrição */}
            <div className="text-start">
              <h1 className="text-white text-[22px] font-semibold leading-[1.56] tracking-[-0.66px] mb-2">
                {title}
              </h1>
              <p className="text-white text-[16px] leading-[1.56] tracking-[-0.48px]">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout desktop
  return (
    <div className="bg-[#38307C] text-white p-4 rounded-t-sm text-center">
      <h2 className="text-lg">{title}</h2>
      <p className="text-sm">{subtitle}</p>

      <div className="flex items-center justify-center mt-3 w-full max-w-3xl mx-auto">
        {steps.map((i, idx) => (
          <React.Fragment key={i}>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold 
                ${
                  i <= step
                    ? "bg-[#211C49] text-white"
                    : "bg-[#DDDDF3] text-[#38307C]"
                }`}
            >
              {i <= step ? "✓" : i}
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 bg-[#DDDDF3] relative">
                <div
                  className="absolute top-0 left-0 h-full bg-[#211C49] transition-all duration-500 ease-in-out"
                  style={{
                    width: i < step + 1 ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepHeader;
