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
  permission: Array<any>,
  payouts: Array<any>,
  allCategories: Array<any>,
  storeById: any,
  error: any,
  loading: boolean,
  storeImage: string,
}



export type OrderState = {
  sellerOrders: Array<any>,
  allOrders: Array<any>,
  selectedOrders: Array<any>,
  selected: string,
  availableStatus: Array<string>,
  error: any,
  loading: boolean,
  searching: boolean
}

export type UserState = {
  userProfile: Array<any>,
  notifications: Array<any>,
  error: any,
  loading: boolean,
}

export type ProductState = {
  myProducts: Array<any>,
  selectedProducts: Array<any>,
  searching: boolean,
  productBySlug: any,
  editableSlug: any,
  newSizes: Array<any>,
  newColours: Array<any>,
  newSizeColours: Array<any>,
  images: Array<string>,
  categories: Array<string>,
  error: any,
  loading: boolean
}

export type StoreCreateFormData = {
  brandName: string,
  description: string,
  imgUrl: string,
  address: string,
  phoneNumber: string,
  status?: string,
  location: {
      state: string,
      city: string,
      street: string,
  },
}

export type StoreUpdateFormData = {
  id: string,
  brandName: string,
  description: string,
  imgUrl: string,
  address: string,
  phoneNumber: string,
  status?: string,
  location: {
      state: string,
      city: string,
      street: string,
  },
}


export type ProductCreateFormData = {
  id: string,
  name: string,
  description: string,
  categories: string,
  variants: Array<any>,
  isDraft: boolean,
  status: string
}

export type locationProp = {
  state: string,
  city: Array<string>,
}

export type ArrayType = {
  id: number,
  title: string,
  icon: ImageSourcePropType,
  navigation?: string,
  route?: string,
  onPress?: any
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

export type MiniButtonProps = ComponentProps<typeof BaseButton> & {
  icon: string;
  iconColor?: string;
  iconSize?: number;
  isLoading?: boolean;
  loaderColor?: string;
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export type ProductFormData1 = {
  name: string;
  description: string;
  category: string;
  sizes: boolean;
  colours: boolean;
};

export type StaffFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type PayoutFormData = {
  name: string;
  _id?: string;
  account: string;
  bankName: string;
  bankCode?: string;
};

export type DeliveryFormData = {
  state: string;
  price: string
}

export type LandmarkFormData = {
  city: string;
  price: string
}
