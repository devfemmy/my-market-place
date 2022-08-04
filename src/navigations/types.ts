import {NavigatorScreenParams} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  LinkSent: undefined;
  StoreCreationScreen: undefined;
  StoreSuccessScreen: undefined;
  WelcomeScreen: undefined;
  Store: undefined;
  AuthStoreSuccess: undefined
};
export type UserDataToken = {
  token: string;
}
export type RootBottomTabParamList = {
  Store: undefined;
  Product: undefined;
  Order: undefined;
  Inbox: undefined;
  Settings: undefined;
};
export type MainStackParamList = {
  HomeTab: NavigatorScreenParams<RootBottomTabParamList>;
  Home: undefined;
  Profile: undefined;
  AuthStoreCreationScreen: undefined;
  AuthStoreSuccessScreen: undefined;
  EditStore: undefined;
  DeliveryScreen: undefined;
  AddShippingFee: undefined;
  AddProduct: undefined;
  PublishProduct: {data?: {}, editData?: {}};
  OrderDetails: {order: {}};
  Staffs: undefined;
  AddStaff: undefined;
  Account: undefined;
  Reviews: undefined;
  AllReviews: undefined;
  NotificationScreen: undefined;
  NotificationDetails: {title: string, type: string};
};
export type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;
export type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;
export type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;
export type LinkSentScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'LinkSent'
>;
export type StoreSuccessScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'AuthStoreSuccess'
>;
export type StoreCreationProp = StackNavigationProp<
  AuthStackParamList,
  'StoreCreationScreen'
>;
export type StoreSuccessProp = StackNavigationProp<
  AuthStackParamList,
  'StoreSuccessScreen'
>

export type StoreProp = StackNavigationProp<
  AuthStackParamList,
  'Store'
>;