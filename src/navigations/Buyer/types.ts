import {NavigatorScreenParams} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type RootBottomTabParamList = {
    HomeStackNavigator: undefined;
    ExploreStackNavigator: undefined;
    Orders: undefined;
    Inbox: undefined;
    Profile: undefined;
};

export type HomeStackParamList = {
    Home: undefined;
    Products: {title?: string, data?: Array<any>}
    Categories: {title?: string, data?: Array<any>}
};

export type ExploreStackParamList = {
    Explore: undefined;
    Products: {title?: string, data?: Array<any>}
    Categories: {title?: string, data?: Array<any>}
};


export type MainStackParamList = {
    MainScreen: NavigatorScreenParams<RootBottomTabParamList>;
};