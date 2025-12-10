import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import TopBar from "../components/TopBar";
import FilterTopBar from "../components/FilterTopBar";
import Footer from "../components/Footer";
import BottomBar from "../components/BottomBar";
import Head from "../components/Head";

const CartridgeGuide: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Head title="Guia: Como Identificar Informações no Cartucho" />
      <TopBar logoPosition="left" showSearchBar={true} showUserMenu={true} />
      <FilterTopBar />

      <main className="bg-[#f4f3f5] min-h-screen py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#4f43ae] hover:text-[#3d3487] mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Guia: Como Identificar Informações no Cartucho
            </h1>
            <p className="text-gray-600">
              Aprenda a identificar corretamente as características do seu
              cartucho para criar anúncios precisos
            </p>
          </div>

          {/* Seção: Tipo de Cartucho */}
          <section className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#4f43ae] rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Tipo de Cartucho
              </h2>
            </div>

            <div className="space-y-8">
          

              {/* Retro - Detalhado */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    RETRÔ (Original)
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Cartucho original fabricado na época de lançamento do jogo
                  pela Nintendo ou fabricante licenciado.
                </p>

                {/* Etiqueta Frontal */}
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <span>1.</span> Etiqueta Frontal
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="aspect-video bg-white rounded border border-green-200 overflow-hidden relative">
                        <img
                          src="https://tm.ibxk.com.br/2024/04/05/05110657090113.jpg?ims=fit-in/800x500/filters:quality(70)"
                          alt="Etiqueta frontal original com faixa vermelha"
                          className="w-full h-full object-contain bg-white"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const placeholder =
                              target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-white border border-green-200 flex items-center justify-center hidden">
                          <div className="text-center text-gray-500 text-xs p-2">
                            <p className="font-medium mb-1">
                              Etiqueta com Faixa Vermelha
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="aspect-video bg-white rounded border border-green-200 overflow-hidden relative">
                        <img
                          src="https://tm.ibxk.com.br/2024/04/05/05110823065114.jpg?ims=fit-in/800x500/filters:quality(70)"
                          alt="Código no lado esquerdo do adesivo"
                          className="w-full h-full object-contain bg-white"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const placeholder =
                              target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-white border border-green-200 flex items-center justify-center hidden">
                          <div className="text-center text-gray-500 text-xs p-2">
                            <p className="font-medium mb-1">
                              Código no Canto Esquerdo
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="aspect-video bg-white rounded border border-green-200 overflow-hidden relative">
                        <img
                          src="https://tm.ibxk.com.br/2024/04/05/05111330549115.jpg?ims=fit-in/800x500/filters:quality(70)"
                          alt="Cartucho japonês com código único"
                          className="w-full h-full object-contain bg-white"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const placeholder =
                              target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-white border border-green-200 flex items-center justify-center hidden">
                          <div className="text-center text-gray-500 text-xs p-2">
                            <p className="font-medium mb-1">Cartucho Japonês</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                      <li>Impressão profissional e nítida</li>
                      <li>Cores vivas e bem definidas</li>
                      <li>
                        Logotipo oficial do console (Nintendo, Sega, etc.)
                      </li>
                      <li>Número de modelo oficial do fabricante</li>
                      <li>Fonte e layout idênticos aos originais</li>
                      <li>Código de barras (quando aplicável)</li>
                      <li>
                        <strong>Faixa vermelha ou roxa</strong> na parte
                        superior (títulos exclusivos)
                      </li>
                      <li>
                        <strong>Código no canto inferior esquerdo</strong> junto
                        ao "Made in (país)"
                      </li>
                      <li>
                        <strong>Cartuchos japoneses:</strong> Código único em
                        partes diferentes do adesivo
                      </li>
                      <li>
                        <strong>Cartuchos nacionais (Brasil):</strong> Todos
                        possuem faixa vermelha, mas podem não ter código
                        impresso no adesivo
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Etiqueta Traseira */}
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <span>2.</span> Etiqueta Traseira
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="aspect-video bg-white rounded border border-green-200 overflow-hidden relative">
                      <img
                        src="https://tm.ibxk.com.br/2024/04/05/05113305132137.jpg?ims=fit-in/800x500/filters:quality(70)"
                        alt="Etiqueta traseira original"
                        className="w-full h-full object-contain bg-white"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const placeholder =
                            target.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = "flex";
                        }}
                      />
                      <div className="absolute inset-0 bg-white border border-green-200 flex items-center justify-center hidden">
                        <div className="text-center text-gray-500 text-xs p-2">
                          <p className="font-medium mb-1">
                            Foto: Etiqueta Traseira Original
                          </p>
                          <p>Com logotipo e avisos oficiais</p>
                        </div>
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                      <li>Etiqueta cinza com avisos de precaução</li>
                      <li>Logotipo da Nintendo ou fabricante</li>
                      <li>Informações de copyright</li>
                      <li>Número de série ou código de identificação</li>
                      <li>
                        <strong>Código gravado abaixo do adesivo</strong>{" "}
                        (visível ao remover o adesivo)
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Parafusos e Construção */}
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <span>3.</span> Parafusos e Construção
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="aspect-video bg-white rounded border border-green-200 overflow-hidden relative">
                        <img
                          src="https://tm.ibxk.com.br/2024/04/05/05113012132125.jpg?ims=fit-in/800x500/filters:quality(70)"
                          alt="Parafusos dourados originais"
                          className="w-full h-full object-contain bg-white"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const placeholder =
                              target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-white border border-green-200 flex items-center justify-center hidden">
                          <div className="text-center text-gray-500 text-xs p-2">
                            <p className="font-medium mb-1">Parafuso Dourado</p>
                          </div>
                        </div>
                      </div>
                      <div className="aspect-video bg-white rounded border border-green-200 overflow-hidden relative">
                        <img
                          src="https://tm.ibxk.com.br/2024/04/05/05113051682133.jpg?ims=fit-in/800x500/filters:quality(70)"
                          alt="Parafusos cromados"
                          className="w-full h-full object-contain bg-white"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const placeholder =
                              target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-white border border-green-200 flex items-center justify-center hidden">
                          <div className="text-center text-gray-500 text-xs p-2">
                            <p className="font-medium mb-1">Parafuso Cromado</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                      <li>
                        <strong>Parafusos dourados</strong> em cartuchos normais
                        (formato Gamebit especial)
                      </li>
                      <li>
                        <strong>Parafusos cromados</strong> em cartuchos com
                        frente fechada
                      </li>
                      <li>Plástico de alta qualidade e peso adequado</li>
                      <li>Textura e acabamento profissional</li>
                      <li>Pinos de contato com acabamento refinado</li>
                      <li>Encastre perfeito entre as partes</li>
                    </ul>
                  </div>
                </div>

                {/* Componentes Internos */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <span>4.</span> Componentes Internos (ao abrir)
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="aspect-video bg-white rounded border border-green-200 overflow-hidden relative">
                        <img
                          src="https://tm.ibxk.com.br/2024/04/05/05113739279138.jpg?ims=fit-in/800x500/filters:quality(70)"
                          alt="Código na parte inferior do cartucho"
                          className="w-full h-full object-contain bg-white"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const placeholder =
                              target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-white border border-green-200 flex items-center justify-center hidden">
                          <div className="text-center text-gray-500 text-xs p-2">
                            <p className="font-medium mb-1">Código Inferior</p>
                          </div>
                        </div>
                      </div>
                      <div className="aspect-video bg-white rounded border border-green-200 overflow-hidden relative">
                        <img
                          src="https://tm.ibxk.com.br/2024/04/05/05114631836147.jpg?ims=fit-in/800x500/filters:quality(70)"
                          alt="Placa interna com código e logo dourado"
                          className="w-full h-full object-contain bg-white"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const placeholder =
                              target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-white border border-green-200 flex items-center justify-center hidden">
                          <div className="text-center text-gray-500 text-xs p-2">
                            <p className="font-medium mb-1">
                              Placa Interna com Logo
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="aspect-video bg-white rounded border border-green-200 overflow-hidden relative">
                        <img
                          src="https://tm.ibxk.com.br/2024/04/05/05114958659148.jpg?ims=fit-in/800x500/filters:quality(70)"
                          alt="Mask ROM com código"
                          className="w-full h-full object-contain bg-white"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const placeholder =
                              target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 bg-white border border-green-200 flex items-center justify-center hidden">
                          <div className="text-center text-gray-500 text-xs p-2">
                            <p className="font-medium mb-1">Mask ROM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                      <li>
                        <strong>Código na parte inferior</strong> do cartucho
                        (perto dos conectores)
                      </li>
                      <li>
                        <strong>Código na placa de circuito</strong> (ao abrir o
                        cartucho)
                      </li>
                      <li>
                        <strong>Logotipo da Nintendo em dourado</strong> na
                        placa
                      </li>
                      <li>
                        <strong>Chips Mask ROM originais</strong> com código que
                        deve corresponder ao da etiqueta externa
                      </li>
                      <li>Componentes específicos do fabricante</li>
                      <li>Solda profissional e organizada</li>
                      <li>
                        <strong>Importante:</strong> O código da Mask ROM deve
                        ser igual ao código da etiqueta externa
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Repro - Detalhado */}
              <div className="border-l-4 border-orange-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    REPRO (Reprodução)
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Cópia não oficial, pode ter sido modificada, traduzida ou
                  reproduzida sem autorização do fabricante.
                </p>

                {/* Etiqueta Frontal */}
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <span>1.</span> Etiqueta Frontal
                  </h4>
                  <div className="grid md:grid-cols-1 gap-4">
                    
                    <ul className="list-disc list-inside space-y-1 text-orange-800 text-sm">
                      <li>Impressão borrada ou com qualidade inferior</li>
                      <li>Cores desbotadas ou diferentes do original</li>
                      <li>
                        Falta de logotipo oficial ou logotipo mal reproduzido
                      </li>
                      <li>Fonte diferente da original</li>
                      <li>
                        Texto em português em jogos que originalmente não tinham
                      </li>
                      <li>Etiqueta colada manualmente ou mal alinhada</li>
                      <li>Ausência de código de barras ou código diferente</li>
                    </ul>
                  </div>
                </div>

                {/* Etiqueta Traseira */}
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <span>2.</span> Etiqueta Traseira
                  </h4>
                  <div className="grid md:grid-cols-1 gap-4">
                    
                    <ul className="list-disc list-inside space-y-1 text-orange-800 text-sm">
                      <li>Ausência de etiqueta traseira</li>
                      <li>Etiqueta com informações diferentes</li>
                      <li>Falta de logotipo oficial</li>
                      <li>Texto em português quando não deveria ter</li>
                    </ul>
                  </div>
                </div>

                {/* Parafusos e Construção */}
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <span>3.</span> Parafusos e Construção
                  </h4>
                  <div className="grid md:grid-cols-1 gap-4">
                    
              
                    <ul className="list-disc list-inside space-y-1 text-orange-800 text-sm">
                      <li>Parafusos comuns (não Gamebit) ou diferentes</li>
                      <li>Plástico mais leve ou de qualidade inferior</li>
                      <li>Textura diferente ou mais brilhante</li>
                      <li>Pinos de contato com acabamento menos refinado</li>
                      <li>Encastre com folgas ou imperfeições</li>
                    </ul>
                  </div>
                </div>

                {/* Componentes Internos */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <span>4.</span> Componentes Internos (ao abrir)
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="list-disc list-inside space-y-1 text-orange-800 text-sm">
                      <li>Ausência de código impresso na placa</li>
                      <li>Falta de logotipo da Nintendo em dourado</li>
                      <li>Chips modernos ou diferentes (não Mask ROM)</li>
                      <li>Componentes diferentes dos originais</li>
                      <li>Solda amadora ou desorganizada</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dica Final */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-blue-900 font-semibold mb-2">
                  💡 Dicas Importantes:
                </p>
                <ul className="text-blue-800 text-sm space-y-2 list-disc list-inside">
                  <li>
                    <strong>Desconfie de preços muito baixos</strong>,
                    especialmente em jogos raros
                  </li>
                  <li>
                    <strong>Cartuchos em perfeito estado são raros</strong> e
                    valem muito - desconfie se o preço não reflete isso
                  </li>
                  <li>
                    <strong>Peça prova de funcionamento</strong> - pode ser uma
                    carcaça original com placa falsa ou defeituosa
                  </li>
                  <li>
                    <strong>Compare códigos:</strong> O código da Mask ROM deve
                    ser igual ao código da etiqueta externa
                  </li>
                  <li>
                    <strong>Quando em dúvida, seja honesto</strong> e mencione
                    no anúncio que não tem certeza sobre a autenticidade
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seção: Estado de Preservação */}
          <section className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#4f43ae] rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Estado de Preservação
              </h2>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Novo
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  Produto lacrado, nunca utilizado, em perfeito estado.
                  Embalagem intacta.
                </p>
                <p className="text-gray-600 text-xs italic">
                  Verifique: Embalagem original selada, sem sinais de abertura
                  ou uso.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Seminovo
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  Produto usado, sem danos visuais significativos.
                </p>
                <p className="text-gray-600 text-xs italic">
                  Verifique: Pode ter sido usado algumas vezes, mas mantém
                  aparência quase nova.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-600" />
                  Bom
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  Produto com sinais leves de uso, como pequenos arranhões,
                  desgaste na capa, leve amarelamento no cartucho.
                </p>
                <p className="text-gray-600 text-xs italic">
                  Verifique: Pequenos arranhões na etiqueta ou no plástico, mas
                  ainda em bom estado geral.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Normal
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  Produto com desgaste visível, como arranhões, amarelamento no
                  cartucho ou rótulo parcialmente danificado.
                </p>
                <p className="text-gray-600 text-xs italic">
                  Verifique: Desgaste visível mas funcional, etiqueta pode estar
                  desgastada ou parcialmente solta.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Danificado
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  Produto bastante desgastado, com rótulo danificado ou ausente.
                  Pode conter trincas ou manchas.
                </p>
                <p className="text-gray-600 text-xs italic">
                  Verifique: Etiqueta muito danificada ou ausente, trincas no
                  plástico, manchas ou desgaste severo.
                </p>
              </div>
            </div>
          </section>

          {/* Seção: Região */}
          <section className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#4f43ae] rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Região</h2>
            </div>

            <p className="text-gray-700 mb-4">
              A região do cartucho determina a compatibilidade com consoles e
              pode afetar o idioma do jogo.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Onde encontrar:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Etiqueta do cartucho (código de região)</li>
                  <li>Manual do jogo (se disponível)</li>
                  <li>Embalagem original (código de barras ou selo)</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Regiões comuns:
                </h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>
                    <strong>NTSC-U:</strong> América do Norte (EUA/Canadá)
                  </li>
                  <li>
                    <strong>NTSC-J:</strong> Japão
                  </li>
                  <li>
                    <strong>PAL:</strong> Europa, Austrália, Brasil
                  </li>
                  <li>
                    <strong>NTSC-C:</strong> China
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <p className="text-blue-900 text-sm">
                <strong>Dica:</strong> Procure por códigos como "USA", "EUR",
                "JPN" ou símbolos de região na etiqueta do cartucho.
              </p>
            </div>
          </section>

          {/* Seção: Idiomas */}
          <section className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#4f43ae] rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Idiomas</h2>
            </div>

            <p className="text-gray-700 mb-4">
              Identifique os idiomas suportados pelo jogo em diferentes
              aspectos:
            </p>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Idioma do Áudio
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  Idioma falado durante o jogo (diálogos, narração, efeitos
                  sonoros com fala).
                </p>
                <p className="text-gray-600 text-xs italic">
                  Como verificar: Inicie o jogo e ouça os diálogos ou narração.
                  Verifique também o manual ou embalagem.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Idioma da Legenda
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  Idioma das legendas exibidas durante o jogo (se disponível).
                </p>
                <p className="text-gray-600 text-xs italic">
                  Como verificar: Verifique as opções de configuração do jogo ou
                  o manual.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Idioma da Interface
                </h3>
                <p className="text-gray-700 text-sm mb-2">
                  Idioma dos menus, textos da interface e instruções na tela.
                </p>
                <p className="text-gray-600 text-xs italic">
                  Como verificar: Inicie o jogo e observe os menus principais,
                  opções e textos da interface.
                </p>
              </div>
            </div>
          </section>

          {/* Seção: Dicas Gerais */}
          <section className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#4f43ae] rounded-lg flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Dicas Gerais</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Fotografe bem o cartucho
                  </p>
                  <p className="text-gray-600 text-sm">
                    Tire fotos claras e bem iluminadas de todos os lados do
                    cartucho, especialmente da etiqueta.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Verifique o manual
                  </p>
                  <p className="text-gray-600 text-sm">
                    Se você tiver o manual original, ele geralmente contém
                    informações sobre região e idiomas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Teste o cartucho</p>
                  <p className="text-gray-600 text-sm">
                    Se possível, teste o cartucho em um console para verificar
                    os idiomas disponíveis e se funciona corretamente.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">Seja honesto</p>
                  <p className="text-gray-600 text-sm">
                    Descreva o estado real do cartucho. Isso evita problemas
                    futuros e constrói confiança com compradores.
                  </p>
                </div>
              </div>
            </div>
          </section>



          {/* Call to Action */}
          <div className="bg-[#38307C] rounded-lg p-6 md:p-8 text-white text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Pronto para criar seu anúncio?
            </h2>
            <p className="mb-4 opacity-90">
              Agora que você sabe como identificar as informações do cartucho,
              crie um anúncio preciso e completo!
            </p>
            <button
              onClick={() => navigate("/criar-anuncio")}
              className="bg-white text-[#4f43ae] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Criar Anúncio
            </button>
          </div>
        <section>
        <div className="bg-white rounded-lg p-6 md:p-8 text-start">
            <h2 className="text-2xl font-bold mb-2">
              Fonte:
            </h2>
            <p className=" opacity-90">
              Confira com mais detalhes em:
            </p>
            <a href="https://www.tecmundo.com.br/voxel/282134-saber-cartucho-super-nintendo-original.htm" className="text-blue-500">https://www.tecmundo.com.br/voxel/282134-saber-cartucho-super-nintendo-original.htm</a>
          </div>
        </section>
        </div>

      </main>

      <Footer
        showBackToTopButton={true}
        onBackToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
      <BottomBar />
    </>
  );
};

export default CartridgeGuide;
