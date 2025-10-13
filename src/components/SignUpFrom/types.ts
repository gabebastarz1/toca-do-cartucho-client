export interface FormData {
  email: string;
  senha: string;
  confirmeSenha: string;
  nome: string;
  sobrenome: string;
  nomeUsuario: string;
  cpf: string; 
}


export type FormErrors = {
  [K in keyof FormData]?: string;
};

export interface StepProps {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}