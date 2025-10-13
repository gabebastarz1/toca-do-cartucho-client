import { useState, useCallback } from "react";

interface AlertState {
  type: "success" | "error" | "warning" | "info";
  message: string;
  isVisible: boolean;
}

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    type: "info",
    message: "",
    isVisible: false,
  });

  const showAlert = useCallback((type: AlertState["type"], message: string) => {
    setAlertState({
      type,
      message,
      isVisible: true,
    });
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showAlert("success", message);
    },
    [showAlert]
  );

  const showError = useCallback(
    (message: string) => {
      showAlert("error", message);
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message: string) => {
      showAlert("warning", message);
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message: string) => {
      showAlert("info", message);
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


