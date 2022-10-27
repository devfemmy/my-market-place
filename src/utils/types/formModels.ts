import { ComponentProps } from "react";
import {Button as BaseButton} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';

import { ChangeEvent, Dispatch, SetStateAction } from "react";


export type Nav = {
    replace(arg0: string): unknown;
    goBack(): void;
    navigate: (value: string) => void;
  }
  
export type LoginFormData = {
    email: string;
    password: string;
}

export type SignupType = {
    email: string;
    password: string;
    fName: string;
    lName: string;
    // mobile: string;

}
export type OauthAction = {
    token: string;
}


export type LoginState = {
    userData: [];
    userInfo: any;
    loading: boolean;
    error: any
}

export type CartState = {
    carts: Array<any>;
    loading: boolean;
    error: any
}

export type AddressState = {
    locations: Array<any>;
    loading: boolean;
    error: any
}


export type StoreState = {
    myStore: Array<any>,
    storeRatings: Array<any>,
    allStores: Array<any>,
    storeById: any,
    error: any,
    loading: boolean,
    wallet: any,
}


export type ProductState = {
    products: Array<any>,
    buyerProducts: Array<any>,
    productSpec: Array<any>,
    productBySlug: any,
    productVariants: any,
    error: any,
    loading: boolean
}


export type ResetFormData = {
    email: string;
}

export type Header = {
    icon: string,
    header: string
}

export type TextProps = {
    text: string;
    fontSize?: string;
    textAlign?: 'left' | 'right' | 'center' | 'justify';
    color?: string;
    lineHeight?: string;
    fontFamily?: string;
    textDecoration?: 'none' | 'underline' | 'overline' | 'line-through' | 'underline overline';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'initial' | 'inherit';
    fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900',
    margin?: string
};

export type SignupFormData = {
    firstName: string,
    lastName: string,
    // phoneNumber: string,
    email: string,
    password: string
}

export type StoreFormData = {
    storeName: string;
    description: string;
    phoneNumber: string;
    estimatedDeliveryDuration: string;
    street: string;
    city: string;
    state: string;
}

export type ProductCreateFormData = {
    name: string,
    description: string,
    category_id: string,
   store_id: string,
  //  variants?: Array<any>,
    // isDraft: boolean,
    // status: string
}

export type HomeHeaderType = {
    data: any
}

export type CategoryState = {
    category: Array<any>,
    storeBySlug: any,
    storeByCategory: any,
    error: any,
    loading: boolean
}
export type ProductUpdateFormData = {
    id: string,
    name?: string,
    description?: string,
    category_id?: string,
   // store_id?: string,
   // variants?: Array<any>,
}

export type ProductVariantFormData = {
    img_urls: Array<string>,
    color?: string,
    product_id: string,
}

export type ProductVariantSpecFormData = {
    size?: string,
    quantity: number,
    amount: number,
    product_variant_id: string,
}

export type DeliveryFormData = {
    state: string;
    price: string
}

export type LandmarkFormData = {
    city: string;
    price: string
}

export type StoreCreateFormData = {
    brandName: string,
    description: string,
    coverImg: string,
    address: string,
    phoneNumber: string,
    estimated_delivery_duration: string,
    location: {
        state: string,
        city: string,
        street: string,
    },
    // isDraft?: boolean,
    // status?: string
}

export type StoreUpdateFormData = {
    id: string,
    brandName: string,
    description: string,
    coverImg: string,
    address: string,
    phoneNumber: string,
    estimated_delivery_duration: string,
    location: {
        state: string,
        city: string,
        street: string,
    },
}


export type WelcomeCardProp = {
    id: number,
    header: string,
    type: string,
    title: string
}

export type InputType = {
    label: string,
    value: string,
    errorMsg?: string,
    isMultiline?: boolean,
    isPassword?: boolean,
    disabled?: boolean,
    type?: string,
    required?: boolean,
    handleClick?: (value?: any) => void,
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    handleTextChange?: (value?: any) => void
}

export type NumberType = {
    label: string,
    value: number,
    errorMsg?: string,
    type?: string,
    handleNumChange?: (value: string | ChangeEvent<any>) => void,
    handleOnChange?: (value: number | string) => void
      onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
   // onChange?: (values: NumberFormatValues, sourceInfo: SourceInfo) => void
}


export type locationProp = {
    state: string,
    city: Array<string>,
}

export type ArrayOptionType = {
    id: number,
    title: string,
    icon: ImageSourcePropType
}


export type ButtonType = {
    children: string,
    isLoading?: boolean,
    handlePress?: () => void,
    type?: string,
    disabled?: boolean
}

export type SelectType = {
    onSearch?: (value: string) => void,
    // onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    onChange?: (event: any ) => void
    placeholder: string,
    errorMsg?: string,
    value: string,
    type?: boolean,
    data: Array<any>,
}

export type ModalType = {
    title: string,
    type: string,
    modalVisible: boolean,
    handlePress?: () => void,
    setModalVisible: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export type ProductModalType = {
    visible: boolean,
    action?: () => void,
    handlePress?: () => void,
    setVisible: () => void
}


export type EditProductModalType = {
    visible: boolean,
    action?: () => void,
    handlePress?: () => void,
    setVisible: () => void,
    editData?: any
}

export type AddStaffModalType = {
    staffModalVisible: boolean, 
    closeModal: () => void,
}


export type ImageType = {
    source: string;
    width?: number;
    height?: number;
    type?: string
}


export type ProductFormData = {
    productName: string;
    productDescription: string;
    category: string;
}


export type EditProductFormData = {
    productName: string;
    productDescription: string;
    category: string;
}

export type ProductColorData = {
    description: '';
}

export type ProductNoColorData = {
    price: number
}

export type ProductSizeData = {
    price: number;
    size: string
}

export type DeliveryData = {
    street: string;
    state: string;
    city: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number
}

export type OrdersState = {
    sellerOrders: Array<any>,
    buyerOrders: Array<any>,
    sellerOrderDetails: any,
    outOfStock: any,
    error: any;
    loading: boolean
}

export type AddStaffData = {
    // firstName: string,
    // lastName: string;
    email: string;
    role: string;
}

export type AddDesktopStaffData = {
    // firstName: string,
    // lastName: string;
    email: string;
}

export type PayoutFormData = {
    bankName: string,
    bankNumber: string
}

export type PayoutState = {
    payout: any,
    loading: any,
    error: any
}

export type PayoutBody = {
    name: string,
    account: string,
    id: string,
    bankName: string,
}

export type ProductColorAloneData = {
    price: number;
    description: string
}


export type PayoutModalData = {
    visible: boolean,
    setVisible: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    editPayout?: any,
    setPayout?: (e: any) => void,
}

export type ProfileFormData = {
    lName: string,
    fName: string,
    email: string,
    mobile: string,
    gender: string
}

export type BuyerProfileFormData = {
    lName: string,
    fName: string,
    email: string,
    mobile: string,
    gender: string
}

export type ProductContainerType = {
    data: any,
    name?: string,
    mini?: boolean,
    slug?: string,
}


export type ProfileState = {
    profile: any,
    loading: boolean,
    error: any
}

export type StaffState = {
    staffs: any,
    loading: boolean,
    error: any,
    storeRoles: any,
}
export type ReviewState = {
    reviews: any,
    loading: boolean,
    error: any,
}
export type NotificationCardType = {
    icon: ImageSourcePropType,
    header: string,
    duration: string,
    action: string,
}

export type EmptyStateType = {
    icon: ImageSourcePropType,
    title: string,
    header: string,
    btn?: boolean,
    route?: string,
    btnText?: string,
   }
   

export type NotificationState = {
   notifications: Array<any>,
    sellerStat: any,
    loading: boolean,
    error: any
}

export type MerchantFormData = {
    firstName: string,
    lastName: string,
    email: string,
    // mobile: string,
    password: string,
}

export type DesktopCreateProduct = {
    productName: string,
    description: string,
    category: string,
}

export type LayoutInputType = {
    label: string, 
    type: string, 
    numberValue?: string, 
    setNumberValue?: Dispatch<SetStateAction<number>>, 
    textValue?: string, 
    setTextValue?: Dispatch<SetStateAction<string>>
}