import React from "react";

interface TopBarProps {
  rightButtonText?: string;
  onRightButtonClick?: () => void;
  logoPosition?: "left" | "center" | "right";
}

const TopBar: React.FC<TopBarProps> = ({
  rightButtonText = "",
  onRightButtonClick,
  logoPosition = "left",
}) => {
  let justifyLogo: string;
  switch (logoPosition) {
    case "center":
      justifyLogo = "justify-center";
      break;
    case "right":
      justifyLogo = "justify-end";
      break;
    default:
      justifyLogo = "justify-start ml-10";
  }

  return (
    <div className="w-full bg-[#211C49] flex items-center px-8 py-3">
      <div className={`flex flex-1 items-center gap-2 ${justifyLogo}`}>
        {/* Logo */}
        <img src="../public/logo.svg" alt="Logo" className="h-8" />
        {/*<span className="text-white font-mono text-xs">
          TOCA DO
          <br />
          CARTUCHO
        </span>*/}
      </div>
      <div className="flex-none">
        <button
          type="button"
          onClick={onRightButtonClick}
          className=" text-white text-xs px-4 py-2 "
        >
          {rightButtonText}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
