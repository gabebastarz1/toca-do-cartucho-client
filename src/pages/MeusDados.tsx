// src/pages/MeusDados.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, HelpCircle, Loader2 } from "lucide-react";

// Importe os componentes que você acabou de criar
import {
  FormField,
  SelectField,
  FormattedField,
} from "../components/FormFields";

import TopBar from "../components/TopBar";
import Head from "../components/Head";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import { useUserProfile } from "../hooks/useUserProfile";
import { api } from "../services/api";
import { authService } from "../services/authService"; // ✅ Importar o authService
import { UserForUpdateDTO } from "../api/types";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { CustomAlert } from "../components/ui/CustomAlert";
import useDebounce from "../hooks/useDebounce"; // ✅ Importar o hook

const MeusDados: React.FC = () => {
  const navigate = useNavigate();
  const { alertState, showSuccess, showError, hideAlert } = useCustomAlert();
  const {
    userProfile,
    isLoading: profileLoading,
    error: profileError,
    refetch,
  } = useUserProfile();

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    nomeUsuario: "",
    dataNascimento: "",
    genero: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    whatsapp: "",
    email: "",
    cpf: "",
    ocultarLocalizacao: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null); // ✅ Novo estado para erro de nickname

  // ✅ Debounce para o campo de nome de usuário
  const debouncedNickname = useDebounce(formData.nomeUsuario, 500);

  // Carregar dados do usuário quando o perfil for carregado
  useEffect(() => {
    if (userProfile) {
      console.log("📋 [MeusDados] Dados do usuário carregados:", userProfile);
      console.log(
        "🏠 [MeusDados] Endereços disponíveis:",
        userProfile.addresses
      );
      console.log("🆔 [MeusDados] CPF do usuário:", userProfile.cpf);
      console.log(
        "📞 [MeusDados] Telefone do usuário:",
        userProfile.phoneNumber
      );
      console.log(
        "🔍 [MeusDados] Campos disponíveis:",
        Object.keys(userProfile)
      );

      // Dados brutos do backend
      const rawCEP = userProfile.addresses?.[0]?.address?.zipCode || "";
      const rawCPF = userProfile.cpf || "";

      console.log("🔧 [MeusDados] Dados brutos do backend:");
      console.log("📮 [MeusDados] CEP bruto:", rawCEP);
      console.log("🆔 [MeusDados] CPF bruto:", rawCPF);

      // Aplicar formatação aos dados do backend
      const formattedCEP = formatCEP(rawCEP);
      const formattedCPF = formatCPF(rawCPF);

      console.log("🎨 [MeusDados] Formatação aplicada:");
      console.log("📮 [MeusDados] CEP formatado:", rawCEP, "→", formattedCEP);
      console.log("🆔 [MeusDados] CPF formatado:", rawCPF, "→", formattedCPF);

      const formDataToSet = {
        nomeCompleto: `${userProfile.firstName || ""} ${
          userProfile.lastName || ""
        }`.trim(),
        nomeUsuario: userProfile.nickName || "",
        dataNascimento: "", // Campo não disponível na API atual
        genero: "", // Campo não disponível na API atual
        cep: formattedCEP, // ✅ CEP formatado do backend
        rua: userProfile.addresses?.[0]?.address?.street || "",
        numero: userProfile.addresses?.[0]?.address?.number || "",
        bairro: userProfile.addresses?.[0]?.address?.neighborhood || "",
        cidade: userProfile.addresses?.[0]?.address?.city || "",
        estado: userProfile.addresses?.[0]?.address?.state || "",
        whatsapp: userProfile.phoneNumber || "",
        email: userProfile.email || "",
        cpf: formattedCPF, // ✅ CPF formatado do backend
        ocultarLocalizacao: false,
      };

      console.log("📝 [MeusDados] Formulário preenchido com:", formDataToSet);
      setFormData(formDataToSet);
    }
  }, [userProfile]);

  // ✅ useEffect para validação em tempo real do nome de usuário
  useEffect(() => {
    const checkNickname = async () => {
      // Só verifica se o campo não está vazio e se é diferente do original
      if (
        debouncedNickname &&
        userProfile &&
        debouncedNickname !== userProfile.nickName
      ) {
        const nicknameExists = await authService.checkNicknameExists(
          debouncedNickname
        );
        if (nicknameExists) {
          setNicknameError("Este nome de usuário já está em uso.");
        } else {
          setNicknameError(null); // Limpa o erro se o nome estiver disponível
        }
      } else {
        setNicknameError(null); // Limpa o erro se o campo estiver vazio ou igual ao original
      }
    };

    checkNickname();
  }, [debouncedNickname, userProfile]);

  // Funções de formatação melhoradas com limite de caracteres
  const formatCEP = (value: string) => {
    if (!value) return "";

    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");

    // Limita a 8 dígitos (CEP brasileiro)
    const limitedNumbers = numbers.slice(0, 8);

    // Log quando o limite é aplicado
    if (numbers.length > 8) {
      console.log(
        `📮 [formatCEP] Limite aplicado: ${numbers} → ${limitedNumbers} (máximo 8 dígitos)`
      );
    }

    // Se tem menos de 5 dígitos, retorna apenas os números
    if (limitedNumbers.length <= 5) {
      return limitedNumbers;
    }

    // Se tem mais de 5 dígitos, aplica a máscara 00000-000
    return limitedNumbers.replace(/(\d{5})(\d{0,3})/, "$1-$2");
  };

  // Função para validar CPF
  const isValidCPF = (cpf: string): boolean => {
    // Remove formatação
    const numbers = cpf.replace(/\D/g, "");

    // Verifica se tem 11 dígitos
    if (numbers.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(numbers[9]) !== firstDigit) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(numbers[10]) === secondDigit;
  };

  const formatCPF = (value: string) => {
    if (!value) return "";

    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");

    // Limita a 11 dígitos (CPF brasileiro)
    const limitedNumbers = numbers.slice(0, 11);

    // Log quando o limite é aplicado
    if (numbers.length > 11) {
      console.log(
        `🆔 [formatCPF] Limite aplicado: ${numbers} → ${limitedNumbers} (máximo 11 dígitos)`
      );
    }

    // Se tem menos de 4 dígitos, retorna apenas os números
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    }

    // Se tem entre 4-6 dígitos, aplica parcialmente a máscara
    if (limitedNumbers.length <= 6) {
      return limitedNumbers.replace(/(\d{3})(\d{0,3})/, "$1.$2");
    }

    // Se tem entre 7-9 dígitos, aplica parcialmente a máscara
    if (limitedNumbers.length <= 9) {
      return limitedNumbers.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
    }

    // Se tem 10+ dígitos, aplica a máscara completa 000.000.000-00
    return limitedNumbers.replace(
      /(\d{3})(\d{3})(\d{3})(\d{0,2})/,
      "$1.$2.$3-$4"
    );
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log(`🔧 [MeusDados] Campo: ${field}, Valor recebido:`, value);

    // Limpar erros quando o usuário começar a digitar novamente
    if (field === "cpf" && cpfError) {
      setCpfError(null);
    }
    if (field === "nomeUsuario" && nicknameError) {
      setNicknameError(null);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userProfile?.id) {
      console.log("❌ [MeusDados] Usuário não encontrado para salvar");
      showError("Usuário não encontrado");
      return;
    }

    // Impede o salvamento se houver um erro de nickname
    if (nicknameError) {
      showError("O nome de usuário já está em uso.");
      return;
    }

    // Validar CPF antes de salvar
    if (formData.cpf) {
      const cpfNumbers = formData.cpf.replace(/\D/g, "");
      if (cpfNumbers.length === 11 && !isValidCPF(formData.cpf)) {
        setCpfError("CPF inválido. Verifique os dígitos informados.");
        showError("CPF inválido. Corrija o CPF antes de salvar.");
        console.log(
          "❌ [MeusDados] Tentativa de salvar com CPF inválido:",
          formData.cpf
        );
        return;
      } else if (cpfNumbers.length > 0 && cpfNumbers.length < 11) {
        setCpfError("CPF deve ter 11 dígitos.");
        showError("CPF incompleto. Digite todos os 11 dígitos.");
        console.log(
          "❌ [MeusDados] Tentativa de salvar com CPF incompleto:",
          formData.cpf
        );
        return;
      }
    }

    console.log("💾 [MeusDados] Iniciando salvamento dos dados...");
    console.log("📊 [MeusDados] Dados do formulário:", formData);
    console.log("👤 [MeusDados] ID do usuário:", userProfile.id);

    setIsSaving(true);
    setCpfError(null);
    setNicknameError(null); // Limpar erro de nickname ao salvar

    try {
      // Preparar dados para atualização
      const [firstName, ...lastNameParts] = formData.nomeCompleto.split(" ");
      const lastName = lastNameParts.join(" ");

      // Remover formatação dos campos antes de enviar
      const cleanCPF = formData.cpf.replace(/\D/g, ""); // Remove pontos e hífens
      const cleanCEP = formData.cep.replace(/\D/g, ""); // Remove hífen

      // Preparar endereço para envio
      const addressData = {
        zipCode: cleanCEP,
        street: formData.rua,
        number: formData.numero,
        complement: "", // Campo não disponível no formulário atual
        neighborhood: formData.bairro,
        city: formData.cidade,
        state: formData.estado,
      };

      const userAddressData = {
        address: addressData,
        isPrimary: true, // Sempre marcado como endereço principal
      };

      const updateData: UserForUpdateDTO = {
        firstName: firstName || null,
        lastName: lastName || null,
        nickName: formData.nomeUsuario || null, // ✅ CAMPO ADICIONADO
        email: formData.email || null,
        cpf: cleanCPF || null, // Campo CPF limpo (pode ser enviado, mas não retornado)
        phoneNumber: formData.whatsapp || null, // ✅ Campo disponível na API
        addresses: [userAddressData], // ✅ Array de endereços
      };

      console.log("📤 [MeusDados] Dados para atualização:", updateData);
      console.log("🏠 [MeusDados] Dados do endereço:", addressData);
      console.log("🏠 [MeusDados] UserAddress completo:", userAddressData);
      console.log("🆔 [MeusDados] CPF formatado:", formData.cpf);
      console.log("🆔 [MeusDados] CPF limpo enviado:", cleanCPF);
      console.log("📮 [MeusDados] CEP formatado:", formData.cep);
      console.log("📮 [MeusDados] CEP limpo:", cleanCEP);
      console.log("👤 [MeusDados] Nome completo:", formData.nomeCompleto);
      console.log("👤 [MeusDados] Primeiro nome:", firstName);
      console.log("👤 [MeusDados] Último nome:", lastName);
      console.log("📧 [MeusDados] Email:", formData.email);
      console.log("📞 [MeusDados] WhatsApp:", formData.whatsapp);
      console.log(
        "🌐 [MeusDados] Fazendo PATCH para:",
        `/api/accounts/profile`
      );

      // Atualizar dados do usuário
      await api.patch(`/api/accounts/profile`, updateData);
      console.log("✅ [MeusDados] Dados atualizados com sucesso!");

      // Recarregar dados do perfil
      console.log("🔄 [MeusDados] Recarregando dados do perfil...");
      await refetch();
      console.log("✅ [MeusDados] Dados do perfil recarregados!");

      // Mostrar alert de sucesso
      showSuccess("Dados salvos com sucesso!");
    } catch (error) {
      console.error("❌ [MeusDados] Erro ao salvar dados:", error);

      // Log detalhado do erro para debug
      if (error.response) {
        console.error("📊 [MeusDados] Status:", error.response.status);
        console.error("📊 [MeusDados] Status Text:", error.response.statusText);
        console.error("📊 [MeusDados] Response Data:", error.response.data);
        console.error("📊 [MeusDados] Headers:", error.response.headers);
      } else if (error.request) {
        console.error("📊 [MeusDados] Request:", error.request);
      } else {
        console.error("📊 [MeusDados] Error Message:", error.message);
      }

      // Mostrar alert de erro
      showError("Erro ao salvar dados. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

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

  const generos = ["Masculino", "Feminino", "Outro", "Prefiro não informar"];

  // Mostrar loading enquanto carrega os dados
  if (profileLoading) {
    return (
      <>
        <Head title="Meus Dados" />
        <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
        <FilterTopBar />
        <main className="bg-[#f4f3f5] flex flex-col items-center justify-center py-12 px-4 font-lexend min-h-screen">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#483d9e]" />
            <span className="text-lg text-gray-700">
              Carregando seus dados...
            </span>
          </div>
        </main>
        <Footer />
        <BottomBar />
      </>
    );
  }

  // Mostrar erro se não conseguir carregar os dados
  if (profileError) {
    return (
      <>
        <Head title="Meus Dados" />
        <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
        <FilterTopBar />
        <main className="bg-[#f4f3f5] flex flex-col items-center justify-center py-12 px-4 font-lexend min-h-screen">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{profileError}</p>
            <button
              onClick={() => refetch()}
              className="bg-[#483d9e] text-white px-6 py-2 rounded-md hover:bg-[#3a2f7a] transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </main>
        <Footer />
        <BottomBar />
      </>
    );
  }

  return (
    <>
      <Head title="Meus Dados" />
      <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
      <FilterTopBar />

      {/* 1. CONTAINER PRINCIPAL: Usa flex para centralizar todo o conteúdo */}
      <main className="bg-[#f4f3f5] flex flex-col items-center py-12 px-4 font-lexend">
        <div className="w-full max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate("/perfil")}
              className="text-[#211a21] text-sm font-normal hover:text-[#483d9e] transition-colors"
            >
              Meu perfil
            </button>
            <ChevronRight className="w-4 h-4 text-[#211a21]" />
            <span className="text-gray-900 text-sm font-normal">
              Meus dados
            </span>
          </div>

          {/* 2. CARD DO FORMULÁRIO: Removido 'absolute', altura automática */}
          <div className="bg-white border border-[#a5a6cf] rounded-xl p-10 shadow-sm">
            <h1 className="text-2xl font-normal text-black mb-8">Meus Dados</h1>

            {/* Seções do Formulário */}
            <section className="space-y-6">
              <FormField
                label="Nome Completo"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleInputChange}
                required={true}
              />
              <FormField
                label="Nome de Usuário"
                name="nomeUsuario"
                value={formData.nomeUsuario}
                onChange={handleInputChange}
                required={true}
                error={nicknameError} // ✅ Exibir erro no campo
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Data de nascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  placeholder="DD/MM/AAAA"
                />
                <SelectField
                  label="Gênero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  options={generos}
                />
              </div>
            </section>

            <hr className="my-8 border-gray-200" />

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-normal text-black">Endereço</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleInputChange(
                        "ocultarLocalizacao",
                        !formData.ocultarLocalizacao
                      )
                    }
                    className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all ${
                      formData.ocultarLocalizacao
                        ? "bg-[#483d9e] border-[#483d9e]"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.ocultarLocalizacao && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <span className="text-sm font-normal text-black">
                    Ocultar minha localização
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <FormattedField
                  label="CEP"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  className="md:col-span-1"
                  placeholder="00000-000"
                  formatFunction={formatCEP}
                />
                <FormField
                  label="Rua"
                  name="rua"
                  value={formData.rua}
                  onChange={handleInputChange}
                  className="md:col-span-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Número"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <SelectField
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  options={estadosDoBrasil}
                />
              </div>
            </section>

            <hr className="my-8 border-gray-200" />

            <section>
              <h2 className="text-2xl font-normal text-black mb-6">Contato</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="WhatsApp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="(00) 0 0000-0000"
                />
                <FormField
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                />
              </div>
            </section>

            <hr className="my-8 border-gray-200" />

            <section>
              <h2 className="text-2xl font-normal text-black mb-6">
                Informações Adicionais
              </h2>
              <div className="w-full md:w-1/3">
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="cpf"
                    className="text-lg font-normal text-black"
                  >
                    CPF
                  </label>
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                </div>
                <FormattedField
                  label=""
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  formatFunction={formatCPF}
                  error={cpfError}
                />
              </div>
            </section>

            {/* Feedback de Sucesso/Erro removido - usando alerts */}

            {/* Botão Salvar */}
            <div className="flex justify-end mt-10">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-8 py-3 rounded-md text-base font-normal font-lexend transition-colors flex items-center gap-2 ${
                  isSaving
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#483d9e] border border-[#2b2560] text-white hover:bg-[#3a2f7a]"
                }`}
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Salvando..." : "Salvar Dados"}
              </button>
            </div>
          </div>
        </div>

        {/* Custom Alert */}
        <CustomAlert
          type={alertState.type}
          message={alertState.message}
          isVisible={alertState.isVisible}
          onClose={hideAlert}
          duration={5000}
        />
      </main>

      <Footer />
      <BottomBar />
    </>
  );
};

export default MeusDados;
