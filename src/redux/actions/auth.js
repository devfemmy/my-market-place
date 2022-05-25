
import { LOG_IN_SUCCESS, BALANCE, NOTIFICATION_STAT, PROFILE_UPLOADING, PROFILE_UPLOAD_SUCCESS, REPORT, NOTIFICATIONS_COUNT, NOTIFICATIONS, RATE_MODAL_VISIBLE, REFERRAL_ANALYSIS, REMOVE_PAYOUT_ACCOUNT_STATE, PAYOUT, PAYOUTS, PAYOUT_MODAL_VISIBLE, LOCATION, ADD_LOCATION_MODAL_VISIBLE, LOCATIONS, PROFILE_UPDATE_SUCCESS, SHOW_NAME_LOADING, ACCOUNT_NAME, LOG_IN_ERROR, ALERT_TYPE, ALERT_VISIBLE, ALERT_VISIBLE_GLOBAL, ALERT_MESSAGE, EMAIL_ALERT_VISIBLE, PHONE_ALERT_VISIBLE, REG_SUCCESS, FORGOT_ERROR, FORGOT_SUCCESS, SHOW_LOADING } from "../constants/auth";
import { doGet, doPost, doPostUpload, doPaystackPost, doPut } from '../util/server';
import {AsyncStorage } from 'react-native';
import { NavigationContext } from "react-navigation";
import { getUser } from '../util/currentUser';
import { not } from "react-native-reanimated";
import crashlytics from '@react-native-firebase/crashlytics';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-simple-toast';
const ToastAndroid = Toast;

const checkUserType = async (navigation) => {
  let userType = await AsyncStorage.getItem("userType");
  if(userType == "Seller"){
    navigation.navigate("NewStore")
  }else{
    navigation.navigate("Home")
  }
}

export function getSideHustlesC(navigation) {

  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doGet(payload, 'sidehustle/account', "v2")
    console.log(res, 'resA')
    dispatch({ type: SHOW_LOADING, payload: false });
    if(res?.rawResponse?.status == 401){
      navigation.navigate("SignIn")
    }
    var response = res.res.data;
    var arr = [];
    var obj = {};
    if(res?.status){
      dispatch({ type: "SIDE_HUSTLES", payload: res.res.data });
      dispatch({ type: "SIDE_HUSTLE", payload: res.res.data[0] });
      if(res.res.data.length > 0){
        let userType = await AsyncStorage.getItem("userType");
        let createCard = await AsyncStorage.getItem("createCard");

        
        if(userType == "Buyer" &&  createCard == null ){
          navigation.push("Home")
        }
        else if (createCard == "create") {
          navigation.push("CreateSideHustle")
        }
        else if (userType == null && createCard == null){
          await AsyncStorage.setItem('userType', "Seller");
          navigation.push("NewStore")
        }
        else {
          return
        }
      }else{
        navigation.push("Home")
      }
    }
    else{
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: SIDE_HUSTLES, payload: [] });
    }
  }
}

export function login(payload, navigation) {
    return async function(dispatch) {
      dispatch({ type: SHOW_LOADING, payload: true });
      const res = await doPost(payload, 'auth/login')
      console.log(res, 'res')
      if(res?.status){
        AsyncStorage.setItem('loggedInUser', JSON.stringify(res.res));
          dispatch({ type: SHOW_LOADING, payload: false });
          dispatch({ type: LOG_IN_SUCCESS, payload: JSON.stringify(res.res) });
          await Promise.all([
            crashlytics().setAttributes({
              user: JSON.stringify(res),
              loginType: 'login'
            }),
          ])
          //navigation.navigate("Home")
          //checkUserType(navigation)
          dispatch(getSideHustlesC(navigation))
      }
      else{
        if(res.res.message){
          var msg = res.res.message;
        }else if(res.res.error){
          var msg = res.res.error;
        }else{
          var msg = "Invalid credentials."
        }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
       dispatch({ type: ALERT_TYPE, payload: "error" });
       dispatch({ type: ALERT_MESSAGE, payload: msg });
      }
    }
}
export function socialSignin(payload, navigation) {
  
  return async function(dispatch) {
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'auth/login/socialAuth')
    if(res?.status){
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(res.res));
        dispatch({ type: LOG_IN_SUCCESS, payload: res.res });
        navigation.navigate("Home")
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
      dispatch({ type: ALERT_TYPE, payload: "error" });
      dispatch({ type: ALERT_MESSAGE, payload: msg });
    }
  }
}

export function oAuthGoogleSignin(payload, navigation) {
  
  return async function(dispatch) {
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'auth/login/oAuthGo')
    if(res?.status){
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(res.res));
        dispatch({ type: LOG_IN_SUCCESS, payload: res.res });
        await Promise.all([
          crashlytics().setAttributes({
            user: JSON.stringify(res),
            loginType: 'oAuth'
          }),
        ])
        //navigation.navigate("Home")
        //checkUserType(navigation)
        dispatch(getSideHustlesC(navigation))
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
      dispatch({ type: ALERT_TYPE, payload: "error" });
      dispatch({ type: ALERT_MESSAGE, payload: msg });
    }
  }
}

export function oAuthAppleSignin(payload, navigation) {
  return async function(dispatch) {
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'auth/login/oAuthApple')
    if(res?.status){
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(res.res));
        dispatch({ type: LOG_IN_SUCCESS, payload: res.res });
        await Promise.all([
          crashlytics().setAttributes({
            user: JSON.stringify(res),
            loginType: 'oAuth Apple'
          }),
        ])
        //checkUserType(navigation)
        dispatch(getSideHustlesC(navigation))
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
      dispatch({ type: ALERT_TYPE, payload: "error" });
      dispatch({ type: ALERT_MESSAGE, payload: msg });
    }
  }
}

export function oAuthFacebookSignin(payload, navigation) {
  
  return async function(dispatch) {
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'auth/login/oAuthFb')
    if(res?.status){
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(res.res));
      dispatch({ type: LOG_IN_SUCCESS, payload: res.res });
      navigation.navigate("Home")
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
      dispatch({ type: ALERT_TYPE, payload: "error" });
      dispatch({ type: ALERT_MESSAGE, payload: msg });
    }
  }
}

export function signup(payload, navigation) {
  
  return async function(dispatch) {
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'auth/regUser')
    if(res?.status){
      AsyncStorage.setItem('loggedInUser', JSON.stringify(res.res));
        dispatch({ type: REG_SUCCESS, payload: payload });
        await Promise.all([
          crashlytics().setAttributes({
            user: JSON.stringify(res),
            loginType: 'signUp'
          }),
        ])
        navigation.navigate("Home")
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
       // dispatch({ type: LOG_IN_ERROR, payload: res.res.message });
    }
  }
}
export function socialSignup(payload, navigation) {
  return async function(dispatch) {
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'auth/socialReg')
    
    
    if(res?.status){
      AsyncStorage.setItem('loggedInUser', JSON.stringify(res.res));
        dispatch({ type: SHOW_LOADING, payload: false });
        dispatch({ type: REG_SUCCESS, payload: res.res });
        dispatch({ type: EMAIL_ALERT_VISIBLE, payload: false });
        dispatch({ type: PHONE_ALERT_VISIBLE, payload: false });
        
        // dispatch({ type: ALERT_TYPE, payload: "Success" });
        // dispatch({ type: ALERT_MESSAGE, payload: "Registration was successful" });
        navigation.navigate("Home")
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
    }
    
  }
}
export function forgotPassword(payload, navigation) {
  return async function(dispatch) {
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'auth/request_reset') 
    
    if(res?.status){
        dispatch({ type: FORGOT_SUCCESS, payload: true });
        await AsyncStorage.removeItem("loggedInUser")
        await AsyncStorage.removeItem("userType")
        await GoogleSignin.signOut();
        navigation.navigate("SignIn")
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
      dispatch({ type: ALERT_TYPE, payload: "error" });
      dispatch({ type: ALERT_MESSAGE, payload: msg });
    }
  }
}

export function phoneAlertVisible(payload) {
  return async function(dispatch) {
    dispatch({ type: PHONE_ALERT_VISIBLE, payload: payload });
  }
}
export function emailAlertVisible(payload) {
  return async function(dispatch) {
    dispatch({ type: EMAIL_ALERT_VISIBLE, payload: payload });
  }
}
export function alertVisible(payload) {
  return async function(dispatch) {
    dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: payload });
  }
}

export function paystackBankVerify(payload, navigation) {
  return async function(dispatch) {
    dispatch({ type: SHOW_NAME_LOADING, payload: true });
    const res = await doPaystackPost(payload, 'https://api.flutterwave.com/v3/accounts/resolve');
    if(res.res.status != "error"){
        dispatch({ type: SHOW_NAME_LOADING, payload: false });
        dispatch({ type: ACCOUNT_NAME, payload: res.res.data.account_name });
    }
    else{
      var msg = res.res.message;
      dispatch({ type: SHOW_NAME_LOADING, payload: false });
      // setTimeout(
      //     function() {
      //       dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
      //     },
      //     500
      //   );
      // dispatch({ type: ALERT_TYPE, payload: "error" });
      // dispatch({ type: ALERT_MESSAGE, payload: msg });
      dispatch({ type: ACCOUNT_NAME, payload: false });
      ToastAndroid.show(msg, ToastAndroid.LONG);
    }
  }
}

export function editProfile(payload, navigation) {
  return async function(dispatch) {
    const user = await getUser();
    if(user){
      payload.token = user.token
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'auth/identity/update')
    dispatch({ type: PROFILE_UPLOAD_SUCCESS, payload: false });
    if(res?.status){
        dispatch({ type: SHOW_LOADING, payload: false });
        var userN = {
          user: res.res.data
        }
        userN.token = payload.token;
        AsyncStorage.setItem('loggedInUser', JSON.stringify(userN));
        dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: res.res });
        // dispatch({ type: ALERT_TYPE, payload: "Success" });
        // dispatch({ type: ALERT_MESSAGE, payload: "Your profile has been successfully updated!" });
        setTimeout(
          function() {
            //dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
            ToastAndroid.show("Your profile has been successfully updated!", ToastAndroid.LONG);
          },
          500
        );
        return true;
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
        return false;
    }
  }
}

export function getUserProfile() {
  return async function(dispatch) {
    const user = await getUser();
    let payload = {};
    if(user){
      payload.token = user.token
    }
    const res = await doGet(payload, 'auth/identity')
    if(res?.status){
      return res.res.data
    }else{
      return false
    }
  }
}

export function getProfileById(payload) {
  return async function(dispatch) {
    const user = await getUser();
    payload.token = user.token
    const res = await doGet(payload, 'auth/identity/mini?userId='+payload.userId);
    if(res?.status){
      return res.res.data
    }else{
      return false
    }
  }
}

export function editProfileA(payload, navigation) {
  return async function(dispatch) {
    const user = await getUser();
    if(user){
      payload.token = user.token
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'auth/identity/update')
    if(res?.status){
        dispatch({ type: SHOW_LOADING, payload: false });
        var userN = {
          user: res.res.data
        }
        userN.token = payload.token;
        AsyncStorage.setItem('loggedInUser', JSON.stringify(userN));
        dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: res.res });
        
        // dispatch({ type: ALERT_TYPE, payload: "Success" });
        // dispatch({ type: ALERT_MESSAGE, payload: "Your profile has been successfully updated!" });
        //navigation.navigate("Home")
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
       // dispatch({ type: LOG_IN_ERROR, payload: res.res.message });
    }
  }
}

export function getLocations(navigation) {
  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doGet(payload, 'sidehustle/account/locations', 'v2')
    if(res?.status){
      dispatch({ type: SHOW_LOADING, payload: false });
      if(res?.res?.data?.locations){
        dispatch({ type: LOCATIONS, payload: res.res.data.locations });
      }else{
        dispatch({ type: LOCATIONS, payload: [] });
      }
    }
    else{
      if(res.res.message != undefined || res.res.error != undefined){
        if(res.res.message){
          var msg = res.res.message;
        }else{
          var msg = res.res.error;
        }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: LOCATIONS, payload: false });
    }
  }
}

export function addLocation(payload, navigation) {
  return async function(dispatch) {
    const user = await getUser();
    if(user){
      payload.token = user.token
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'sidehustle/account/locations', 'v2')
    console.log(res, 'kkkd')
    if(res?.status){
        dispatch({ type: SHOW_LOADING, payload: false });
        dispatch({ type: LOCATIONS, payload: res.res.data.locations });
        dispatch({type: ADD_LOCATION_MODAL_VISIBLE, payload: false});
       
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
       // dispatch({ type: LOG_IN_ERROR, payload: res.res.message });
    }
  }
}

export function updateLocation(payload, navigation) {
  return async function(dispatch) {
    const user = await getUser();
    if(user){
      payload.token = user.token
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'sidehustle/account/locations/'+payload._id+'/update', 'v2')
    if(res?.status){
        dispatch({ type: SHOW_LOADING, payload: false });
        dispatch({type: ADD_LOCATION_MODAL_VISIBLE, payload: false});
        dispatch({ type: LOCATIONS, payload: res.res.data.locations });
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
       // dispatch({ type: LOG_IN_ERROR, payload: res.res.message });
    }
  }
}

export function getPayouts(navigation) {
  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doGet(payload, 'sidehustle/account/payouts', "v2")
    console.log(JSON.stringify(res), 'payout')
    if(res?.status){
      if(res?.res?.data?.payouts){
        dispatch({ type: SHOW_LOADING, payload: false });
        dispatch({ type: PAYOUTS, payload: res.res.data.payouts });
      }else{
        dispatch({ type: SHOW_LOADING, payload: false });
        dispatch({ type: PAYOUTS, payload: [] });
      }
    }
    else{
      if(res.res.message != undefined || res.res.error != undefined){
        if(res.res.message){
          var msg = res.res.message;
        }else{
          var msg = res.res.error;
        }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: PAYOUTS, payload: [] });
    }
  }
}
export function getPayoutsBackground(navigation) {
  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    
    }
    const res = await doGet(payload, 'sidehustle/account/payouts', "v2")
    if(res?.status){
      if(res.res.data.payouts){
         dispatch({ type: PAYOUTS, payload: res.res.data.payouts });
         return res.res.data.payouts
      }else{
        dispatch({ type: SHOW_LOADING, payload: false });
        dispatch({ type: PAYOUTS, payload: [] });
      }
    }
    else{
      if(res.res.message != undefined || res.res.error != undefined){
        if(res.res.message){
          var msg = res.res.message;
        }else{
          var msg = res.res.error;
        }
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: PAYOUTS, payload: [] });
    }
  }
}
export function addPayout(payload, navigation) {
  return async function(dispatch) {
    const user = await getUser();
    if(user){
      payload.token = user.token
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'sidehustle/account/payouts', "v2")
    if(res?.status){
        dispatch({ type: SHOW_LOADING, payload: false });
        dispatch({ type: PAYOUTS, payload: res.res.data.payouts });
        dispatch({type: PAYOUT_MODAL_VISIBLE, payload: false});
        ToastAndroid.show("Payout account added.", ToastAndroid.LONG);
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
        dispatch({ type: SHOW_LOADING, payload: false });
        ToastAndroid.show(msg, ToastAndroid.LONG);
        // setTimeout(
        //   function() {
        //     dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
        //   },
        //   500
        // );
        // dispatch({ type: ALERT_TYPE, payload: "error" });
        // dispatch({ type: ALERT_MESSAGE, payload: msg });
       // dispatch({ type: LOG_IN_ERROR, payload: res.res.message });
    }
  }
}

export function updatePayout(payload, navigation) {
  return async function(dispatch) {
    const user = await getUser();
    if(user){
      payload.token = user.token
      
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'sidehustle/account/payouts/'+payload._id+'/update', "v2")
    
    if(res?.status){
        dispatch({ type: SHOW_LOADING, payload: false });
        dispatch({type: PAYOUT_MODAL_VISIBLE, payload: false});
        dispatch({ type: PAYOUTS, payload: res.res.data.payouts });
        setTimeout(
          function() {
            ToastAndroid.show("Payout account updated.", ToastAndroid.LONG);
          },
          500
        );
        
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            ToastAndroid.show(msg, ToastAndroid.LONG);
          },
          500
        );
        
        // setTimeout(
        //   function() {
        //     dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
        //   },
        //   1000
        // );
        // dispatch({ type: ALERT_TYPE, payload: "error" });
        // dispatch({ type: ALERT_MESSAGE, payload: msg });
       // dispatch({ type: LOG_IN_ERROR, payload: res.res.message });
    }
  }
}
export function deletePayout(payload, navigation) {
  return async function(dispatch) {
    const user = await getUser();
    if(user){
      payload.token = user.token
      
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'sidehustle/account/payouts/'+payload.payout._id+'/delete', "v2")
    
    if(res?.status){
        dispatch({ type: SHOW_LOADING, payload: false });
        dispatch({type: "REMOVE_PAYOUT_ACCOUNT_STATE", payload: false})
        dispatch({ type: PAYOUTS, payload: res.res.data.payouts });
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
       // dispatch({ type: LOG_IN_ERROR, payload: res.res.message });
    }
  }
}


export function getBalance(navigation) {
  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doGet(payload, 'sidehustle/account/analysis', 'v2')
    
    
    if(res?.status){
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: BALANCE, payload: res.res.data });
    }
    else{
      if(res.res.message != undefined || res.res.error != undefined){
        if(res.res.message){
          var msg = res.res.message;
        }else{
          var msg = res.res.error;
        }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: BALANCE, payload: false });
    }
  }
}
export function getReferralAnalysis(navigation) {
  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doGet(payload, 'auth/identity/referral/analysis')
    
    
    if(res?.status){
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: REFERRAL_ANALYSIS, payload: res.res.data });
    }
    else{
      if(res.res.message != undefined || res.res.error != undefined){
        if(res.res.message){
          var msg = res.res.message;
        }else{
          var msg = res.res.error;
        }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: REFERRAL_ANALYSIS, payload: false });
    }
  }
}
export function getNotifications(navigation) {
  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doGet(payload, 'sidehustle/notification', "v2")
    
    
    if(res?.status){
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: NOTIFICATIONS, payload: res.res.data });
    }
    else{
      if(res.res.message != undefined || res.res.error != undefined){
        if(res.res.message){
          var msg = res.res.message;
        }else{
          var msg = res.res.error;
        }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: NOTIFICATIONS, payload: false });
    }
  }
}
export function getNotificationStat(navigation) {
  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doGet(payload, 'sidehustle/notification/stat', "v2")
    
    
    if(res?.status){
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: NOTIFICATION_STAT, payload: res.res.data });
    }
    else{
      if(res.res.message != undefined || res.res.error != undefined){
        if(res.res.message){
          var msg = res.res.message;
        }else{
          var msg = res.res.error;
        }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: NOTIFICATION_STAT, payload: false });
    }
  }
}

export function getNotificationsA(navigation) {
  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    
    }
    const res = await doGet(payload, 'sidehustle/notification', "v2")
    
    if(res?.status){
      //dispatch({ type: SHOW_LOADING, payload: false });
      var notCount = res.res.data.filter(function (el) {
        return el.status != "read";
      });
      
      dispatch({ type: NOTIFICATIONS_COUNT, payload: notCount.length });
    }
  }
}

export function getReport(navigation) {
  return async function(dispatch) {
    const user = await getUser();
    const payload = {token: ""}
    if(user){
      payload.token = user.token
    }
    dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doGet(payload, 'sidehustle/analysis', "v2")
    
    
    if(res?.rawResponse?.status == 401){
      navigation.navigate("SignIn")
    }
    if(res?.status){
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: REPORT, payload: res.res.data });
    }
    else{
      if(res.res.message != undefined || res.res.error != undefined){
        if(res.res.message){
          var msg = res.res.message;
        }else{
          var msg = res.res.error;
        }
        dispatch({ type: SHOW_LOADING, payload: false });
        setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
        dispatch({ type: ALERT_TYPE, payload: "error" });
        dispatch({ type: ALERT_MESSAGE, payload: msg });
      }
      dispatch({ type: SHOW_LOADING, payload: false });
      dispatch({ type: REPORT, payload: false });
    }
  }
}
export function uploadProfileImage(payload) {
  return async function(dispatch) {
    const user = await getUser();
    payload.token = user.token;
    dispatch({ type: PROFILE_UPLOADING, payload: true });
    const res = await doPostUpload(payload)
    
    if(res?.status){
      dispatch({ type: PROFILE_UPLOADING, payload: false });
      dispatch({ type: PROFILE_UPLOAD_SUCCESS, payload: res.res.data.url });
    }
    else{
      if(res.res.message){
        var msg = res.res.message;
      }else{
        var msg = res.res.error;
      }
      dispatch({ type: PROFILE_UPLOADING, payload: false });
      setTimeout(
          function() {
            dispatch({ type: ALERT_VISIBLE_GLOBAL, payload: true });
          },
          500
        );
      dispatch({ type: ALERT_TYPE, payload: "error" });
      dispatch({ type: ALERT_MESSAGE, payload: msg });
    }
  }
}

export function markNotificationRead(payload, navigation) {
  return async function(dispatch) {
    const user = await getUser();
    if(user){
      payload.token = user.token
      
    }
    //dispatch({ type: SHOW_LOADING, payload: true });
    const res = await doPost(payload, 'sidehustle/notification/mark?id='+payload.notificationId+'&status=read', "v2")
    
    if(res?.status){
        
    }
    else{
      
    }
  }
}

export function resendEmail() {
  return async function(dispatch) {
    const user = await getUser();
    var payload = {}
    if(user){
      payload.token = user.token
    }
    const res = await doPost(payload, 'auth/email-validation-req')
    
  }
}