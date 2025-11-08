import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useReferenceData } from "../hooks/useReferenceData";
import { advertisementService } from "../services/advertisementService";
import { advertisementImageService } from "../services/advertisementImageService";
import { authService } from "../services/authService";
import { AdvertisementDTO } from "../api/types";
import CustomMultiSelect from "../components/ui/CustomMultiSelect";
import { SelectOption } from "../api/referenceDataTypes";
import TopBar from "../components/TopBar";
import Head from "../components/Head";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import { CustomAlert } from "../components/ui/CustomAlert";
import { Camera, Check, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";
import { useCustomAlert } from "../hooks/useCustomAlert";

interface TradeConditions {
  games: number[];
  cartridgeTypes: number[];
  preservationStates: number[];
  regions: number[];
  audioLanguages: number[];
  subtitleLanguages: number[];
  interfaceLanguages: number[];
}

interface AdvertisementEditForm {
  title: string;
  price: number;
  availableStock: number;
  preservationStateId: number | null;
  description: string;
  displayDiscount: boolean;
  tradeConditions: TradeConditions;
}

const EditarAnuncio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { alertState, showSuccess, showError, hideAlert } = useCustomAlert();

  const [isMainAdExpanded, setIsMainAdExpanded] = useState(true);
  const [isTradeConditionsExpanded, setIsTradeConditionsExpanded] =
    useState(false);
  const [isVariationsExpanded, setIsVariationsExpanded] = useState(false);

  const {
    games,
    preservationStates,
    cartridgeTypes,
    regions,
    languages,
    loading: refDataLoading,
    error: refDataError,
  } = useReferenceData();

  const [advertisement, setAdvertisement] = useState<AdvertisementDTO | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState<string>("");

  const [formData, setFormData] = useState<AdvertisementEditForm>({
    title: "",
    price: 0,
    availableStock: 1,
    preservationStateId: null,
    description: "",
    displayDiscount: true,
    tradeConditions: {
      games: [],
      cartridgeTypes: [],
      preservationStates: [],
      regions: [],
      audioLanguages: [],
      subtitleLanguages: [],
      interfaceLanguages: [],
    },
  });

  // Estado para armazenar dados originais para comparação
  const [originalFormData, setOriginalFormData] =
    useState<AdvertisementEditForm | null>(null);

  const [newImages, setNewImages] = useState<(File | null)[]>(
    Array(5).fill(null)
  );
  const [existingImages, setExistingImages] = useState<
    ({ id: number; url: string } | null)[]
  >(Array(5).fill(null));
  // Para futuro uso quando backend tiver endpoint de delete de imagem
  const [, setImagesToDelete] = useState<number[]>([]);
  const [editingVariationId, setEditingVariationId] = useState<number | null>(
    null
  );
  const [variations, setVariations] = useState<AdvertisementDTO[]>([]);

  // Carregar dados do anúncio
  useEffect(() => {
    const loadAdvertisement = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Verificar se há um parâmetro de variação na URL
        const urlParams = new URLSearchParams(location.search);
        const variationId = urlParams.get("variation");

        // Carregar o anúncio principal (o ID na URL é sempre do anúncio principal)
        const data = await advertisementService.getById(parseInt(id));

        // ✅ Verificar se o usuário logado é o proprietário do anúncio
        const currentUser = await authService.getCurrentUser();

        if (!currentUser || data.seller?.id !== currentUser.id) {
          showError("Você não tem permissão para editar este anúncio.");
          setTimeout(() => {
            navigate(`/anuncio/${id}`);
          }, 2000);
          return;
        }

        setAdvertisement(data);

        // Guardar as variações se existirem
        if (data.variations && data.variations.length > 0) {
          setVariations(data.variations);
        }

        // Se houver variationId, buscar essa variação específica
        let dataToEdit = data;
        if (variationId) {
          const variation = data.variations?.find(
            (v) => v.id.toString() === variationId
          );
          if (variation) {
            dataToEdit = variation;
            setEditingVariationId(parseInt(variationId));
          }
        } else {
          // Se não há variationId, está editando o anúncio principal
          setEditingVariationId(null);
        }

        const tradeData = dataToEdit.trade as
          | {
              acceptedGameIds?: number[];
              acceptedCartridgeTypeIds?: number[];
              acceptedPreservationStateIds?: number[];
              acceptedRegionIds?: number[];
            }
          | undefined;

        // Type assertion para sale com displayDiscount
        const saleData = dataToEdit.sale as
          | {
              price?: number;
              displayDiscount?: boolean;
            }
          | undefined;

        const loadedData = {
          title: dataToEdit.title || "",
          price: saleData?.price || 0,
          availableStock: dataToEdit.availableStock || 1,
          preservationStateId: dataToEdit.preservationState?.id || null,
          description: dataToEdit.description || "",
          displayDiscount: saleData?.displayDiscount === false ? false : true,
          tradeConditions: {
            games: tradeData?.acceptedGameIds || [],
            cartridgeTypes: tradeData?.acceptedCartridgeTypeIds || [],
            preservationStates: tradeData?.acceptedPreservationStateIds || [],
            regions: tradeData?.acceptedRegionIds || [],
            audioLanguages: [],
            subtitleLanguages: [],
            interfaceLanguages: [],
          },
        };

        setFormData(loadedData);
        // Armazenar dados originais para comparação
        const originalData = JSON.parse(JSON.stringify(loadedData));
        setOriginalFormData(originalData);

        // Carregar imagens existentes
        if (dataToEdit.images) {
          const images = Array(5).fill(null);
          dataToEdit.images.forEach((img, index) => {
            if (index < 5) {
              // Usar getDisplayUrl que verifica se preSignedUrl expirou
              const imageUrl = advertisementImageService.getDisplayUrl(img);
              images[index] = { id: img.id, url: imageUrl };
            }
          });
          setExistingImages(images);
        }
      } catch (err) {
        console.error("Erro ao carregar anúncio:", err);
        showError("Erro ao carregar anúncio. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadAdvertisement();
  }, [id, location.search, navigate, showError]);

  const handleInputChange = (
    field: keyof AdvertisementEditForm,
    value: string | number | boolean | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTradeConditionChange = (
    field: keyof TradeConditions,
    values: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      tradeConditions: {
        ...prev.tradeConditions,
        [field]: values.map((v) => parseInt(v)),
      },
    }));
  };

  const handleImageSelect = (
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

      // Limpa o erro se havia
      setImageError("");

      // Adiciona a nova imagem na posição específica
      setNewImages((prev) => {
        const newImagens = [...prev];
        newImagens[index] = file;
        return newImagens;
      });
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };

  const handleRemoveExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    if (imageToRemove) {
      setImagesToDelete((prev) => [...prev, imageToRemove.id]);
    }
    setExistingImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };

  // Função para detectar campos alterados
  const getChangedFields = () => {
    if (!originalFormData) return null;

    const changes: Record<string, string | number | boolean | number[] | null> =
      {};

    // Comparar campos simples
    if (formData.title !== originalFormData.title) {
      changes.title = formData.title;
    }
    if (formData.price !== originalFormData.price) {
      changes.price = formData.price;
    }
    if (formData.availableStock !== originalFormData.availableStock) {
      changes.availableStock = formData.availableStock;
    }
    if (formData.preservationStateId !== originalFormData.preservationStateId) {
      changes.preservationStateId = formData.preservationStateId;
    }
    if (formData.description !== originalFormData.description) {
      changes.description = formData.description;
    }
    if (formData.displayDiscount !== originalFormData.displayDiscount) {
      changes.displayDiscount = formData.displayDiscount;
    }

    // Comparar arrays de condições de troca (compara se os IDs mudaram)
    const arraysEqual = (a: number[], b: number[]) => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => val === sortedB[idx]);
    };

    if (
      !arraysEqual(
        formData.tradeConditions.games,
        originalFormData.tradeConditions.games
      )
    ) {
      changes.acceptedTradeGameIds = formData.tradeConditions.games;
    }
    if (
      !arraysEqual(
        formData.tradeConditions.cartridgeTypes,
        originalFormData.tradeConditions.cartridgeTypes
      )
    ) {
      changes.acceptedTradeCartridgeTypeIds =
        formData.tradeConditions.cartridgeTypes;
    }
    if (
      !arraysEqual(
        formData.tradeConditions.preservationStates,
        originalFormData.tradeConditions.preservationStates
      )
    ) {
      changes.acceptedTradePreservationStateIds =
        formData.tradeConditions.preservationStates;
    }
    if (
      !arraysEqual(
        formData.tradeConditions.regions,
        originalFormData.tradeConditions.regions
      )
    ) {
      changes.acceptedTradeRegionIds = formData.tradeConditions.regions;
    }

    return Object.keys(changes).length > 0 ? changes : null;
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);

      // Determinar qual ID usar (variação ou anúncio principal)
      const targetId = editingVariationId || parseInt(id);

      // Detectar apenas os campos alterados
      const changedFields = getChangedFields();

      // Se não houver alterações nos dados do formulário e nem novas imagens, não fazer nada
      const hasNewImages = newImages.some((img) => img !== null);
      if (!changedFields && !hasNewImages) {
        showSuccess("Nenhuma alteração foi feita.");
        setSaving(false);
        return;
      }

      // Atualizar dados do anúncio ou variação (apenas campos alterados)
      if (changedFields) {
        await advertisementService.update(targetId, changedFields);
      }

      // Upload de novas imagens (filtra os nulls)
      const imagesToUpload = newImages.filter(
        (img): img is File => img !== null
      );
      if (imagesToUpload.length > 0) {
        await advertisementImageService.uploadImages(targetId, imagesToUpload);
      }

      // Deletar imagens marcadas para exclusão
      // TODO: Implementar endpoint de delete de imagem no backend

      const message = editingVariationId
        ? "Variação atualizada com sucesso!"
        : "Anúncio atualizado com sucesso!";

      showSuccess(message);
      setTimeout(() => {
        navigate(`/anuncio/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Erro ao salvar anúncio:", err);
      showError("Erro ao salvar anúncio. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || refDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (refDataError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{refDataError}</div>
      </div>
    );
  }

  if (!advertisement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Anúncio não encontrado</div>
      </div>
    );
  }

  const gameOptions: SelectOption[] = games.map((g) => ({
    value: g.id.toString(),
    label: g.name,
  }));

  const preservationStateOptions: SelectOption[] = preservationStates.map(
    (p) => ({
      value: p.id.toString(),
      label: p.name,
    })
  );

  const cartridgeTypeOptions: SelectOption[] = cartridgeTypes.map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

  const regionOptions: SelectOption[] = regions.map((r) => ({
    value: r.id.toString(),
    label: r.name || r.identifier || `Região ${r.id}`,
  }));

  const languageOptions: SelectOption[] = languages.map((l) => ({
    value: l.id.toString(),
    label: l.name,
  }));

  // Layout Mobile - seguindo o padrão
  if (isMobile) {
    return (
      <>
        <Head title="Editar Anúncio" />
        <div className="min-h-screen bg-[#f4f3f5] md:hidden">
          {/* Header roxo escuro */}
          <div className="bg-[#2B2560] text-white">
            <div className="flex bg-[#211C49] items-center px-4 py-4 pt-8">
              <button
                onClick={() => navigate(`/anuncio/${id}`)}
                className="p-2 -ml-2 focus:outline-none"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-lg font-light ml-2">Editar anúncio</h1>
            </div>
          </div>

          {/* Aviso de Editando Variação */}
          {editingVariationId && (
            <div className="mx-4 mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-800 rounded text-sm flex items-start gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Editando Variação:</strong> Você está editando uma
                variação do anúncio principal. As alterações serão salvas apenas
                nesta variação específica.
              </span>
            </div>
          )}

          {/* Conteúdo */}
          <div className="pb-40">
            {/* Seção Anúncio Principal */}
            <div className="mt-4">
              <button
                onClick={() => setIsMainAdExpanded(!isMainAdExpanded)}
                className="w-full bg-[#f4f3f5] flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-black text-base font-semibold">
                  Anúncio Principal
                </h2>
                {isMainAdExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {isMainAdExpanded && (
                <div className="bg-white px-4 py-4 space-y-4 rounded-lg mx-3">
                  <h3 className="text-sm font-medium text-gray-800">
                    Alterar informações principais
                  </h3>

                  {/* Título do anúncio */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Título do Anúncio:
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4A2C7C] bg-white text-black"
                      placeholder="Insira o título do anúncio"
                    />
                  </div>

                  {/* Estoque disponível */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Estoque disponível:
                    </label>
                    <input
                      type="number"
                      value={formData.availableStock}
                      onChange={(e) =>
                        handleInputChange(
                          "availableStock",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4A2C7C] bg-white text-black"
                      placeholder="1"
                      min="1"
                    />
                  </div>

                  {/* Condições */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Condições:
                    </label>
                    <select
                      value={formData.preservationStateId || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "preservationStateId",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4A2C7C] bg-white text-black"
                    >
                      <option value="">Venda e Troca</option>
                      {preservationStateOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preço */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Preço:
                    </label>
                    <input
                      type="text"
                      value={`R$${formData.price.toFixed(2)}`}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        handleInputChange("price", parseFloat(value) || 0);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4A2C7C] bg-white text-black"
                      placeholder="R$0.00"
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Descrição:
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#4A2C7C] bg-white text-black"
                      rows={4}
                      placeholder="descrição"
                    />
                  </div>

                  {/* Imagens */}
                  <div>
                    <div className="flex gap-3 overflow-x-auto">
                      {[...Array(5)].map((_, i) => {
                        const existingImage = existingImages[i];
                        const newImage = newImages[i];
                        const hasImage = existingImage || newImage;

                        return (
                          <div
                            key={i}
                            className="relative flex-shrink-0 w-24 h-24"
                          >
                            {hasImage ? (
                              <div className="w-full h-full border-2 border-solid border-purple-400 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={
                                    existingImage
                                      ? existingImage.url
                                      : URL.createObjectURL(newImage)
                                  }
                                  alt={`Imagem ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() =>
                                    existingImage
                                      ? handleRemoveExistingImage(i)
                                      : handleRemoveNewImage(i)
                                  }
                                  type="button"
                                  className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full text-[#483D9E] flex items-center justify-center text-lg hover:text-[#211C49] transition-colors font-semibold shadow"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <label className="w-full h-full border-2 border-dashed border-purple-400 rounded-lg flex flex-col items-center justify-center cursor-pointer text-center text-xs text-gray-600 hover:bg-purple-50 hover:border-purple-600 hover:text-purple-600 transition p-1">
                                <Camera className="w-6 h-6 mb-0.5 text-purple-500" />
                                <span className="text-[10px]">
                                  Incluir Foto e Video
                                </span>
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  onChange={(e) => handleImageSelect(e, i)}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {imageError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-xs text-red-600">{imageError}</p>
                      </div>
                    )}
                  </div>

                  {/* Mostrar Desconto */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange(
                            "displayDiscount",
                            !formData.displayDiscount
                          )
                        }
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          formData.displayDiscount
                            ? "bg-[#483d9e] border-[#483d9e]"
                            : "border-gray-400"
                        }`}
                      >
                        {formData.displayDiscount && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <span className="text-sm text-gray-700">
                        Mostrar desconto no anúncio
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Seção Alterar Condições de Troca */}
            {advertisement?.trade && (
              <div className="mt-1">
                <button
                  onClick={() =>
                    setIsTradeConditionsExpanded(!isTradeConditionsExpanded)
                  }
                  className="w-full bg-white flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-black text-base font-semibold">
                    Alterar Condições de Troca
                  </h2>
                  {isTradeConditionsExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {isTradeConditionsExpanded && (
                  <div className="bg-[#F4F3F5] px-4 py-4 space-y-4">
                    {/* Jogos */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Jogos
                      </label>
                      <CustomMultiSelect
                        options={gameOptions}
                        value={formData.tradeConditions.games.map((g) =>
                          g.toString()
                        )}
                        onChange={(value) =>
                          handleTradeConditionChange("games", value)
                        }
                        placeholder="Selecione os jogos"
                      />
                    </div>

                    {/* Tipo de Cartucho */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Tipo de Cartucho
                      </label>
                      <CustomMultiSelect
                        options={cartridgeTypeOptions}
                        value={formData.tradeConditions.cartridgeTypes.map(
                          (c) => c.toString()
                        )}
                        onChange={(value) =>
                          handleTradeConditionChange("cartridgeTypes", value)
                        }
                        placeholder="Selecione o tipo"
                      />
                    </div>

                    {/* Estado de Preservação */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Estado de Preservação
                      </label>
                      <CustomMultiSelect
                        options={preservationStateOptions}
                        value={formData.tradeConditions.preservationStates.map(
                          (p) => p.toString()
                        )}
                        onChange={(value) =>
                          handleTradeConditionChange(
                            "preservationStates",
                            value
                          )
                        }
                        placeholder="Selecione o estado"
                      />
                    </div>

                    {/* Regiões do Cartucho */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Regiões do Cartucho
                      </label>
                      <CustomMultiSelect
                        options={regionOptions}
                        value={formData.tradeConditions.regions.map((r) =>
                          r.toString()
                        )}
                        onChange={(value) =>
                          handleTradeConditionChange("regions", value)
                        }
                        placeholder="Selecione as regiões"
                      />
                    </div>

                    {/* Idiomas do Áudio */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Idiomas do Áudio
                      </label>
                      <CustomMultiSelect
                        options={languageOptions}
                        value={formData.tradeConditions.audioLanguages.map(
                          (l) => l.toString()
                        )}
                        onChange={(value) =>
                          handleTradeConditionChange("audioLanguages", value)
                        }
                        placeholder="Selecione os idiomas"
                      />
                    </div>

                    {/* Idiomas da Legenda */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Idiomas da Legenda
                      </label>
                      <CustomMultiSelect
                        options={languageOptions}
                        value={formData.tradeConditions.subtitleLanguages.map(
                          (l) => l.toString()
                        )}
                        onChange={(value) =>
                          handleTradeConditionChange("subtitleLanguages", value)
                        }
                        placeholder="Selecione os idiomas"
                      />
                    </div>

                    {/* Idiomas da Interface */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Idiomas da Interface
                      </label>
                      <CustomMultiSelect
                        options={languageOptions}
                        value={formData.tradeConditions.interfaceLanguages.map(
                          (l) => l.toString()
                        )}
                        onChange={(value) =>
                          handleTradeConditionChange(
                            "interfaceLanguages",
                            value
                          )
                        }
                        placeholder="Selecione os idiomas"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Seção Variações */}
            {variations.length > 0 && (
              <div className="mt-1">
                <button
                  onClick={() => setIsVariationsExpanded(!isVariationsExpanded)}
                  className="w-full bg-[#f4f3f5] flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-black text-base font-semibold">
                    Variações ({variations.length})
                  </h2>
                  {isVariationsExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {isVariationsExpanded && (
                  <div className="bg-[#F4F3F5] px-4 py-4 space-y-3">
                    <p className="text-sm text-gray-700 mb-2">
                      Este anúncio possui {variations.length} variação(ões).
                      Toque em uma variação para editá-la.
                    </p>

                    {/* Card para editar anúncio principal */}
                    <div
                      className={`p-3 border rounded-lg ${
                        !editingVariationId
                          ? "border-[#4f43ae] bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
                      onClick={() => {
                        if (editingVariationId) {
                          navigate(`/anuncio/${id}/editar`);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-sm mb-1">
                            Anúncio Principal
                            {!editingVariationId && (
                              <span className="ml-2 text-xs bg-[#4f43ae] text-white px-2 py-0.5 rounded">
                                Editando
                              </span>
                            )}
                          </h3>
                          <div className="text-xs text-gray-600 space-y-0.5">
                            <p className="truncate">
                              <strong>Título:</strong> {advertisement?.title}
                            </p>
                            <p>
                              <strong>Preço:</strong> R${" "}
                              {advertisement?.sale?.price?.toFixed(2) || "0.00"}
                            </p>
                            <p>
                              <strong>Estado:</strong>{" "}
                              {advertisement?.preservationState?.name || "N/A"}
                            </p>
                            <p>
                              <strong>Estoque:</strong>{" "}
                              {advertisement?.availableStock} un.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cards das variações */}
                    {variations.map((variation, index) => (
                      <div
                        key={variation.id}
                        className={`p-3 border rounded-lg ${
                          editingVariationId === variation.id
                            ? "border-[#4f43ae] bg-blue-50"
                            : "border-gray-300 bg-white"
                        }`}
                        onClick={() => {
                          if (editingVariationId !== variation.id) {
                            navigate(
                              `/anuncio/${id}/editar?variation=${variation.id}`
                            );
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 text-sm mb-1">
                              Variação {index + 1}
                              {editingVariationId === variation.id && (
                                <span className="ml-2 text-xs bg-[#4f43ae] text-white px-2 py-0.5 rounded">
                                  Editando
                                </span>
                              )}
                            </h3>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              <p className="truncate">
                                <strong>Título:</strong> {variation.title}
                              </p>
                              <p>
                                <strong>Preço:</strong> R${" "}
                                {variation.sale?.price?.toFixed(2) || "0.00"}
                              </p>
                              <p>
                                <strong>Estado:</strong>{" "}
                                {variation.preservationState?.name || "N/A"}
                              </p>
                              <p>
                                <strong>Estoque:</strong>{" "}
                                {variation.availableStock} un.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Botões de ação - Mobile */}
            <div className="fixed bottom-16 left-0 right-0 px-4 py-3 pb-6 flex gap-3 z-50 bg-[#f4f3f5]">
              <button
                type="button"
                onClick={() => navigate(`/anuncio/${id}`)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium bg-white"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-3 bg-[#4A2C7C] text-white rounded-lg hover:bg-[#3a2260] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {saving ? "Salvando..." : "Salvar"}
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
      <Head title="Editar Anúncio" />
      <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
      <FilterTopBar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <span
              className="cursor-pointer hover:text-gray-900"
              onClick={() => navigate("/meu-perfil")}
            >
              Meu Perfil
            </span>
            {" > "}
            <span
              className="cursor-pointer hover:text-gray-900"
              onClick={() => navigate("/meus-anuncios")}
            >
              Meus Anúncios
            </span>
            {" > "}
            <span className="text-gray-900">Editar Anúncio</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">Editar Anúncio</h1>

          {editingVariationId && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-800 rounded flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Editando Variação:</strong> Você está editando uma
                variação do anúncio principal. As alterações serão salvas apenas
                nesta variação específica.
              </span>
            </div>
          )}

          {/* Anúncio Principal */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 bg-gray-100 p-3 rounded">
              Anúncio
            </h2>

            <div className="space-y-4">
              {/* Alterar Informações Principais */}
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-3">
                  Alterar Informações Principais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Título do anúncio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Título do anúncio
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f43ae] focus:border-transparent"
                      placeholder="Ex: Cartucho SNES - Super Mario World"
                    />
                  </div>

                  {/* Preço */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Preço
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        R$
                      </span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange(
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f43ae] focus:border-transparent"
                        placeholder="80.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Estoque disponível */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Estoque disponível
                    </label>
                    <input
                      type="number"
                      value={formData.availableStock}
                      onChange={(e) =>
                        handleInputChange(
                          "availableStock",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f43ae] focus:border-transparent"
                      placeholder="1"
                      min="1"
                    />
                  </div>

                  {/* Condições */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Condições
                    </label>
                    <select
                      value={formData.preservationStateId || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "preservationStateId",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f43ae] focus:border-transparent"
                    >
                      <option value="">Selecione o estado</option>
                      {preservationStateOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mostrar Desconto */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange(
                            "displayDiscount",
                            !formData.displayDiscount
                          )
                        }
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          formData.displayDiscount
                            ? "bg-[#483d9e] border-[#483d9e]"
                            : "border-gray-400"
                        }`}
                      >
                        {formData.displayDiscount && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <span className="text-sm text-gray-700">
                        Mostrar desconto no anúncio
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4f43ae] focus:border-transparent"
                  rows={4}
                  placeholder="Jogo Super Mario World, em bom estado de conservação, funcionando perfeitamente, aceito trocas"
                />
              </div>

              {/* Adicionar Imagens */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Imagens e Vídeos
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Envie imagens de até 3MB cada, com boa iluminação.
                </p>

                {/* Grid de upload com imagens existentes e novas */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {[...Array(5)].map((_, i) => {
                    // Verificar se há imagem existente nesta posição
                    const existingImage = existingImages[i];
                    // Verificar se há nova imagem nesta posição
                    const newImage = newImages[i];
                    const hasImage = existingImage || newImage;

                    return (
                      <div key={i} className="relative">
                        {hasImage ? (
                          // Botão com imagem (não clicável)
                          <div className="w-full aspect-square border-2 border-solid border-purple-400 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={
                                existingImage
                                  ? existingImage.url
                                  : URL.createObjectURL(newImage)
                              }
                              alt={`Imagem ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() =>
                                existingImage
                                  ? handleRemoveExistingImage(i)
                                  : handleRemoveNewImage(i)
                              }
                              type="button"
                              className="absolute top-2 right-2 w-6 h-6 text-[#483D9E] flex items-center justify-center text-2xl hover:text-[#211C49] transition-colors font-semibold"
                              title="Remover imagem do anúncio"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          // Botão vazio (clicável)
                          <label className="w-full aspect-square border-2 border-dashed border-purple-400 rounded-lg flex flex-col items-center justify-center cursor-pointer text-center text-sm text-gray-600 hover:bg-purple-50 hover:border-purple-600 hover:text-purple-600 transition p-2">
                            <Camera className="w-6 h-6 mb-1 text-purple-500" />
                            Incluir Fotos e Vídeos
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleImageSelect(e, i)}
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
              </div>
            </div>
          </div>

          {/* Alterar Condições de Troca - Só exibe se o anúncio tiver troca */}
          {advertisement?.trade && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 bg-gray-100 p-3 rounded">
                Alterar Condições de Troca
              </h2>

              <div className="space-y-4">
                {/* Jogos */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Jogos
                  </label>
                  <CustomMultiSelect
                    options={gameOptions}
                    value={formData.tradeConditions.games.map((g) =>
                      g.toString()
                    )}
                    onChange={(value) =>
                      handleTradeConditionChange("games", value)
                    }
                    placeholder="Selecione os jogos"
                  />
                </div>

                {/* Tipo de Cartucho */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Tipo de Cartucho
                  </label>
                  <CustomMultiSelect
                    options={cartridgeTypeOptions}
                    value={formData.tradeConditions.cartridgeTypes.map((c) =>
                      c.toString()
                    )}
                    onChange={(value) =>
                      handleTradeConditionChange("cartridgeTypes", value)
                    }
                    placeholder="Selecione o tipo"
                  />
                </div>

                {/* Estado de Preservação */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Estado de Preservação
                  </label>
                  <CustomMultiSelect
                    options={preservationStateOptions}
                    value={formData.tradeConditions.preservationStates.map(
                      (p) => p.toString()
                    )}
                    onChange={(value) =>
                      handleTradeConditionChange("preservationStates", value)
                    }
                    placeholder="Selecione o estado"
                  />
                </div>

                {/* Regiões do Cartucho */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Regiões do Cartucho
                  </label>
                  <CustomMultiSelect
                    options={regionOptions}
                    value={formData.tradeConditions.regions.map((r) =>
                      r.toString()
                    )}
                    onChange={(value) =>
                      handleTradeConditionChange("regions", value)
                    }
                    placeholder="Selecione as regiões"
                  />
                </div>

                {/* Idiomas do Áudio */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Idiomas do Áudio
                  </label>
                  <CustomMultiSelect
                    options={languageOptions}
                    value={formData.tradeConditions.audioLanguages.map((l) =>
                      l.toString()
                    )}
                    onChange={(value) =>
                      handleTradeConditionChange("audioLanguages", value)
                    }
                    placeholder="Selecione os idiomas"
                  />
                </div>

                {/* Idiomas da Legenda */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Idiomas da Legenda
                  </label>
                  <CustomMultiSelect
                    options={languageOptions}
                    value={formData.tradeConditions.subtitleLanguages.map((l) =>
                      l.toString()
                    )}
                    onChange={(value) =>
                      handleTradeConditionChange("subtitleLanguages", value)
                    }
                    placeholder="Selecione os idiomas"
                  />
                </div>

                {/* Idiomas da Interface */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Idiomas da Interface
                  </label>
                  <CustomMultiSelect
                    options={languageOptions}
                    value={formData.tradeConditions.interfaceLanguages.map(
                      (l) => l.toString()
                    )}
                    onChange={(value) =>
                      handleTradeConditionChange("interfaceLanguages", value)
                    }
                    placeholder="Selecione os idiomas"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Variações - Listar variações existentes */}
          {variations.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 bg-gray-100 p-3 rounded">
                Variações
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                Este anúncio possui {variations.length} variação(ões). Clique em
                uma variação para editá-la.
              </p>

              {/* Card para editar anúncio principal */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors mb-3 ${
                  !editingVariationId
                    ? "border-[#4f43ae] bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => {
                  if (editingVariationId) {
                    navigate(`/anuncio/${id}/editar`);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">
                      Anúncio Principal
                      {!editingVariationId && (
                        <span className="ml-2 text-xs bg-[#4f43ae] text-white px-2 py-1 rounded">
                          Editando
                        </span>
                      )}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="truncate">
                        <strong>Título:</strong> {advertisement?.title}
                      </p>
                      <p>
                        <strong>Preço:</strong> R${" "}
                        {advertisement?.sale?.price?.toFixed(2) || "0.00"}
                      </p>
                      <p>
                        <strong>Estado:</strong>{" "}
                        {advertisement?.preservationState?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Estoque:</strong>{" "}
                        {advertisement?.availableStock} un.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {variations.map((variation, index) => (
                <div
                  key={variation.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors mb-3 ${
                    editingVariationId === variation.id
                      ? "border-[#4f43ae] bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => {
                    if (editingVariationId !== variation.id) {
                      navigate(
                        `/anuncio/${id}/editar?variation=${variation.id}`
                      );
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">
                        Variação {index + 1}
                        {editingVariationId === variation.id && (
                          <span className="ml-2 text-xs bg-[#4f43ae] text-white px-2 py-1 rounded">
                            Editando
                          </span>
                        )}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="truncate">
                          <strong>Título:</strong> {variation.title}
                        </p>
                        <p>
                          <strong>Preço:</strong> R${" "}
                          {variation.sale?.price?.toFixed(2) || "0.00"}
                        </p>
                        <p>
                          <strong>Estado:</strong>{" "}
                          {variation.preservationState?.name || "N/A"}
                        </p>
                        <p>
                          <strong>Estoque:</strong> {variation.availableStock}{" "}
                          un.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate(`/anuncio/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#4f43ae] text-white rounded-lg hover:bg-[#3d3487] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>
      <Footer
        showBackToTopButton={true}
        onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
      <CustomAlert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={hideAlert}
        duration={5000}
      />
      <BottomBar />
    </>
  );
};

export default EditarAnuncio;
