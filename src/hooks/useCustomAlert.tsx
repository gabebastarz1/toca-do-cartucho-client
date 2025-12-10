import { useState, useCallback } from "react";

interface AlertState {
  type: "success" | "error" | "warning" | "info";
  message: string;
  isVisible: boolean;
  duration?: number; // Duração customizada em ms
}

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    type: "info",
    message: "",
    isVisible: false,
    duration: undefined,
  });

  const showAlert = useCallback(
    (type: AlertState["type"], message: string, duration?: number) => {
      setAlertState({
        type,
        message,
        isVisible: true,
        duration,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showAlert("success", message, duration);
    },
    [showAlert]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showAlert("error", message, duration);
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showAlert("warning", message, duration);
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showAlert("info", message, duration);
    },
    [showAlert]
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  return {
    alertState,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert,
  };
};
