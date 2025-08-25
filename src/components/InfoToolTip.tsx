import React from "react";

const InfoTooltip: React.FC<{ message: React.ReactNode }> = ({ message }) => {
  return (
    <div className="relative inline-block group">
      <span className="w-5 h-5 flex items-center justify-center text-black rounded-full border border-black cursor-pointer">
        ?
      </span>

      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:block z-[9999]">
        <div className="relative bg-white text-black text-sm rounded-lg shadow-xl p-3 w-80 whitespace-pre-line">
          {message}
          <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-white rotate-45 shadow-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default InfoTooltip;
