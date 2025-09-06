import React, { useState, useEffect } from "react";
import { Camera, Check, ChevronDown, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InfoTooltip from "./InfoToolTip";
import CustomSelect from "./ui/CustomSelect";
import ConfirmButton from "./ui/ConfirmButton";
import ModalAlert from "./ui/ModalAlert";
import CustomCheckbox from "./ui/CustomCheckbox";
import Head from "./Head";

interface MultiPartFormSaleAndTradeProps {
  isMobile?: boolean;
}

const MultiPartFormSaleAndTrade = ({
  isMobile = false,
}: MultiPartFormSaleAndTradeProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showVariationForm, setShowVariationForm] = useState(false);
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

  // Funções para gerenciar localStorage
  const saveVariationsToStorage = (variationsToSave) => {
    try {
      localStorage.setItem("tcc-variations", JSON.stringify(variationsToSave));
    } catch (error) {
      console.error("Erro ao salvar variações no localStorage:", error);
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

    jogosTroca: "",
    tiposTroca: "",
    estadosTroca: "",
    regioesTroca: "",
    idiomasAudioTroca: "",
    idiomasLegendaTroca: "",
    idiomasInterfaceTroca: "",

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
    // Condições de troca
    jogosTroca: "",
    tiposTroca: "",
    estadosTroca: "",
    regioesTroca: "",
    idiomasAudioTroca: "",
    idiomasLegendaTroca: "",
    idiomasInterfaceTroca: "",
  });

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      if (
        !formData.jogo ||
        !formData.tipoCartucho ||
        !formData.estadoPreservacao ||
        !formData.regiao ||
        !formData.idiomaAudio
      ) {
        return; // Não prosseguir se campos obrigatórios estiverem vazios
      }
    } else if (step === 3) {
      // Ativar validação apenas do step 3
      setShowValidation((prev) => ({ ...prev, step3: true }));

      if (
        !formData.jogosTroca ||
        !formData.tiposTroca ||
        !formData.estadosTroca ||
        !formData.regioesTroca ||
        !formData.idiomasAudioTroca ||
        !formData.idiomasLegendaTroca ||
        !formData.idiomasInterfaceTroca
      ) {
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

  const handleFinish = () => {
    // Aqui você pode adicionar a lógica de envio do formulário
    // Por exemplo, validações, chamadas para API, etc.

    // Incluir as variações no envio
    const formDataWithVariations = {
      ...formData,
      variations: variations,
    };

    // Simular envio bem-sucedido
    console.log("Formulário enviado:", formDataWithVariations);
    console.log("Variações incluídas:", variations);

    setShowSuccessMessage(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleVariation = (variationId) => {
    setExpandedVariations((prev) => ({
      ...prev,
      [variationId]: !prev[variationId],
    }));
  };

  const handleSaveVariation = () => {
    // Ativar validação apenas do step 5
    setShowValidation((prev) => ({ ...prev, step5: true }));

    if (
      variationData.tipoCartucho &&
      variationData.estadoPreservacao &&
      variationData.regiao &&
      variationData.idiomaAudio &&
      variationData.estoque
    ) {
      if (editingVariationId) {
        // Editando variação existente
        setVariations((prev) =>
          prev.map((v) =>
            v.id === editingVariationId
              ? {
                  ...v,
                  ...variationData,
                  titulo:
                    variationData.titulo ||
                    formData.titulo ||
                    "Troco Cartucho Super Mario Bros Usado.",
                  descricao: `${variationData.tipoCartucho} - ${variationData.estadoPreservacao} - ${variationData.regiao} - ${variationData.idiomaAudio}`,
                }
              : v
          )
        );
        setEditingVariationId(null);
      } else {
        // Criando nova variação
        const newVariation = {
          id: Date.now(),
          ...variationData,
          titulo:
            variationData.titulo ||
            formData.titulo ||
            "Troca Cartucho Super Mario Bros Usado.",
          descricao: `${variationData.tipoCartucho} - ${variationData.estadoPreservacao} - ${variationData.regiao} - ${variationData.idiomaAudio}`,
        };

        setVariations((prev) => [...prev, newVariation]);
      }

      setShowVariationForm(false);

      // Resetar o formulário de variação
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
        // Condições de troca
        jogosTroca: "",
        tiposTroca: "",
        estadosTroca: "",
        regioesTroca: "",
        idiomasAudioTroca: "",
        idiomasLegendaTroca: "",
        idiomasInterfaceTroca: "",
      });
    }
  };

  const handleDeleteVariation = (id) => {
    setVariations((prev) => prev.filter((v) => v.id !== id));
  };

  const handleEditVariation = (variation) => {
    setVariationData(variation);
    setEditingVariationId(variation.id);
    setShowVariationForm(true);
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
  const jogos = [
    { label: "Jogo 1", value: "Jogo 1" },
    { label: "Jogo 2", value: "Jogo 2" },
  ];

  const tiposCartucho = [
    { label: "Retrô", value: "Retro" },
    { label: "Repro", value: "Repro" },
  ];

  const estados = [
    { label: "Novo", value: "Novo" },
    { label: "Usado", value: "Usado" },
  ];

  const regioes = [
    { label: "NTSC", value: "NTSC" },
    { label: "PAL", value: "PAL" },
  ];

  const regioesTroca = [
    { label: "NTSC-U", value: "NTSCU" },
    { label: "NTSC-J", value: "NTSCJ" },
    { label: "PAL-A", value: "PALA" },
    { label: "PAL-B", value: "PALB" },
    { label: "PAL", value: "PAL" },
  ];

  const idiomas = [
    { label: "Inglês", value: "Inglês" },
    { label: "Português", value: "Português" },
  ];

  const StepHeader = ({ title, subtitle, step }) => {
    const steps = [1, 2, 3, 4, 5]; // Step 6 não é contabilizado

    if (isMobile) {
      return null; // Mobile uses ProgressIndicator component
    }

    return (
      <div className="bg-[#38307C] text-white p-4 rounded-t-sm text-center">
        <h2 className="text-lg">{title}</h2>
        <p className="text-sm">{subtitle}</p>

        <div className="flex items-center justify-center mt-3 w-full max-w-3xl mx-auto">
          {steps.map((i, idx) => (
            <React.Fragment key={i}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold 
                  ${
                    i <= step
                      ? "bg-[#211C49] text-white"
                      : "bg-[#DDDDF3] text-[#38307C]"
                  }`}
              >
                {i <= step ? <Check className="w-4 h-4" /> : i}
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-1 bg-[#DDDDF3] relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#211C49] transition-all duration-500 ease-in-out"
                    style={{
                      width: i < step + 1 ? "100%" : "0%",
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Head title="Cadastrar anúncio - Venda e troca" />
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
              title="Informações Básicas - Venda e Troca"
              subtitle="Comece preenchendo as informações básicas sobre o anúncio de venda e troca"
              step={step - 1}
            />
            <div className={`${isMobile ? "p-4" : "p-6"} space-y-4`}>
              <div>
                <label className="block mb-1 text-sm font-bold">
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
                <label className="block mb-1 text-sm font-bold">
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
                <label className="block mb-1 text-sm font-bold">
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
                <label className="block mb-1 text-sm font-bold">
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
            />
            <div className={`${isMobile ? "p-4" : "p-6"} space-y-4`}>
              <div>
                <label className="block mb-1 text-sm font-bold">Jogo</label>
                <CustomSelect
                  options={jogos}
                  value={jogos.find((o) => o.value === formData.jogo)}
                  onChange={(opt) => handleSelectChange("jogo", opt.value)}
                  placeholder="Selecione o jogo do cartucho"
                  required={true}
                  showValidation={showValidation.step2}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Tipo de Cartucho{" "}
                  <InfoTooltip
                    message={
                      <>
                        Retro: cartucho original da época do console.
                        <br />
                        Repro: cópia não oficial modificada ou traduzida.
                      </>
                    }
                  />
                </label>
                <CustomSelect
                  options={tiposCartucho}
                  value={tiposCartucho.find(
                    (o) => o.value === formData.tipoCartucho
                  )}
                  onChange={(opt) =>
                    handleSelectChange("tipoCartucho", opt.value)
                  }
                  placeholder="Selecione o tipo de cartucho"
                  required={true}
                  showValidation={showValidation.step2}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
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
                  placeholder="Selecione o estado de preservação"
                  required={true}
                  showValidation={showValidation.step2}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Região do Cartucho
                </label>
                <CustomSelect
                  options={regioes}
                  value={regioes.find((o) => o.value === formData.regiao)}
                  onChange={(opt) => handleSelectChange("regiao", opt.value)}
                  placeholder="Selecione a região do cartucho"
                  required={true}
                  showValidation={showValidation.step2}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Idiomas do Áudio
                </label>
                <CustomSelect
                  options={idiomas}
                  value={idiomas.find((o) => o.value === formData.idiomaAudio)}
                  onChange={(opt) =>
                    handleSelectChange("idiomaAudio", opt.value)
                  }
                  placeholder="Selecione o idioma do áudio"
                  required={true}
                  showValidation={showValidation.step2}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Idiomas da Legenda
                </label>
                <CustomSelect
                  options={idiomas}
                  value={idiomas.find(
                    (o) => o.value === formData.idiomaLegenda
                  )}
                  onChange={(opt) =>
                    handleSelectChange("idiomaLegenda", opt.value)
                  }
                  placeholder="Selecione o idioma da legenda"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Idiomas da Interface
                </label>
                <CustomSelect
                  options={idiomas}
                  value={idiomas.find(
                    (o) => o.value === formData.idiomaInterface
                  )}
                  onChange={(opt) =>
                    handleSelectChange("idiomaInterface", opt.value)
                  }
                  placeholder="Selecione o idioma da interface"
                />
              </div>

              <p className="text-sm">
                Acesse o guia{" "}
                <a href="#" className="text-blue-600 underline">
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
              title="Condições de Troca"
              subtitle="Especifique as condições para a troca"
              step={step - 1}
            />
            <div className={`${isMobile ? "p-4" : "p-6"} space-y-4`}>
              <div>
                <label className="block mb-1 text-sm font-bold">Jogo</label>
                <CustomSelect
                  options={jogos}
                  value={jogos.find((o) => o.value === formData.jogosTroca)}
                  onChange={(opt) =>
                    handleSelectChange("jogosTroca", opt.value)
                  }
                  placeholder="Selecione o jogo desejado para troca"
                  required={true}
                  showValidation={showValidation.step3}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Tipo de Cartucho{" "}
                  <InfoTooltip
                    message={
                      <>
                        Retro: cartucho original da época do console.
                        <br />
                        Repro: cópia não oficial modificada ou traduzida.
                      </>
                    }
                  />
                </label>
                <CustomSelect
                  options={tiposCartucho}
                  value={tiposCartucho.find(
                    (o) => o.value === formData.tiposTroca
                  )}
                  onChange={(opt) =>
                    handleSelectChange("tiposTroca", opt.value)
                  }
                  placeholder="Selecione o tipo de cartucho aceito"
                  required={true}
                  showValidation={showValidation.step3}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Estado de Preservação
                </label>
                <CustomSelect
                  options={estados}
                  value={estados.find((o) => o.value === formData.estadosTroca)}
                  onChange={(opt) =>
                    handleSelectChange("estadosTroca", opt.value)
                  }
                  placeholder="Selecione o estado mínimo aceito"
                  required={true}
                  showValidation={showValidation.step3}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Região do Cartucho
                </label>
                <CustomSelect
                  options={regioesTroca}
                  value={regioesTroca.find(
                    (o) => o.value === formData.regioesTroca
                  )}
                  onChange={(opt) =>
                    handleSelectChange("regioesTroca", opt.value)
                  }
                  placeholder="Selecione a região aceita para troca"
                  required={true}
                  showValidation={showValidation.step3}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Idiomas do Áudio
                </label>
                <CustomSelect
                  options={idiomas}
                  value={idiomas.find(
                    (o) => o.value === formData.idiomasAudioTroca
                  )}
                  onChange={(opt) =>
                    handleSelectChange("idiomasAudioTroca", opt.value)
                  }
                  placeholder="Selecione o idioma de áudio aceito"
                  required={true}
                  showValidation={showValidation.step3}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Idiomas da Legenda
                </label>
                <CustomSelect
                  options={idiomas}
                  value={idiomas.find(
                    (o) => o.value === formData.idiomasLegendaTroca
                  )}
                  onChange={(opt) =>
                    handleSelectChange("idiomasLegendaTroca", opt.value)
                  }
                  placeholder="Selecione o idioma de legenda aceito"
                  required={true}
                  showValidation={showValidation.step3}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-bold">
                  Idiomas da Interface
                </label>
                <CustomSelect
                  options={idiomas}
                  value={idiomas.find(
                    (o) => o.value === formData.idiomasInterfaceTroca
                  )}
                  onChange={(opt) =>
                    handleSelectChange("idiomasInterfaceTroca", opt.value)
                  }
                  placeholder="Selecione o idioma de interface aceito"
                  required={true}
                  showValidation={showValidation.step3}
                />
              </div>
            </div>
          </>
        )}
        {/* STEP 4 */}
        {step === 4 && (
          <>
            <StepHeader
              title="Imagens e Vídeos"
              subtitle="Nós já estamos finalizando, envie fotos e vídeos do seu cartucho para venda"
              step={step - 1}
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
                              className="absolute top-2 right-2 w-6 h-6 text-[#483D9E] flex items-center justify-center text-2xl hover:text-[#211C49] transition-colors font-bold"
                              title="Remover imagem do anúncio de venda"
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
        {/* STEP 5 */}
        {step === 5 && (
          <>
            <StepHeader
              title="Adicionar Variações"
              subtitle="Tem mais de um cartucho do mesmo jogo para vender?"
              step={4}
            />
            <div className={`${isMobile ? "p-4" : "p-6"} space-y-6`}>
              {/* Lista de variações existentes - sempre visível */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
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

                {variations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma variação criada ainda.</p>
                    <p className="text-sm">
                      Clique em "Adicionar nova variação" para começar.
                    </p>
                  </div>
                ) : (
                  variations.map((variation, index) => (
                    <div
                      key={variation.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Cabeçalho roxo claro */}
                      <div className="bg-[#EDECF7] px-4 py-3 flex items-center justify-between">
                        <span className="font-medium text-gray-800">
                          Variação {index + 1}
                        </span>
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      </div>

                      {/* Conteúdo da variação */}
                      <div className="bg-white p-4 border-x-8 border-[#EDECF7] border-b-8">
                        <div className="flex items-start space-x-4">
                          {/* Imagem da variação ou placeholder */}
                          <div className="w-16 h-16 rounded flex-shrink-0 overflow-hidden">
                            {variation.imagens && variation.imagens[0] ? (
                              <img
                                src={URL.createObjectURL(variation.imagens[0])}
                                alt={`Imagem da variação de venda ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded"></div>
                            )}
                          </div>

                          {/* Informações do produto */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {variation.titulo} - {variation.descricao}
                            </p>
                          </div>

                          {/* Ícones de ação */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                              onClick={() => handleEditVariation(variation)}
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteVariation(variation.id)
                              }
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Botão para adicionar nova variação ou formulário */}
              {!showVariationForm ? (
                <button
                  onClick={() => setShowVariationForm(true)}
                  className="w-full border-2 border-dashed border-purple-400 p-6 rounded-lg text-purple-600 hover:bg-purple-50 hover:border-purple-600 transition-colors"
                >
                  + Adicionar nova variação
                </button>
              ) : (
                <div className="bg-[#EDECF7] border border-gray-300 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {editingVariationId
                        ? "Editar Variação"
                        : `Variação ${variations.length + 1}`}
                    </h3>

                    <button
                      onClick={() => {
                        setShowVariationForm(false);
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
                          // Condições de troca
                          jogosTroca: "",
                          tiposTroca: "",
                          estadosTroca: "",
                          regioesTroca: "",
                          idiomasAudioTroca: "",
                          idiomasLegendaTroca: "",
                          idiomasInterfaceTroca: "",
                        });
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                      Detalhes do anúncio de venda
                    </h4>
                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                        Título do Anúncio:
                      </label>
                      <input
                        type="text"
                        name="titulo"
                        value={variationData.titulo}
                        onChange={handleVariationInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex: Troco Cartucho Super Mario Bros Usado - Repro"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
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
                          placeholder="Retrô"
                          required={true}
                          showValidation={showValidation.step5}
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
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
                          placeholder="Seminovo"
                          required={true}
                          showValidation={showValidation.step5}
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                        Região do Cartucho:
                      </label>
                      <div className="flex-1">
                        <CustomSelect
                          options={regioes}
                          value={regioes.find(
                            (o) => o.value === variationData.regiao
                          )}
                          onChange={(opt) =>
                            handleVariationSelectChange("regiao", opt.value)
                          }
                          placeholder="EUA"
                          required={true}
                          showValidation={showValidation.step5}
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                        Idioma da Audio:
                      </label>
                      <div className="flex-1">
                        <CustomSelect
                          options={idiomas}
                          value={idiomas.find(
                            (o) => o.value === variationData.idiomaAudio
                          )}
                          onChange={(opt) =>
                            handleVariationSelectChange(
                              "idiomaAudio",
                              opt.value
                            )
                          }
                          placeholder="Inglês"
                          required={true}
                          showValidation={showValidation.step5}
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                        Idioma da Legenda:
                      </label>
                      <div className="flex-1">
                        <CustomSelect
                          options={idiomas}
                          value={idiomas.find(
                            (o) => o.value === variationData.idiomaLegenda
                          )}
                          onChange={(opt) =>
                            handleVariationSelectChange(
                              "idiomaLegenda",
                              opt.value
                            )
                          }
                          placeholder="Inglês"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                        Idioma da Interface:
                      </label>
                      <div className="flex-1">
                        <CustomSelect
                          options={idiomas}
                          value={idiomas.find(
                            (o) => o.value === variationData.idiomaInterface
                          )}
                          onChange={(opt) =>
                            handleVariationSelectChange(
                              "idiomaInterface",
                              opt.value
                            )
                          }
                          placeholder="Inglês"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2 text-end pr-2">
                        Estoque Disponível:
                      </label>
                      <input
                        type="number"
                        name="estoque"
                        value={variationData.estoque}
                        placeholder="01"
                        onChange={handleVariationInputChange}
                        className={`flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          showValidation.step5 && !variationData.estoque
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        min="1"
                      />
                      {showValidation.step5 && !variationData.estoque && (
                        <p className="text-red-500 text-xs mt-1">
                          *Campo obrigatório
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
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
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                        Descrição:
                      </label>
                      <input
                        type="text"
                        name="descricao"
                        value={variationData.descricao}
                        placeholder="Descrição"
                        onChange={handleVariationInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-start">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2 pt-2">
                        Imagens e Vídeos:
                      </label>
                      <div className="flex-1">
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(4)].map((_, i) => {
                            const hasImage = variationData.imagens[i];
                            return (
                              <div key={i} className="relative">
                                {hasImage ? (
                                  // Botão com imagem (não clicável)
                                  <div className="aspect-square border-2 border-solid border-purple-400 rounded overflow-hidden bg-gray-100">
                                    <img
                                      src={URL.createObjectURL(hasImage)}
                                      alt={`Imagem da variação de venda ${
                                        i + 1
                                      }`}
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      onClick={() => removeVariationImage(i)}
                                      className="absolute top-1 right-1 w-5 h-5 text-[#483D9E] flex items-center justify-center text-lg hover:text-[#211C49] transition-colors font-bold shadow-sm"
                                      title="Remover imagem da variação de venda"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  // Botão vazio (clicável)
                                  <label className="aspect-square bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
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
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Condições de Troca */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                        Condições de Troca
                      </h4>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                            Jogos:
                          </label>
                          <div className="flex-1">
                            <CustomSelect
                              options={jogos}
                              value={jogos.find(
                                (o) => o.value === variationData.jogosTroca
                              )}
                              onChange={(opt) =>
                                handleVariationSelectChange(
                                  "jogosTroca",
                                  opt.value
                                )
                              }
                              placeholder="Selecione o jogo aceito"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                            Tipo de Cartucho:
                          </label>
                          <div className="flex-1">
                            <CustomSelect
                              options={tiposCartucho}
                              value={tiposCartucho.find(
                                (o) => o.value === variationData.tiposTroca
                              )}
                              onChange={(opt) =>
                                handleVariationSelectChange(
                                  "tiposTroca",
                                  opt.value
                                )
                              }
                              placeholder="Selecione o tipo aceito"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                            Estado de Preservação:
                          </label>
                          <div className="flex-1">
                            <CustomSelect
                              options={estados}
                              value={estados.find(
                                (o) => o.value === variationData.estadosTroca
                              )}
                              onChange={(opt) =>
                                handleVariationSelectChange(
                                  "estadosTroca",
                                  opt.value
                                )
                              }
                              placeholder="Selecione o estado mínimo"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                            Região do Cartucho:
                          </label>
                          <div className="flex-1">
                            <CustomSelect
                              options={regioesTroca}
                              value={regioesTroca.find(
                                (o) => o.value === variationData.regioesTroca
                              )}
                              onChange={(opt) =>
                                handleVariationSelectChange(
                                  "regioesTroca",
                                  opt.value
                                )
                              }
                              placeholder="Selecione as regiões aceitas"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                            Idiomas de Áudio:
                          </label>
                          <div className="flex-1">
                            <CustomSelect
                              options={idiomas}
                              value={idiomas.find(
                                (o) =>
                                  o.value === variationData.idiomasAudioTroca
                              )}
                              onChange={(opt) =>
                                handleVariationSelectChange(
                                  "idiomasAudioTroca",
                                  opt.value
                                )
                              }
                              placeholder="Selecione os idiomas aceitos"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                            Idiomas de Legenda Aceitos:
                          </label>
                          <div className="flex-1">
                            <CustomSelect
                              options={idiomas}
                              value={idiomas.find(
                                (o) =>
                                  o.value === variationData.idiomasLegendaTroca
                              )}
                              onChange={(opt) =>
                                handleVariationSelectChange(
                                  "idiomasLegendaTroca",
                                  opt.value
                                )
                              }
                              placeholder="Selecione os idiomas aceitos"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 text-end pr-2">
                            Idiomas de Interface Aceitos:
                          </label>
                          <div className="flex-1">
                            <CustomSelect
                              options={idiomas}
                              value={idiomas.find(
                                (o) =>
                                  o.value ===
                                  variationData.idiomasInterfaceTroca
                              )}
                              onChange={(opt) =>
                                handleVariationSelectChange(
                                  "idiomasInterfaceTroca",
                                  opt.value
                                )
                              }
                              placeholder="Selecione os idiomas aceitos"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <button
                      onClick={() => {
                        setShowVariationForm(false);
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
                          // Condições de troca
                          jogosTroca: "",
                          tiposTroca: "",
                          estadosTroca: "",
                          regioesTroca: "",
                          idiomasAudioTroca: "",
                          idiomasLegendaTroca: "",
                          idiomasInterfaceTroca: "",
                        });
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <ConfirmButton onClick={handleSaveVariation}>
                      Confirmar
                    </ConfirmButton>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {/* STEP 6 - Publicar Anúncio */}
        {step === 6 && (
          <>
            <StepHeader title="Publicar Anúncio" subtitle="" step={6} />
            <div className="p-8 text-center">
              {/* Mensagem central */}
              <p className="text-black font- text-lg mb-8 max-w-2xl mx-auto">
                Você está prestes a publicar o seu anúncio de venda, revise
                todas as informações, e se quiser, ainda é possível fazer
                alterações
              </p>
              <div className="flex items-center justify-center gap-4">
                <img src="../public/computador.svg" alt="" />
                {/* Botões */}
                <div className="space-y-4">
                  <button
                    onClick={handleFinish}
                    disabled={!checkboxConfirmed}
                    className="px-24 py-3 bg-[#38307C] text-white rounded-lg hover:bg-[#2A1F5C] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#38307C]"
                  >
                    Publicar
                  </button>
                  <br />
                  <button
                    onClick={() => setStep(7)}
                    className="px-16 py-3 bg-[#DDDDF3] text-[#38307C] rounded-lg hover:bg-[#C8C8E8] transition-colors font-medium"
                  >
                    Revisar Anúncio
                  </button>
                </div>
              </div>

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

        {/* STEP 7 - Revisão do Anúncio */}
        {step === 7 && (
          <>
            <StepHeader
              title="Revisar Anúncio"
              subtitle="Confirme se todas as informações estão corretas"
              step={7}
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
                    <div className={`${isMobile ? "p-4" : "p-6"} space-y-6`}>
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
                          {formData.tipoCartucho || "Não informado"}
                        </p>
                      </div>

                      {/* Jogo */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Jogo
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.jogo || "Não informado"}
                        </p>
                      </div>

                      {/* Estado de Preservação */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Estado de Preservação
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.estadoPreservacao || "Não informado"}
                        </p>
                      </div>

                      {/* Região do Cartucho */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Região do Cartucho
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.regiao || "Não informado"}
                        </p>
                      </div>

                      {/* Idiomas do Audio */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Idiomas do Audio
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.idiomaAudio || "Não informado"}
                        </p>
                      </div>

                      {/* Idiomas da Legenda */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Idiomas da Legenda
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.idiomaLegenda || "Não informado"}
                        </p>
                      </div>

                      {/* Idiomas da Interface */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">
                          Idiomas da Interface
                        </label>
                        <p className="text-gray-800 font-medium">
                          {formData.idiomaInterface || "Não informado"}
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
                          Venda e Troca
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
                        <p className="text-gray-800 font-medium">R$ 80,00</p>
                      </div>

                      {/* Condições de Troca */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-500">
                          Condições de Troca
                        </label>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Jogos
                            </label>
                            <p className="text-gray-800 font-medium">
                              {formData.jogosTroca || "Nome do Jogo"}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Tipo de Cartucho Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {formData.tiposTroca || "Não informado"}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Estado Mínimo Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {formData.estadosTroca || "Não informado"}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Região Aceita
                            </label>
                            <p className="text-gray-800 font-medium">
                              {formData.regioesTroca || "Não informado"}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Idioma de Áudio Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {formData.idiomasAudioTroca || "Não informado"}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Idioma de Legenda Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {formData.idiomasLegendaTroca || "Não informado"}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Idioma de Interface Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {formData.idiomasInterfaceTroca ||
                                "Não informado"}
                            </p>
                          </div>
                        </div>
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
                              {variation.tipoCartucho || "N/A"} -{" "}
                              {variation.estadoPreservacao || "N/A"} -{" "}
                              {variation.regiao || "N/A"} -{" "}
                              {variation.idiomaAudio || "N/A"}
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
                            {variation.tipoCartucho || "Não informado"}
                          </p>
                        </div>

                        {/* Jogo */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Jogo
                          </label>
                          <p className="text-gray-800 font-medium">
                            {variation.jogo || "Não informado"}
                          </p>
                        </div>

                        {/* Estado de Preservação */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Estado de Preservação
                          </label>
                          <p className="text-gray-800 font-medium">
                            {variation.estadoPreservacao || "Não informado"}
                          </p>
                        </div>

                        {/* Região */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Região
                          </label>
                          <p className="text-gray-800 font-medium">
                            {variation.regiao || "Não informado"}
                          </p>
                        </div>

                        {/* Idiomas */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Idiomas do Áudio
                          </label>
                          <p className="text-gray-800 font-medium">
                            {variation.idiomaAudio || "Não informado"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Idiomas da Legenda
                          </label>
                          <p className="text-gray-800 font-medium">
                            {variation.idiomaLegenda || "Não informado"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">
                            Idiomas da Interface
                          </label>
                          <p className="text-gray-800 font-medium">
                            {variation.idiomaInterface || "Não informado"}
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
                              R${" "}
                              {variation.preco.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                              })}
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
        <div className="flex justify-end p-4 bg-gray-50 border-t gap-1">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 rounded-lg bg-[#DDDDF3] disabled:opacity-50"
          >
            Cancelar
          </button>
          {step !== 6 && (
            <ConfirmButton
              onClick={() => {
                if (step === 7) {
                  setStep(6);
                } else {
                  nextStep();
                }
              }}
            >
              Confirmar
            </ConfirmButton>
          )}
        </div>
      </div>
    </>
  );
};

export default MultiPartFormSaleAndTrade;
