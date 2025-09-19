import React from "react";

interface SellerInfoProps {
  data?: {
    name: string;
    avatar: string;
    rating: number;
    memberSince: string;
  };
}

const SellerInfo: React.FC<SellerInfoProps> = ({
  data = {
    name: "GameCollectorBR",
    avatar: "👤",
    rating: 4.8,
    memberSince: "2023",
  },
}) => {
  return (
    <div className="p-4 mt-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Conheça o vendedor
      </h2>
      <div className="flex items-center bg-white p-4 rounded-lg">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
          <span className="text-gray-600 text-lg">{data.avatar}</span>
        </div>
        <div className="flex-1">
          <span className="text-gray-700 font-medium block">{data.name}</span>
          <span className="text-sm text-gray-500">
            ⭐ {data.rating}/5 • Membro desde {data.memberSince}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
