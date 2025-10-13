import React from "react";
import SignUpForm from "../components/SignUpFrom/SignUpForm";
import GameControllerImage from "../assets/controller.png";

const Register: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-[#211c49] overflow-hidden flex items-center justify-center py-10">
      <SignUpForm />

      <img
        src={GameControllerImage}
        alt="Controle"
        className="absolute bottom-16 left-[calc(53%-480px)] z-50 hidden w-80 transform md:block"
      />
     

      
    </div>
  );
};

export default Register;

