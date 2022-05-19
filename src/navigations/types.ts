import {NavigatorScreenParams} from '@react-navigation/native';

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
