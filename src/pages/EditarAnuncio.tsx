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
  tradeConditions: TradeConditions;
}

const EditarAnuncio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<AdvertisementEditForm>({
    title: "",
    price: 0,
    availableStock: 1,
    preservationStateId: null,
    description: "",
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

  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<
    { id: number; url: string }[]
  >([]);
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
          setError("Você não tem permissão para editar este anúncio.");
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
            setCurrentEditingAd(variation); // ✅ Guardar variação sendo editada
          }
        } else {
          // Se não há variationId, está editando o anúncio principal
          setEditingVariationId(null);
        }

        // Preencher formulário com dados do anúncio ou da variação
        // Type assertion para acessar propriedades do trade que podem não estar na interface base
        const tradeData = dataToEdit.trade as
          | {
              acceptedGameIds?: number[];
              acceptedCartridgeTypeIds?: number[];
              acceptedPreservationStateIds?: number[];
              acceptedRegionIds?: number[];
            }
          | undefined;

        setFormData({
          title: dataToEdit.title || "",
          price: dataToEdit.sale?.price || 0,
          availableStock: dataToEdit.availableStock || 1,
          preservationStateId: dataToEdit.preservationState?.id || null,
          description: dataToEdit.description || "",
          tradeConditions: {
            games: tradeData?.acceptedGameIds || [],
            cartridgeTypes: tradeData?.acceptedCartridgeTypeIds || [],
            preservationStates: tradeData?.acceptedPreservationStateIds || [],
            regions: tradeData?.acceptedRegionIds || [],
            audioLanguages: [],
            subtitleLanguages: [],
            interfaceLanguages: [],
          },
        });

        // Carregar imagens existentes
        if (dataToEdit.images) {
          setExistingImages(
            dataToEdit.images.map((img) => ({ id: img.id, url: img.url }))
          );
        }
      } catch (err) {
        console.error("Erro ao carregar anúncio:", err);
        setError("Erro ao carregar anúncio. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadAdvertisement();
  }, [id, location.search, navigate]);

  const handleInputChange = (
    field: keyof AdvertisementEditForm,
    value: string | number | null
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageId: number) => {
    setImagesToDelete((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);
      setError(null);

      // Determinar qual ID usar (variação ou anúncio principal)
      const targetId = editingVariationId || parseInt(id);

      // Atualizar dados do anúncio ou variação
      const updateData = {
        title: formData.title,
        description: formData.description,
        availableStock: formData.availableStock,
        preservationStateId: formData.preservationStateId,
        price: formData.price,
        acceptedTradeGameIds: formData.tradeConditions.games,
        acceptedTradeCartridgeTypeIds: formData.tradeConditions.cartridgeTypes,
        acceptedTradePreservationStateIds:
          formData.tradeConditions.preservationStates,
        acceptedTradeRegionIds: formData.tradeConditions.regions,
      };

      await advertisementService.update(targetId, updateData);

      // Upload de novas imagens
      if (newImages.length > 0) {
        await advertisementImageService.uploadImages(targetId, newImages);
      }

      // Deletar imagens marcadas para exclusão
      // TODO: Implementar endpoint de delete de imagem no backend

      const message = editingVariationId
        ? "Variação atualizada com sucesso!"
        : "Anúncio atualizado com sucesso!";

      setSuccessMessage(message);
      setTimeout(() => {
        navigate(`/anuncio/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Erro ao salvar anúncio:", err);
      setError("Erro ao salvar anúncio. Tente novamente.");
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

  if (error || refDataError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error || refDataError}</div>
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

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
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
                  Adicionar Imagens
                </label>

                {/* Imagens existentes */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Imagens atuais:
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.url}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Novas imagens */}
                {newImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Novas imagens:</p>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {newImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-[#4f43ae] hover:text-[#3d3487]"
                  >
                    <div className="mb-2">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">
                      Adicionar Fotos e Vídeos
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Alterar Condições de Troca - Só exibe se o anúncio tiver troca */}
          {currentEditingAd?.trade && (
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
      <BottomBar />
    </>
  );
};

export default EditarAnuncio;
