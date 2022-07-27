import {ImageSourcePropType} from 'react-native';

export interface ListCardProps {
    title: string,
    route: string,
    icon?: ImageSourcePropType,
    isActive?: boolean
}

export interface OrderCardProps {
    item: any,
    onIconPress?:(value?: any) => void
}

export interface StoreHeaderProps {
    name: string,
    slug: string
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