import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../../config/config";


export const doPost = async (payload: Object, url: String, v?: String) => {
    
    var response = await axios.post(config?.databaseUrl + url, payload);

    return response
        
};

export const postAuthRequest = async (url: string, payload: any) => {
  const token = await AsyncStorage.getItem("token");

  var res = await axios.post(config.databaseUrl + url, payload,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    if(res?.status === 200){
      return res
    }
}


export const getRequest = async (url: String, v?: String) => {

    const token = await AsyncStorage.getItem("token");

    var response = await axios.get(config?.databaseUrl2 + url, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      if(response?.status === 200){
        return response
      }
}

export const getRequestNoToken = (url: string) => {
  try {
    return axios.get(config.databaseUrl2 + url)
  }
  catch(e){
    console.log("err",{e})
  }
}


export const specialGetRequest = async (url: string) => {
  const token = await AsyncStorage.getItem("token");

  var res = await axios.get(config.databaseUrl + url,
     {
       headers: {
         authorization: `Bearer ${token}`,
       },
     })
 
     if(res?.status === 200){
       return res
     }
    
 }
 

 export const specialPostRequest = async (url: string, id: string) => {
  const token = await AsyncStorage.getItem("token");

  var res = await axios.post(config.databaseUrl2 + url,
    {
      params: {
        productId: id,
      },
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  )
  if(res?.status === 200){
    return res
  }
  
}



export const getProfileRequest = async (url: String, v?: String) => {

    const token = await AsyncStorage.getItem("token");

    var response = await axios.get(config?.databaseUrl2 + url, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
    return response
}

export const postRequest =  async (url: string, payload?: any) => {
  const token = await AsyncStorage.getItem("token");
  var res = await axios.post(config.databaseUrl2 + url, payload, {
    headers: {
      authorization: `Bearer ${token}`,
    }
  })
  if(res?.status === 200){
    return res
  }
  
}

export const deleteRequest = (url: string, payload: any) => {
  return axios.delete(config.databaseUrl2 + url, payload)
}

export const deleteRequestNoPayload = async (url: string) => {
  const token = await AsyncStorage.getItem("token");
  return axios.delete(config.databaseUrl2 + url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
}


export const uploadImageFunc = async (payload: any) => {
  const token = await AsyncStorage.getItem("token");
  return axios.post(config.databaseUpload, payload, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
}


export const bankVerification =  (payload: any) => {

  return axios.get(`https://api.paystack.co/bank/resolve?account_number=${payload.bankAccount}&bank_code=${payload.bankCode}`, {
    headers: {
      authorization: `Bearer ${config.secretOrKey}`,
    },
  })
}


export const truncate = (info: string, num: number) => {
  return info?.length > num ? info?.substr(0, num - 1) + "..." : info 
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

export const sendDelete = async ( url: String, v?: String) => {
    
  const token = await AsyncStorage.getItem("token");

  var response = await axios.delete(config?.databaseUrl2 + url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
  });

  return response
      
};


  
 
export default {doPost}