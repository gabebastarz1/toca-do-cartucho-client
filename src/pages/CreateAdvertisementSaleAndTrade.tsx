import MultiPartFormSaleAndTrade from "../components/MultiPartFormSaleAndTrade";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import React from "react";
import AdvertisementCreationGuard from "../components/AdvertisementCreationGuard";

export default function CreateAdvertisementSaleAndTrade() {
  const navigate = useNavigate();
  return (
    <AdvertisementCreationGuard>
      <div className="min-h-screen w-full bg-[#211C49] flex flex-col">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <TopBar
          rightButtonText="Meus Anúncios"
          onRightButtonClick={() => navigate("/meus-anuncios")}
        />
        <div className="min-h-9/10 bg-[#f4f3f5] w-full py-12 px-4 itens-center flex flex-col">
          <MultiPartFormSaleAndTrade />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        <div className="flex-1 bg-[#f4f3f5] overflow-y-auto">
          <MultiPartFormSaleAndTrade />
        </div>
      </div>
      </div>
    </AdvertisementCreationGuard>
  );
}
