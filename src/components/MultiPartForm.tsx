import React, { useState } from "react";
import { Camera, Check } from "lucide-react";

const MultiPartForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Etapa 1
    titulo: "",
    estoque: "",
    descricao: "",

    // Etapa 2
    jogo: "",
    tipoCartucho: "",
    estadoPreservacao: "",
    regiao: "",
    idiomaAudio: "",
    idiomaLegenda: "",
    idiomaInterface: "",

    // Etapa 3
    jogosTroca: "",
    tiposTroca: "",
    estadosTroca: "",
    regioesTroca: "",
    idiomasAudioTroca: "",
    idiomasLegendaTroca: "",
    idiomasInterfaceTroca: "",

    // Etapa 4
    imagens: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, imagens: [...prev.imagens, ...files] }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Cabeçalho dos steps
  const StepHeader = ({ title, subtitle, step }) => {
    const steps = [1, 2, 3, 4, 5];

    return (
      <div className="bg-[#38307C] text-white p-4 rounded-t-sm text-center">
        <h2 className="text-lg">{title}</h2>
        <p className="text-sm">{subtitle}</p>

        {/* Stepper */}
        <div className="flex items-center justify-center mt-3 w-full max-w-3xl mx-auto">
          {steps.map((i, idx) => (
            <React.Fragment key={i}>
              {/* Círculo */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium
          ${
            i <= step
              ? "bg-[#211C49] text-white"
              : "bg-[#DDDDF3] text-[#38307C]"
          }`}
              >
                {i <= step ? <Check className="w-4 h-4" /> : i}
              </div>

              {/* Linha entre steps */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 transition-all
            ${i < step + 1 ? "bg-[#211C49]" : "bg-[#DDDDF3]"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="lg:mx-52 shadow-lg rounded-sm overflow-hidden border justify-center">
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <StepHeader
            title="Informações Básicas"
            subtitle="Comece preenchendo as informações básicas sobre o anúncio"
            step={step - 1}
          />
          <div className="p-6 space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Título do Anúncio
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="Insira o título do anúncio"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Estoque disponível
              </label>
              <input
                type="number"
                name="estoque"
                value={formData.estoque}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="Insira o estoque disponível"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder="Descreva a condição e detalhes do produto"
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
            subtitle="Agora adicione os detalhes sobre o cartucho que está sendo anunciado"
            step={step - 1}
          />
          <div className="p-6 space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Jogo</label>
              <select
                name="jogo"
                value={formData.jogo}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Jogo 1">Jogo 1</option>
                <option value="Jogo 2">Jogo 2</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Tipo de Cartucho
              </label>
              <select
                name="tipoCartucho"
                value={formData.tipoCartucho}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Retro">Retrô</option>
                <option value="Repro">Repro</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Estado de Preservação
              </label>
              <select
                name="estadoPreservacao"
                value={formData.estadoPreservacao}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Novo">Novo</option>
                <option value="Usado">Usado</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Região do Cartucho
              </label>
              <select
                name="regiao"
                value={formData.regiao}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="NTSC">NTSC</option>
                <option value="PAL">PAL</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Idiomas do Áudio
              </label>
              <select
                name="idiomaAudio"
                value={formData.idiomaAudio}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Inglês">Inglês</option>
                <option value="Português">Português</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Idiomas da Legenda
              </label>
              <select
                name="idiomaLegenda"
                value={formData.idiomaLegenda}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Inglês">Inglês</option>
                <option value="Português">Português</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Idiomas da Interface
              </label>
              <select
                name="idiomaInterface"
                value={formData.idiomaInterface}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Inglês">Inglês</option>
                <option value="Português">Português</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <StepHeader
            title="Condições de Troca"
            subtitle="Antes de prosseguir, especifique as condições para a troca do cartucho"
            step={step - 1}
          />
          <div className="p-6 space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Jogo</label>
              <select
                name="jogoTroca"
                value={formData.jogosTroca}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Jogo 1">Jogo 1</option>
                <option value="Jogo 2">Jogo 2</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Tipo de Cartucho
              </label>
              <select
                name="tipoCartuchoTroca"
                value={formData.tiposTroca}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Retro">Retrô</option>
                <option value="Repro">Repro</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Estado de Preservação
              </label>
              <select
                name="estadoPreservacaoTroca"
                value={formData.estadosTroca}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Novo">Novo</option>
                <option value="Usado">Usado</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Região do Cartucho
              </label>
              <select
                name="regiaoTroca"
                value={formData.regioesTroca}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="NTSCU">NTSC-U</option>
                <option value="NTSCJ">NTSC-J</option>
                <option value="PALA">PAL-A</option>
                <option value="PALB">PAL-B</option>
                <option value="PAL">PAL</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Idiomas do Áudio
              </label>
              <select
                name="idiomaAudioTroca"
                value={formData.idiomasAudioTroca}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Inglês">Inglês</option>
                <option value="Português">Português</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Idiomas da Legenda
              </label>
              <select
                name="idiomaLegendaTroca"
                value={formData.idiomasLegendaTroca}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Inglês">Inglês</option>
                <option value="Português">Português</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Idiomas da Interface
              </label>
              <select
                name="idiomaInterfaceTroca"
                value={formData.idiomasInterfaceTroca}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="">Selecione um item...</option>
                <option value="Inglês">Inglês</option>
                <option value="Português">Português</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && (
  <>
    <StepHeader
      title="Imagens e Vídeos"
      subtitle="Nós já estamos finalizando, envie fotos e vídeos do seu cartucho"
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

        {/* Caixas responsivas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <label
              key={i}
              className="w-full aspect-square border-2 border-dashed border-purple-400 rounded-lg
                         flex flex-col items-center justify-center cursor-pointer text-center text-sm text-gray-600
                         hover:bg-purple-50 hover:border-purple-600 hover:text-purple-600 transition"
            >
              <Camera className="w-6 h-6 mb-1 text-purple-500" />
              Incluir Fotos e Vídeos
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ))}
        </div>

        {/* Aviso */}
        {formData.tipoCartucho === "Retro" && (
          <p className="text-sm">
            <span className="font-semibold">Atenção:</span> Identificamos que seu Cartucho foi
            marcado como retrô, é obrigatório incluir fotos dos códigos de autenticação. Veja nosso{" "}
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
            title="Adicionar Variação"
            subtitle="Tem mais de um cartucho do mesmo jogo para anunciar?"
            step={step - 1}
          />
          <div className="p-6">
            <button className="w-full border-2 border-dashed p-4 rounded-lg text-gray-500">
              Adicionar nova variação
            </button>
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
        <button
          onClick={nextStep}
          className="px-4 py-2 rounded-lg bg-[#483D9E] text-white hover:bg-purple-700"
        >
          {step === 5 ? "Finalizar" : "Confirmar"}
        </button>
      </div>
    </div>
  );
};

export default MultiPartForm;
