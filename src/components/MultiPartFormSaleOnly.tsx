import React, { useState, useEffect, useCallback, useRef } from "react";
import { Camera, ChevronDown, Edit, Trash2, BookOpen } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import InfoTooltip from "./InfoToolTip";
import CustomSelect from "./ui/CustomSelect";
import ConfirmButton from "./ui/ConfirmButton";
import ModalAlert from "./ui/ModalAlert";
import CustomCheckbox from "./ui/CustomCheckbox";
import Head from "./Head";
import StepHeader from "./StepHeader";
import { useIsMobile } from "../hooks/useIsMobile";
import { useAdvertisementCreation } from "../hooks/useAdvertisementCreation";
import { useReferenceData } from "../hooks/useReferenceData";
import { useGameSpecificData } from "../hooks/useGameSpecificData";
import {
  validateFormData,
  validateVariations,
} from "../utils/formDataConverter";

const stepsArray = [1, 2, 3, 4];

const MultiPartFormSaleOnly = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [imageError, setImageError] = useState<string>("");

  // Hook para dados de referência
  const handleReferenceDataError = useCallback(() => {}, []);

  const {
    preservationStates,
    cartridgeTypes,
    regions,
    languages,
    getGameOptions,
    getPreservationStateOptions,
    getCartridgeTypeOptions,
    getRegionOptions,
    getLanguageOptions,
    getGameById,
    getPreservationStateById,
    getCartridgeTypeById,
    getRegionById,
  } = useReferenceData({
    autoLoad: true,
    onError: handleReferenceDataError,
  });

  // Hook para dados específicos do jogo selecionado
  const {
    loading: gameDataLoading,
    error: gameDataError,
    fetchGameData,
    clearData: clearGameData,
    getAvailableRegions,
    getAvailableAudioLanguages,
    getAvailableSubtitleLanguages,
    getAvailableInterfaceLanguages,
  } = useGameSpecificData();

  // Hook para criação de anúncios
  const {
    createAdvertisementFromExistingForm,
    loading: creationLoading,
    error: creationError,
  } = useAdvertisementCreation({
    onSuccess: () => {
      setShowSuccessMessage(true);
      // Limpar localStorage após sucesso
      localStorage.removeItem("tcc-variations");
    },
    onError: () => {
      // Mostrar erro para o usuário
    },
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [variations, setVariations] = useState([]);
  const [editingVariationId, setEditingVariationId] = useState(null);
  const [checkboxConfirmed, setCheckboxConfirmed] = useState(false);
  const [showMainAd, setShowMainAd] = useState(false);
  const [expandedVariations, setExpandedVariations] = useState({});
  const [showValidation, setShowValidation] = useState({
    step1: false,
    step2: false,
    step3: false,
    step5: false,
  });
  const isMobile = useIsMobile();
  // Funções para gerenciar localStorage
  const saveVariationsToStorage = (variationsToSave) => {
    try {
      localStorage.setItem("tcc-variations", JSON.stringify(variationsToSave));
    } catch {
      // Erro ao salvar variações no localStorage
    }
  };

  const loadVariationsFromStorage = () => {
    try {
      const saved = localStorage.getItem("tcc-variations");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Erro ao carregar variações do localStorage:", error);
      return [];
    }
  };

  // Carregar variações do localStorage ao montar o componente
  useEffect(() => {
    const savedVariations = loadVariationsFromStorage();
    setVariations(savedVariations);
  }, []);

  // Sincronizar variações com localStorage sempre que houver mudanças
  useEffect(() => {
    saveVariationsToStorage(variations);
  }, [variations]);

  const [formData, setFormData] = useState({
    titulo: "",
    estoque: "",
    descricao: "",
    preco: "",

    jogo: "",
    tipoCartucho: "",
    estadoPreservacao: "",
    regiao: "",
    idiomaAudio: "",
    idiomaLegenda: "",
    idiomaInterface: "",
    condicoes: "Venda",

    imagens: Array(5).fill(null),
  });

  const [variationData, setVariationData] = useState({
    titulo: "",
    tipoCartucho: "",
    estadoPreservacao: "",
    regiao: "",
    idiomaAudio: "",
    idiomaLegenda: "",
    idiomaInterface: "",
    preco: "",
    estoque: "",
    descricao: "",
    imagens: Array(4).fill(null),
  });

  // ✅ Ref para rastrear o jogo anterior
  const previousJogoRef = useRef<string>(formData.jogo);

  const handleSelectChange = (name: string, value: string) => {
    const previousJogo = previousJogoRef.current;

    // Quando um jogo é selecionado ou alterado
    if (name === "jogo") {
      // Se o jogo mudou (não é apenas a primeira vez), limpar campos condicionais
      if (previousJogo && previousJogo !== value) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          regiao: "",
          idiomaAudio: "",
          idiomaLegenda: "",
          idiomaInterface: "",
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }

      // Atualizar a ref
      previousJogoRef.current = value;

      // Buscar dados específicos do jogo ou limpar
      if (value) {
        fetchGameData(parseInt(value));
      } else {
        clearGameData();
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVariationSelectChange = (name: string, value: string) => {
    setVariationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Autoformat para o campo de preço
    if (name === "preco") {
      // Remove tudo que não é número
      const numericValue = value.replace(/\D/g, "");

      // Converte para centavos e formata
      if (numericValue) {
        const cents = parseInt(numericValue);
        const reais = (cents / 100).toFixed(2).replace(".", ",");
        setVariationData((prev) => ({ ...prev, [name]: reais }));
        return;
      } else {
        setVariationData((prev) => ({ ...prev, [name]: "" }));
        return;
      }
    }

    setVariationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Autoformat para o campo de preço
    if (name === "preco") {
      // Remove tudo que não é número
      const numericValue = value.replace(/\D/g, "");

      // Converte para centavos e formata
      if (numericValue) {
        const cents = parseInt(numericValue);
        const reais = (cents / 100).toFixed(2).replace(".", ",");
        setFormData((prev) => ({ ...prev, [name]: reais }));
        return;
      } else {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0]; // Pega apenas o primeiro arquivo

      // Validação de tamanho (3MB = 3 * 1024 * 1024 bytes)
      const maxSize = 3 * 1024 * 1024; // 3MB em bytes
      if (file.size > maxSize) {
        setImageError(
          `A imagem ou vídeo "${file.name}" é muito grande. Tamanho máximo permitido: 3MB`
        );
        return; // Não adiciona o arquivo se for muito grande
      }

      // Limpa erros anteriores se o arquivo for válido
      setImageError("");

      setFormData((prev) => {
        const newImagens = [...prev.imagens];
        newImagens[index] = file; // Substitui o arquivo na posição específica
        return { ...prev, imagens: newImagens };
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImagens = [...prev.imagens];
      newImagens[index] = null; // Remove a imagem da posição
      return { ...prev, imagens: newImagens };
    });
  };

  const handleVariationFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0]; // Pega apenas o primeiro arquivo

      // Validação de tamanho (3MB = 3 * 1024 * 1024 bytes)
      const maxSize = 3 * 1024 * 1024; // 3MB em bytes
      if (file.size > maxSize) {
        setImageError(
          `A imagem "${file.name}" é muito grande. Tamanho máximo permitido: 3MB`
        );
        return; // Não adiciona o arquivo se for muito grande
      }

      // Limpa erros anteriores se o arquivo for válido
      setImageError("");

      setVariationData((prev) => {
        const newImagens = [...prev.imagens];
        newImagens[index] = file; // Substitui o arquivo na posição específica
        return { ...prev, imagens: newImagens };
      });
    }
  };

  const removeVariationImage = (index: number) => {
    setVariationData((prev) => {
      const newImagens = [...prev.imagens];
      newImagens[index] = null; // Remove a imagem da posição
      return { ...prev, imagens: newImagens };
    });
  };

  const nextStep = () => {
    // Verificar se os campos obrigatórios estão preenchidos
    if (step === 1) {
      // Ativar validação apenas do step 1
      setShowValidation((prev) => ({ ...prev, step1: true }));

      if (!formData.titulo || !formData.estoque || !formData.preco) {
        return; // Não prosseguir se campos obrigatórios estiverem vazios
      }
    } else if (step === 2) {
      // Ativar validação apenas do step 2
      setShowValidation((prev) => ({ ...prev, step2: true }));

      // Verificar se campos obrigatórios estão preenchidos
      const hasRequiredFields =
        formData.jogo && formData.tipoCartucho && formData.estadoPreservacao;

      // Verificar campos condicionais (apenas se estão visíveis)
      const hasRegionField = formData.jogo && getAvailableRegions().length > 0;
      const hasAudioField =
        formData.jogo && getAvailableAudioLanguages().length > 0;

      const hasConditionalFields =
        (!hasRegionField || formData.regiao) &&
        (!hasAudioField || formData.idiomaAudio);

      if (!hasRequiredFields || !hasConditionalFields) {
        return; // Não prosseguir se campos obrigatórios estiverem vazios
      }
    }
    setStep((prev) => Math.min(prev + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinish = async () => {
    try {
      // Validar dados do formulário principal
      const formErrors = validateFormData(formData);
      if (formErrors.length > 0) {
        alert(`Erro de validação:\n${formErrors.join("\n")}`);
        return;
      }

      // Validar variações
      const variationErrors = validateVariations(variations);
      if (variationErrors.length > 0) {
        alert(
          `Erro de validação nas variações:\n${variationErrors.join("\n")}`
        );
        return;
      }

      // Criar anúncio usando o serviço
      await createAdvertisementFromExistingForm(formData, variations, {
        preservationStates,
        cartridgeTypes,
        regions,
        languages,
      });

      // Scroll para o topo após envio
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Erro ao finalizar criação do anúncio:", error);
      alert("Erro ao criar anúncio. Tente novamente.");
    }
  };

  const toggleVariation = (variationId) => {
    setExpandedVariations((prev) => ({
      ...prev,
      [variationId]: !prev[variationId],
    }));
  };

  const handleSaveVariation = () => {
    setShowValidation((prev) => ({ ...prev, step5: true }));

    // Verificar campos obrigatórios básicos
    const hasRequiredFields =
      variationData.tipoCartucho &&
      variationData.estadoPreservacao &&
      variationData.estoque;

    // Verificar campos condicionais (apenas se estão visíveis)
    const hasRegionField = formData.jogo && getAvailableRegions().length > 0;
    const hasAudioField =
      formData.jogo && getAvailableAudioLanguages().length > 0;

    const hasConditionalFields =
      (!hasRegionField || variationData.regiao) &&
      (!hasAudioField || variationData.idiomaAudio);

    if (hasRequiredFields && hasConditionalFields) {
      if (editingVariationId && editingVariationId !== "new") {
        // Editando variação existente
        setVariations((prev) =>
          prev.map((v) =>
            v.id === editingVariationId ? { ...v, ...variationData } : v
          )
        );
      } else {
        // Criando nova variação
        const newVariation = {
          id: Date.now(),
          ...variationData,
          // ... (sua lógica de título e descrição padrão)
        };
        setVariations((prev) => [...prev, newVariation]);
      }

      // Limpa o estado de edição e reseta o formulário
      setEditingVariationId(null);
      setVariationData({
        titulo: "",
        tipoCartucho: "",
        estadoPreservacao: "",
        regiao: "",
        idiomaAudio: "",
        idiomaLegenda: "",
        idiomaInterface: "",
        preco: "",
        estoque: "",
        descricao: "",
        imagens: Array(4).fill(null),
      });
    }
  };

  const handleDeleteVariation = (id) => {
    setVariations((prev) => prev.filter((v) => v.id !== id));
  };

  const handleEditVariation = (variation) => {
    setVariationData(variation);
    setEditingVariationId(variation.id);
    setExpandedVariations((prev) => ({ ...prev, [variation.id]: false }));
  };

  const handleCancelEdit = () => {
    setEditingVariationId(null);
    // Limpar os dados do formulário de variação ao cancelar
    setVariationData({
      titulo: "",
      tipoCartucho: "",
      estadoPreservacao: "",
      regiao: "",
      idiomaAudio: "",
      idiomaLegenda: "",
      idiomaInterface: "",
      preco: "",
      estoque: "",
      descricao: "",
      imagens: Array(4).fill(null),
    });
  };

  const clearVariationsStorage = () => {
    try {
      localStorage.removeItem("tcc-variations");
      setVariations([]);
    } catch (error) {
      console.error("Erro ao limpar variações do localStorage:", error);
    }
  };

  // =================== Opções para os selects ===================
  const jogos = getGameOptions();
  const tiposCartucho = getCartridgeTypeOptions();
  const estados = getPreservationStateOptions();
  const regioes = getRegionOptions();
  const idiomas = getLanguageOptions();

  // =================== Funções para obter nomes dos IDs ===================
  const getGameName = (gameId: string) => {
    const game = getGameById(parseInt(gameId));
    return game?.name || "Não informado";
  };

  const getCartridgeTypeName = (cartridgeTypeId: string) => {
    const cartridgeType = getCartridgeTypeById(parseInt(cartridgeTypeId));
    return cartridgeType?.name || "Não informado";
  };

  const getPreservationStateName = (preservationStateId: string) => {
    const preservationState = getPreservationStateById(
      parseInt(preservationStateId)
    );
    return preservationState?.name || "Não informado";
  };

  const getRegionName = (regionId: string) => {
    if (!regionId || regionId.trim() === "") {
      return "Não informado";
    }
    const parsedId = parseInt(regionId);
    if (isNaN(parsedId)) {
      return "Não informado";
    }
    const region = getRegionById(parsedId);
    return region?.name || region?.identifier || "Não informado";
  };

  const getLanguageName = (languageSupportId: string) => {
    if (!languageSupportId || languageSupportId.trim() === "") {
      return "Não informado";
    }

    // O ID que vem do formulário é o ID do LanguageSupport, não do Language
    // Precisamos buscar o LanguageSupport e pegar o nome do Language associado
    const languageSupportIdNum = parseInt(languageSupportId);
    if (isNaN(languageSupportIdNum)) {
      return "Não informado";
    }

    // Buscar em todos os language supports disponíveis
    const allLanguageSupports = [
      ...getAvailableAudioLanguages(),
      ...getAvailableSubtitleLanguages(),
      ...getAvailableInterfaceLanguages(),
    ];

    const languageSupport = allLanguageSupports.find(
      (ls) => ls.id === languageSupportIdNum
    );

    return languageSupport?.name || "Não informado";
  };

  return (
    <>
      <Head title="Cadastrar anúncio" iconHref="/Logos/logo-icon.svg" />
      <ModalAlert
        isOpen={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
        title="Pronto!"
        subtitle="Seu anúncio foi publicado com sucesso!"
        description='Seu anúncio pode demorar alguns minutos para aparecer nos resultados de busca. Você pode visualizá-lo em "Meus Anúncios".'
        buttonText="OK"
        onButtonClick={() => {
          setShowSuccessMessage(false);
          navigate("/meus-anuncios");
        }}
      />

      <div
        className={`${
          isMobile
            ? "mx-0 shadow-none border-0"
            : "lg:mx-52 shadow-lg rounded-sm border"
        } justify-center`}
      >
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <StepHeader
              title="Informações Básicas"
              subtitle="Comece preenchendo as informações básicas sobre o anúncio"
              step={step - 1}
              steps={stepsArray}
              onBack={""}
            />
            <div
              className={`${isMobile ? "p-4 pt-24 px-10" : "p-6"} space-y-4`}
            >
              <div>
                <label className="block mb-1 text-sm font-semibold">
                  Título do Anúncio
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  placeholder="Insira o título do anúncio"
                  onChange={handleInputChange}
                  className={`w-full border rounded p-2 ${
                    showValidation.step1 && !formData.titulo
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {showValidation.step1 && !formData.titulo && (
                  <p className="text-red-500 text-xs mt-1">
                    *Campo obrigatório
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold">
                  Estoque disponível
                </label>
                <input
                  type="number"
                  name="estoque"
                  value={formData.estoque}
                  placeholder="Insira o estoque disponível"
                  onChange={handleInputChange}
                  className={`w-full border rounded p-2 ${
                    showValidation.step1 && !formData.estoque
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {showValidation.step1 && !formData.estoque && (
                  <p className="text-red-500 text-xs mt-1">
                    *Campo obrigatório
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva a condição e detalhes do produto"
                  className="w-full border rounded p-2"
                />
              </div>

              {/* Campo de Preço */}
              <div>
                <label className="block mb-1 text-sm font-semibold">
                  Preço de Venda
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">R$</span>
                  <input
                    type="text"
                    name="preco"
                    value={formData.preco}
                    placeholder="0,00"
                    onChange={handleInputChange}
                    className={`w-full border rounded p-2 ${
                      showValidation.step1 && !formData.preco
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                {showValidation.step1 && !formData.preco && (
                  <p className="text-red-500 text-xs mt-1">
                    *Campo obrigatório
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <StepHeader
              title="Detalhes do Cartucho"
              subtitle="Agora adicione os detalhes sobre o cartucho"
              step={step - 1}
              steps={stepsArray}
              onBack={prevStep}
            />
            <div
              className={`${isMobile ? "p-4 pt-24 px-10" : "p-6"} space-y-4`}
            >
              <div>
                <label className="block mb-1 text-sm font-semibold">Jogo</label>
                <CustomSelect
                  options={jogos}
                  value={jogos.find((o) => o.value === formData.jogo)}
                  onChange={(opt) => handleSelectChange("jogo", opt.value)}
                  required={true}
                  showValidation={showValidation.step2}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-semibold">
                    Tipo de Cartucho{" "}
                  </label>
                  <InfoTooltip
                    message={
                      <>
                        Retro: cartucho original da época do console.
                        <br />
                        Repro: cópia não oficial modificada ou traduzida.
                      </>
                    }
                  />
                </div>
                <CustomSelect
                  options={tiposCartucho}
                  value={tiposCartucho.find(
                    (o) => o.value === formData.tipoCartucho
                  )}
                  onChange={(opt) =>
                    handleSelectChange("tipoCartucho", opt.value)
                  }
                  required={true}
                  showValidation={showValidation.step2}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold">
                  Estado de Preservação
                </label>
                <CustomSelect
                  options={estados}
                  value={estados.find(
                    (o) => o.value === formData.estadoPreservacao
                  )}
                  onChange={(opt) =>
                    handleSelectChange("estadoPreservacao", opt.value)
                  }
                  required={true}
                  showValidation={showValidation.step2}
                />
              </div>
              {/* Mostrar campo de região apenas se um jogo está selecionado E há regiões disponíveis */}
              {formData.jogo && getAvailableRegions().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Região do Cartucho
                  </label>
                  <CustomSelect
                    options={
                      formData.jogo
                        ? getAvailableRegions().map((r) => ({
                            value: r.id.toString(),
                            label: r.name,
                          }))
                        : regioes
                    }
                    value={
                      formData.jogo
                        ? getAvailableRegions().find(
                            (r) => r.id.toString() === formData.regiao
                          )
                          ? {
                              value: formData.regiao,
                              label:
                                getAvailableRegions().find(
                                  (r) => r.id.toString() === formData.regiao
                                )?.name || "",
                            }
                          : null
                        : regioes.find((o) => o.value === formData.regiao)
                    }
                    onChange={(opt) => handleSelectChange("regiao", opt.value)}
                    required={true}
                    showValidation={showValidation.step2}
                  />
                </div>
              ) : null}
              {/* Mostrar campo de idioma do áudio apenas se um jogo está selecionado E há idiomas disponíveis */}
              {formData.jogo && getAvailableAudioLanguages().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Idioma do Áudio
                  </label>
                  <CustomSelect
                    options={
                      formData.jogo
                        ? getAvailableAudioLanguages().map((l) => ({
                            value: l.id.toString(),
                            label: l.name,
                          }))
                        : idiomas
                    }
                    value={
                      formData.jogo
                        ? getAvailableAudioLanguages().find(
                            (l) => l.id.toString() === formData.idiomaAudio
                          )
                          ? {
                              value: formData.idiomaAudio,
                              label:
                                getAvailableAudioLanguages().find(
                                  (l) =>
                                    l.id.toString() === formData.idiomaAudio
                                )?.name || "",
                            }
                          : null
                        : idiomas.find((o) => o.value === formData.idiomaAudio)
                    }
                    onChange={(opt) =>
                      handleSelectChange("idiomaAudio", opt.value)
                    }
                    required={false}
                    showValidation={showValidation.step2}
                  />
                </div>
              ) : null}
              {/* Mostrar campo de idioma da legenda apenas se um jogo está selecionado E há idiomas disponíveis */}
              {formData.jogo && getAvailableSubtitleLanguages().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Idioma da Legenda
                  </label>
                  <CustomSelect
                    options={
                      formData.jogo
                        ? getAvailableSubtitleLanguages().map((l) => ({
                            value: l.id.toString(),
                            label: l.name,
                          }))
                        : idiomas
                    }
                    value={
                      formData.jogo
                        ? getAvailableSubtitleLanguages().find(
                            (l) => l.id.toString() === formData.idiomaLegenda
                          )
                          ? {
                              value: formData.idiomaLegenda,
                              label:
                                getAvailableSubtitleLanguages().find(
                                  (l) =>
                                    l.id.toString() === formData.idiomaLegenda
                                )?.name || "",
                            }
                          : null
                        : idiomas.find(
                            (o) => o.value === formData.idiomaLegenda
                          )
                    }
                    onChange={(opt) =>
                      handleSelectChange("idiomaLegenda", opt.value)
                    }
                    required={false}
                    showValidation={showValidation.step2}
                  />
                </div>
              ) : null}
              {/* Mostrar campo de idioma da interface apenas se um jogo está selecionado E há idiomas disponíveis */}
              {formData.jogo && getAvailableInterfaceLanguages().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Idioma da Interface
                  </label>
                  <CustomSelect
                    options={
                      formData.jogo
                        ? getAvailableInterfaceLanguages().map((l) => ({
                            value: l.id.toString(),
                            label: l.name,
                          }))
                        : idiomas
                    }
                    value={
                      formData.jogo
                        ? getAvailableInterfaceLanguages().find(
                            (l) => l.id.toString() === formData.idiomaInterface
                          )
                          ? {
                              value: formData.idiomaInterface,
                              label:
                                getAvailableInterfaceLanguages().find(
                                  (l) =>
                                    l.id.toString() === formData.idiomaInterface
                                )?.name || "",
                            }
                          : null
                        : idiomas.find(
                            (o) => o.value === formData.idiomaInterface
                          )
                    }
                    onChange={(opt) =>
                      handleSelectChange("idiomaInterface", opt.value)
                    }
                    required={false}
                    showValidation={showValidation.step2}
                  />
                </div>
              ) : null}

              {formData.jogo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Opções limitadas ao jogo selecionado
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          As opções de região e idiomas foram filtradas baseadas
                          no que este jogo suporta.
                        </p>
                        {gameDataLoading && (
                          <p className="mt-1 font-medium">
                            🔄 Carregando dados específicos do jogo...
                          </p>
                        )}
                        {gameDataError && (
                          <p className="mt-1 text-red-600">
                            ❌ Erro ao carregar dados: {gameDataError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm">
                Acesse o guia{" "}
                <a
                  href="/guia-cartucho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Como identificar as informações no seu cartucho
                </a>{" "}
                para descobrir onde encontrar as informações corretamente antes
                de enviar.
              </p>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <StepHeader
              title="Imagens e Vídeos"
              subtitle="Nós já estamos finalizando, envie fotos e vídeos do seu cartucho para venda"
              step={step - 1}
              steps={stepsArray}
              onBack={prevStep}
            />

            <div className="px-6 md:px-16 pt-8">
              <div className="max-w-5xl mx-auto flex flex-col gap-4">
                {/* Título e instrução */}
                <div>
                  <h2 className="font-semibold">Imagens e Vídeos</h2>
                  <p className="text-[13px]">
                    Envie imagens de até 3MB cada, com boa iluminação.
                  </p>
                </div>

                {/* input file */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {[...Array(5)].map((_, i) => {
                    const hasImage = formData.imagens[i];
                    return (
                      <div key={i} className="relative">
                        {hasImage ? (
                          // Botão com imagem (não clicável)
                          <div className="w-full aspect-square border-2 border-solid border-purple-400 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={URL.createObjectURL(hasImage)}
                              alt={`Imagem ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 w-6 h-6 text-[#483D9E] flex items-center justify-center text-2xl hover:text-[#211C49] transition-colors font-semibold"
                              title="Remover imagem do anúncio"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          // Botão vazio (clicável)
                          <label
                            className="w-full aspect-square border-2 border-dashed border-purple-400 rounded-lg
                              flex flex-col items-center justify-center cursor-pointer text-center text-sm text-gray-600
                              hover:bg-purple-50 hover:border-purple-600 hover:text-purple-600 transition p-2"
                          >
                            <Camera className="w-6 h-6 mb-1 text-purple-500" />
                            Incluir Fotos e Vídeos
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleFileChange(e, i)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mensagem de erro de tamanho de imagem */}
                {imageError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{imageError}</p>
                  </div>
                )}

                {/* Aviso */}
                {formData.tipoCartucho === "Retro" && (
                  <p className="text-sm">
                    <span className="font-semibold">Atenção:</span>{" "}
                    Identificamos que seu Cartucho foi marcado como retrô, é
                    obrigatório incluir fotos dos códigos de autenticação. Veja
                    nosso{" "}
                    <a href="#" className="text-blue-600 underline">
                      guia para encontrar e fotografar os códigos
                    </a>{" "}
                    antes de enviar.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
        {/* STEP 4 */}
        {step === 4 && (
          <>
            <StepHeader
              title="Adicionar Variações"
              subtitle="Tem mais de um cartucho do mesmo jogo para vender?"
              step={3}
              steps={stepsArray}
              onBack={prevStep}
            />
            <div className={`${isMobile ? "p-4" : "p-6"} space-y-6`}>
              {/* Lista de variações existentes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3
                    className={`${
                      isMobile ? "hidden" : ""
                    } text-lg font-semibold text-gray-800`}
                  >
                    Variações do Anúncio
                  </h3>
                  {variations.length > 0 && (
                    <button
                      onClick={clearVariationsStorage}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md border border-red-200 hover:border-red-300 transition-colors"
                    >
                      Limpar Todas
                    </button>
                  )}
                </div>

                {variations.map((variation, index) => {
                  // Se o ID desta variação é o que está sendo editado, mostre o formulário
                  if (editingVariationId === variation.id) {
                    return (
                      // =================== FORMULÁRIO DE EDIÇÃO ===================
                      <div
                        key={`editing-${variation.id}`}
                        className={`bg-[#EDECF7] border border-gray-300 rounded-lg ${
                          isMobile ? "p-4  w-full" : "p-6"
                        } space-y-4 animate-fadeIn`}
                      >
                        <div className="flex items-center justify-between border-b pb-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Editando Variação
                          </h3>
                          <button
                            onClick={handleCancelEdit}
                            title="Fechar edição"
                          >
                            <ChevronDown className="w-8 h-8 text-gray-600" />
                          </button>
                        </div>

                        <div className="space-y-3 bg-white p-4 rounded-lg">
                          {/* COLE O CONTEÚDO DO FORMULÁRIO AQUI */}
                          <div
                            className={`flex ${
                              isMobile ? "flex-col gap-2" : "items-center"
                            }`}
                          >
                            <label
                              className={`font-medium text-gray-700 flex-shrink-0 ${
                                isMobile
                                  ? "text-start text-md"
                                  : "text-end text-sm w-40"
                              } pr-2`}
                            >
                              Título do Anúncio:
                            </label>
                            <input
                              type="text"
                              name="titulo"
                              value={variationData.titulo}
                              onChange={handleVariationInputChange}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Ex: Cartucho Super Mario Bros - Repro"
                            />
                          </div>
                          <div
                            className={`flex ${
                              isMobile ? "flex-col gap-2" : "items-center"
                            }`}
                          >
                            <label
                              className={`font-medium text-gray-700 flex-shrink-0 ${
                                isMobile
                                  ? "text-start text-md"
                                  : "text-end text-sm w-40"
                              } pr-2`}
                            >
                              Tipo do Cartucho:
                            </label>
                            <div className="flex-1">
                              <CustomSelect
                                options={tiposCartucho}
                                value={tiposCartucho.find(
                                  (o) => o.value === variationData.tipoCartucho
                                )}
                                onChange={(opt) =>
                                  handleVariationSelectChange(
                                    "tipoCartucho",
                                    opt.value
                                  )
                                }
                                required={true}
                                showValidation={showValidation.step5}
                              />
                            </div>
                          </div>
                          <div
                            className={`flex ${
                              isMobile ? "flex-col gap-2" : "items-center"
                            }`}
                          >
                            <label
                              className={`font-medium text-gray-700 flex-shrink-0 ${
                                isMobile
                                  ? "text-start text-md"
                                  : "text-end text-sm w-40"
                              } pr-2`}
                            >
                              Estado de Preservação:
                            </label>
                            <div className="flex-1">
                              <CustomSelect
                                options={estados}
                                value={estados.find(
                                  (o) =>
                                    o.value === variationData.estadoPreservacao
                                )}
                                onChange={(opt) =>
                                  handleVariationSelectChange(
                                    "estadoPreservacao",
                                    opt.value
                                  )
                                }
                                required={true}
                                showValidation={showValidation.step5}
                              />
                            </div>
                          </div>
                          {/* Mostrar campo de região apenas se um jogo está selecionado E há regiões disponíveis */}
                          {formData.jogo && getAvailableRegions().length > 0 ? (
                            <div
                              className={`flex ${
                                isMobile ? "flex-col gap-2" : "items-center"
                              }`}
                            >
                              <label
                                className={`font-medium text-gray-700 flex-shrink-0 ${
                                  isMobile
                                    ? "text-start text-md"
                                    : "text-end text-sm w-40"
                                } pr-2`}
                              >
                                Região do Cartucho:
                              </label>
                              <div className="flex-1">
                                <CustomSelect
                                  options={getAvailableRegions().map((r) => ({
                                    value: r.id.toString(),
                                    label: r.name,
                                  }))}
                                  value={
                                    getAvailableRegions().find(
                                      (r) =>
                                        r.id.toString() === variationData.regiao
                                    )
                                      ? {
                                          value: variationData.regiao,
                                          label:
                                            getAvailableRegions().find(
                                              (r) =>
                                                r.id.toString() ===
                                                variationData.regiao
                                            )?.name || "",
                                        }
                                      : null
                                  }
                                  onChange={(opt) =>
                                    handleVariationSelectChange(
                                      "regiao",
                                      opt.value
                                    )
                                  }
                                  required={false}
                                  showValidation={showValidation.step5}
                                />
                              </div>
                            </div>
                          ) : null}
                          {/* Mostrar campo de idioma do áudio apenas se um jogo está selecionado E há idiomas disponíveis */}
                          {formData.jogo &&
                          getAvailableAudioLanguages().length > 0 ? (
                            <div
                              className={`flex ${
                                isMobile ? "flex-col gap-2" : "items-center"
                              }`}
                            >
                              <label
                                className={`font-medium text-gray-700 flex-shrink-0 ${
                                  isMobile
                                    ? "text-start text-md"
                                    : "text-end text-sm w-40"
                                } pr-2`}
                              >
                                Idioma do Audio:
                              </label>
                              <div className="flex-1">
                                <CustomSelect
                                  options={getAvailableAudioLanguages().map(
                                    (l) => ({
                                      value: l.id.toString(),
                                      label: l.name,
                                    })
                                  )}
                                  value={
                                    getAvailableAudioLanguages().find(
                                      (l) =>
                                        l.id.toString() ===
                                        variationData.idiomaAudio
                                    )
                                      ? {
                                          value: variationData.idiomaAudio,
                                          label:
                                            getAvailableAudioLanguages().find(
                                              (l) =>
                                                l.id.toString() ===
                                                variationData.idiomaAudio
                                            )?.name || "",
                                        }
                                      : null
                                  }
                                  onChange={(opt) =>
                                    handleVariationSelectChange(
                                      "idiomaAudio",
                                      opt.value
                                    )
                                  }
                                  required={false}
                                  showValidation={showValidation.step5}
                                />
                              </div>
                            </div>
                          ) : null}
                          {/* Mostrar campo de idioma da legenda apenas se um jogo está selecionado E há idiomas disponíveis */}
                          {formData.jogo &&
                          getAvailableSubtitleLanguages().length > 0 ? (
                            <div
                              className={`flex ${
                                isMobile ? "flex-col gap-2" : "items-center"
                              }`}
                            >
                              <label
                                className={`font-medium text-gray-700 flex-shrink-0 ${
                                  isMobile
                                    ? "text-start text-md"
                                    : "text-end text-sm w-40"
                                } pr-2`}
                              >
                                Idioma da Legenda:
                              </label>
                              <div className="flex-1">
                                <CustomSelect
                                  options={getAvailableSubtitleLanguages().map(
                                    (l) => ({
                                      value: l.id.toString(),
                                      label: l.name,
                                    })
                                  )}
                                  value={
                                    getAvailableSubtitleLanguages().find(
                                      (l) =>
                                        l.id.toString() ===
                                        variationData.idiomaLegenda
                                    )
                                      ? {
                                          value: variationData.idiomaLegenda,
                                          label:
                                            getAvailableSubtitleLanguages().find(
                                              (l) =>
                                                l.id.toString() ===
                                                variationData.idiomaLegenda
                                            )?.name || "",
                                        }
                                      : null
                                  }
                                  onChange={(opt) =>
                                    handleVariationSelectChange(
                                      "idiomaLegenda",
                                      opt.value
                                    )
                                  }
                                  required={false}
                                  showValidation={showValidation.step5}
                                />
                              </div>
                            </div>
                          ) : null}
                          {/* Mostrar campo de idioma da interface apenas se um jogo está selecionado E há idiomas disponíveis */}
                          {formData.jogo &&
                          getAvailableInterfaceLanguages().length > 0 ? (
                            <div
                              className={`flex ${
                                isMobile ? "flex-col gap-2" : "items-center"
                              }`}
                            >
                              <label
                                className={`font-medium text-gray-700 flex-shrink-0 ${
                                  isMobile
                                    ? "text-start text-md"
                                    : "text-end text-sm w-40"
                                } pr-2`}
                              >
                                Idioma da Interface:
                              </label>
                              <div className="flex-1">
                                <CustomSelect
                                  options={getAvailableInterfaceLanguages().map(
                                    (l) => ({
                                      value: l.id.toString(),
                                      label: l.name,
                                    })
                                  )}
                                  value={
                                    getAvailableInterfaceLanguages().find(
                                      (l) =>
                                        l.id.toString() ===
                                        variationData.idiomaInterface
                                    )
                                      ? {
                                          value: variationData.idiomaInterface,
                                          label:
                                            getAvailableInterfaceLanguages().find(
                                              (l) =>
                                                l.id.toString() ===
                                                variationData.idiomaInterface
                                            )?.name || "",
                                        }
                                      : null
                                  }
                                  onChange={(opt) =>
                                    handleVariationSelectChange(
                                      "idiomaInterface",
                                      opt.value
                                    )
                                  }
                                  required={false}
                                  showValidation={showValidation.step5}
                                />
                              </div>
                            </div>
                          ) : null}
                          <div
                            className={`flex ${
                              isMobile ? "flex-col gap-2" : "items-center"
                            }`}
                          >
                            <label
                              className={`font-medium text-gray-700 flex-shrink-0 ${
                                isMobile
                                  ? "text-start text-md"
                                  : "text-end text-sm w-40"
                              } pr-2`}
                            >
                              Estoque Disponível:
                            </label>
                            <input
                              type="number"
                              name="estoque"
                              value={variationData.estoque}
                              placeholder="1"
                              onChange={handleVariationInputChange}
                              className={`flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none ${
                                showValidation.step5 && !variationData.estoque
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              min="1"
                            />
                          </div>
                          <div
                            className={`flex ${
                              isMobile ? "flex-col gap-2" : "items-center"
                            }`}
                          >
                            <label
                              className={`font-medium text-gray-700 flex-shrink-0 ${
                                isMobile
                                  ? "text-start text-md"
                                  : "text-end text-sm w-40"
                              } pr-2`}
                            >
                              Preço de Venda:
                            </label>
                            <div className="flex-1 flex items-center space-x-2">
                              <span className="text-gray-600">R$</span>
                              <input
                                type="text"
                                name="preco"
                                value={variationData.preco}
                                placeholder="0,00"
                                onChange={handleVariationInputChange}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                            </div>
                          </div>
                          <div
                            className={`flex ${
                              isMobile ? "flex-col gap-2" : "items-center"
                            }`}
                          >
                            <label
                              className={`font-medium text-gray-700 flex-shrink-0 ${
                                isMobile
                                  ? "text-start text-md"
                                  : "text-end text-sm w-40"
                              } pr-2`}
                            >
                              Descrição:
                            </label>
                            <input
                              type="text"
                              name="descricao"
                              value={variationData.descricao}
                              placeholder="Descrição"
                              onChange={handleVariationInputChange}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div
                            className={`flex ${
                              isMobile ? "flex-col gap-2" : "items-center"
                            }`}
                          >
                            <label
                              className={`font-medium text-gray-700 flex-shrink-0 ${
                                isMobile
                                  ? "text-start text-md"
                                  : "text-end text-sm w-40"
                              } pr-2`}
                            >
                              Imagens e Vídeos:
                            </label>
                            <div className="flex-1">
                              <div className="grid grid-cols-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                  <div key={i} className="relative">
                                    {variationData.imagens[i] ? (
                                      <div className="aspect-square border-2 border-solid border-purple-400 rounded overflow-hidden bg-gray-100">
                                        <img
                                          src={URL.createObjectURL(
                                            variationData.imagens[i]
                                          )}
                                          alt={`Imagem ${i + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                        <button
                                          onClick={() =>
                                            removeVariationImage(i)
                                          }
                                          className="absolute top-1 right-1 w-5 h-5 text-[#483D9E] flex items-center justify-center text-lg hover:text-[#211C49] transition-colors"
                                          title="Remover imagem"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <label className="aspect-square bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-300">
                                        <Camera className="w-6 h-6 text-gray-400" />
                                        <input
                                          type="file"
                                          accept="image/*,video/*"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleVariationFileChange(e, i)
                                          }
                                        />
                                      </label>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                          >
                            Cancelar
                          </button>
                          <ConfirmButton onClick={handleSaveVariation}>
                            Salvar Alterações
                          </ConfirmButton>
                        </div>
                      </div>
                    );
                  }

                  // =================== MODO DE VISUALIZAÇÃO NORMAL ===================
                  return (
                    <div
                      key={variation.id}
                      className="border border-gray-200 rounded-lg overflow-hidden animate-fadeIn"
                    >
                      <div
                        className="bg-[#EDECF7] px-4 py-3 cursor-pointer transition-colors"
                        onClick={() => toggleVariation(variation.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              {variation.imagens && variation.imagens[0] ? (
                                <img
                                  src={URL.createObjectURL(
                                    variation.imagens[0]
                                  )}
                                  alt={`Imagem da variação`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300"></div>
                              )}
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">
                                Variação {index + 1}
                              </span>
                              <p className="text-sm text-gray-600 truncate max-w-xs md:max-w-md">
                                {getCartridgeTypeName(variation.tipoCartucho)} -{" "}
                                {getPreservationStateName(
                                  variation.estadoPreservacao
                                )}{" "}
                                - {getRegionName(variation.regiao)}
                              </p>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                              expandedVariations[variation.id]
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      </div>

                      {expandedVariations[variation.id] && (
                        <div className="bg-white p-4 border-x-8 border-[#EDECF7] border-b-8">
                          <div className="flex items-start space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 leading-relaxed">
                                <strong>Título:</strong> {variation.titulo}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Descrição:</strong>{" "}
                                {variation.descricao || "Nenhuma descrição."}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Estoque:</strong> {variation.estoque}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Preço:</strong> R${" "}
                                {variation.preco || "0,00"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <button
                                onClick={() => handleEditVariation(variation)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteVariation(variation.id)
                                }
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botão para ADICIONAR ou o Formulário de NOVA variação */}
              {editingVariationId === "new" ? (
                // =================== FORMULÁRIO DE NOVA VARIAÇÃO ===================
                <div
                  className={`bg-[#EDECF7] border border-gray-300 rounded-lg ${
                    isMobile ? "p-4 w-full" : "p-6"
                  } space-y-4 animate-fadeIn`}
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Nova Variação ({variations.length + 1})
                    </h3>
                    <button onClick={handleCancelEdit} title="Cancelar">
                      <ChevronDown className="w-8 h-8 text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-3 bg-white p-4 rounded-lg">
                    {/* COLE O CONTEÚDO DO FORMULÁRIO AQUI */}
                    <div
                      className={`flex ${
                        isMobile ? "flex-col gap-2" : "items-center"
                      }`}
                    >
                      <label
                        className={`font-medium text-gray-700 flex-shrink-0 ${
                          isMobile
                            ? "text-start text-md"
                            : "text-end text-sm w-40"
                        } pr-2`}
                      >
                        Título do Anúncio:
                      </label>
                      <input
                        type="text"
                        name="titulo"
                        value={variationData.titulo}
                        onChange={handleVariationInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Ex: Cartucho Super Mario Bros - Repro"
                      />
                    </div>
                    <div
                      className={`flex ${
                        isMobile ? "flex-col gap-2" : "items-center"
                      }`}
                    >
                      <label
                        className={`font-medium text-gray-700 flex-shrink-0 ${
                          isMobile
                            ? "text-start text-md"
                            : "text-end text-sm w-40"
                        } pr-2`}
                      >
                        Tipo do Cartucho:
                      </label>
                      <div className="flex-1">
                        <CustomSelect
                          options={tiposCartucho}
                          value={tiposCartucho.find(
                            (o) => o.value === variationData.tipoCartucho
                          )}
                          onChange={(opt) =>
                            handleVariationSelectChange(
                              "tipoCartucho",
                              opt.value
                            )
                          }
                          required={true}
                          showValidation={showValidation.step5}
                        />
                      </div>
                    </div>
                    <div
                      className={`flex ${
                        isMobile ? "flex-col gap-2" : "items-center"
                      }`}
                    >
                      <label
                        className={`font-medium text-gray-700 flex-shrink-0 ${
                          isMobile
                            ? "text-start text-md"
                            : "text-end text-sm w-40"
                        } pr-2`}
                      >
                        Estado de Preservação:
                      </label>
                      <div className="flex-1">
                        <CustomSelect
                          options={estados}
                          value={estados.find(
                            (o) => o.value === variationData.estadoPreservacao
                          )}
                          onChange={(opt) =>
                            handleVariationSelectChange(
                              "estadoPreservacao",
                              opt.value
                            )
                          }
                          required={true}
                          showValidation={showValidation.step5}
                        />
                      </div>
                    </div>
                    {/* Mostrar campo de região apenas se um jogo está selecionado E há regiões disponíveis */}
                    {formData.jogo && getAvailableRegions().length > 0 ? (
                      <div
                        className={`flex ${
                          isMobile ? "flex-col gap-2" : "items-center"
                        }`}
                      >
                        <label
                          className={`font-medium text-gray-700 flex-shrink-0 ${
                            isMobile
                              ? "text-start text-md"
                              : "text-end text-sm w-40"
                          } pr-2`}
                        >
                          Região do Cartucho:
                        </label>
                        <div className="flex-1">
                          <CustomSelect
                            options={getAvailableRegions().map((r) => ({
                              value: r.id.toString(),
                              label: r.name,
                            }))}
                            value={
                              getAvailableRegions().find(
                                (r) => r.id.toString() === variationData.regiao
                              )
                                ? {
                                    value: variationData.regiao,
                                    label:
                                      getAvailableRegions().find(
                                        (r) =>
                                          r.id.toString() ===
                                          variationData.regiao
                                      )?.name || "",
                                  }
                                : null
                            }
                            onChange={(opt) =>
                              handleVariationSelectChange("regiao", opt.value)
                            }
                            required={false}
                            showValidation={showValidation.step5}
                          />
                        </div>
                      </div>
                    ) : null}
                    {/* Mostrar campo de idioma do áudio apenas se um jogo está selecionado E há idiomas disponíveis */}
                    {formData.jogo &&
                    getAvailableAudioLanguages().length > 0 ? (
                      <div
                        className={`flex ${
                          isMobile ? "flex-col gap-2" : "items-center"
                        }`}
                      >
                        <label
                          className={`font-medium text-gray-700 flex-shrink-0 ${
                            isMobile
                              ? "text-start text-md"
                              : "text-end text-sm w-40"
                          } pr-2`}
                        >
                          Idioma do Audio:
                        </label>
                        <div className="flex-1">
                          <CustomSelect
                            options={getAvailableAudioLanguages().map((l) => ({
                              value: l.id.toString(),
                              label: l.name,
                            }))}
                            value={
                              getAvailableAudioLanguages().find(
                                (l) =>
                                  l.id.toString() === variationData.idiomaAudio
                              )
                                ? {
                                    value: variationData.idiomaAudio,
                                    label:
                                      getAvailableAudioLanguages().find(
                                        (l) =>
                                          l.id.toString() ===
                                          variationData.idiomaAudio
                                      )?.name || "",
                                  }
                                : null
                            }
                            onChange={(opt) =>
                              handleVariationSelectChange(
                                "idiomaAudio",
                                opt.value
                              )
                            }
                            required={false}
                            showValidation={showValidation.step5}
                          />
                        </div>
                      </div>
                    ) : null}
                    {/* Mostrar campo de idioma da legenda apenas se um jogo está selecionado E há idiomas disponíveis */}
                    {formData.jogo &&
                    getAvailableSubtitleLanguages().length > 0 ? (
                      <div
                        className={`flex ${
                          isMobile ? "flex-col gap-2" : "items-center"
                        }`}
                      >
                        <label
                          className={`font-medium text-gray-700 flex-shrink-0 ${
                            isMobile
                              ? "text-start text-md"
                              : "text-end text-sm w-40"
                          } pr-2`}
                        >
                          Idioma da Legenda:
                        </label>
                        <div className="flex-1">
                          <CustomSelect
                            options={getAvailableSubtitleLanguages().map(
                              (l) => ({
                                value: l.id.toString(),
                                label: l.name,
                              })
                            )}
                            value={
                              getAvailableSubtitleLanguages().find(
                                (l) =>
                                  l.id.toString() ===
                                  variationData.idiomaLegenda
                              )
                                ? {
                                    value: variationData.idiomaLegenda,
                                    label:
                                      getAvailableSubtitleLanguages().find(
                                        (l) =>
                                          l.id.toString() ===
                                          variationData.idiomaLegenda
                                      )?.name || "",
                                  }
                                : null
                            }
                            onChange={(opt) =>
                              handleVariationSelectChange(
                                "idiomaLegenda",
                                opt.value
                              )
                            }
                            required={false}
                            showValidation={showValidation.step5}
                          />
                        </div>
                      </div>
                    ) : null}
                    {/* Mostrar campo de idioma da interface apenas se um jogo está selecionado E há idiomas disponíveis */}
                    {formData.jogo &&
                    getAvailableInterfaceLanguages().length > 0 ? (
                      <div
                        className={`flex ${
                          isMobile ? "flex-col gap-2" : "items-center"
                        }`}
                      >
                        <label
                          className={`font-medium text-gray-700 flex-shrink-0 ${
                            isMobile
                              ? "text-start text-md"
                              : "text-end text-sm w-40"
                          } pr-2`}
                        >
                          Idioma da Interface:
                        </label>
                        <div className="flex-1">
                          <CustomSelect
                            options={getAvailableInterfaceLanguages().map(
                              (l) => ({
                                value: l.id.toString(),
                                label: l.name,
                              })
                            )}
                            value={
                              getAvailableInterfaceLanguages().find(
                                (l) =>
                                  l.id.toString() ===
                                  variationData.idiomaInterface
                              )
                                ? {
                                    value: variationData.idiomaInterface,
                                    label:
                                      getAvailableInterfaceLanguages().find(
                                        (l) =>
                                          l.id.toString() ===
                                          variationData.idiomaInterface
                                      )?.name || "",
                                  }
                                : null
                            }
                            onChange={(opt) =>
                              handleVariationSelectChange(
                                "idiomaInterface",
                                opt.value
                              )
                            }
                            required={false}
                            showValidation={showValidation.step5}
                          />
                        </div>
                      </div>
                    ) : null}
                    <div
                      className={`flex ${
                        isMobile ? "flex-col gap-2" : "items-center"
                      }`}
                    >
                      <label
                        className={`font-medium text-gray-700 flex-shrink-0 ${
                          isMobile
                            ? "text-start text-md"
                            : "text-end text-sm w-40"
                        } pr-2`}
                      >
                        Estoque Disponível:
                      </label>
                      <input
                        type="number"
                        name="estoque"
                        value={variationData.estoque}
                        placeholder="1"
                        onChange={handleVariationInputChange}
                        className={`flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none ${
                          showValidation.step5 && !variationData.estoque
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        min="1"
                      />
                    </div>
                    <div
                      className={`flex ${
                        isMobile ? "flex-col gap-2" : "items-center"
                      }`}
                    >
                      <label
                        className={`font-medium text-gray-700 flex-shrink-0 ${
                          isMobile
                            ? "text-start text-md"
                            : "text-end text-sm w-40"
                        } pr-2`}
                      >
                        Preço de Venda:
                      </label>
                      <div className="flex-1 flex items-center space-x-2">
                        <span className="text-gray-600">R$</span>
                        <input
                          type="text"
                          name="preco"
                          value={variationData.preco}
                          placeholder="0,00"
                          onChange={handleVariationInputChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                    <div
                      className={`flex ${
                        isMobile ? "flex-col gap-2" : "items-center"
                      }`}
                    >
                      <label
                        className={`font-medium text-gray-700 flex-shrink-0 ${
                          isMobile
                            ? "text-start text-md"
                            : "text-end text-sm w-40"
                        } pr-2`}
                      >
                        Descrição:
                      </label>
                      <input
                        type="text"
                        name="descricao"
                        value={variationData.descricao}
                        placeholder="Descrição"
                        onChange={handleVariationInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div
                      className={`flex ${
                        isMobile ? "flex-col gap-2" : "items-center"
                      }`}
                    >
                      <label
                        className={`font-medium text-gray-700 flex-shrink-0 ${
                          isMobile
                            ? "text-start text-md"
                            : "text-end text-sm w-40"
                        } pr-2`}
                      >
                        Imagens e Vídeos:
                      </label>
                      <div className="flex-1">
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="relative">
                              {variationData.imagens[i] ? (
                                <div className="aspect-square border-2 border-solid border-purple-400 rounded overflow-hidden bg-gray-100">
                                  <img
                                    src={URL.createObjectURL(
                                      variationData.imagens[i]
                                    )}
                                    alt={`Imagem ${i + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={() => removeVariationImage(i)}
                                    className="absolute top-1 right-1 w-5 h-5 text-[#483D9E] flex items-center justify-center text-lg hover:text-[#211C49] transition-colors"
                                    title="Remover imagem"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <label className="aspect-square bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-300">
                                  <Camera className="w-6 h-6 text-gray-400" />
                                  <input
                                    type="file"
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleVariationFileChange(e, i)
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <ConfirmButton onClick={handleSaveVariation}>
                      Adicionar Variação
                    </ConfirmButton>
                  </div>
                </div>
              ) : (
                // =================== BOTÃO DE ADICIONAR ===================
                <div className="px-6">
                  <button
                    onClick={() => {
                      setVariationData({
                        titulo: formData.titulo || "",
                        tipoCartucho: formData.tipoCartucho || "",
                        estadoPreservacao: formData.estadoPreservacao || "",
                        regiao: formData.regiao || "",
                        idiomaAudio: formData.idiomaAudio || "",
                        idiomaLegenda: formData.idiomaLegenda || "",
                        idiomaInterface: formData.idiomaInterface || "",
                        preco: formData.preco || "",
                        estoque: formData.estoque || "",
                        descricao: formData.descricao || "",
                        imagens: Array(4).fill(null),
                      });
                      setEditingVariationId("new");
                    }}
                    className={`w-full border-2 border-dashed border-purple-400 ${
                      isMobile ? "p-4" : "p-6"
                    } rounded-lg text-purple-600 hover:bg-purple-50 hover:border-purple-600 transition-colors font-semibold`}
                  >
                    + Adicionar nova variação
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        {/* STEP 5 - Publicar Anúncio */}
        {step === 5 && (
          <>
            <StepHeader
              title="Publicar Anúncio"
              subtitle=""
              step={5}
              steps={stepsArray}
              onBack={prevStep}
            />
            <div className="p-8 text-center">
              {/* Exibir erro se houver */}
              {creationError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 mb-3">{creationError}</p>
                  {
                    creationError.includes("CPF") /* && (
                    <button
                      onClick={() => navigate("/meu-perfil")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Ir para Perfil
                    </button>
                  )*/
                  }
                </div>
              )}

              {/* Mensagem central */}
              <p className="text-black font- text-lg mb-8 max-w-2xl mx-auto">
                Você está prestes a publicar o seu anúncio, revise todas as
                informações, e se quiser, ainda é possível fazer alterações
              </p>
              {isMobile ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <img src="/Icons/computador.svg" alt="" />
                  {/* Botões */}
                  <div className="space-y-4">
                    <button
                      onClick={handleFinish}
                      disabled={!checkboxConfirmed || creationLoading}
                      className="px-24 py-3 bg-[#38307C] text-white rounded-lg hover:bg-[#2A1F5C] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#38307C]"
                    >
                      {creationLoading ? "Publicando..." : "Publicar"}
                    </button>
                    <br />
                    <button
                      onClick={() => setStep(6)}
                      className="px-16 py-3 bg-[#DDDDF3] text-[#38307C] rounded-lg hover:bg-[#C8C8E8] transition-colors font-medium"
                    >
                      Revisar Anúncio
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <img src="/Icons/computador.svg" alt="" />
                  {/* Botões */}
                  <div className="space-y-4">
                    <button
                      onClick={handleFinish}
                      disabled={!checkboxConfirmed || creationLoading}
                      className="px-24 py-3 bg-[#38307C] text-white rounded-lg hover:bg-[#2A1F5C] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#38307C]"
                    >
                      {creationLoading ? "Publicando..." : "Publicar"}
                    </button>
                    <br />
                    <button
                      onClick={() => setStep(6)}
                      className="px-16 py-3 bg-[#DDDDF3] text-[#38307C] rounded-lg hover:bg-[#C8C8E8] transition-colors font-medium"
                    >
                      Revisar Anúncio
                    </button>
                  </div>
                </div>
              )}
              {/* Checkbox e disclaimer */}
              <div className="mt-8 text-start">
                <div className="flex items-center justify-center mb-2">
                  <CustomCheckbox
                    id="confirm-publish"
                    checked={checkboxConfirmed}
                    onChange={setCheckboxConfirmed}
                    required
                    label="Ao publicar este anúncio, confirmo estar ciente de que, caso o conteúdo não esteja em conformidade com os regulamentos do site, ele poderá ser suspenso."
                    labelClassName="text-sm text-black"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* STEP 6 - Revisão do Anúncio */}
        {step === 6 && (
          <>
            <StepHeader
              title="Revisar Anúncio"
              subtitle="Confirme se todas as informações estão corretas"
              step={6}
              steps={stepsArray}
              onBack={prevStep}
            />
            <div className="p-8 bg-white">
              <div className="space-y-4">
                {/* Gaveta do Anúncio Principal */}
                <div className="bg-white rounded-lg shadow-sm border-x-8 border-[#EDECF7] border-b-8 overflow-hidden">
                  <div
                    className="bg-[#EDECF7] px-6 py-4 cursor-pointer transition-colors"
                    onClick={() => setShowMainAd(!showMainAd)}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Anúncio Principal
                      </h2>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          showMainAd ? "" : "rotate-180"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Conteúdo do anúncio principal */}
                  {showMainAd && (
                    <div className={`${isMobile ? "" : "p-6"} space-y-6`}>
                      {/* Imagens */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Imagens
                        </label>
                        <div className="flex space-x-3">
                          {formData.imagens.slice(0, 3).map((imagem, index) => (
                            <div
                              key={index}
                              className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden"
                            >
                              {imagem ? (
                                <img
                                  src={URL.createObjectURL(imagem)}
                                  alt={`Imagem ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                              )}
                            </div>
                          ))}
                          {formData.imagens.length < 3 &&
                            Array.from({
                              length: 3 - formData.imagens.length,
                            }).map((_, index) => (
                              <div
                                key={`empty-${index}`}
                                className="w-20 h-20 bg-gray-200 rounded-lg"
                              ></div>
                            ))}
                        </div>
                      </div>

                      {/* Título do Anúncio */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Titulo do Anúncio
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.titulo || "Não informado"}
                        </p>
                      </div>

                      {/* Tipo do Cartucho */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Tipo do Cartucho
                        </label>
                        <p className="text-gray-800 font-medium">
                          {getCartridgeTypeName(formData.tipoCartucho)}
                        </p>
                      </div>

                      {/* Jogo */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Jogo
                        </label>
                        <p className="text-gray-800 font-medium">
                          {getGameName(formData.jogo)}
                        </p>
                      </div>

                      {/* Estado de Preservação */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Estado de Preservação
                        </label>
                        <p className="text-gray-800 font-medium">
                          {getPreservationStateName(formData.estadoPreservacao)}
                        </p>
                      </div>

                      {/* Região do Cartucho */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Região do Cartucho
                        </label>
                        <p className="text-gray-800 font-medium">
                          {getRegionName(formData.regiao)}
                        </p>
                      </div>

                      {/* Idiomas do Audio */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Idioma do Audio
                        </label>
                        <p className="text-gray-800 font-medium">
                          {getLanguageName(formData.idiomaAudio)}
                        </p>
                      </div>

                      {/* Idiomas da Legenda */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Idioma da Legenda
                        </label>
                        <p className="text-gray-800 font-medium">
                          {getLanguageName(formData.idiomaLegenda)}
                        </p>
                      </div>

                      {/* Idiomas da Interface */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Idioma da Interface
                        </label>
                        <p className="text-gray-800 font-medium">
                          {getLanguageName(formData.idiomaInterface)}
                        </p>
                      </div>

                      {/* Descrição */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Descrição
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.descricao || "Não informado"}
                        </p>
                      </div>

                      {/* Condições */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Condições
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.condicoes || "Não informado"}
                        </p>
                      </div>

                      {/* Estoque disponível */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Estoque disponível
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.estoque || "Não informado"}
                        </p>
                      </div>

                      {/* Preço */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Preço
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.preco
                            ? `R$ ${parseFloat(
                                formData.preco.replace(",", ".")
                              ).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : "Não informado"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gavetas individuais para cada variação */}
                {variations.map((variation, index) => (
                  <div
                    key={variation.id || index}
                    className="bg-white rounded-lg shadow-sm border-x-8 border-[#EDECF7] border-b-8 overflow-hidden"
                  >
                    {/* Header da variação individual */}
                    <div
                      className="bg-[#EDECF7] px-6 py-4 cursor-pointer transition-colors"
                      onClick={() => toggleVariation(variation.id || index)}
                    >
                      <h2 className="text-lg font-semibold text-gray-800">
                        Variação
                      </h2>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                            {variation.imagens &&
                            variation.imagens[0] &&
                            variation.imagens[0] instanceof File ? (
                              <img
                                src={URL.createObjectURL(variation.imagens[0])}
                                alt={`Imagem da variação ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                            )}
                          </div>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                              {variation.titulo || `Variação ${index + 1}`}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {getCartridgeTypeName(variation.tipoCartucho)} -{" "}
                              {getPreservationStateName(
                                variation.estadoPreservacao
                              )}{" "}
                              - {getRegionName(variation.regiao)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Estoque: {variation.estoque || "N/A"}
                            </p>
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            expandedVariations[variation.id || index]
                              ? ""
                              : "rotate-180"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 23"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Conteúdo expandido da variação */}
                    {expandedVariations[variation.id || index] && (
                      <div className={`${isMobile ? "p-4" : "p-6"} space-y-6`}>
                        {/* Imagens da variação */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Imagens
                          </label>
                          <div className="flex space-x-3">
                            {variation.imagens &&
                              variation.imagens
                                .slice(0, 3)
                                .map((imagem, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden"
                                  >
                                    {imagem && imagem instanceof File ? (
                                      <img
                                        src={URL.createObjectURL(imagem)}
                                        alt={`Imagem ${imgIndex + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                                    )}
                                  </div>
                                ))}
                            {(!variation.imagens ||
                              variation.imagens.length < 3) &&
                              Array.from({
                                length:
                                  3 -
                                  (variation.imagens
                                    ? variation.imagens.length
                                    : 0),
                              }).map((_, imgIndex) => (
                                <div
                                  key={`empty-${imgIndex}`}
                                  className="w-20 h-20 bg-gray-200 rounded-lg"
                                ></div>
                              ))}
                          </div>
                        </div>

                        {/* Título da variação */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Título da Variação
                          </label>
                          <p className="text-gray-800 font-medium">
                            {variation.titulo || "Não informado"}
                          </p>
                        </div>

                        {/* Tipo do Cartucho */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Tipo do Cartucho
                          </label>
                          <p className="text-gray-800 font-medium">
                            {getCartridgeTypeName(variation.tipoCartucho)}
                          </p>
                        </div>

                        {/* Jogo */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Jogo
                          </label>
                          <p className="text-gray-800 font-medium">
                            {getGameName(formData.jogo)}
                          </p>
                        </div>

                        {/* Estado de Preservação */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Estado de Preservação
                          </label>
                          <p className="text-gray-800 font-medium">
                            {getPreservationStateName(
                              variation.estadoPreservacao
                            )}
                          </p>
                        </div>

                        {/* Região */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Região
                          </label>
                          <p className="text-gray-800 font-medium">
                            {getRegionName(variation.regiao)}
                          </p>
                        </div>

                        {/* Idiomas */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Idioma do Áudio
                          </label>
                          <p className="text-gray-800 font-medium">
                            {getLanguageName(variation.idiomaAudio)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Idioma da Legenda
                          </label>
                          <p className="text-gray-800 font-medium">
                            {getLanguageName(variation.idiomaLegenda)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Idioma da Interface
                          </label>
                          <p className="text-gray-800 font-medium">
                            {getLanguageName(variation.idiomaInterface)}
                          </p>
                        </div>

                        {/* Descrição */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Descrição
                          </label>
                          <p className="text-gray-800 font-medium">
                            {variation.descricao || "Não informado"}
                          </p>
                        </div>

                        {/* Estoque */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Estoque Disponível
                          </label>
                          <p className="text-gray-800 font-medium">
                            {variation.estoque || "Não informado"}
                          </p>
                        </div>

                        {/* Preço (se aplicável) */}
                        {variation.preco && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Preço
                            </label>
                            <p className="text-gray-800 font-medium">
                              {typeof variation.preco === "string"
                                ? `R$ ${parseFloat(
                                    variation.preco.replace(",", ".")
                                  ).toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}`
                                : `R$ ${variation.preco.toLocaleString(
                                    "pt-BR",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* FOOTER BUTTONS */}
        <div
          className={`flex justify-end p-4 bg-gray-50 border-t gap-1 ${
            isMobile ? "flex-col px-9" : "flex-row"
          }`}
        >
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`py-2 rounded-lg bg-[#DDDDF3] disabled:opacity-50 ${
              isMobile ? "hidden" : "px-4"
            }`}
          >
            Cancelar
          </button>
          {step !== 5 && (
            <ConfirmButton
              onClick={() => {
                if (step === 6) {
                  setStep(5);
                } else {
                  nextStep();
                }
              }}
              disabled={false}
            >
              {step === 6 ? "Voltar" : "Continuar"}
            </ConfirmButton>
          )}
        </div>
      </div>
    </>
  );
};

export default MultiPartFormSaleOnly;
