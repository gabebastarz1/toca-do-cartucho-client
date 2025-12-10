import React, { useState, useEffect, useRef } from "react";
import { Camera, ChevronDown, Edit, Trash2, BookOpen } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import InfoTooltip from "./InfoToolTip";
import CustomSelect from "./ui/CustomSelect";
import CustomMultiSelect from "./ui/CustomMultiSelect";
import ConfirmButton from "./ui/ConfirmButton";
import ModalAlert from "./ui/ModalAlert";
import CustomCheckbox from "./ui/CustomCheckbox";
import Head from "./Head";
import StepHeader from "./StepHeader";
import { useIsMobile } from "../hooks/useIsMobile";
import { useAdvertisementCreation } from "../hooks/useAdvertisementCreation";
import { useReferenceData } from "../hooks/useReferenceData";
import { useGameSpecificData } from "../hooks/useGameSpecificData";
import { api } from "../services/api";
import {
  validateFormData,
  validateVariations,
} from "../utils/formDataConverter";

const stepsArray = [1, 2, 3, 4, 5];

const MultiPartForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [imageError, setImageError] = useState<string>("");

  // Hook para dados de referência

  const {
    preservationStates,
    cartridgeTypes,
    regions,
    languages,
    getGameOptions,
    getPreservationStateOptions,
    getCartridgeTypeOptions,
    getGameById,
    getPreservationStateById,
    getCartridgeTypeById,
    getRegionById,
    getLanguageById,
  } = useReferenceData();

  // Hooks para dados específicos de cada jogo separadamente
  const mainGameData = useGameSpecificData();
  const tradeGameData = useGameSpecificData();

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
    onError: (error) => {
      console.error("Erro ao criar anúncio:", error);
      // Mostrar erro para o usuário
    },
  });

  //const [showVariationForm, setShowVariationForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [variations, setVariations] = useState([]);
  const [editingVariationId, setEditingVariationId] = useState(null);
  const [checkboxConfirmed, setCheckboxConfirmed] = useState(false);
  const [showMainAd, setShowMainAd] = useState(false);
  const [expandedVariations, setExpandedVariations] = useState({});
  const [showValidation, setShowValidation] = useState({
    step1: false,
    step2: false,
    step5: false,
  });
  const isMobile = useIsMobile();
  // Funções para gerenciar localStorage
  const saveVariationsToStorage = (variationsToSave) => {
    try {
      localStorage.setItem("tcc-variations", JSON.stringify(variationsToSave));
    } catch (error) {
      console.error("Erro ao salvar variações no localStorage:", error);
    }
  };
  const resetAndHideVariationForm = () => {
    setEditingVariationId(null);
    setVariationData({
      titulo: "",
      tipoCartucho: "",
      estadoPreservacao: "",
      regiao: "",
      idiomaAudio: "",
      idiomaLegenda: "",
      idiomaInterface: "",
      preco: "", // Este campo parece não ser usado neste formulário, mas mantendo a estrutura
      estoque: "",
      descricao: "",
      imagens: Array(4).fill(null),
      // Limpar condições de troca também
      jogosTroca: [] as string[],
      tiposTroca: [] as string[],
      estadosTroca: [] as string[],
      regioesTroca: [] as string[],
      idiomasAudioTroca: [] as string[],
      idiomasLegendaTroca: [] as string[],
      idiomasInterfaceTroca: [] as string[],
    });
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

    jogosTroca: [] as string[],
    tiposTroca: [] as string[],
    estadosTroca: [] as string[],
    regioesTroca: [] as string[],
    idiomasAudioTroca: [] as string[],
    idiomasLegendaTroca: [] as string[],
    idiomasInterfaceTroca: [] as string[],
    condicoes: "Troca",

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
    jogosTroca: [] as string[],
    tiposTroca: [] as string[],
    estadosTroca: [] as string[],
    regioesTroca: [] as string[],
    idiomasAudioTroca: [] as string[],
    idiomasLegendaTroca: [] as string[],
    idiomasInterfaceTroca: [] as string[],
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
        mainGameData.fetchGameData(parseInt(value));
      } else {
        mainGameData.clearData();
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectChange = async (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));

    // Quando jogos de troca são selecionados, buscar dados e priorizar o jogo com mais opções
    if (name === "jogosTroca") {
      if (values.length > 0) {
        try {
          // Buscar dados de todos os jogos selecionados
          const gameIds = values
            .map((v) => parseInt(v))
            .filter((id) => !isNaN(id));
          const allGamesData = await Promise.all(
            gameIds.map(async (gameId) => {
              try {
                const [gameLocalizationsResponse, languageSupportsResponse] =
                  await Promise.all([
                    api.get("/api/game-localizations", {
                      params: { GameId: gameId },
                    }),
                    api.get("/api/language-supports", {
                      params: { GameId: gameId },
                    }),
                  ]);

                const gameLocalizations = gameLocalizationsResponse.data || [];
                const languageSupports = languageSupportsResponse.data || [];

                // Extrair regiões únicas
                const regions = new Set(
                  gameLocalizations
                    .map((gl: any) => gl.region?.id)
                    .filter(Boolean)
                );

                // Contar idiomas por tipo
                const audioLanguages = new Set(
                  languageSupports
                    .filter(
                      (ls: any) =>
                        ls.languageSupportType?.name?.toLowerCase() === "audio"
                    )
                    .map((ls: any) => ls.language?.id)
                    .filter(Boolean)
                );
                const subtitleLanguages = new Set(
                  languageSupports
                    .filter(
                      (ls: any) =>
                        ls.languageSupportType?.name?.toLowerCase() ===
                          "legenda" ||
                        ls.languageSupportType?.name?.toLowerCase() ===
                          "subtitle"
                    )
                    .map((ls: any) => ls.language?.id)
                    .filter(Boolean)
                );
                const interfaceLanguages = new Set(
                  languageSupports
                    .filter(
                      (ls: any) =>
                        ls.languageSupportType?.name?.toLowerCase() ===
                        "interface"
                    )
                    .map((ls: any) => ls.language?.id)
                    .filter(Boolean)
                );

                return {
                  gameId,
                  gameLocalizations,
                  languageSupports,
                  regionCount: regions.size,
                  audioCount: audioLanguages.size,
                  subtitleCount: subtitleLanguages.size,
                  interfaceCount: interfaceLanguages.size,
                  totalOptions:
                    regions.size +
                    audioLanguages.size +
                    subtitleLanguages.size +
                    interfaceLanguages.size,
                };
              } catch (error) {
                console.error(`Erro ao buscar dados do jogo ${gameId}:`, error);
                return {
                  gameId,
                  gameLocalizations: [],
                  languageSupports: [],
                  regionCount: 0,
                  audioCount: 0,
                  subtitleCount: 0,
                  interfaceCount: 0,
                  totalOptions: 0,
                };
              }
            })
          );

          // Encontrar o jogo com mais opções totais
          const bestGame = allGamesData.reduce((best, current) => {
            const bestTotal = "totalOptions" in best ? best.totalOptions : 0;
            const currentTotal =
              "totalOptions" in current ? current.totalOptions : 0;
            return currentTotal > bestTotal ? current : best;
          }, allGamesData[0] || { gameId: 0, gameLocalizations: [], languageSupports: [], totalOptions: 0 });

          // Usar os dados do jogo com mais opções
          if (bestGame.gameId > 0) {
            tradeGameData.fetchGameData(bestGame.gameId);
          } else if (allGamesData.length > 0) {
            // Fallback: usar o primeiro jogo se não conseguir determinar o melhor
            tradeGameData.fetchGameData(allGamesData[0].gameId);
          }
        } catch (error) {
          console.error("Erro ao buscar dados dos jogos:", error);
          // Fallback: usar o primeiro jogo
          if (values.length > 0) {
            tradeGameData.fetchGameData(parseInt(values[0]));
          }
        }
      } else {
        // Se nenhum jogo de troca estiver selecionado, limpar os dados específicos
        tradeGameData.clearData();
      }
    }
  };

  const handleVariationSelectChange = (name: string, value: string) => {
    setVariationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariationMultiSelectChange = (name: string, values: string[]) => {
    setVariationData((prev) => ({ ...prev, [name]: values }));
  };

  const handleVariationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Remover zeros à esquerda para campos de estoque
    if (name === "estoque" && value) {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue)) {
        setVariationData((prev) => ({
          ...prev,
          [name]: numericValue.toString(),
        }));
        return;
      }
    }

    setVariationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Remover zeros à esquerda para campos de estoque
    if (name === "estoque" && value) {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue)) {
        setFormData((prev) => ({ ...prev, [name]: numericValue.toString() }));
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

      if (!formData.titulo || !formData.estoque) {
        return; // Não prosseguir se campos obrigatórios estiverem vazios
      }
    } else if (step === 2) {
      // Ativar validação apenas do step 2
      setShowValidation((prev) => ({ ...prev, step2: true }));

      // Verificar se campos obrigatórios estão preenchidos
      const hasRequiredFields =
        formData.jogo && formData.tipoCartucho && formData.estadoPreservacao;

      // Verificar campos condicionais (apenas se estão visíveis)
      const hasRegionField =
        formData.jogo && mainGameData.getAvailableRegions().length > 0;
      const hasAudioField =
        formData.jogo && mainGameData.getAvailableAudioLanguages().length > 0;

      const hasConditionalFields =
        (!hasRegionField || formData.regiao) &&
        (!hasAudioField || formData.idiomaAudio);

      if (!hasRequiredFields || !hasConditionalFields) {
        return; // Não prosseguir se campos obrigatórios estiverem vazios
      }
    } else if (step === 3) {
      // Ativar validação apenas do step 3
      setShowValidation((prev) => ({ ...prev, step3: true }));

      // Verificar se campos obrigatórios estão preenchidos (arrays não vazios)
      const hasRequiredFields =
        Array.isArray(formData.jogosTroca) &&
        formData.jogosTroca.length > 0 &&
        Array.isArray(formData.tiposTroca) &&
        formData.tiposTroca.length > 0 &&
        Array.isArray(formData.estadosTroca) &&
        formData.estadosTroca.length > 0;

      // Verificar campos condicionais da troca (apenas se estão visíveis)
      const hasRegionFieldTroca =
        Array.isArray(formData.jogosTroca) &&
        formData.jogosTroca.length > 0 &&
        tradeGameData.getAvailableRegions().length > 0;
      const hasAudioFieldTroca =
        Array.isArray(formData.jogosTroca) &&
        formData.jogosTroca.length > 0 &&
        tradeGameData.getAvailableAudioLanguages().length > 0;
      const hasSubtitleFieldTroca =
        Array.isArray(formData.jogosTroca) &&
        formData.jogosTroca.length > 0 &&
        tradeGameData.getAvailableSubtitleLanguages().length > 0;
      const hasInterfaceFieldTroca =
        Array.isArray(formData.jogosTroca) &&
        formData.jogosTroca.length > 0 &&
        tradeGameData.getAvailableInterfaceLanguages().length > 0;

      const hasConditionalFieldsTroca =
        (!hasRegionFieldTroca ||
          (Array.isArray(formData.regioesTroca) &&
            formData.regioesTroca.length > 0)) &&
        (!hasAudioFieldTroca ||
          (Array.isArray(formData.idiomasAudioTroca) &&
            formData.idiomasAudioTroca.length > 0)) &&
        (!hasSubtitleFieldTroca ||
          (Array.isArray(formData.idiomasLegendaTroca) &&
            formData.idiomasLegendaTroca.length > 0)) &&
        (!hasInterfaceFieldTroca ||
          (Array.isArray(formData.idiomasInterfaceTroca) &&
            formData.idiomasInterfaceTroca.length > 0));

      if (!hasRequiredFields || !hasConditionalFieldsTroca) {
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

    const hasRequiredFields =
      variationData.tipoCartucho &&
      variationData.estadoPreservacao &&
      variationData.estoque;

    // Verificar campos condicionais da variação principal (apenas se estão visíveis)
    const hasRegionField =
      formData.jogo && mainGameData.getAvailableRegions().length > 0;
    const hasAudioField =
      formData.jogo && mainGameData.getAvailableAudioLanguages().length > 0;
    const hasSubtitleField =
      formData.jogo && mainGameData.getAvailableSubtitleLanguages().length > 0;
    const hasInterfaceField =
      formData.jogo && mainGameData.getAvailableInterfaceLanguages().length > 0;

    // Verificar campos condicionais da variação de troca (apenas se estão visíveis)
    const hasRegionFieldTroca =
      Array.isArray(variationData.jogosTroca) &&
      variationData.jogosTroca.length > 0 &&
      tradeGameData.getAvailableRegions().length > 0;
    const hasAudioFieldTroca =
      Array.isArray(variationData.jogosTroca) &&
      variationData.jogosTroca.length > 0 &&
      tradeGameData.getAvailableAudioLanguages().length > 0;
    const hasSubtitleFieldTroca =
      Array.isArray(variationData.jogosTroca) &&
      variationData.jogosTroca.length > 0 &&
      tradeGameData.getAvailableSubtitleLanguages().length > 0;
    const hasInterfaceFieldTroca =
      Array.isArray(variationData.jogosTroca) &&
      variationData.jogosTroca.length > 0 &&
      tradeGameData.getAvailableInterfaceLanguages().length > 0;

    const hasConditionalFields =
      (!hasRegionField || variationData.regiao) &&
      (!hasAudioField || variationData.idiomaAudio) &&
      (!hasSubtitleField || variationData.idiomaLegenda) &&
      (!hasInterfaceField || variationData.idiomaInterface) &&
      (!hasRegionFieldTroca ||
        (Array.isArray(variationData.regioesTroca) &&
          variationData.regioesTroca.length > 0)) &&
      (!hasAudioFieldTroca ||
        (Array.isArray(variationData.idiomasAudioTroca) &&
          variationData.idiomasAudioTroca.length > 0)) &&
      (!hasSubtitleFieldTroca ||
        (Array.isArray(variationData.idiomasLegendaTroca) &&
          variationData.idiomasLegendaTroca.length > 0)) &&
      (!hasInterfaceFieldTroca ||
        (Array.isArray(variationData.idiomasInterfaceTroca) &&
          variationData.idiomasInterfaceTroca.length > 0));

    const isDataValid = hasRequiredFields && hasConditionalFields;

    if (isDataValid) {
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
          // Sua lógica para título e descrição padrão
          titulo:
            variationData.titulo || formData.titulo || "Variação de Anúncio",
          descricao:
            variationData.descricao ||
            `Variação de ${getCartridgeTypeName(variationData.tipoCartucho)}`,
        };
        setVariations((prev) => [...prev, newVariation]);
      }
      resetAndHideVariationForm();
    }
  };

  const handleDeleteVariation = (id) => {
    setVariations((prev) => prev.filter((v) => v.id !== id));
  };

  const handleEditVariation = (variation) => {
    setVariationData(variation);
    setEditingVariationId(variation.id);
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
      ...mainGameData.getAvailableAudioLanguages(),
      ...mainGameData.getAvailableSubtitleLanguages(),
      ...mainGameData.getAvailableInterfaceLanguages(),
    ];

    const languageSupport = allLanguageSupports.find(
      (ls) => ls.id === languageSupportIdNum
    );

    return languageSupport?.name || "Não informado";
  };

  // Versões que aceitam arrays para campos de troca
  const getGameNames = (gameIds: string | string[]) => {
    const ids = Array.isArray(gameIds) ? gameIds : [gameIds];
    if (ids.length === 0) return "Não informado";
    return ids.map((id) => getGameName(id)).join(", ");
  };

  const getCartridgeTypeNames = (typeIds: string | string[]) => {
    const ids = Array.isArray(typeIds) ? typeIds : [typeIds];
    if (ids.length === 0) return "Não informado";
    return ids.map((id) => getCartridgeTypeName(id)).join(", ");
  };

  const getPreservationStateNames = (stateIds: string | string[]) => {
    const ids = Array.isArray(stateIds) ? stateIds : [stateIds];
    if (ids.length === 0) return "Não informado";
    return ids.map((id) => getPreservationStateName(id)).join(", ");
  };

  const getRegionNames = (regionIds: string | string[]) => {
    const ids = Array.isArray(regionIds) ? regionIds : [regionIds];
    if (ids.length === 0) return "Não informado";
    return ids.map((id) => getRegionName(id)).join(", ");
  };

  const getLanguageNames = (languageIds: string | string[]) => {
    const ids = Array.isArray(languageIds) ? languageIds : [languageIds];
    if (ids.length === 0) return "Não informado";
    return ids.map((id) => getLanguageName(id)).join(", ");
  };

  return (
    <>
      <Head
        title="Cadastrar anúncio - Apenas Troca"
        iconHref="/Logos/logo-icon.svg"
      />
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
              {formData.jogo &&
              mainGameData.getAvailableRegions().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Região do Cartucho
                  </label>
                  <CustomSelect
                    options={mainGameData.getAvailableRegions().map((r) => ({
                      value: r.id.toString(),
                      label: r.name,
                    }))}
                    value={
                      mainGameData
                        .getAvailableRegions()
                        .find((r) => r.id.toString() === formData.regiao)
                        ? {
                            value: formData.regiao,
                            label:
                              mainGameData
                                .getAvailableRegions()
                                .find(
                                  (r) => r.id.toString() === formData.regiao
                                )?.name || "",
                          }
                        : null
                    }
                    onChange={(opt) => handleSelectChange("regiao", opt.value)}
                    required={true}
                    showValidation={showValidation.step2}
                  />
                </div>
              ) : null}
              {/* Mostrar campo de idioma do áudio apenas se um jogo está selecionado E há idiomas disponíveis */}
              {formData.jogo &&
              mainGameData.getAvailableAudioLanguages().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Idioma do Áudio
                  </label>
                  <CustomSelect
                    options={mainGameData
                      .getAvailableAudioLanguages()
                      .map((l) => ({
                        value: l.id.toString(),
                        label: l.name,
                      }))}
                    value={
                      mainGameData
                        .getAvailableAudioLanguages()
                        .find((l) => l.id.toString() === formData.idiomaAudio)
                        ? {
                            value: formData.idiomaAudio,
                            label:
                              mainGameData
                                .getAvailableAudioLanguages()
                                .find(
                                  (l) =>
                                    l.id.toString() === formData.idiomaAudio
                                )?.name || "",
                          }
                        : null
                    }
                    onChange={(opt) =>
                      handleSelectChange("idiomaAudio", opt.value)
                    }
                    required={true}
                    showValidation={showValidation.step2}
                  />
                </div>
              ) : null}
              {/* Mostrar campo de idioma da legenda apenas se um jogo está selecionado E há idiomas disponíveis */}
              {formData.jogo &&
              mainGameData.getAvailableSubtitleLanguages().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Idioma da Legenda
                  </label>
                  <CustomSelect
                    options={mainGameData
                      .getAvailableSubtitleLanguages()
                      .map((l) => ({
                        value: l.id.toString(),
                        label: l.name,
                      }))}
                    value={
                      mainGameData
                        .getAvailableSubtitleLanguages()
                        .find((l) => l.id.toString() === formData.idiomaLegenda)
                        ? {
                            value: formData.idiomaLegenda,
                            label:
                              mainGameData
                                .getAvailableSubtitleLanguages()
                                .find(
                                  (l) =>
                                    l.id.toString() === formData.idiomaLegenda
                                )?.name || "",
                          }
                        : null
                    }
                    onChange={(opt) =>
                      handleSelectChange("idiomaLegenda", opt.value)
                    }
                    required={true}
                    showValidation={showValidation.step2}
                  />
                </div>
              ) : null}
              {/* Mostrar campo de idioma da interface apenas se um jogo está selecionado E há idiomas disponíveis */}
              {formData.jogo &&
              mainGameData.getAvailableInterfaceLanguages().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Idioma da Interface
                  </label>
                  <CustomSelect
                    options={mainGameData
                      .getAvailableInterfaceLanguages()
                      .map((l) => ({
                        value: l.id.toString(),
                        label: l.name,
                      }))}
                    value={
                      mainGameData
                        .getAvailableInterfaceLanguages()
                        .find(
                          (l) => l.id.toString() === formData.idiomaInterface
                        )
                        ? {
                            value: formData.idiomaInterface,
                            label:
                              mainGameData
                                .getAvailableInterfaceLanguages()
                                .find(
                                  (l) =>
                                    l.id.toString() === formData.idiomaInterface
                                )?.name || "",
                          }
                        : null
                    }
                    onChange={(opt) =>
                      handleSelectChange("idiomaInterface", opt.value)
                    }
                    required={true}
                    showValidation={showValidation.step2}
                  />
                </div>
              ) : null}
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
              title="Condições de Troca"
              subtitle="Antes de prosseguir, especifique as condições para a troca"
              step={step - 1}
              steps={stepsArray}
              onBack={prevStep}
            />
            <div
              className={`${isMobile ? "p-4 pt-24 px-10" : "p-6"} space-y-4`}
            >
              <div>
                <label className="block mb-1 text-sm font-semibold">
                  Jogos
                </label>
                <CustomMultiSelect
                  options={jogos}
                  value={
                    Array.isArray(formData.jogosTroca)
                      ? formData.jogosTroca
                      : []
                  }
                  onChange={(values) =>
                    handleMultiSelectChange("jogosTroca", values)
                  }
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold">
                  Tipos de Cartucho{" "}
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
                <CustomMultiSelect
                  options={tiposCartucho}
                  value={
                    Array.isArray(formData.tiposTroca)
                      ? formData.tiposTroca
                      : []
                  }
                  onChange={(values) =>
                    handleMultiSelectChange("tiposTroca", values)
                  }
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold">
                  Estados de Preservação
                </label>
                <CustomMultiSelect
                  options={estados}
                  value={
                    Array.isArray(formData.estadosTroca)
                      ? formData.estadosTroca
                      : []
                  }
                  onChange={(values) =>
                    handleMultiSelectChange("estadosTroca", values)
                  }
                />
              </div>
              {/* Mostrar campo de região apenas se um jogo de troca está selecionado E há regiões disponíveis */}
              {Array.isArray(formData.jogosTroca) &&
              formData.jogosTroca.length > 0 &&
              tradeGameData.getAvailableRegions().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Regiões dos Cartuchos
                  </label>
                  <CustomMultiSelect
                    options={tradeGameData.getAvailableRegions().map((r) => ({
                      value: r.id.toString(),
                      label: r.name,
                    }))}
                    value={
                      Array.isArray(formData.regioesTroca)
                        ? formData.regioesTroca
                        : []
                    }
                    onChange={(values) =>
                      handleMultiSelectChange("regioesTroca", values)
                    }
                  />
                </div>
              ) : null}
              {/* Mostrar campo de idioma do áudio apenas se um jogo de troca está selecionado E há idiomas disponíveis */}
              {Array.isArray(formData.jogosTroca) &&
              formData.jogosTroca.length > 0 &&
              tradeGameData.getAvailableAudioLanguages().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Idiomas de Áudio
                  </label>
                  <CustomMultiSelect
                    options={tradeGameData
                      .getAvailableAudioLanguages()
                      .map((l) => ({
                        value: l.id.toString(),
                        label: l.name,
                      }))}
                    value={
                      Array.isArray(formData.idiomasAudioTroca)
                        ? formData.idiomasAudioTroca
                        : []
                    }
                    onChange={(values) =>
                      handleMultiSelectChange("idiomasAudioTroca", values)
                    }
                  />
                </div>
              ) : null}
              {/* Mostrar campo de idioma da legenda apenas se um jogo de troca está selecionado E há idiomas disponíveis */}
              {Array.isArray(formData.jogosTroca) &&
              formData.jogosTroca.length > 0 &&
              tradeGameData.getAvailableSubtitleLanguages().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Idiomas de Legenda
                  </label>
                  <CustomMultiSelect
                    options={tradeGameData
                      .getAvailableSubtitleLanguages()
                      .map((l) => ({
                        value: l.id.toString(),
                        label: l.name,
                      }))}
                    value={
                      Array.isArray(formData.idiomasLegendaTroca)
                        ? formData.idiomasLegendaTroca
                        : []
                    }
                    onChange={(values) =>
                      handleMultiSelectChange("idiomasLegendaTroca", values)
                    }
                  />
                </div>
              ) : null}
              {/* Mostrar campo de idioma da interface apenas se um jogo de troca está selecionado E há idiomas disponíveis */}
              {Array.isArray(formData.jogosTroca) &&
              formData.jogosTroca.length > 0 &&
              tradeGameData.getAvailableInterfaceLanguages().length > 0 ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">
                    Idiomas de Interface
                  </label>
                  <CustomMultiSelect
                    options={tradeGameData
                      .getAvailableInterfaceLanguages()
                      .map((l) => ({
                        value: l.id.toString(),
                        label: l.name,
                      }))}
                    value={
                      Array.isArray(formData.idiomasInterfaceTroca)
                        ? formData.idiomasInterfaceTroca
                        : []
                    }
                    onChange={(values) =>
                      handleMultiSelectChange("idiomasInterfaceTroca", values)
                    }
                  />
                </div>
              ) : null}
            </div>
          </>
        )}
        {/* STEP 4 */}
        {step === 4 && (
          <>
            <StepHeader
              title="Imagens e Vídeos"
              subtitle="Nós já estamos finalizando, envie fotos e vídeos do seu cartucho para troca"
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
                              className="w-full h-full object-contain bg-white"
                            />
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 w-6 h-6 text-[#483D9E] flex items-center justify-center text-2xl hover:text-[#211C49] transition-colors font-semibold"
                              title="Remover imagem"
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
        {/* STEP 5 */}
        {/* STEP 5 - VARIAÇÕES */}
        {step === 5 && (
          <>
            <StepHeader
              title="Adicionar Variações"
              subtitle="Tem mais de um cartucho do mesmo jogo para trocar?"
              step={step - 1}
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
                          isMobile ? "p-4" : "p-6"
                        } space-y-4 animate-fadeIn`}
                      >
                        <div className="flex items-center justify-between border-b pb-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Editando Variação
                          </h3>
                          <button
                            onClick={resetAndHideVariationForm}
                            title="Fechar edição"
                          >
                            <ChevronDown className="w-8 h-8 text-gray-600" />
                          </button>
                        </div>

                        <div className="space-y-3 bg-white p-4 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                            Detalhes da variação
                          </h4>
                          {/* CAMPOS DO FORMULÁRIO */}
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
                              Título:
                            </label>
                            <input
                              type="text"
                              name="titulo"
                              value={variationData.titulo}
                              onChange={handleVariationInputChange}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                              Estado:
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
                          {formData.jogo &&
                          mainGameData.getAvailableRegions().length > 0 ? (
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
                                Região:
                              </label>
                              <div className="flex-1">
                                <CustomSelect
                                  options={mainGameData
                                    .getAvailableRegions()
                                    .map((r) => ({
                                      value: r.id.toString(),
                                      label: r.name,
                                    }))}
                                  value={
                                    mainGameData
                                      .getAvailableRegions()
                                      .find(
                                        (r) =>
                                          r.id.toString() ===
                                          variationData.regiao
                                      )
                                      ? {
                                          value: variationData.regiao,
                                          label:
                                            mainGameData
                                              .getAvailableRegions()
                                              .find(
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
                          mainGameData.getAvailableAudioLanguages().length >
                            0 ? (
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
                                  options={mainGameData
                                    .getAvailableAudioLanguages()
                                    .map((l) => ({
                                      value: l.id.toString(),
                                      label: l.name,
                                    }))}
                                  value={
                                    mainGameData
                                      .getAvailableAudioLanguages()
                                      .find(
                                        (l) =>
                                          l.id.toString() ===
                                          variationData.idiomaAudio
                                      )
                                      ? {
                                          value: variationData.idiomaAudio,
                                          label:
                                            mainGameData
                                              .getAvailableAudioLanguages()
                                              .find(
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
                          mainGameData.getAvailableSubtitleLanguages().length >
                            0 ? (
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
                                  options={mainGameData
                                    .getAvailableSubtitleLanguages()
                                    .map((l) => ({
                                      value: l.id.toString(),
                                      label: l.name,
                                    }))}
                                  value={
                                    mainGameData
                                      .getAvailableSubtitleLanguages()
                                      .find(
                                        (l) =>
                                          l.id.toString() ===
                                          variationData.idiomaLegenda
                                      )
                                      ? {
                                          value: variationData.idiomaLegenda,
                                          label:
                                            mainGameData
                                              .getAvailableSubtitleLanguages()
                                              .find(
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
                          mainGameData.getAvailableInterfaceLanguages().length >
                            0 ? (
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
                                  options={mainGameData
                                    .getAvailableInterfaceLanguages()
                                    .map((l) => ({
                                      value: l.id.toString(),
                                      label: l.name,
                                    }))}
                                  value={
                                    mainGameData
                                      .getAvailableInterfaceLanguages()
                                      .find(
                                        (l) =>
                                          l.id.toString() ===
                                          variationData.idiomaInterface
                                      )
                                      ? {
                                          value: variationData.idiomaInterface,
                                          label:
                                            mainGameData
                                              .getAvailableInterfaceLanguages()
                                              .find(
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
                              Estoque:
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
                              isMobile ? "flex-col gap-2" : "items-start"
                            }`}
                          >
                            <label
                              className={`font-medium text-gray-700 flex-shrink-0 ${
                                isMobile
                                  ? "text-start text-md"
                                  : "text-end text-sm w-40"
                              } pr-2 pt-2`}
                            >
                              Imagens:
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
                                          className="w-full h-full object-contain bg-white"
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

                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                              Condições de Troca
                            </h4>
                            <div className="space-y-3">
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
                                  Jogos:
                                </label>
                                <div className="flex-1">
                                  <CustomMultiSelect
                                    options={jogos}
                                    value={
                                      Array.isArray(variationData.jogosTroca)
                                        ? variationData.jogosTroca
                                        : []
                                    }
                                    onChange={(values) =>
                                      handleVariationMultiSelectChange(
                                        "jogosTroca",
                                        values
                                      )
                                    }
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
                                  Tipo de Cartucho:
                                </label>
                                <div className="flex-1">
                                  <CustomMultiSelect
                                    options={tiposCartucho}
                                    value={
                                      Array.isArray(variationData.tiposTroca)
                                        ? variationData.tiposTroca
                                        : []
                                    }
                                    onChange={(values) =>
                                      handleVariationMultiSelectChange(
                                        "tiposTroca",
                                        values
                                      )
                                    }
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
                                  <CustomMultiSelect
                                    options={estados}
                                    value={
                                      Array.isArray(variationData.estadosTroca)
                                        ? variationData.estadosTroca
                                        : []
                                    }
                                    onChange={(values) =>
                                      handleVariationMultiSelectChange(
                                        "estadosTroca",
                                        values
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              {/* Mostrar campo de região de troca apenas se um jogo de troca está selecionado E há regiões disponíveis */}
                              {Array.isArray(variationData.jogosTroca) &&
                              variationData.jogosTroca.length > 0 &&
                              tradeGameData.getAvailableRegions().length > 0 ? (
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
                                    <CustomMultiSelect
                                      options={tradeGameData
                                        .getAvailableRegions()
                                        .map((r) => ({
                                          value: r.id.toString(),
                                          label: r.name,
                                        }))}
                                      value={
                                        Array.isArray(
                                          variationData.regioesTroca
                                        )
                                          ? variationData.regioesTroca
                                          : []
                                      }
                                      onChange={(values) =>
                                        handleVariationMultiSelectChange(
                                          "regioesTroca",
                                          values
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ) : null}
                              {/* Mostrar campo de idioma do áudio de troca apenas se um jogo de troca está selecionado E há idiomas disponíveis */}
                              {Array.isArray(variationData.jogosTroca) &&
                              variationData.jogosTroca.length > 0 &&
                              tradeGameData.getAvailableAudioLanguages()
                                .length > 0 ? (
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
                                    Idioma de Áudio:
                                  </label>
                                  <div className="flex-1">
                                    <CustomMultiSelect
                                      options={tradeGameData
                                        .getAvailableAudioLanguages()
                                        .map((l) => ({
                                          value: l.id.toString(),
                                          label: l.name,
                                        }))}
                                      value={
                                        Array.isArray(
                                          variationData.idiomasAudioTroca
                                        )
                                          ? variationData.idiomasAudioTroca
                                          : []
                                      }
                                      onChange={(values) =>
                                        handleVariationMultiSelectChange(
                                          "idiomasAudioTroca",
                                          values
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ) : null}
                              {/* Mostrar campo de idioma da legenda de troca apenas se um jogo de troca está selecionado E há idiomas disponíveis */}
                              {Array.isArray(variationData.jogosTroca) &&
                              variationData.jogosTroca.length > 0 &&
                              tradeGameData.getAvailableSubtitleLanguages()
                                .length > 0 ? (
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
                                    Idioma de Legenda:
                                  </label>
                                  <div className="flex-1">
                                    <CustomMultiSelect
                                      options={tradeGameData
                                        .getAvailableSubtitleLanguages()
                                        .map((l) => ({
                                          value: l.id.toString(),
                                          label: l.name,
                                        }))}
                                      value={
                                        Array.isArray(
                                          variationData.idiomasLegendaTroca
                                        )
                                          ? variationData.idiomasLegendaTroca
                                          : []
                                      }
                                      onChange={(values) =>
                                        handleVariationMultiSelectChange(
                                          "idiomasLegendaTroca",
                                          values
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ) : null}
                              {/* Mostrar campo de idioma da interface de troca apenas se um jogo de troca está selecionado E há idiomas disponíveis */}
                              {Array.isArray(variationData.jogosTroca) &&
                              variationData.jogosTroca.length > 0 &&
                              tradeGameData.getAvailableInterfaceLanguages()
                                .length > 0 ? (
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
                                    Idioma de Interface:
                                  </label>
                                  <div className="flex-1">
                                    <CustomMultiSelect
                                      options={tradeGameData
                                        .getAvailableInterfaceLanguages()
                                        .map((l) => ({
                                          value: l.id.toString(),
                                          label: l.name,
                                        }))}
                                      value={
                                        Array.isArray(
                                          variationData.idiomasInterfaceTroca
                                        )
                                          ? variationData.idiomasInterfaceTroca
                                          : []
                                      }
                                      onChange={(values) =>
                                        handleVariationMultiSelectChange(
                                          "idiomasInterfaceTroca",
                                          values
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                          <button
                            onClick={resetAndHideVariationForm}
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
                                  alt="Imagem da variação"
                                  className="w-full h-full object-contain bg-white"
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
                    isMobile ? "p-4" : "p-6"
                  } space-y-4 animate-fadeIn`}
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Nova Variação ({variations.length + 1})
                    </h3>
                    <button
                      onClick={resetAndHideVariationForm}
                      title="Cancelar"
                    >
                      <ChevronDown className="w-8 h-8 text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-3 bg-white p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                      Detalhes da variação
                    </h4>
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
                        Título:
                      </label>
                      <input
                        type="text"
                        name="titulo"
                        value={variationData.titulo}
                        onChange={handleVariationInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                        Estado:
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
                    {formData.jogo &&
                    mainGameData.getAvailableRegions().length > 0 ? (
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
                          Região:
                        </label>
                        <div className="flex-1">
                          <CustomSelect
                            options={mainGameData
                              .getAvailableRegions()
                              .map((r) => ({
                                value: r.id.toString(),
                                label: r.name,
                              }))}
                            value={
                              mainGameData
                                .getAvailableRegions()
                                .find(
                                  (r) =>
                                    r.id.toString() === variationData.regiao
                                )
                                ? {
                                    value: variationData.regiao,
                                    label:
                                      mainGameData
                                        .getAvailableRegions()
                                        .find(
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
                    mainGameData.getAvailableAudioLanguages().length > 0 ? (
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
                            options={mainGameData
                              .getAvailableAudioLanguages()
                              .map((l) => ({
                                value: l.id.toString(),
                                label: l.name,
                              }))}
                            value={
                              mainGameData
                                .getAvailableAudioLanguages()
                                .find(
                                  (l) =>
                                    l.id.toString() ===
                                    variationData.idiomaAudio
                                )
                                ? {
                                    value: variationData.idiomaAudio,
                                    label:
                                      mainGameData
                                        .getAvailableAudioLanguages()
                                        .find(
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
                    mainGameData.getAvailableSubtitleLanguages().length > 0 ? (
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
                            options={mainGameData
                              .getAvailableSubtitleLanguages()
                              .map((l) => ({
                                value: l.id.toString(),
                                label: l.name,
                              }))}
                            value={
                              mainGameData
                                .getAvailableSubtitleLanguages()
                                .find(
                                  (l) =>
                                    l.id.toString() ===
                                    variationData.idiomaLegenda
                                )
                                ? {
                                    value: variationData.idiomaLegenda,
                                    label:
                                      mainGameData
                                        .getAvailableSubtitleLanguages()
                                        .find(
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
                    mainGameData.getAvailableInterfaceLanguages().length > 0 ? (
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
                            options={mainGameData
                              .getAvailableInterfaceLanguages()
                              .map((l) => ({
                                value: l.id.toString(),
                                label: l.name,
                              }))}
                            value={
                              mainGameData
                                .getAvailableInterfaceLanguages()
                                .find(
                                  (l) =>
                                    l.id.toString() ===
                                    variationData.idiomaInterface
                                )
                                ? {
                                    value: variationData.idiomaInterface,
                                    label:
                                      mainGameData
                                        .getAvailableInterfaceLanguages()
                                        .find(
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
                        Estoque:
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
                        isMobile ? "flex-col gap-2" : "items-start"
                      }`}
                    >
                      <label
                        className={`font-medium text-gray-700 flex-shrink-0 ${
                          isMobile
                            ? "text-start text-md"
                            : "text-end text-sm w-40"
                        } pr-2 pt-2`}
                      >
                        Imagens:
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
                                    className="w-full h-full object-contain bg-white"
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

                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                        Condições de Troca
                      </h4>
                      <div className="space-y-3">
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
                            Jogos:
                          </label>
                          <div className="flex-1">
                            <CustomMultiSelect
                              options={jogos}
                              value={
                                Array.isArray(variationData.jogosTroca)
                                  ? variationData.jogosTroca
                                  : []
                              }
                              onChange={(values) =>
                                handleVariationMultiSelectChange(
                                  "jogosTroca",
                                  values
                                )
                              }
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
                            Tipo de Cartucho:
                          </label>
                          <div className="flex-1">
                            <CustomMultiSelect
                              options={tiposCartucho}
                              value={
                                Array.isArray(variationData.tiposTroca)
                                  ? variationData.tiposTroca
                                  : []
                              }
                              onChange={(values) =>
                                handleVariationMultiSelectChange(
                                  "tiposTroca",
                                  values
                                )
                              }
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
                            <CustomMultiSelect
                              options={estados}
                              value={
                                Array.isArray(variationData.estadosTroca)
                                  ? variationData.estadosTroca
                                  : []
                              }
                              onChange={(values) =>
                                handleVariationMultiSelectChange(
                                  "estadosTroca",
                                  values
                                )
                              }
                            />
                          </div>
                        </div>
                        {/* Mostrar campo de região de troca apenas se um jogo de troca está selecionado E há regiões disponíveis */}
                        {Array.isArray(variationData.jogosTroca) &&
                        variationData.jogosTroca.length > 0 &&
                        tradeGameData.getAvailableRegions().length > 0 ? (
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
                              <CustomMultiSelect
                                options={tradeGameData
                                  .getAvailableRegions()
                                  .map((r) => ({
                                    value: r.id.toString(),
                                    label: r.name,
                                  }))}
                                value={
                                  Array.isArray(variationData.regioesTroca)
                                    ? variationData.regioesTroca
                                    : []
                                }
                                onChange={(values) =>
                                  handleVariationMultiSelectChange(
                                    "regioesTroca",
                                    values
                                  )
                                }
                              />
                            </div>
                          </div>
                        ) : null}
                        {/* Mostrar campo de idioma do áudio de troca apenas se um jogo de troca está selecionado E há idiomas disponíveis */}
                        {Array.isArray(variationData.jogosTroca) &&
                        variationData.jogosTroca.length > 0 &&
                        tradeGameData.getAvailableAudioLanguages().length >
                          0 ? (
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
                              Idioma de Áudio:
                            </label>
                            <div className="flex-1">
                              <CustomMultiSelect
                                options={tradeGameData
                                  .getAvailableAudioLanguages()
                                  .map((l) => ({
                                    value: l.id.toString(),
                                    label: l.name,
                                  }))}
                                value={
                                  Array.isArray(variationData.idiomasAudioTroca)
                                    ? variationData.idiomasAudioTroca
                                    : []
                                }
                                onChange={(values) =>
                                  handleVariationMultiSelectChange(
                                    "idiomasAudioTroca",
                                    values
                                  )
                                }
                              />
                            </div>
                          </div>
                        ) : null}
                        {/* Mostrar campo de idioma da legenda de troca apenas se um jogo de troca está selecionado E há idiomas disponíveis */}
                        {Array.isArray(variationData.jogosTroca) &&
                        variationData.jogosTroca.length > 0 &&
                        tradeGameData.getAvailableSubtitleLanguages().length >
                          0 ? (
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
                              Idioma de Legenda:
                            </label>
                            <div className="flex-1">
                              <CustomMultiSelect
                                options={tradeGameData
                                  .getAvailableSubtitleLanguages()
                                  .map((l) => ({
                                    value: l.id.toString(),
                                    label: l.name,
                                  }))}
                                value={
                                  Array.isArray(
                                    variationData.idiomasLegendaTroca
                                  )
                                    ? variationData.idiomasLegendaTroca
                                    : []
                                }
                                onChange={(values) =>
                                  handleVariationMultiSelectChange(
                                    "idiomasLegendaTroca",
                                    values
                                  )
                                }
                              />
                            </div>
                          </div>
                        ) : null}
                        {/* Mostrar campo de idioma da interface de troca apenas se um jogo de troca está selecionado E há idiomas disponíveis */}
                        {Array.isArray(variationData.jogosTroca) &&
                        variationData.jogosTroca.length > 0 &&
                        tradeGameData.getAvailableInterfaceLanguages().length >
                          0 ? (
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
                              Idioma de Interface:
                            </label>
                            <div className="flex-1">
                              <CustomMultiSelect
                                options={tradeGameData
                                  .getAvailableInterfaceLanguages()
                                  .map((l) => ({
                                    value: l.id.toString(),
                                    label: l.name,
                                  }))}
                                value={
                                  Array.isArray(
                                    variationData.idiomasInterfaceTroca
                                  )
                                    ? variationData.idiomasInterfaceTroca
                                    : []
                                }
                                onChange={(values) =>
                                  handleVariationMultiSelectChange(
                                    "idiomasInterfaceTroca",
                                    values
                                  )
                                }
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <button
                      onClick={resetAndHideVariationForm}
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
                        // Condições de troca
                        jogosTroca: Array.isArray(formData.jogosTroca)
                          ? formData.jogosTroca
                          : [],
                        tiposTroca: Array.isArray(formData.tiposTroca)
                          ? formData.tiposTroca
                          : [],
                        estadosTroca: Array.isArray(formData.estadosTroca)
                          ? formData.estadosTroca
                          : [],
                        regioesTroca: Array.isArray(formData.regioesTroca)
                          ? formData.regioesTroca
                          : [],
                        idiomasAudioTroca: Array.isArray(
                          formData.idiomasAudioTroca
                        )
                          ? formData.idiomasAudioTroca
                          : [],
                        idiomasLegendaTroca: Array.isArray(
                          formData.idiomasLegendaTroca
                        )
                          ? formData.idiomasLegendaTroca
                          : [],
                        idiomasInterfaceTroca: Array.isArray(
                          formData.idiomasInterfaceTroca
                        )
                          ? formData.idiomasInterfaceTroca
                          : [],
                      });
                      setEditingVariationId("new");
                    }}
                    className={`w-full border-2 border-dashed border-purple-400 ${
                      isMobile ? "p-4" : "p-6"
                    } rounded-lg text-purple-600 hover:bg-purple-50 hover:border-purple-600 transition-colors font-semibold`}
                  >
                    + Adicionar nova variação de troca
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        {/* STEP 6 - Publicar Anúncio */}
        {step === 6 && (
          <>
            <StepHeader
              title="Publicar Anúncio"
              subtitle=""
              step={6}
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
                      onClick={() => setStep(7)}
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
                      onClick={() => setStep(7)}
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

        {/* STEP 7 - Revisão do Anúncio */}
        {step === 7 && (
          <>
            <StepHeader
              title="Revisar Anúncio de Troca"
              subtitle="Confirme se todas as informações estão corretas"
              step={step - 1}
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
                        Anúncio Principal de Troca
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
                                  className="w-full h-full object-contain bg-white"
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
                          Titulo do Anúncio de Troca
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
                          Condições de Troca Aceitas
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

                      {/* Condições de Troca */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-500">
                          Condições de Troca Aceitas
                        </label>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Jogos
                            </label>
                            <p className="text-gray-800 font-medium">
                              {getGameNames(formData.jogosTroca)}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Tipo de Cartucho Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {getCartridgeTypeNames(formData.tiposTroca)}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Estado Mínimo Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {getPreservationStateNames(formData.estadosTroca)}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Região Aceita
                            </label>
                            <p className="text-gray-800 font-medium">
                              {getRegionNames(formData.regioesTroca)}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Idioma de Áudio Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {getLanguageNames(formData.idiomasAudioTroca)}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Idioma de Legenda Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {getLanguageNames(formData.idiomasLegendaTroca)}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-500">
                              Idioma de Interface Aceito
                            </label>
                            <p className="text-gray-800 font-medium">
                              {getLanguageNames(formData.idiomasInterfaceTroca)}
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
                                className="w-full h-full object-contain bg-white"
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
                              - {getRegionName(variation.regiao)} -{" "}
                              {getLanguageName(variation.idiomaAudio)}
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
                                        className="w-full h-full object-contain bg-white"
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
          {step !== 6 && (
            <ConfirmButton
              onClick={() => {
                if (step === 6) {
                  setStep(6);
                } else {
                  nextStep();
                }
              }}
              disabled={false}
            >
              {step === 7 ? "Voltar" : "Continuar"}
            </ConfirmButton>
          )}
        </div>
      </div>
    </>
  );
};

export default MultiPartForm;
