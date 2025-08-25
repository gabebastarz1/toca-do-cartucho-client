import React, { useState } from "react";
import { Camera, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InfoTooltip from "./InfoToolTip";
import CustomSelect from "./ui/CustomSelect";
import ConfirmButton from "./ui/ConfirmButton";
import ModalAlert from "./ui/ModalAlert";

const MultiPartForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showVariationForm, setShowVariationForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    estoque: "",
    descricao: "",

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

    imagens: [],
  });

  const [variationData, setVariationData] = useState({
    tipoCartucho: "",
    estadoPreservacao: "",
    regiao: "",
    idiomaAudio: "",
    idiomaLegenda: "",
    idiomaInterface: "",
    preco: "",
    estoque: "",
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
    setVariationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, imagens: [...prev.imagens, ...files] }));
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinish = () => {
    // Aqui você pode adicionar a lógica de envio do formulário
    // Por exemplo, validações, chamadas para API, etc.

    // Simular envio bem-sucedido
    console.log("Formulário enviado:", formData);
    setShowSuccessMessage(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const steps = [1, 2, 3, 4, 5];

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
                <label className="block mb-1 text-sm font-bold">
                  Título do Anúncio
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  placeholder="Insira o título do anúncio"
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
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
                  className="w-full border rounded p-2"
                />
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
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-bold">Jogo</label>
                <CustomSelect
                  options={jogos}
                  value={jogos.find((o) => o.value === formData.jogo)}
                  onChange={(opt) => handleSelectChange("jogo", opt.value)}
                  placeholder="Selecione o jogo do cartucho"
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
            />
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-bold">Jogo</label>
                <CustomSelect
                  options={jogos}
                  value={jogos.find((o) => o.value === formData.jogosTroca)}
                  onChange={(opt) =>
                    handleSelectChange("jogosTroca", opt.value)
                  }
                  placeholder="Selecione o jogo desejado para troca"
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

                {/* input file */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
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
              title="Adicionar Variação"
              subtitle="Tem mais de um cartucho do mesmo jogo para anunciar?"
              step={step - 1}
            />
            <div className="p-6">
              {!showVariationForm ? (
                <button
                  onClick={() => setShowVariationForm(true)}
                  className="w-full border-2 border-dashed border-purple-400 p-6 rounded-lg text-purple-600 hover:bg-purple-50 hover:border-purple-600 transition-colors"
                >
                  + Adicionar nova variação
                </button>
              ) : (
                <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Variação 1
                    </h3>
                    <button
                      onClick={() => setShowVariationForm(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0">
                        Título do Anúncio:
                      </label>
                      <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Vendo ou troco Cartucho Super Mario Bros Usado."
                        readOnly
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0">
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
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0">
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
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0">
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
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0">
                        Idioma do Jogo:
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
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0">
                        Estoque Disponível:
                      </label>
                      <input
                        type="number"
                        name="estoque"
                        value={variationData.estoque}
                        placeholder="01"
                        onChange={handleVariationInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div className="flex items-start">
                      <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0 pt-2">
                        Imagens e Vídeos:
                      </label>
                      <div className="flex-1">
                        <div className="grid grid-cols-5 gap-2">
                          {[...Array(4)].map((_, i) => (
                            <label
                              key={i}
                              className="aspect-square bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                            >
                              <Camera className="w-6 h-6 text-gray-400" />
                              <input
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={(e) => {
                                  // Aqui você pode adicionar a lógica para lidar com o arquivo
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    console.log(
                                      "Arquivo selecionado:",
                                      file.name
                                    );
                                  }
                                }}
                              />
                            </label>
                          ))}
                          <label className="aspect-square bg-gray-100 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                            <span className="text-gray-500 text-lg">+</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                // Lógica para adicionar múltiplos arquivos
                                const files = Array.from(e.target.files || []);
                                console.log(
                                  "Arquivos adicionados:",
                                  files.map((f) => f.name)
                                );
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <button
                      onClick={() => setShowVariationForm(false)}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <ConfirmButton
                      onClick={() => {
                        // Aqui você pode adicionar a lógica para salvar a variação
                        console.log("Variação salva:", variationData);
                        setShowVariationForm(false);
                        // Resetar o formulário de variação
                        setVariationData({
                          tipoCartucho: "",
                          estadoPreservacao: "",
                          regiao: "",
                          idiomaAudio: "",
                          idiomaLegenda: "",
                          idiomaInterface: "",
                          preco: "",
                          estoque: "",
                        });
                      }}
                    >
                      Salvar Variação
                    </ConfirmButton>
                  </div>
                </div>
              )}
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
          <ConfirmButton onClick={step === 5 ? handleFinish : nextStep}>
            {step === 5 ? "Finalizar" : "Confirmar"}
          </ConfirmButton>
        </div>
      </div>
    </>
  );
};

export default MultiPartForm;
