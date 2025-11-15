import React from "react";
import { useStatistics } from "../hooks/useStatistics";
import TopBar from "../components/TopBar";
import Head from "../components/Head";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

// Paleta de cores do projeto
const projectColors = [
  "#211C49", // Roxo escuro principal
  "#2B2560", // Roxo médio
  "#38307c", // Roxo
  "#4f43ae", // Roxo claro
  "#483d9e", // Roxo médio-claro
  "#5a4fb8", // Roxo claro alternativo
  "#6b5fc2", // Roxo mais claro
  "#7c6fcc", // Roxo claro
];

// Função para obter cor baseada no índice
const getColor = (index: number) => {
  return projectColors[index % projectColors.length];
};

// Componente de gráfico de barras
const BarChart: React.FC<{
  data: Array<{ id: string; value: number; fullTerm?: string }>;
  title: string;
}> = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  // Garantir que não há IDs duplicados
  const uniqueData = data.map((item, index) => ({
    id: item.id || `item-${index}`,
    value: item.value,
    fullTerm: item.fullTerm || item.id,
  }));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="h-64">
        <ResponsiveBar
          data={uniqueData}
          keys={["value"]}
          indexBy="id"
          margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={(bar) => getColor(bar.index)}
          layout="vertical"
          enableLabel={true}
          isInteractive={true}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "",
            legendPosition: "middle",
            legendOffset: 50,
            format: (value) => {
              // Remover o número do início se existir (ex: "1. termo" -> "termo")
              return value.toString().replace(/^\d+\.\s*/, "");
            },
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Quantidade",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
          tooltip={({ indexValue, value, data: tooltipData }) => {
            // Usar o termo completo se disponível, senão usar o indexValue
            const displayText =
              (tooltipData as { fullTerm?: string })?.fullTerm || indexValue;
            return (
              <div className="bg-white border border-gray-300 rounded shadow-lg px-3 py-2 min-w-[200px] max-w-[400px]">
                <div className="text-sm font-semibold text-gray-800 break-words">
                  {displayText}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Quantidade: {value}
                </div>
              </div>
            );
          }}
          animate={true}
          motionConfig="gentle"
        />
      </div>
    </div>
  );
};

// Componente de gráfico de linha
const LineChart: React.FC<{
  data: Array<{ x: string; y: number }>;
  title: string;
}> = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const chartData = [
    {
      id: "data",
      data: data,
      color: "#211C49", // Cor principal do projeto
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="h-64">
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: "Mês",
            legendOffset: 50,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Quantidade",
            legendOffset: -50,
            legendPosition: "middle",
          }}
          colors={["#211C49"]}
          pointSize={8}
          pointColor="#211C49"
          pointBorderWidth={2}
          pointBorderColor="#ffffff"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[]}
          animate={true}
          motionConfig="gentle"
        />
      </div>
    </div>
  );
};

// Componente de gráfico de pizza
const PieChart: React.FC<{
  data: Array<{ id: string; value: number }>;
  title: string;
}> = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  // Adicionar cores aos dados baseado no índice
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: getColor(index),
  }));

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="h-64">
        <ResponsivePie
          data={dataWithColors}
          margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          colors={(d) => d.data.color}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#ffffff"
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#333333",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#211C49",
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionConfig="gentle"
        />
      </div>
    </div>
  );
};

const Reports: React.FC = () => {
  const { statistics, isLoading, error, refetch } = useStatistics();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Preparar dados para os gráficos
  // Termos mais pesquisados
  const mostSearchedTermsData =
    statistics?.mostSearchedTerms?.slice(0, 10).map((item, index) => ({
      id: `${index + 1}. ${
        item.term.length > 30 ? `${item.term.substring(0, 30)}...` : item.term
      }`,
      value: item.amount,
      fullTerm: item.term, // Guardar o termo completo para o tooltip
    })) || [];

  // Jogos mais anunciados
  const mostAdvertisedGamesData =
    statistics?.mostAdvertisedGames?.slice(0, 10).map((item) => ({
      id:
        item.gameName.length > 30
          ? `${item.gameName.substring(0, 30)}...`
          : item.gameName,
      value: item.advertisementCount,
    })) || [];

  // Anúncios por status (para gráfico de pizza)
  const advertisementsByStatusData = statistics
    ? [
        {
          id: "Ativos",
          value: statistics.amountOfActiveAdvertisements || 0,
        },
        {
          id: "Inativos",
          value: statistics.amountOfInactiveAdvertisements || 0,
        },
        {
          id: "Indisponíveis",
          value: statistics.amountOfUnavailableAdvertisements || 0,
        },
      ].filter((item) => item.value > 0)
    : [];

  if (isMobile) {
    return (
      <>
        <Head title="Relatórios e Estatísticas" />
        <div className="min-h-screen bg-[#f4f3f5]">
          {/* Header */}
          <div className="bg-[#2B2560] text-white">
            <div className="flex items-center px-4 py-4 pt-8">
              <button
                onClick={() => navigate("/meu-perfil")}
                className="p-2 -ml-2 focus:outline-none"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-lg font-light ml-2">Relatórios</h1>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-4 pb-32">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#211C49]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={refetch}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : statistics ? (
              <div className="space-y-6">
                {/* Cards de resumo */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-bold text-[#211C49]">
                      {statistics.amountOfUsers || 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Anúncios Ativos</p>
                    <p className="text-2xl font-bold text-[#4f43ae]">
                      {statistics.amountOfActiveAdvertisements || 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Anúncios Inativos</p>
                    <p className="text-2xl font-bold text-[#38307c]">
                      {statistics.amountOfInactiveAdvertisements || 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">Termos Pesquisados</p>
                    <p className="text-2xl font-bold text-[#2B2560]">
                      {statistics.amountOfTermsSearched || 0}
                    </p>
                  </div>
                </div>

                {/* Gráficos */}
                {mostAdvertisedGamesData.length > 0 && (
                  <BarChart
                    data={mostAdvertisedGamesData}
                    title="Top 10 Jogos Mais Anunciados"
                  />
                )}
                {mostSearchedTermsData.length > 0 && (
                  <BarChart
                    data={mostSearchedTermsData}
                    title="Top 10 Termos Mais Pesquisados"
                  />
                )}
                {advertisementsByStatusData.length > 0 && (
                  <PieChart
                    data={advertisementsByStatusData}
                    title="Anúncios por Status"
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
        <BottomBar />
      </>
    );
  }

  return (
    <>
      <Head title="Relatórios e Estatísticas" />
      <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
      <FilterTopBar />

      <main className="bg-[#f4f3f5] min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/meu-perfil")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-3xl font-normal text-black">
                Relatórios e Estatísticas
              </h1>
            </div>
            <button
              onClick={refetch}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#211C49] text-white rounded-lg hover:bg-[#2B2560] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Atualizar
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#211C49] mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando estatísticas...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : statistics ? (
            <div className="space-y-8">
              {/* Cards de resumo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">
                    Total de Usuários
                  </p>
                  <p className="text-3xl font-bold text-[#211C49]">
                    {statistics.amountOfUsers || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">Anúncios Ativos</p>
                  <p className="text-3xl font-bold text-[#4f43ae]">
                    {statistics.amountOfActiveAdvertisements || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">
                    Anúncios Inativos
                  </p>
                  <p className="text-3xl font-bold text-[#38307c]">
                    {statistics.amountOfInactiveAdvertisements || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">
                    Anúncios Indisponíveis
                  </p>
                  <p className="text-3xl font-bold text-[#2B2560]">
                    {statistics.amountOfUnavailableAdvertisements || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">
                    Total de Anúncios
                  </p>
                  <p className="text-3xl font-bold text-[#483d9e]">
                    {(statistics.amountOfActiveAdvertisements || 0) +
                      (statistics.amountOfInactiveAdvertisements || 0) +
                      (statistics.amountOfUnavailableAdvertisements || 0)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2">
                    Termos Pesquisados
                  </p>
                  <p className="text-3xl font-bold text-[#5a4fb8]">
                    {statistics.amountOfTermsSearched || 0}
                  </p>
                </div>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {advertisementsByStatusData.length > 0 && (
                  <PieChart
                    data={advertisementsByStatusData}
                    title="Anúncios por Status"
                  />
                )}
                {mostSearchedTermsData.length > 0 && (
                  <BarChart
                    data={mostSearchedTermsData}
                    title="Top 10 Termos Mais Pesquisados"
                  />
                )}
              </div>

              {mostAdvertisedGamesData.length > 0 && (
                <BarChart
                  data={mostAdvertisedGamesData}
                  title="Top 10 Jogos Mais Anunciados"
                />
              )}
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
      <BottomBar />
    </>
  );
};

export default Reports;
