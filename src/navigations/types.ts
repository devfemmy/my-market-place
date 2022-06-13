import {NavigatorScreenParams} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  LinkSent: undefined;
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
  StoreCreationScreen: undefined;
  StoreSuccessScreen: undefined;
  WelcomeScreen: undefined;
  AddProduct: undefined;
  PublishProduct: {data: {}};
  OrderDetails: {order: {}};
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
