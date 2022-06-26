import { Platform, AlertType } from "react-native";
import { colors } from "./themes";
import Clipboard from '@react-native-clipboard/clipboard';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import 'intl'
import 'intl/locale-data/jsonp/en'

export const currencyFormat = (value: string | number | any) =>{
    if(value == "" || value == null){
        return ""
    }
    else {if(Platform.OS == "android"){
        var newVal = new Intl.NumberFormat('en-NG', {style: 'currency',currency: 'NGN'}).format(value);
        return newVal.replace("NGN", '\u20A6')
    }
    else{
        return new Intl.NumberFormat('en-NG', {style: 'currency',currency: 'NGN'}).format(value);
    }}
}

export const statusColor = (value: string) =>{
    
    if(value == "pending"){
        return colors.pending
    }
    else if(value == "processing"){
        return colors.processing
    }
    else if(value == "dispatched"){
        return colors.dispatched
    }
    else if(value == "completed"){
        return colors.completed
    }
    else{
        return colors.cancelled
    }
}

export const statusMessage = (value: string) =>{
    
    if(value == "pending"){
        return "This order is pending"
    }
    else if(value == "processing"){
        return "This order is being processed"
    }
    else if(value == "dispatched"){
        return "This order has been dispatched"
    }
    else if(value == "completed"){
        return "Order has been completed"
    }
    else{
        return "This order has been cancelled"
    }
}

export const buttonMessage = (value: string) =>{
    
    if(value == "pending"){
        return "Mark as processing"
    }
    else if(value == "processing"){
        return "Mark as dispatched"
    }
    else if(value == "dispatched"){
        return "Mark as completed"
    }
    else{
        return ""
    }
}

export const nextStatus = (value: string) =>{
    
    if(value === "pending"){
        return "processing"
    }
    else if(value === "processing"){
        return "dispatched"
    }
    else if(value === "dispatched"){
        return "completed"
    }
    else{
        return ""
    }
}

export const firstLetterUppercase = (value: string) =>{
    return value.charAt(0).toUpperCase() + value.slice(1)
}

export const copyToClipboard = (value: string) => {
    Clipboard.setString(value)
    Notifier.showNotification({
        title: 'Copied!',
        description: value,
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'success',
        },
    });
}

export const Notify = (title: string, description: string, type?: string) => {
    Notifier.showNotification({
        title: title,
        description: description,
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: type == 'success' ? ('success') : (type == 'warn' ? ('warn') : (type == 'info' ? 'info' : 'error')),
        },
    });
}

export const rejectionMsg = (value: string) => {
    if(value == 'Product out of stock'){
        return {desc: 'We recommend that you update your store.', btn: 'Update store'}
    }else if('Seller currently unavailable'){
        return {desc: 'We recommend that you deactivate your store based on your unavailability.', btn: 'Deactivate store'}
    }else if('Others'){
        return {desc: 'Do you want to add more products to your store now?', btn: 'Edit store'}
    }else {
        return {desc: 'Your order has been cancelled successfully.', btn: 'Dismiss'}
    }
}