import { api } from "./api";
import { TwoFactorRequest, TwoFactorResponse } from "../api/api";

/**
 * Serviço para gerenciar autenticação de dois fatores (2FA)
 */
class TwoFactorAuthService {
  /**
   * Obtém informações sobre o estado atual do 2FA do usuário
   */
  async get2FAInfo(): Promise<TwoFactorResponse> {
    try {
      // O endpoint retorna informações atuais sem modificar nada
      const response = await api.post<TwoFactorResponse>("/api/accounts/two-factor-authentication", {
        // Corpo vazio - apenas consulta o estado atual
      } as TwoFactorRequest);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter informações de 2FA:", error);
      throw error;
    }
  }

  /**
   * Obtém a chave compartilhada e QR code para configurar 2FA
   */
  async setup2FA(): Promise<TwoFactorResponse> {
    try {
      const response = await api.post<TwoFactorResponse>("/api/accounts/two-factor-authentication", {
        resetSharedKey: true,
      } as TwoFactorRequest);
      return response.data;
    } catch (error) {
      console.error("Erro ao configurar 2FA:", error);
      throw error;
    }
  }

  /**
   * Ativa o 2FA com o código de verificação
   */
  async enable2FA(twoFactorCode: string): Promise<TwoFactorResponse> {
    try {
      console.log("📤 [twoFactorAuthService] Enviando requisição enable2FA");
      console.log("📤 [twoFactorAuthService] Código:", twoFactorCode);
      
      // Tentar com camelCase primeiro
      const payload = {
        enable: true,
        twoFactorCode: twoFactorCode, // camelCase
      } as TwoFactorRequest;
      
      console.log("📤 [twoFactorAuthService] Payload camelCase:", JSON.stringify(payload));
      
      const response = await api.post<TwoFactorResponse>(
        "/api/accounts/two-factor-authentication", 
        payload,
        {
          // Log do request
          onUploadProgress: () => {
            console.log("⬆️ [twoFactorAuthService] Enviando dados...");
          },
        }
      );
      
      console.log("📥 [twoFactorAuthService] Resposta recebida:", response.data);
      console.log("📥 [twoFactorAuthService] Status:", response.status);
      console.log("📥 [twoFactorAuthService] Headers:", response.headers);
      return response.data;
    } catch (error: any) {
      console.error("❌ [twoFactorAuthService] Erro completo:", error);
      console.error("❌ [twoFactorAuthService] Status:", error.response?.status);
      console.error("❌ [twoFactorAuthService] Data:", error.response?.data);
      console.error("❌ [twoFactorAuthService] Headers:", error.response?.headers);
      console.error("❌ [twoFactorAuthService] Config:", error.config);
      
      // Se o erro foi 400, tentar novamente com PascalCase
      if (error.response?.status === 400) {
        console.log("🔄 [twoFactorAuthService] Tentando novamente com PascalCase...");
        try {
          const payloadPascal = {
            Enable: true,
            TwoFactorCode: twoFactorCode, // PascalCase
          };
          
          console.log("📤 [twoFactorAuthService] Payload PascalCase:", JSON.stringify(payloadPascal));
          
          const retryResponse = await api.post<TwoFactorResponse>(
            "/api/accounts/two-factor-authentication", 
            payloadPascal
          );
          
          console.log("✅ [twoFactorAuthService] Sucesso com PascalCase!");
          return retryResponse.data;
        } catch (retryError: any) {
          console.error("❌ [twoFactorAuthService] Falha também com PascalCase:", retryError.response?.data);
        }
      }
      
      throw error;
    }
  }

  /**
   * Desativa o 2FA
   */
  async disable2FA(): Promise<TwoFactorResponse> {
    try {
      const response = await api.post<TwoFactorResponse>("/api/accounts/two-factor-authentication", {
        enable: false,
      } as TwoFactorRequest);
      return response.data;
    } catch (error) {
      console.error("Erro ao desativar 2FA:", error);
      throw error;
    }
  }

  /**
   * Gera novos códigos de recuperação
   */
  async regenerateRecoveryCodes(): Promise<TwoFactorResponse> {
    try {
      const response = await api.post<TwoFactorResponse>("/api/accounts/two-factor-authentication", {
        resetRecoveryCodes: true,
      } as TwoFactorRequest);
      return response.data;
    } catch (error) {
      console.error("Erro ao regenerar códigos de recuperação:", error);
      throw error;
    }
  }

  /**
   * Reseta a chave compartilhada (desativa 2FA)
   */
  async resetSharedKey(): Promise<TwoFactorResponse> {
    try {
      const response = await api.post<TwoFactorResponse>("/api/accounts/two-factor-authentication", {
        resetSharedKey: true,
      } as TwoFactorRequest);
      return response.data;
    } catch (error) {
      console.error("Erro ao resetar chave compartilhada:", error);
      throw error;
    }
  }

  /**
   * Gera URL para QR Code do Google Authenticator
   */
  generateQRCodeUrl(email: string, sharedKey: string): string {
    const appName = encodeURIComponent("Toca do Cartucho");
    const formattedKey = sharedKey.replace(/\s/g, "");
    return `otpauth://totp/${appName}:${encodeURIComponent(
      email
    )}?secret=${formattedKey}&issuer=${appName}`;
  }

  /**
   * Formata a chave compartilhada para exibição (grupos de 4 caracteres)
   */
  formatSharedKey(key: string): string {
    return key.match(/.{1,4}/g)?.join(" ") || key;
  }
}

export const twoFactorAuthService = new TwoFactorAuthService();

