import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../../config/config";


export const doPost = async (payload: Object, url: String, v?: String) => {
    
    var response = await axios.post(config?.databaseUrl + url, payload);

    return response
        
};


export const getRequest = async (url: String, v?: String) => {

    const token = await AsyncStorage.getItem("token");

    var response = await axios.get(config?.databaseUrl2 + url, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

    return response
}


export const sendPost = async ( url: String, payload: any, v?: String) => {
    
    const token = await AsyncStorage.getItem("token");

    var response = await axios.post(config?.databaseUrl2 + url, payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });


    return response
        
};


export const uploadImageFunc = async (payload: any) => {
    const token = await AsyncStorage.getItem("token");
    return axios.post(config?.databaseUpload, payload, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
  }
  
 

export default {doPost}