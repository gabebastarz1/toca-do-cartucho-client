import { Card } from "@/components/ui/card";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import React from "react";
import Head from "../components/Head";
import BackButton from "../components/ui/BackButton";


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
      className="md:w-[238px] md:h-[185px] w-[172px] h-[120px] bg-white md:rounded-[20px] rounded-[10px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0"
      onClick={onClick}
    >
      <div className="flex flex-col items-center md:gap-6 gap-2">
        <div className="w-[70px] h-[45px] md:w-[92px] md:h-[59px] flex items-center justify-center">
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
    <>
      <Head title="Cadastrar anúncio" />

      <div className="min-h-screen w-full bg-[#211C49] md:bg-[#f4f3f5] flex flex-col">
        <div className="hidden md:block">
          <TopBar
            rightButtonText="Meus Anúncios"
            onRightButtonClick={() => navigate("/meus-anuncios")}
          />
        </div>
        <BackButton />
        {/* Main content area */}
        <div className="bg-[#2b2560] w-full py-12 px-4 items-center justify-center flex flex-col h-screen sm:h-auto ">
          <div className="max-w-lg mx-auto">
            {/* Main heading */}
              <h1 className="hidden md:block text-white text-2xl md:text-3xl font-light mb-10 mt-24 text-left">
                Olá, antes de prosseguirmos, <br />
                qual o seu tipo de anúncio?
              </h1>
              <h1 className="block md:hidden text-white text-2xl md:text-3xl font-light mb-10 text-center">
                Qual o seu tipo de anúncio?
              </h1>

           
            {/* Option cards */}
            <div className="hidden md:flex flex-cols-1 md:justify-center justify-center md:gap-8 gap-4 md:-mb-32">
              <OptionCard
                title="Venda"
                icon={
                  <img src="/venda.svg" alt="Venda" className="w-20 h-14" />
                }
                onClick={() => navigate("/criar-anuncio/apenas-venda")}
              />
              <OptionCard
                title="Venda ou Troca"
                icon={
                  <img
                    src="/vendaoutroca.svg"
                    alt="Venda"
                    className="md:w-20 md:h-14"
                  />
                }
                onClick={() => navigate("/criar-anuncio/venda-e-troca")}
              />
              <OptionCard
                title="Troca"
                icon={
                  <img src="/troca.svg" alt="Venda" className="w-20 h-14" />
                }
                onClick={() => navigate("/criar-anuncio/apenas-troca")}
              />
            </div>
            {/* Option cards Mobile */}
            <div className="block md:hidden space-y-4">
            <div className=" grid grid-cols-2 gap-4 justify-items-center sm:flex sm:flex-row sm:justify-center sm:gap-8">
              <OptionCard
                title="Venda"
                icon={
                  <img src="/venda.svg" alt="Venda" className="w-20 h-14" />
                }
                onClick={() => navigate("/criar-anuncio/apenas-venda")}
              />
              <OptionCard
                title="Venda ou Troca"
                icon={
                  <img
                    src="/vendaoutroca.svg"
                    alt="Venda ou Troca"
                    className="w-20 h-14"
                  />
                }
                onClick={() => navigate("/criar-anuncio/venda-e-troca")}
              />
            </div>
              <div className=" col-span-2 flex justify-start">
                <OptionCard
                  title="Troca"
                  icon={
                    <img src="/troca.svg" alt="Troca" className="w-20 h-14" />
                  }
                  onClick={() => navigate("/criar-anuncio/apenas-troca")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
