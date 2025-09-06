import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

interface BackButtonProps {
  onBack?: () => void;
}

export default function BackButton({ onBack }: BackButtonProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile && (
        <button
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              navigate(-1);
            }
          }}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      )}
    </>
  );
}
