export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  fName: string;
  lName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordFormData = {
  email: string;
};

export type StoreFormData = {
  storeName: string;
  description: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
};

