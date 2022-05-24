import {NavigatorScreenParams} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
export type RootBottomTabParamList = {
  Home: undefined;
};
export type MainStackParamList = {
  HomeTab: NavigatorScreenParams<RootBottomTabParamList>;
  Home: undefined;
};
export type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;
export type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;
