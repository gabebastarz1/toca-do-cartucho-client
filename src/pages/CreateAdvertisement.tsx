import { Card } from "@/components/ui/card";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import React from "react";



function OptionCard({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Card
      className="w-[238px] h-[185px] bg-white rounded-[20px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="w-[92px] h-[59px] flex items-center justify-center">
          {icon}
        </div>
        <div className="text-[22px] text-black text-center font-light tracking-[-0.66px] leading-[1.56]">
          {title}
        </div>
      </div>
    </Card>
  );
}

export default function CreateAdvertisementPp() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-[#f4f3f5] flex flex-col">
      <TopBar 
        rightButtonText="Meus Anúncios" 
        onRightButtonClick={() => navigate("/meus-anuncios")}
         />

      {/* Main content area */}
      <div className="bg-[#2b2560] w-full py-12 px-4 itens-center flex flex-col">
        <div className="max-w-5xl mx-auto">
          {/* Main heading */}
          <h1 className="text-white text-2xl md:text-3xl font-light mb-10 mt-24 text-left">
            Olá, antes de prosseguirmos, <br />
            qual o seu tipo de anúncio?
          </h1>

          {/* Option cards */}
          <div className="flex flex-col md:flex-row gap-8 -mb-32 ">
            <OptionCard
              title="Somente Venda"
              icon={<img src="/venda.svg" alt="Venda" className="w-20 h-14" />}
              onClick={() => navigate("/criar-anuncio/apenas-venda")}
            />
            <OptionCard
              title="Venda ou Troca"
              icon={<img src="/vendaoutroca.svg" alt="Venda" className="w-20 h-14" />}
              onClick={() => navigate("/criar-anuncio/venda-e-troca")}
            />
            <OptionCard
              title="Somente Troca"
              icon={<img src="/troca.svg" alt="Venda" className="w-20 h-14" />}
              onClick={() => navigate("/criar-anuncio/apenas-troca")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
