import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const UPLOAD_URL = "https://prod.bazara.co/upload-microservice/v1/upload/img";
const UPLOAD_VIDEO_URL = "https://prod.bazara.co/upload-microservice/v1/upload/video";
const PAYSTACK_VERIFY_URL = "https://api.flutterwave.com/v3/accounts/resolve";


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
    var response = await axios.post(SERVER_URL + url, payload);

    return response
        
};


export const getRequest = async (url: String, v?: String) => {

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

    const token = await AsyncStorage.getItem("token");

    console.log("action payload---", payload)

    var response = await axios.post(SERVER_URL + url, payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });


      console.log("responsen payload---", payload)

    return response
        
};
 

export default {doPost} 