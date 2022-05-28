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

export type Nav = {
  goBack(): void;
  navigate: (value: string) => void;
}


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


export type StoreState = {
  myStore: Array<any>,
  allStores: Array<any>,
  error: any,
  loading: boolean
}

export type StoreCreateFormData = {
  category: string,
  brandName: string,
  description: string,
  imgUrl: string,
  address: string,
  shippingFees: {
      withinLocation: number,
      outsideLocation: number
  },
  location: {
      state: string,
      city: string,
      street: string,
  },
}