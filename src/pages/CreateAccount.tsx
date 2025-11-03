import React, { useState } from "react";
import TopBar from "../components/TopBar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";


const CreateAccount: React.FC = () => {
  const [cpf, setCpf] = useState("");

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      const formattedCpf = value.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
      setCpf(formattedCpf);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para validar CPF e prosseguir
    console.log("CPF enviado:", cpf);
  };

  const handleVoltar = () => {
    // Lógica para voltar à página anterior
    window.history.back();
  };

  return (
    <div
      className="bg-[#f4f3f5] min-h-screen"
      data-name="cadastro para anunciar"
    >
      <TopBar 
        logoPosition="center" />

      {/* Container botão e card */}
      <div className="flex flex-col items-center mt-36 ">
        
      
        <div className="w-[459px] max-w-[90vw] self-start mb-2 ml-[calc(50%-229.5px)]"> {/* ml compensando centralização */}
          <button
            onClick={handleVoltar}
            className="text-[#0088ff] text-[18px] tracking-[-0.54px] leading-[1.56] font-normal hover:underline"
          >
            Voltar
          </button>
        </div>

        {/* Card principal */}
        <div className="w-[459px] max-w-[90vw]">
          <Card className="bg-white shadow-[0px_0px_3px_1px_#ced1d4] rounded-[5px] p-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-[22px] font-medium text-[#000] tracking-[-0.66px] leading-[35px]">
                Para anunciar na Toca do Cartucho, confirme o seu CPF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div>
                  <label
                    htmlFor="cpf"
                    className="block text-[18px] text-[#000] font-normal tracking-[-0.54px] mb-1"
                  >
                    CPF:
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    className="w-full h-[39px] px-3 text-[16px] text-[#928f91] font-normal tracking-[-0.48px] leading-[1.56] border border-[#4c4c60] rounded-[5px] focus:outline-none focus:border-[#483d9e] transition-colors duration-200"
                    maxLength={14}
                    required
                  />
                </div>
                <CardFooter className="p-0 pt-4">
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#483d9e] rounded-[5px] border border-[#2b2560] hover:bg-[#3a2f7d] transition-colors duration-200 flex items-center justify-center"
                  >
                    <span className="text-[#fff] text-[16px] tracking-[-0.48px] leading-[1.56]">
                      Começar a anunciar
                    </span>
                  </button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
