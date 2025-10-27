import React, { useState } from "react";
import {
  FormField,
  FormattedField,
  SelectField,
} from "../components/FormFields";

interface Address {
  address?: {
    zipCode?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
}

interface UserProfile {
  addresses?: Address[];
}

interface EnderecoButtonProps {
  userProfile: UserProfile;
  onDeleteAddress: (index: number) => void;
}

const estadosDoBrasil = [
  "São Paulo",
  "Rio de Janeiro",
  "Minas Gerais",
  "Bahia",
  "Paraná",
  "Rio Grande do Sul",
  "Pernambuco",
  "Ceará",
  "Pará",
  "Santa Catarina",
  "Maranhão",
  "Goiás",
  "Amazonas",
  "Espírito Santo",
  "Paraíba",
  "Rio Grande do Norte",
  "Mato Grosso",
  "Alagoas",
  "Piauí",
  "Tocantins",
  "Mato Grosso do Sul",
  "Sergipe",
  "Rondônia",
  "Acre",
  "Amapá",
  "Roraima",
  "Distrito Federal",
];

const formatCEP = (value: string) => {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "");
  const limitedNumbers = numbers.slice(0, 8);
  if (limitedNumbers.length <= 5) return limitedNumbers;
  return limitedNumbers.replace(/(\d{5})(\d{0,3})/, "$1-$2");
};

const EnderecoButton: React.FC<EnderecoButtonProps> = ({
  userProfile,
  onDeleteAddress,
}) => {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [newAddress, setNewAddress] = useState({
    zipCode: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para lidar com mudança de campo do novo endereço
  const handleFieldChange = (field: string, value: string) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  // Função para salvar novo endereço
  const handleSaveNewAddress = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const api = await import("../services/api");
      const addresses = userProfile?.addresses
        ? [...userProfile.addresses]
        : [];
      addresses.push({
        address: {
          ...newAddress,
          zipCode: newAddress.zipCode.replace(/-/g, ""),
        },
      });
      await api.api.patch("/api/accounts/profile", { addresses });
      setShowNewAddressForm(false);
      setNewAddress({
        zipCode: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
      });
      window.location.reload(); // Ou chame um refetch se disponível via prop
    } catch (error) {
      console.error("Erro ao adicionar endereço:", error);
      setError("Erro ao adicionar endereço. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          className="px-6 py-2 rounded-md bg-[#483d9e] text-white font-lexend hover:bg-[#3a2f7a] transition-colors"
          onClick={() => setShowNewAddressForm((v) => !v)}
        >
          Adicionar novo endereço
        </button>
      </div>
      {showNewAddressForm && (
        <div className="mt-6 space-y-8">
          <div className="border rounded-lg p-6 ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <FormattedField
                label="CEP"
                name="cep_novo"
                value={newAddress.zipCode}
                onChange={(_, v) => handleFieldChange("zipCode", v)}
                className="md:col-span-1"
                placeholder="00000-000"
                formatFunction={formatCEP}
              />
              <FormField
                label="Rua"
                name="rua_novo"
                value={newAddress.street}
                onChange={(_, v) => handleFieldChange("street", v)}
                className="md:col-span-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="Número"
                name="numero_novo"
                value={newAddress.number}
                onChange={(_, v) => handleFieldChange("number", v)}
              />
              <FormField
                label="Bairro"
                name="bairro_novo"
                value={newAddress.neighborhood}
                onChange={(_, v) => handleFieldChange("neighborhood", v)}
              />
              <FormField
                label="Cidade"
                name="cidade_novo"
                value={newAddress.city}
                onChange={(_, v) => handleFieldChange("city", v)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <SelectField
                label="Estado"
                name="estado_novo"
                value={newAddress.state}
                onChange={(_, v) => handleFieldChange("state", v)}
                options={estadosDoBrasil}
              />
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="px-6 py-2 rounded-md bg-[#483d9e] text-white font-lexend hover:bg-[#3a2f7a] transition-colors"
                onClick={handleSaveNewAddress}
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar Endereço"}
              </button>
            </div>
          </div>
        </div>
      )}

      {userProfile?.addresses && userProfile.addresses.length > 1 && (
        <div className="flex justify-start mt-4">
          <button
            type="button"
            className="px-6 py-2 rounded-md bg-[#483d9e] text-white font-lexend hover:bg-[#3a2f7a] transition-colors"
            onClick={() => setShowAddresses((v) => !v)}
          >
            Ver meus endereços
          </button>
        </div>
      )}

      {showAddresses && (
        <div className="mt-6 space-y-8">
          {(userProfile?.addresses && userProfile.addresses.length > 1
            ? userProfile.addresses.slice(1)
            : []
          ).length > 0 ? (
            userProfile.addresses.slice(1).map((item: Address, idx: number) => (
              <div key={idx} className=" border rounded-lg p-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => onDeleteAddress(idx + 1)}
                  >
                    Excluir
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <FormattedField
                    label="CEP"
                    name={`cep_${idx + 1}`}
                    value={item.address?.zipCode || ""}
                    onChange={() => {}}
                    className="md:col-span-1"
                    placeholder="00000-000"
                    formatFunction={formatCEP}
                  />
                  <FormField
                    label="Rua"
                    name={`rua_${idx + 1}`}
                    value={item.address?.street || ""}
                    onChange={() => {}}
                    className="md:col-span-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Número"
                    name={`numero_${idx + 1}`}
                    value={item.address?.number || ""}
                    onChange={() => {}}
                  />
                  <FormField
                    label="Bairro"
                    name={`bairro_${idx + 1}`}
                    value={item.address?.neighborhood || ""}
                    onChange={() => {}}
                  />
                  <FormField
                    label="Cidade"
                    name={`cidade_${idx + 1}`}
                    value={item.address?.city || ""}
                    onChange={() => {}}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <SelectField
                    label="Estado"
                    name={`estado_${idx + 1}`}
                    value={item.address?.state || ""}
                    onChange={() => {}}
                    options={estadosDoBrasil}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              Nenhum endereço adicional cadastrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnderecoButton;
