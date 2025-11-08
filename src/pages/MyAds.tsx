import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Loader2,
  Trash2,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  Search,
  MoreVertical,
  PencilLine,
  X,
  AlertCircle,
} from "lucide-react";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import Head from "../components/Head";
import { useMyAdvertisements } from "../hooks/useMyAdvertisements";
import { IoMdSettings } from "react-icons/io";
import { AdvertisementDTO } from "../api/types";
import { useIsMobile } from "../hooks/useIsMobile";

const MyAds: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    advertisements,
    isLoading,
    error,
    deleteAdvertisement,
    updateAdvertisementStatus,
  } = useMyAdvertisements();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Estados para o modal de confirmação
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    id: number;
    currentStatus?: string;
    message: string;
    action: "delete" | "toggleStatus";
  } | null>(null);

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar anúncios baseado na busca
  const filteredAds = advertisements.filter((ad) =>
    ad.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginação
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAds = filteredAds.slice(startIndex, endIndex);

  // Resetar para página 1 quando o termo de busca mudar
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleDelete = (id: number) => {
    setConfirmModalData({
      id,
      message: "Tem certeza que deseja excluir este anúncio?",
      action: "delete",
    });
    setShowConfirmModal(true);
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Tem certeza que deseja desativar este anúncio?"
        : "Tem certeza que deseja ativar este anúncio?";

    setConfirmModalData({
      id,
      currentStatus,
      message: confirmMessage,
      action: "toggleStatus",
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmModalData) return;

    const { id, currentStatus, action } = confirmModalData;

    setShowConfirmModal(false);
    setConfirmModalData(null);

    if (action === "delete") {
      setDeletingId(id);
      const success = await deleteAdvertisement(id);
      setDeletingId(null);
      setOpenMenuId(null);

      if (!success) {
        alert("Erro ao excluir anúncio. Tente novamente.");
      }
    } else if (action === "toggleStatus" && currentStatus) {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

      setUpdatingStatusId(id);
      const success = await updateAdvertisementStatus(id, newStatus);
      setUpdatingStatusId(null);
      setOpenMenuId(null);

      if (!success) {
        alert("Erro ao atualizar status do anúncio. Tente novamente.");
      }
    }
  };

  const handleEdit = (id: number) => {
    // Encontrar o anúncio para verificar se é uma variação
    const ad = advertisements.find((a) => a.id === id);

    if (ad?.parentAdvertisementId) {
      // Se é uma variação, redireciona para editar o anúncio principal com a variação selecionada
      navigate(`/anuncio/${ad.parentAdvertisementId}/editar?variation=${id}`);
    } else {
      // Se é um anúncio principal, edita normalmente
      navigate(`/anuncio/${id}/editar`);
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === "Active") {
      return "text-green-600";
    }
    return "text-red-600";
  };

  const getStatusLabel = (status: string) => {
    if (status === "Active") {
      return "Ativo";
    }
    return "Inativo";
  };

  const getAdvertisementType = (ad: AdvertisementDTO) => {
    const hasSale =
      ad.sale && ad.sale.price !== null && ad.sale.price !== undefined;
    const hasTrade = ad.trade !== null && ad.trade !== undefined;

    if (hasSale && hasTrade) {
      return "Venda e Troca";
    } else if (hasSale) {
      return "Venda";
    } else if (hasTrade) {
      return "Troca";
    }
    return null;
  };

  const configIcon = () => {
    return (
      <>
        <div className="flex items-center gap-2">
          <IoMdSettings className="w-5 h-5 text-[#211C49] " />
          <ChevronDown className="w-3 h-3 text-[#211C49] " />
        </div>
      </>
    );
  };

  if (isLoading && advertisements.length === 0) {
    return (
      <>
        <Head title="Meus Anúncios" />
        <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
        <FilterTopBar />
        <div className="min-h-screen bg-[#f4f3f5] md:pt-20 pt-10 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#211C49] mx-auto mb-4" />
                <p className="text-gray-600">Carregando seus anúncios...</p>
              </div>
            </div>
          </div>
        </div>
        <BottomBar />
        <Footer showBackToTopButton={true} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head title="Meus Anúncios" />
        <TopBar logoPosition="left" showSearchBar={false} showUserMenu={true} />
        <FilterTopBar />
        <div className="min-h-screen bg-[#f4f3f5] md:pt-20 pt-10 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Erro ao carregar anúncios
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#38307c] text-white px-6 py-3 rounded-lg hover:bg-[#211C49] transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
        <BottomBar />
        <Footer showBackToTopButton={true} />
      </>
    );
  }

  // Layout Mobile - exatamente como a imagem
  if (isMobile) {
    return (
      <>
        <Head title="Meus Anúncios" />
        <div className="min-h-screen bg-[#f4f3f5] md:hidden">
          {/* Header roxo escuro */}
          <div className="bg-[#2B2560] text-white">
            <div className="flex bg-[#211C49] items-center px-4 py-4 pt-8">
              <button
                onClick={() => navigate("/meu-perfil")}
                className="p-2 -ml-2 focus:outline-none"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-lg font-bold ml-2">Meus Anúncios</h1>
            </div>
          </div>

          {/* Barra de busca */}
          <div className="[#f4f3f5] px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar em Anúncios"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#4A2C7C] text-black"
              />
            </div>
          </div>

          {/* Lista de anúncios */}
          <div className="bg-[#f4f3f5] min-h-screen pb-20">
            {isLoading && advertisements.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-[#211C49] mx-auto mb-4" />
                  <p className="text-gray-600">Carregando seus anúncios...</p>
                </div>
              </div>
            ) : filteredAds.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchTerm
                    ? "Nenhum anúncio encontrado"
                    : "Nenhum anúncio ainda"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Tente buscar por outro termo"
                    : "Comece criando seu primeiro anúncio!"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => navigate("/criar-anuncio")}
                    className="bg-[#483d9e] text-white px-6 py-3 rounded-lg hover:bg-[#3a2f7a] transition-colors"
                  >
                    Criar Anúncio
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-0">
                {filteredAds.map((ad, index) => {
                  const isInactive = ad.status === "Inactive";
                  const bgColor =
                    index % 2 === 0 ? "bg-[#f4f3f5]" : "bg-[#f4f3f5]";
                  const textColor = isInactive ? "text-gray-400" : "text-black";

                  return (
                    <div
                      key={ad.id}
                      className={`${bgColor} flex items-center gap-3 px-4 py-3 relative`}
                    >
                      {/* Imagem */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {ad.images?.[0]?.preSignedUrl || ad.images?.[0]?.url ? (
                          <img
                            src={ad.images[0].preSignedUrl || ad.images[0].url}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 text-xs">
                              Sem imagem
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Título */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-base font-medium ${textColor} truncate`}
                        >
                          {ad.title}
                        </h3>
                      </div>

                      {/* Menu de três pontos */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === ad.id ? null : ad.id)
                          }
                          className={`p-2 ${textColor} hover:bg-gray-200 rounded-full transition-colors`}
                          disabled={deletingId === ad.id}
                        >
                          {deletingId === ad.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <MoreVertical className="w-5 h-5" />
                          )}
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === ad.id && (
                          <>
                            {/* Overlay para fechar o menu */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />

                            {/* Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                              {/* Botão Ativar/Desativar baseado no status */}
                              <button
                                onClick={() =>
                                  handleToggleStatus(ad.id, ad.status)
                                }
                                className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                                  ad.status === "Active"
                                    ? "text-orange-600 hover:bg-orange-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                                disabled={updatingStatusId === ad.id}
                              >
                                {updatingStatusId === ad.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processando...
                                  </>
                                ) : (
                                  <>
                                    {ad.status === "Active" ? (
                                      <>
                                        <ToggleLeft className="w-4 h-4" />
                                        Desativar
                                      </>
                                    ) : (
                                      <>
                                        <ToggleRight className="w-4 h-4" />
                                        Ativar
                                      </>
                                    )}
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleEdit(ad.id)}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <PencilLine className="w-4 h-4" />
                                Editar
                              </button>

                              <button
                                onClick={() => handleDelete(ad.id)}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <BottomBar />
      </>
    );
  }

  return (
    <>
      <Head title="Meus Anúncios" />
      <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
      <FilterTopBar />

      <main className="bg-[#f4f3f5] flex flex-col items-center md:pt-20 pt-10 pb-12 px-4 font-lexend min-h-screen">
        <div className="w-full max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate("/meu-perfil")}
              className="text-[#211a21] text-sm font-normal hover:text-[#483d9e] transition-colors"
            >
              Meu perfil
            </button>
            <ChevronRight className="w-4 h-4 text-[#211a21]" />
            <span className="text-gray-900 text-sm font-normal">
              Meus Anúncios
            </span>
          </div>

          {/* Card Principal */}
          <div className="">
            <h1 className="text-2xl font-normal text-black mb-6 ">
              Meus Anúncios
            </h1>

            {/* Barra de Busca */}
            <div className="mb-6 max-w-96">
              <input
                type="text"
                placeholder="Buscar em Anúncios"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full  px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#483d9e] focus:border-transparent"
              />
            </div>

            {/* Informação de resultados */}
            {filteredAds.length > 0 && (
              <div className="mb-4 text-sm text-gray-600">
                Mostrando {startIndex + 1}-
                {Math.min(endIndex, filteredAds.length)} de {filteredAds.length}{" "}
                anúncio{filteredAds.length !== 1 ? "s" : ""}
              </div>
            )}

            {/* Lista de Anúncios */}
            {filteredAds.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchTerm
                    ? "Nenhum anúncio encontrado"
                    : "Nenhum anúncio ainda"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Tente buscar por outro termo"
                    : "Comece criando seu primeiro anúncio!"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => navigate("/criar-anuncio")}
                    className="bg-[#483d9e] text-white px-6 py-3 rounded-lg hover:bg-[#3a2f7a] transition-colors"
                  >
                    Criar Anúncio
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 ">
                {paginatedAds.map((ad) => {
                  const saleType = getAdvertisementType(ad);
                  return (
                    <div
                      key={ad.id}
                      className="relative flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow justify-between"
                    >
                      {/* Flag de tipo de anúncio - igual ao ProductCard */}
                      {saleType && (
                        <span className="absolute z-10 top-0 right-0 px-3 py-1 text-xs bg-[#38307C] text-white shadow-xl rounded-bl-lg">
                          {saleType}
                        </span>
                      )}

                      <div className="flex items-center gap-4">
                        {/* Imagem */}
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {ad.images?.[0]?.preSignedUrl ||
                          ad.images?.[0]?.url ? (
                            <img
                              src={
                                ad.images[0].preSignedUrl || ad.images[0].url
                              }
                              alt={ad.title}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-gray-400 text-xs">
                                Sem imagem
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Informações do Título*/}
                        <div className="flex-1 min-w-0 max-w-96">
                          <p className="text-xs text-gray-500 mb-1">Título</p>
                          <h3 className="text-sm md:text-base font-medium text-gray-900 truncate">
                            {ad.title}
                          </h3>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <span
                          className={`text-sm font-medium ${getStatusStyle(
                            ad.status
                          )}`}
                        >
                          {getStatusLabel(ad.status)}
                        </span>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center gap-2 flex-shrink-0 justify-end">
                        <button
                          onClick={() => handleEdit(ad.id)}
                          className="px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm bg-[#EDECF7] text-[#211C49] rounded-md hover:bg-[#C9C6E6] transition-colors"
                        >
                          Editar Anúncio
                        </button>

                        {/* Menu de Opções */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(openMenuId === ad.id ? null : ad.id)
                            }
                            className="p-2 hover:bg-[#C9C6E6] rounded-md transition-colors bg-[#EDECF7]"
                            disabled={deletingId === ad.id}
                          >
                            {deletingId === ad.id ? (
                              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                            ) : (
                              configIcon()
                            )}
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === ad.id && (
                            <>
                              {/* Overlay para fechar o menu */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />

                              {/* Menu */}
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                {/* Botão Ativar/Desativar baseado no status */}
                                <button
                                  onClick={() =>
                                    handleToggleStatus(ad.id, ad.status)
                                  }
                                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                                    ad.status === "Active"
                                      ? "text-orange-600 hover:bg-orange-50"
                                      : "text-green-600 hover:bg-green-50"
                                  }`}
                                  disabled={updatingStatusId === ad.id}
                                >
                                  {updatingStatusId === ad.id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Processando...
                                    </>
                                  ) : (
                                    <>
                                      {ad.status === "Active" ? (
                                        <>
                                          <ToggleLeft className="w-4 h-4" />
                                          Desativar
                                        </>
                                      ) : (
                                        <>
                                          <ToggleRight className="w-4 h-4" />
                                          Ativar
                                        </>
                                      )}
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => handleDelete(ad.id)}
                                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Excluir
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Paginação */}
            {filteredAds.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4 rotate-90"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.5 1L15 7.5L8.5 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="flex gap-2">
                  {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                      <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          currentPage === page
                            ? "bg-[#4f43ae] text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className="px-4 py-2 text-sm font-bold">
                        {page}
                      </span>
                    )
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4 -rotate-90"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.5 1L15 7.5L8.5 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Confirmação */}
      {showConfirmModal && confirmModalData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-[#2B2560]" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Ação
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmModalData(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {confirmModalData.message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmModalData(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAction}
                className="flex-1 px-4 py-2 bg-[#2B2560] text-white rounded-lg hover:bg-[#1f1a45] transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomBar />
      <Footer showBackToTopButton={true} />
    </>
  );
};

export default MyAds;
