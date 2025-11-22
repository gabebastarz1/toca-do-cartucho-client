import React from "react";
import SignUpForm from "../components/SignUpFrom/SignUpForm";
import { useIsMobile } from "../hooks/useIsMobile";

const Register: React.FC = () => {
  const isMobile = useIsMobile();

  // Layout Mobile
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#ECF0F1] p-6 font-sans">
        <SignUpForm />
      </div>
    );
  }

  // Layout Desktop
  return (
    <div className="relative w-full min-h-screen bg-[#211c49] overflow-hidden flex items-center justify-center py-10">
      <div>
      <SignUpForm />

      
      </div>
    </div>
  );
};

export default Register;
