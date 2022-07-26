import { Platform, AlertType } from "react-native";
import { colors } from "./themes";
import Clipboard from '@react-native-clipboard/clipboard';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import 'intl'
import 'intl/locale-data/jsonp/en'
import axios from "axios";
import banks from "./banks";

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
    if(value == null){
        return ''
    }
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

export const pictureUpload = async (image: any) => {
    let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
    };
    const request = new FormData();
    request.append('image', {
        uri: Platform.OS === "android" ? image.path : image.path.replace("file://", ""),
        type: image.mime,
        mime: image.mime,
        name: `${new Date()}picture.jpeg`,
    });
    console.log(request)
    try {
        const response = await axios.post(
            'https://prod.bazara.co/upload-microservice/v1/upload/img',
            request,
            config,
        );
        if (response.status === 200) {
            const image = response?.data?.data?.url;
            return image
        }else{
            Notify('Error', 'Problem uploading picture.', 'error')
            return ''
        }
    } catch (error) {
        console.log(error)
        return ''
    }
}

export const timeSince = (date) => {

    const seconds = Math.floor((new Date() - date) / 1000);
  
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      //years
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      //months
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      //days
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      //hours
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      //minutes
      return Math.floor(interval) + " minutes ago";
    }
    if(!interval){
        return '...'
    }
    return Math.floor(seconds) + " seconds ago";
}

const validateAccount = async (accountNumber, bankName) => {

    if(accountNumber.length == 10 && bankName){
      const bankDetails = banks.find((bank) => bankName == bank.label)
      const bankCode = bankDetails?.code

      let confg = {
        headers: {
          authorization: `Bearer ${config.secretOrKey}`,
        },
      };
      try {
        const response = await axios.post(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            confg,
        );
        if (response.status === 200) {
            console.log(response?.data)
        }
      } catch (error) {
        
      }
    }
  }