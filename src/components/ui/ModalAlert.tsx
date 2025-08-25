import React from "react";

interface ModalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const ModalAlert: React.FC<ModalAlertProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  buttonText = "OK",
  onButtonClick,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "bg-black bg-opacity-50" : "bg-black bg-opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white border border-[#5baf65] rounded-md p-6 mx-4 w-full max-w-4xl shadow-lg transform transition-all duration-300 ease-in-out ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-black mb-1">{title}</h3>
              <img
                src="../../public/checkcircle.svg"
                alt="Success"
                className="w-[18px] h-[18px]"
              />
            </div>
            <h2 className="text-base font-semibold text-black mb-2">
              {subtitle}
            </h2>
            <div className="flex justify-between ">
              <p className="text-xs text-black leading-relaxed">
                {description}
              </p>
              <button
                onClick={handleButtonClick}
                className="bg-[#47884f] text-white px-4 py-1 rounded text-sm font-semibold hover:bg-[#3d7544] transition-colors"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert;
