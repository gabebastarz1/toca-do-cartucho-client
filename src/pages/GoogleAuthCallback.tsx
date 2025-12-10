import React, { useEffect, useState } from "react";
import { authService } from "../services/authService";

const GoogleAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processando autenticação...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Verificar se estamos em uma popup
        const isPopup = window.opener !== null && window.opener !== window;

        if (!isPopup) {
          // Se não estiver em popup, recarregar a página para garantir que todas as requisições sejam feitas com autenticação
          window.location.href = "/produtos";
          return;
        }

        // Aguardar um pouco para garantir que os cookies foram definidos
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Tentar obter usuário autenticado com retry
        let user = null;
        let retries = 0;
        const maxRetries = 5;

        while (!user && retries < maxRetries) {
          try {
            user = await authService.getCurrentUser();
            if (!user) {
              // Aguardar mais um pouco antes de tentar novamente
              await new Promise((resolve) => setTimeout(resolve, 500));
              retries++;
            }
          } catch (error) {
            console.error(`Tentativa ${retries + 1} falhou:`, error);
            await new Promise((resolve) => setTimeout(resolve, 500));
            retries++;
          }
        }

        if (user) {
          // Salvar dados do usuário
          authService.setAuthData("cookie-based-auth", user);

          // Verificar se o cookie de sessão existe
          const hasCookie = authService.hasSessionCookie();
          console.log("🍪 Cookie de sessão na popup:", hasCookie);

          // Se temos usuário, podemos prosseguir mesmo se a verificação de isAuthenticated falhar
          // O importante é que temos o usuário e o cookie deve estar sendo definido pelo servidor

          // Enviar mensagem de sucesso para a janela pai
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_SUCCESS",
              user: user,
              hasCookie: hasCookie,
            },
            window.location.origin
          );

          setStatus("success");
          setMessage("Autenticação realizada com sucesso! Fechando...");

          // Fechar popup após um breve delay
          setTimeout(() => {
            window.close();
          }, 1500);
        } else {
          throw new Error("Usuário não autenticado após várias tentativas");
        }
      } catch (error) {
        console.error("Erro ao processar callback do Google:", error);

        // Enviar mensagem de erro para a janela pai
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_ERROR",
              error: "Erro ao autenticar com Google",
            },
            window.location.origin
          );
        }

        setStatus("error");
        setMessage("Erro ao autenticar. Fechando...");

        // Fechar popup após um breve delay
        setTimeout(() => {
          window.close();
        }, 2000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mb-4">
          {status === "loading" && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          )}
          {status === "success" && (
            <div className="text-green-600 text-4xl mb-4">✓</div>
          )}
          {status === "error" && (
            <div className="text-red-600 text-4xl mb-4">✗</div>
          )}
        </div>
        <p className="text-gray-700 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
