import React, { useState } from "react";
import { authService } from "../../services/authService";
import { useCustomAlert } from "../../hooks/useCustomAlert";
import { CustomAlert } from "../../components/ui/CustomAlert";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { FormData, FormErrors } from "./types";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const initialFormData: FormData = {
  email: "",
  senha: "",
  confirmeSenha: "",
  nome: "",
  sobrenome: "",
  nomeUsuario: "",
  dataNascimento: "",
  cpf: "",
};

const SignUpForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { alertState, showSuccess, hideAlert } = useCustomAlert();
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStepOne = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.includes("@")) newErrors.email = "Email inválido.";
    if (formData.senha.length < 6)
      newErrors.senha = "A senha precisa ter no mínimo 6 caracteres.";
    if (formData.senha !== formData.confirmeSenha)
      newErrors.confirmeSenha = "As senhas não coincidem.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para validar CPF
  const isValidCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(numbers[9]) !== firstDigit) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(numbers[10]) === secondDigit;
  };

  const validateStepTwo = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nome) newErrors.nome = "Nome é obrigatório.";
    if (!formData.sobrenome) newErrors.sobrenome = "Sobrenome é obrigatório.";
    if (!formData.nomeUsuario)
      newErrors.nomeUsuario = "Nome de usuário é obrigatório.";
    if (!formData.dataNascimento)
      newErrors.dataNascimento = "Data de nascimento é obrigatória.";

    // Validar CPF se preenchido
    if (formData.cpf) {
      const cpfNumbers = formData.cpf.replace(/\D/g, "");
      if (cpfNumbers.length > 0 && cpfNumbers.length < 11) {
        newErrors.cpf = "CPF deve ter 11 dígitos.";
      } else if (cpfNumbers.length === 11 && !isValidCPF(formData.cpf)) {
        newErrors.cpf = "CPF inválido. Verifique os dígitos informados.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (!validateStepOne()) {
      return;
    }

    try {
      setIsLoading(true);
      const resp = await api.get("/api/accounts/email-exists", {
        params: { email: formData.email },
      });

      const exists = Boolean(
        typeof resp.data === "boolean"
          ? resp.data
          : resp.data?.exists ?? resp.data?.result ?? resp.data
      );

      if (exists) {
        setErrors({ email: "Este email já está cadastrado. Faça login." });
        return;
      }

      setErrors({});
      setStep(2);
    } catch {
      // Fallback genérico
      setErrors({
        email: "Não foi possível validar o email. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStepTwo()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Passo 1: Verificar se o nome de usuário já existe
      const nicknameExists = await authService.checkNicknameExists(
        formData.nomeUsuario
      );
      if (nicknameExists) {
        setErrors({
          nomeUsuario:
            "Este nome de usuário já está em uso. Por favor, escolha outro.",
        });
        setIsLoading(false);
        return;
      }

      // Passo 2: Prosseguir com o registro se o nome estiver disponível
      const {
        email,
        senha,
        nome,
        sobrenome,
        nomeUsuario,
        cpf,
        dataNascimento,
      } = formData;

      const apiPayload = {
        email,
        password: senha,
        firstName: nome,
        lastName: sobrenome,
        nickName: nomeUsuario,
        cpf: cpf ? cpf.replace(/\D/g, "") : null, // Envia null se o CPF estiver vazio
        birthdayDate: dataNascimento || null,
      };

      const response = await authService.register(apiPayload);
      console.log("Cadastro realizado com sucesso! Resposta da API:", response);
      showSuccess(
        "Conta criada com sucesso! Verifique seu e-mail para ativá-la. Você será redirecionado para o login em 5 segundos."
      );
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error: unknown) {
      const apiError = error as { status?: number; data?: unknown };
      console.error("Erro no cadastro:", apiError);
      const errorData = (apiError.data ?? {}) as {
        errors?: Record<string, string[]>;
      };
      const newErrors: FormErrors = {};

      if (apiError.status === 400 && errorData.errors) {
        // Mapeia os erros de validação da API para o estado de erros
        for (const key in errorData.errors) {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          const messages = errorData.errors[key];

          // Compatibiliza nomes de campo (API vs Frontend)
          if (fieldName === "password") {
            newErrors["senha"] = messages.join(" ");
          } else if (fieldName === "nickName") {
            newErrors["nomeUsuario"] = messages.join(" ");
          } else if (fieldName === "email") {
            newErrors["email"] = messages.join(" ");
          } else if (fieldName === "cpf") {
            newErrors["cpf"] = messages.join(" ");
          } else {
            newErrors[fieldName] = messages.join(" ");
          }
        }
      } else {
        // Erro genérico: anexar ao campo de email para exibição
        newErrors.email = "Ocorreu um erro inesperado. Tente novamente.";
      }

      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-10 p-8 md:bg-[#F8F8FC] md:p-10 md:shadow-lg rounded-lg text-white md:text-[#2B2560] w-full max-w-3xl">
      <CustomAlert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={hideAlert}
      />
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="text-2xl font-bold text-start mb-4">
          Verificamos que você ainda não tem um cadastro
        </h2>
        {/* <p className="text-center text-sm mb-6">
          Já tem uma conta?{" "}
          <a
            href="/login"
            className="font-bold text-brand-dark hover:underline"
          >
            Login
          </a>
        </p> */}

        {step === 1 && (
          <StepOne
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            showConfirmPassword={showConfirmPassword}
            toggleShowConfirmPassword={toggleShowConfirmPassword}
          />
        )}
        {step === 2 && (
          <StepTwo
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        )}
        {step === 1 && (
          <div className="mt-6">
            <button
              type="button"
              className="w-full bg-[#2B2560] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
              onClick={handleNextStep}
            >
              Continuar
            </button>
            {/*<div className="flex items-center justify-center gap-2">
              <hr className="flex-grow border-t border-gray-500 md:border-gray-300" />
              <div className="text-center my-4 text-gray-500 text-xs">Ou</div>
              <hr className="flex-grow border-t border-gray-500 md:border-gray-300" />
            </div>
             <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white md:bg-transparent py-3 text-md text-white md:text-[#2B2560] font-bold shadow-sm transition-colors hover:bg-gray-50"
            >
              <FaGoogle size={20} />
              Entrar com o Google
            </button> */}
          </div>
        )}
        {step === 2 && (
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-[#2B2560] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
