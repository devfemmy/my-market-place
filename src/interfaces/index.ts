import {ImageSourcePropType} from 'react-native';

export interface ListCardProps {
    id: number,
    title: string,
    icon: ImageSourcePropType
}

export interface StoreHeaderProps {
    name: string
 }

 export interface WalletProps {
     escrow: number,
     balance: number
 }