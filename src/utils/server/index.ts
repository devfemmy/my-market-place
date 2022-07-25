import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from 'react-native-config';

const UPLOAD_URL = "https://prod.bazara.co/upload-microservice/v1/upload/img";
const UPLOAD_VIDEO_URL = "https://prod.bazara.co/upload-microservice/v1/upload/video";
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/bank/resolve";


var SERVER_URL = "https://api.bazara.co/api/v2/dev";
const API_ENV = "Staging";



export const doPost = async (payload: Object, url: String, v?: String) => {
    
    if(API_ENV == "Staging"){
        var SERVER_URL = "https://api.bazara.co/api/v1/staging";
    }
    else if(API_ENV == "Prod"){
        var SERVER_URL = "https://prod.bazara.co/api/v1/prod";
    }
    else if(v == "v2"){
        SERVER_URL = "https://api.bazara.co/api/v2/dev";
    }else{
        SERVER_URL = "https://api.bazara.co/api/v1/dev";
    }
    // SERVER_URL = "https://api.bazara.co/api/v1/dev";
    SERVER_URL = "https://api.bazara.co/api/v1/staging"
    console.log(SERVER_URL)
    var response = await axios.post(SERVER_URL + url, payload);

    return response
        
};


export const getRequest = async (url: String, v?: String) => {

    if(API_ENV == "Staging" || v === "Staging"){
        SERVER_URL = "https://api.bazara.co/api/v1/dev";
    }
    else if(API_ENV == "Prod"){
        SERVER_URL = "https://prod.bazara.co/api/v1/prod";
    }
    else if(v == "v2"){
        SERVER_URL = "https://api.bazara.co/api/v2/dev";
    }else{
        SERVER_URL = "https://api.bazara.co/api/v2/dev";
    }
    // SERVER_URL = "https://api.bazara.co/api/v2/dev";
    SERVER_URL = "https://api.bazara.co/api/v1/staging"
    
    console.log(SERVER_URL)
    const token = await AsyncStorage.getItem("token");

    var response = await axios.get(SERVER_URL + url, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

    return response
}
export const getProfileRequest = async (url: String, v?: String) => {

    if(API_ENV == "Staging" || v === "Staging"){
        SERVER_URL = "https://api.bazara.co/api/v1/dev";
    }
    else if(API_ENV == "Prod"){
        SERVER_URL = "https://prod.bazara.co/api/v1/prod";
    }
    else if(v == "v2"){
        SERVER_URL = "https://api.bazara.co/api/v2/dev";
    }else{
        SERVER_URL = "https://api.bazara.co/api/v2/dev";
    }
    const token = await AsyncStorage.getItem("token");

    var response = await axios.get(SERVER_URL + url, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
    return response
}


export const sendPost = async ( url: String, payload: any, v?: String) => {
    
    if(API_ENV == "Staging"){
        var SERVER_URL = "https://api.bazara.co/api/v1/staging";
    }
    else if(API_ENV == "Prod"){
        var SERVER_URL = "https://prod.bazara.co/api/v1/prod";
    }
    else if(v == "v2"){
        SERVER_URL = "https://api.bazara.co/api/v2/dev";
    }else{
        SERVER_URL = "https://api.bazara.co/api/v1/dev";
    }

    if(v == "v2"){
        SERVER_URL = "https://api.bazara.co/api/v2/dev";
    }
    // SERVER_URL = "https://api.bazara.co/api/v2/dev";
    SERVER_URL = "https://api.bazara.co/api/v1/staging"

    console.log(SERVER_URL)
    const token = await AsyncStorage.getItem("token");

    var response = await axios.post(SERVER_URL + url, payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });


      console.log("responsen payload---", payload)

    return response
        
};
export const sendProfilePost = async ( url: String, payload: any, v?: String) => {
    
    if(API_ENV == "Staging"){
        var SERVER_URL = "https://api.bazara.co/api/v1/staging";
    }
    else if(API_ENV == "Prod"){
        var SERVER_URL = "https://prod.bazara.co/api/v1/prod";
    }
    else if(v == "v2"){
        SERVER_URL = "https://api.bazara.co/api/v2/dev";
    }else{
        SERVER_URL = "https://api.bazara.co/api/v1/dev";
    }

    if(v == "v2"){
        SERVER_URL = "https://api.bazara.co/api/v2/dev";
    }
    SERVER_URL = "https://api.bazara.co/api/v1/dev";
    console.log(SERVER_URL)
    const token = await AsyncStorage.getItem("token");

    var response = await axios.post(SERVER_URL + url, payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });


      console.log("responsen payload---", payload)

    return response
        
};

export const bankVerification = (payload: {bankAccount: string, bankCode: string}) => {
    return axios.get(PAYSTACK_VERIFY_URL + `?account_number=${payload.bankAccount}&bank_code=${payload.bankCode}`, {
      headers: {
        authorization: `Bearer ${CONFIG.REACT_APP_STAGING_VERIFICATION}`,
    },
    })
}
 

export default {doPost}