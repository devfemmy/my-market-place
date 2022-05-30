import { ComponentProps } from "react";
import {Button as BaseButton} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';

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

export type locationProp = {
  state: string,
  city: Array<string>,
}

export type ArrayType = {
  id: number,
  title: string,
  icon: ImageSourcePropType
}

export type WelcomeType = {
  id: number,
  header: string,
  type: string,
  title: string
}


export type AuthButtonProps = ComponentProps<typeof BaseButton> & {
  title: string;
  image?: ImageSourcePropType;
  isLoading?: boolean;
  loaderColor?: string;
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export type ButtonProps = ComponentProps<typeof BaseButton> & {
  title: string;
  isLoading?: boolean;
  loaderColor?: string;
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};