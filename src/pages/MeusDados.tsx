import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Check,
  HelpCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

import {
  FormField,
  SelectField,
  FormattedField,
} from "../components/FormFields";

import TopBar from "../components/TopBar";
import EnderecoButton from "../components/EnderecoButton";
import Head from "../components/Head";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";

import { useUserProfile } from "../hooks/useUserProfile";
import { api } from "../services/api";
import { authService } from "../services/authService";
import { UserForUpdateDTO } from "../api/types";
import { useCustomAlert } from "../hooks/useCustomAlert";
import { CustomAlert } from "../components/ui/CustomAlert";
import useDebounce from "../hooks/useDebounce";

const MeusDados: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { alertState, showSuccess, showError, hideAlert } = useCustomAlert();
  const {
    userProfile,
    isLoading: profileLoading,
    error: profileError,
    refetch,
  } = useUserProfile();

  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
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

  const [originalData, setOriginalData] = useState({
    nome: "",
    sobrenome: "",
    nomeCompleto: "",
    nomeUsuario: "",
    dataNascimento: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    whatsapp: "",
    email: "",
    cpf: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null); // ✅ Novo estado para erro de nickname
  const [birthdayError, setBirthdayError] = useState<string | null>(null); // ✅ Novo estado para erro de data de nascimento
  const [isLoadingCep, setIsLoadingCep] = useState(false); // ✅ Estado para indicar carregamento do CEP
  const [cepError, setCepError] = useState<string | null>(null); // ✅ Estado para erro de CEP

  const debouncedNickname = useDebounce(formData.nomeUsuario, 500);
  const debouncedCep = useDebounce(formData.cep, 500); // ✅ Debounce para CEP

  // detecta alterações nos campos
  const getChangedFields = () => {
    const changes: Partial<UserForUpdateDTO> & {
      birthdayDate?: string | null;
    } = {};
    let hasAddressChanges = false;
    const addressChanges: {
      zipCode: string;
      street: string;
      number: string;
      complement: string;
      neighborhood: string;
      city: string;
      state: string;
    } = {
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    };

    // Verificar mudanças em nome e sobrenome separadamente
    if (
      formData.nome !== originalData.nome ||
      formData.sobrenome !== originalData.sobrenome
    ) {
      changes.firstName = formData.nome || null;
      changes.lastName = formData.sobrenome || null;
    } else if (formData.nomeCompleto !== originalData.nomeCompleto) {
      // Fallback para nome completo se nome/sobrenome não estiverem disponíveis
      const [firstName, ...lastNameParts] = formData.nomeCompleto.split(" ");
      const lastName = lastNameParts.join(" ");
      changes.firstName = firstName || null;
      changes.lastName = lastName || null;
    }

    if (formData.nomeUsuario !== originalData.nomeUsuario) {
      changes.nickName = formData.nomeUsuario || null;
    }

    if (formData.email !== originalData.email) {
      changes.email = formData.email || null;
    }

    if (formData.whatsapp !== originalData.whatsapp) {
      // Remove a máscara do telefone antes de enviar
      changes.phoneNumber = formData.whatsapp
        ? formData.whatsapp.replace(/\D/g, "")
        : null;
    }

    if (formData.cpf !== originalData.cpf) {
      changes.cpf = formData.cpf.replace(/\D/g, "") || null;
    }

    if (formData.dataNascimento !== originalData.dataNascimento) {
      changes.birthdayDate = parseDate(formData.dataNascimento);
    }

    // Verificar mudanças no endereço
    if (
      formData.cep !== originalData.cep ||
      formData.rua !== originalData.rua ||
      formData.numero !== originalData.numero ||
      formData.bairro !== originalData.bairro ||
      formData.cidade !== originalData.cidade ||
      formData.estado !== originalData.estado
    ) {
      hasAddressChanges = true;
      addressChanges.zipCode = formData.cep.replace(/\D/g, "");
      addressChanges.street = formData.rua;
      addressChanges.number = formData.numero;
      addressChanges.complement = "";
      addressChanges.neighborhood = formData.bairro;
      addressChanges.city = formData.cidade;
      addressChanges.state = formData.estado;
    }

    // Se houve mudanças no endereço, incluir no objeto de mudanças
    if (hasAddressChanges) {
      changes.addresses = [
        {
          address: addressChanges,
          isPrimary: true,
        },
      ];
    }

    return changes;
  };

  // Carregar dados do usuário quando o perfil for carregado
  useEffect(() => {
    if (userProfile) {
      // Dados brutos do backend
      const rawCEP = userProfile.addresses?.[0]?.address?.zipCode || "";
      const rawCPF = userProfile.cpf || "";

      // Aplicar formatação aos dados do backend
      const formattedCEP = formatCEP(rawCEP);
      const formattedCPF = formatCPF(rawCPF);

      // Formatar telefone do backend
      const formattedPhone = formatPhone(userProfile.phoneNumber || "");

      const formDataToSet = {
        nome: userProfile.firstName || "",
        sobrenome: userProfile.lastName || "",
        nomeCompleto: `${userProfile.firstName || ""} ${
          userProfile.lastName || ""
        }`.trim(),
        nomeUsuario: userProfile.nickName || "",
        dataNascimento: userProfile.birthdayDate
          ? formatDate(userProfile.birthdayDate)
          : "",
        genero: "", // Campo não disponível na API atual
        cep: formattedCEP, // ✅ CEP formatado do backend
        rua: userProfile.addresses?.[0]?.address?.street || "",
        numero: userProfile.addresses?.[0]?.address?.number || "",
        bairro: userProfile.addresses?.[0]?.address?.neighborhood || "",
        cidade: userProfile.addresses?.[0]?.address?.city || "",
        estado: userProfile.addresses?.[0]?.address?.state || "",
        whatsapp: formattedPhone, // ✅ Telefone formatado do backend
        email: userProfile.email || "",
        cpf: formattedCPF, // ✅ CPF formatado do backend
        ocultarLocalizacao: false,
      };

      // ✅ Armazenar dados originais para comparação posterior
      const originalDataToSet = {
        nome: userProfile.firstName || "",
        sobrenome: userProfile.lastName || "",
        nomeCompleto: `${userProfile.firstName || ""} ${
          userProfile.lastName || ""
        }`.trim(),
        nomeUsuario: userProfile.nickName || "",
        dataNascimento: userProfile.birthdayDate
          ? formatDate(userProfile.birthdayDate)
          : "",
        cep: formattedCEP,
        rua: userProfile.addresses?.[0]?.address?.street || "",
        numero: userProfile.addresses?.[0]?.address?.number || "",
        bairro: userProfile.addresses?.[0]?.address?.neighborhood || "",
        cidade: userProfile.addresses?.[0]?.address?.city || "",
        estado: userProfile.addresses?.[0]?.address?.state || "",
        whatsapp: formattedPhone, // ✅ Telefone formatado do backend
        email: userProfile.email || "",
        cpf: formattedCPF,
      };

      setFormData(formDataToSet);
      setOriginalData(originalDataToSet);
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

  // ✅ Função para buscar CEP na API ViaCEP
  const fetchCepData = async (cep: string) => {
    // Remove formatação do CEP
    const cleanCep = cep.replace(/\D/g, "");

    // Verifica se tem 8 dígitos
    if (cleanCep.length !== 8) {
      setCepError(null);
      return;
    }

    setIsLoadingCep(true);
    setCepError(null);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado. Verifique o CEP informado.");
        setIsLoadingCep(false);
        return;
      }

      // Preencher campos automaticamente
      setFormData((prev) => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));

      setCepError(null);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setCepError("Erro ao buscar CEP. Tente novamente.");
    } finally {
      setIsLoadingCep(false);
    }
  };

  // ✅ useEffect para buscar CEP automaticamente quando digitado completamente
  useEffect(() => {
    if (!debouncedCep) return;

    const cleanCep = debouncedCep.replace(/\D/g, "");
    const originalCepClean = originalData.cep.replace(/\D/g, "");

    // Só busca se tiver 8 dígitos e for diferente do CEP original
    if (cleanCep.length === 8 && cleanCep !== originalCepClean) {
      fetchCepData(debouncedCep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCep]);

  // Funções de formatação melhoradas com limite de caracteres
  const formatCEP = (value: string) => {
    if (!value) return "";

    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");

    // Limita a 8 dígitos (CEP brasileiro)
    const limitedNumbers = numbers.slice(0, 8);

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

  // ✅ Função para formatar data de nascimento (para exibição)
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      // Converter de YYYY-MM-DD para DD/MM/YYYY
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
      }
      // fallback para Date caso venha em outro formato
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "";
    }
  };

  // ✅ Função para formatar data de nascimento (para input com máscara)
  const formatDateInput = (value: string) => {
    if (!value) return "";

    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");

    // Limita a 8 dígitos (DDMMYYYY)
    const limitedNumbers = numbers.slice(0, 8);

    // Se tem menos de 3 dígitos, retorna apenas os números
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    }

    // Se tem entre 3-4 dígitos, aplica DD/MM
    if (limitedNumbers.length <= 4) {
      return limitedNumbers.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    }

    // Se tem 5+ dígitos, aplica a máscara completa DD/MM/YYYY
    return limitedNumbers.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
  };

  // ✅ Função para formatar telefone
  const formatPhone = (value: string) => {
    if (!value) return "";

    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");

    // Limita a 11 dígitos (telefone brasileiro com DDD)
    const limitedNumbers = numbers.slice(0, 11);

    // Se tem menos de 3 dígitos, retorna apenas os números
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    }

    // Se tem entre 3-6 dígitos, aplica (XX) X
    if (limitedNumbers.length <= 6) {
      return limitedNumbers.replace(/(\d{2})(\d{0,4})/, "($1) $2");
    }

    // Se tem entre 7-10 dígitos, aplica (XX) XXXX-X
    if (limitedNumbers.length <= 10) {
      return limitedNumbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }

    // Se tem 11 dígitos, aplica (XX) X XXXX-XXXX
    return limitedNumbers.replace(
      /(\d{2})(\d{1})(\d{4})(\d{0,4})/,
      "($1) $2 $3-$4"
    );
  };

  // ✅ Função para converter data do formato brasileiro para ISO
  const parseDate = (dateString: string) => {
    if (!dateString) return null;

    try {
      // Converter de DD/MM/YYYY para YYYY-MM-DD (apenas string, sem usar Date)
      const [day, month, year] = dateString.split("/");
      if (day && month && year && year.length === 4) {
        // Retorna a string diretamente, sem criar um objeto Date
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
      return null;
    } catch (error) {
      console.error("Erro ao converter data:", error);
      return null;
    }
  };

  // ✅ Função para validar data de nascimento
  const isValidBirthday = (dateString: string) => {
    if (!dateString) return true; // Campo opcional

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);

    if (!match) return false;

    const [, day, month, year] = match;
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Verificar se os valores estão dentro dos limites
    if (dayNum < 1 || dayNum > 31) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) return false;

    // Verificar se a data é válida
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (
      date.getDate() !== dayNum ||
      date.getMonth() !== monthNum - 1 ||
      date.getFullYear() !== yearNum
    ) {
      return false;
    }

    // Verificar se não é uma data futura
    if (date > new Date()) return false;

    return true;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    // Limpar erros quando o usuário começar a digitar novamente
    if (field === "cpf" && cpfError) {
      setCpfError(null);
    }
    if (field === "nomeUsuario" && nicknameError) {
      setNicknameError(null);
    }
    if (field === "dataNascimento" && birthdayError) {
      setBirthdayError(null);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userProfile?.id) {
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

        return;
      } else if (cpfNumbers.length > 0 && cpfNumbers.length < 11) {
        setCpfError("CPF deve ter 11 dígitos.");
        showError("CPF incompleto. Digite todos os 11 dígitos.");

        return;
      }
    }

    // Validar data de nascimento antes de salvar
    if (formData.dataNascimento && !isValidBirthday(formData.dataNascimento)) {
      setBirthdayError(
        "Data de nascimento inválida. Use o formato DD/MM/AAAA."
      );
      showError("Data de nascimento inválida. Corrija a data antes de salvar.");

      return;
    }

    setIsSaving(true);
    setCpfError(null);
    setNicknameError(null); // Limpar erro de nickname ao salvar
    setBirthdayError(null); // Limpar erro de data de nascimento ao salvar

    try {
      const changedFields = getChangedFields();

      if (Object.keys(changedFields).length === 0) {
        setIsSaving(false);
        return;
      }

      // Atualizar dados do usuário
      await api.patch(`/api/accounts/profile`, changedFields);

      await refetch();

      //  Atualizar dados originais com os novos dados salvos
      const newOriginalData = {
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        nomeCompleto: formData.nomeCompleto,
        nomeUsuario: formData.nomeUsuario,
        dataNascimento: formData.dataNascimento,
        cep: formData.cep,
        rua: formData.rua,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        whatsapp: formData.whatsapp,
        email: formData.email,
        cpf: formData.cpf,
      };
      setOriginalData(newOriginalData);

      // Mostrar alert de sucesso
      showSuccess("Dados salvos com sucesso!");
    } catch (error) {
      console.error("[MeusDados] Erro ao salvar dados:", error);

      // Log detalhado do erro para debug
      if (error.response) {
        console.error(" [MeusDados] Status:", error.response.status);
        console.error("[MeusDados] Status Text:", error.response.statusText);
        console.error("[MeusDados] Response Data:", error.response.data);
        console.error("[MeusDados] Headers:", error.response.headers);
      } else if (error.request) {
        console.error("[MeusDados] Request:", error.request);
      } else {
        console.error("[MeusDados] Error Message:", error.message);
      }

      // Mostrar alert de erro
      showError("Erro ao salvar dados. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Função para excluir endereço
  const handleDeleteAddress = async (index: number) => {
    if (!userProfile?.addresses || !userProfile?.id) return;
    try {
      // Remove o endereço do array
      const newAddresses = userProfile.addresses.filter((_, i) => i !== index);
      await api.patch(`/api/accounts/profile`, {
        addresses: newAddresses,
      });
      await refetch();
      showSuccess("Endereço excluído com sucesso!");
    } catch (error) {
      showError("Erro ao excluir endereço.");
      console.error("Erro ao excluir endereço:", error);
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

  // Layout Mobile - exatamente como a imagem
  if (isMobile) {
    return (
      <>
        <Head title="Meus Dados" />
        <div className="min-h-screen bg-white md:hidden">
          {/* Header roxo escuro */}
          <div className="bg-[#4A2C7C] text-white">
            <div className="flex bg-[#211C49] items-center px-4 py-4 pt-8">
              <button
                onClick={() => navigate("/meu-perfil")}
                className="p-2 -ml-2 focus:outline-none"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-lg font-light ml-2">Meus Dados</h1>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="bg-[#F4F3F5] min-h-screen pt-4 pb-20">
            {/* Seção Dados Pessoais */}
            <div className="px-4 mb-6">
              <h2 className="text-lg font-bold text-black mb-4">
                Dados Pessoais
              </h2>

              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                </div>

                {/* Sobrenome */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    value={formData.sobrenome}
                    onChange={(e) =>
                      handleInputChange("sobrenome", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                </div>

                {/* Nome de Usuário */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={formData.nomeUsuario}
                    onChange={(e) =>
                      handleInputChange("nomeUsuario", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                  {nicknameError && (
                    <div className="text-red-500 text-sm mt-1">
                      {nicknameError}
                    </div>
                  )}
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="text"
                    value={formData.dataNascimento}
                    onChange={(e) => {
                      const formatted = formatDateInput(e.target.value);
                      handleInputChange("dataNascimento", formatted);
                    }}
                    placeholder="DD/MM/AAAA"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                  {birthdayError && (
                    <div className="text-red-500 text-sm mt-1">
                      {birthdayError}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seção Endereço */}
            <div className="px-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-black">Endereço</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleInputChange(
                        "ocultarLocalizacao",
                        !formData.ocultarLocalizacao
                      )
                    }
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                      formData.ocultarLocalizacao
                        ? "bg-[#4A2C7C] border-[#4A2C7C]"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {formData.ocultarLocalizacao && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <span className="text-sm font-normal text-black">
                    Ocultar minha localização
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* CEP */}
                <div>
                  <label className="block text-lg font-normal text-black">
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cep}
                      onChange={(e) => {
                        const formatted = formatCEP(e.target.value);
                        handleInputChange("cep", formatted);
                        setCepError(null); // Limpa erro quando usuário digita
                      }}
                      placeholder="00000-000"
                      className={`w-full px-3 py-2 bg-white border rounded-md text-black focus:outline-none focus:border-[#4A2C7C] ${
                        cepError ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isLoadingCep}
                    />
                    {isLoadingCep && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  {cepError && (
                    <p className="mt-1 text-sm text-red-500">{cepError}</p>
                  )}
                  {!cepError &&
                    formData.cep.replace(/\D/g, "").length === 8 &&
                    !isLoadingCep 
                    }
                </div>

                {/* Rua */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    Rua
                  </label>
                  <input
                    type="text"
                    value={formData.rua}
                    onChange={(e) => handleInputChange("rua", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) =>
                      handleInputChange("numero", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                </div>

                {/* Bairro */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={formData.bairro}
                    onChange={(e) =>
                      handleInputChange("bairro", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) =>
                      handleInputChange("cidade", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) =>
                      handleInputChange("estado", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  >
                    <option value="">Selecione um estado</option>
                    {estadosDoBrasil.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Seção Contato */}
            <div className="px-4 mt-6">
              <h2 className="text-lg font-bold text-black mb-4">Contato</h2>

              <div className="space-y-4">
                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      handleInputChange("whatsapp", formatted);
                    }}
                    placeholder="(00) 0 0000-0000"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-normal text-black mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                  />
                </div>
              </div>
            </div>

            {/* Seção Informações Adicionais */}
            <div className="px-4 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-black">CPF</h2>
                <HelpCircle className="w-4 h-4 text-gray-500" />
              </div>

              <div>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    handleInputChange("cpf", formatted);
                  }}
                  placeholder="000.000.000-00"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-[#4A2C7C]"
                />
                {cpfError && (
                  <div className="text-red-500 text-sm mt-1">{cpfError}</div>
                )}
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="px-4 mt-8 mb-8">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full py-3 rounded-md text-base font-normal transition-colors flex items-center justify-center gap-2 ${
                  isSaving
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#4A2C7C] text-white hover:bg-[#3a2370]"
                }`}
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSaving ? "Salvando..." : "Salvar Dados"}
              </button>
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
        </div>
        <BottomBar />
      </>
    );
  }

  // Layout Desktop - mantém o layout original
  return (
    <>
      <Head title="Meus Dados" />
      <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
      <FilterTopBar />

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
              />
              {nicknameError && (
                <div className="text-red-500 text-sm mt-1">{nicknameError}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormattedField
                    label="Data de nascimento"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    placeholder="DD/MM/AAAA"
                    formatFunction={formatDateInput}
                    error={birthdayError}
                  />
                </div>
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
                <div className="flex flex-col gap-1 md:col-span-1">
                  <label className="block text-lg font-normal text-black mb-1">
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cep}
                      onChange={(e) => {
                        const formatted = formatCEP(e.target.value);
                        handleInputChange("cep", formatted);
                        setCepError(null); // Limpa erro quando usuário digita
                      }}
                      placeholder="00000-000"
                      className={`w-full px-3 py-2 bg-white border rounded-md text-black focus:outline-none focus:border-[#4A2C7C] ${
                        cepError ? "border-red-500" : "border-gray-300"
                      }`}
                      
                    />
                  {cepError && (
                    <p className="mt-1 text-sm text-red-500">{cepError}</p>
                  )}
                  </div>
                  
                </div>
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
            <EnderecoButton
              userProfile={userProfile}
              onDeleteAddress={handleDeleteAddress}
            />
            <hr className="my-8 border-gray-200" />

            <section>
              <h2 className="text-2xl font-normal text-black mb-6">Contato</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormattedField
                  label="WhatsApp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="(00) 0 0000-0000"
                  formatFunction={formatPhone}
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

            <hr className="my-8 border-gray-200" />

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
