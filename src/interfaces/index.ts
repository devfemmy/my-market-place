import {ImageSourcePropType} from 'react-native';

export interface ListCardProps {
    id?: number,
    title: string,
    icon?: ImageSourcePropType,
    onPress?: any
}

export interface OrderCardProps {
    item: any,
}

export interface StoreHeaderProps {
    name: string
 }

 export interface WalletProps {
     escrow: number,
     balance: number
 }