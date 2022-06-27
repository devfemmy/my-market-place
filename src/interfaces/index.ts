import {ImageSourcePropType} from 'react-native';

export interface ListCardProps {
    title: string,
    route: string,
    icon?: ImageSourcePropType,
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
 export interface NavHeaderProps {
    icon?: string,
    title: string,
    handlePress?: () => void
 }