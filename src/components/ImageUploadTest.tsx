import React, { useState } from "react";
import { advertisementImageService } from "../services/advertisementImageService";

interface ImageUploadTestProps {
  advertisementId: number;
}

const ImageUploadTest: React.FC<ImageUploadTestProps> = ({
  advertisementId,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setError("");
    setUploadResult("");
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Selecione pelo menos uma imagem");
      return;
    }

    setUploading(true);
    setError("");
    setUploadResult("");

    try {
      const result = await advertisementImageService.uploadImages(
        advertisementId,
        selectedFiles
      );
      setUploadResult(
        `Upload realizado com sucesso! ${result.length} imagem(ns) enviada(s).`
      );
      setSelectedFiles([]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(`Erro no upload: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const validateFiles = () => {
    const errors: string[] = [];
    selectedFiles.forEach((file, index) => {
      const validation = advertisementImageService.validateImageFile(file);
      if (!validation.isValid) {
        errors.push(`Arquivo ${index + 1}: ${validation.error}`);
      }
    });
    return errors;
  };

  const validationErrors = validateFiles();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md">
      <h3 className="text-lg font-semibold mb-4">Teste de Upload de Imagens</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecionar Imagens
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Arquivos selecionados:</p>
            <ul className="text-sm space-y-1">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-gray-700">{file.name}</span>
                  <span className="text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  {validationErrors.some((error) =>
                    error.includes(`Arquivo ${index + 1}`)
                  ) && <span className="text-red-500 text-xs">⚠️</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm font-medium text-red-800 mb-1">
              Erros de validação:
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || validationErrors.length > 0}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            uploading || validationErrors.length > 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {uploading ? "Enviando..." : "Fazer Upload"}
        </button>

        {uploadResult && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-800">{uploadResult}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadTest;
