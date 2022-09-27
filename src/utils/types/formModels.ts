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
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  // confirmPassword: string;
};

export type Nav = {
  goBack(): void;
  navigate: (value: string) => void;
}


export type ForgotPasswordFormData = {
  email: string;
};

export type AssignUserFormData = {
  roleId: string;
  email: string;
  storeId: string;
};

export type StoreFormData = {
  storeName: string;
  description: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  estimatedDelivery: string;
};

export type CartFormData = {
  cart: Array<any>;
  loading: boolean;
  error: any
};

export type NotificationFormData = {
  notifications: Array<any>;
  loading: boolean;
  error: any
};


export type StoreState = {
  myStore: Array<any>,
  allStores: Array<any>,
  permission: Array<any>,
  payouts: Array<any>,
  reviews: Array<any>,
  filteredreviews: Array<any>,
  allCategories: Array<any>,
  storeById: any,
  error: any,
  loading: boolean,
  storeImage: string,
  staffs: any,
  filteredStaffs: any,
  wallet: any,
  storeRoles: any
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

export type SideHustleState = {
  allCategories: Array<any>,
  error: any,
  loading: boolean,
}


export type UserState = {
  userProfile: Array<any>,
  notifications: Array<any>,
  notificationStat: Array<any>,
  error: any,
  loading: boolean,
}

export type CartState = {
  carts: Array<any>,
  error: any,
  loading: boolean,
}

export type ProductState = {
  myProducts: Array<any>,
  productVariants: Array<any>,
  productSpec: Array<any>,
  buyerProducts: Array<any>,
  buyerProduct: Array<any>,
  selectedProducts: Array<any>,
  productBackground: Array<any>,
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

export type ProductVariant = {
  size: any,
  quantity: any,
  color: string,
  amount: any,
  img_urls: Array<string>,
  product_id?: string,
  product_variant_id?: string
}

export type StoreCreateFormData = {
  brand_name: string,
  description: string,
  img_url: string,
  city: string,
  phone_number: string,
  state?: string,
  street: string,
  estimated_delivery_duration: string
}

export type StoreUpdateFormData = {
  id: string,
  brand_name: string,
  description: string,
  img_url: string,
  city: string,
  street: string,
  state: string,
  phone_number: string,
  estimated_delivery_duration: string,
}


export type ProductCreateFormData = {
  id?: string,
  name?: string,
  description?: string,
  categories?: string,
  variants?: Array<any>,
  isDraft?: boolean,
  status?: string
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
  small?: boolean;
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
  account?: string;
  account_name: string;
  _id?: string;
  bank_account_number: string;
  bank_name: string;
  bankCode?: string;
  store_id?: string;
};

export type DeliveryFormData = {
  state: string;
  price: string
}

export type DeliveryAddressFormData = {
  address: string;
  state: string;
  city: string
}

export type LandmarkFormData = {
  city: string;
  price: string
}
