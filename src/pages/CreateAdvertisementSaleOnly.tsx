import MultiPartFormSaleOnly from "../components/MultiPartFormSaleOnly";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function CreateAdvertisementSaleOnly() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-[#211C49] flex flex-col">
      <TopBar
        rightButtonText="Meus Anúncios"
        onRightButtonClick={() => navigate("/meus-anuncios")}
      />

      {/* Main content area */}
      <div className="min-h-9/10 bg-[#f4f3f5] w-full py-12 px-4 itens-center flex flex-col">
        <MultiPartFormSaleOnly />
      </div>
    </div>
  );
}

