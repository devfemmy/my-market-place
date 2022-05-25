import { SHOW_LOADING, BALANCE, NOTIFICATION_STAT, ADD_SHIPPING_FEE_MODAL_VISIBLE, PROFILE_UPLOADING, PROFILE_UPLOAD_SUCCESS, REPORT, NOTIFICATIONS_COUNT, NOTIFICATIONS, PAYOUT, PAYOUTS, LOCATION, LOCATIONS, PROFILE_UPDATE_SUCCESS, MENU_VISIBLE, ADD_LOCATION_MODAL_VISIBLE, REMOVE_PAYOUT_ACCOUNT_STATE, SHOW_NAME_LOADING, PAYOUT_MODAL_VISIBLE, PASSWORD_MODAL_VISIBLE, LOG_IN_SUCCESS, ALERT_MESSAGE, ALERT_TYPE, ALERT_VISIBLE_GLOBAL, EMAIL_ALERT_VISIBLE, PHONE_ALERT_VISIBLE, REG_SUCCESS, FORGOT_SUCCESS, FORGOT_ERROR, LOG_IN_ERROR, ACCOUNT_NAME, REFERRAL_ANALYSIS } from "../constants/auth";


const initialState = {
  loggedInUser: false,
  showLoading: false,
  forgotError: false,
  forgotSuccess: false,
  loginError: false,
  passwordModalVisible: false,
  payoutModalVisible: false,
  phoneAlertVisible: false,
  emailAlertVisible: false,
  emailAlertVisibleState: false,
  alertVisibleGlobal:false,
  alertType: "",
  alertMessage: "",
  accountName: false,
  showNameLoading: false,
  removePayoutAccountState: false,
  addLocationModalVisible: false,
  menuVisible: false,
  profileUpdateSuccess: false,
  locations: false,
  location: false,
  payout: false,
  payouts: false,
  referralAnalysis: false,
  notifications: false,
  report: false,
  balance: false,
  notificationsCount: false,
  profileUploading: false,
  profileUploadSuccess: false,
  profileUploadUrl: false,
  addShippingFeeModalVisible: false,
  notificationStat: false

};

function authReducer(state = initialState, action) {
    switch (action.type) {
    case LOG_IN_SUCCESS: {
        return Object.assign({}, state, {
            loggedInUser: action.payload,
            showLoading: false
        })
    }
    case REG_SUCCESS: {
        return Object.assign({}, state, {
            loggedInUser: action.payload,
            showLoading: false
        })
    }
    case PROFILE_UPLOAD_SUCCESS: {
        return Object.assign({}, state, {
            profileUploadSuccess: true,
            profileUploadUrl: action.payload,
            //showLoading: false
        })
    }
    case PROFILE_UPLOADING: {
        return Object.assign({}, state, {
            profileUploading: action.payload,
        })
    }

    case PHONE_ALERT_VISIBLE: {
        return Object.assign({}, state, {
            phoneAlertVisible: action.payload
        })
    }
    case EMAIL_ALERT_VISIBLE: {
        return Object.assign({}, state, {
            emailAlertVisible: action.payload
        })
    }
    case ALERT_VISIBLE_GLOBAL: {
        return Object.assign({}, state, {
            alertVisibleGlobal: action.payload
        })
    }
    case ALERT_TYPE: {
        return Object.assign({}, state, {
            alertType: action.payload
        })
    }
    case ALERT_MESSAGE: {
        return Object.assign({}, state, {
            alertMessage: action.payload
        })
    }
    case LOG_IN_ERROR: {
        return Object.assign({}, state, {
            loggedInUser: false,
            showLoading: false,
            loginError: action.payload
        })
    }
    case FORGOT_ERROR: {
        return Object.assign({}, state, {
            showLoading: false,
            forgotError: action.payload
        })
    }
    case FORGOT_SUCCESS: {
        return Object.assign({}, state, {
            showLoading: false,
            forgotSuccess: action.payload
        })
    }
    case SHOW_LOADING: {
        return Object.assign({}, state, {
            showLoading: action.payload,
        })
    }
    case SHOW_NAME_LOADING: {
        return Object.assign({}, state, {
            showNameLoading: action.payload,
        })
    }
    case PASSWORD_MODAL_VISIBLE: {
        return Object.assign({}, state, {
            passwordModalVisible: action.payload,
        })
    }
    case PAYOUT_MODAL_VISIBLE: {
        return Object.assign({}, state, {
            payoutModalVisible: action.payload,
        })
    }
    case ACCOUNT_NAME: {
        return Object.assign({}, state, {
            accountName: action.payload,
        })
    }
    case REMOVE_PAYOUT_ACCOUNT_STATE: {
        return Object.assign({}, state, {
            removePayoutAccountState: action.payload,
        })
    }
    case ADD_LOCATION_MODAL_VISIBLE: {
        return Object.assign({}, state, {
            addLocationModalVisible: action.payload,
        })
    }
    case ADD_SHIPPING_FEE_MODAL_VISIBLE: {
        return Object.assign({}, state, {
            addShippingFeeModalVisible: action.payload,
        })
    }
    case MENU_VISIBLE: {
        return Object.assign({}, state, {
            menuVisible: action.payload,
        })
    }
    case PROFILE_UPDATE_SUCCESS: {
        return Object.assign({}, state, {
            profileUpdateSuccess: action.payload,
        })
    }
    case LOCATIONS: {
        return Object.assign({}, state, {
            locations: action.payload,
        })
    }
    case LOCATION: {
        return Object.assign({}, state, {
            location: action.payload,
        })
    }
    case PAYOUT: {
        return Object.assign({}, state, {
            payout: action.payload,
        })
    }
    case PAYOUTS: {
        return Object.assign({}, state, {
            payouts: action.payload,
        })
    }
    case REFERRAL_ANALYSIS: {
        return Object.assign({}, state, {
            referralAnalysis: action.payload,
        })
    }
    case NOTIFICATIONS: {
        return Object.assign({}, state, {
            notifications: action.payload,
        })
    }
    case NOTIFICATION_STAT: {
        return Object.assign({}, state, {
            notificationStat: action.payload,
        })
    }
    case REPORT: {
        return Object.assign({}, state, {
            report: action.payload,
        })
    }
    case BALANCE: {
        return Object.assign({}, state, {
            balance: action.payload,
        })
    }
    case NOTIFICATIONS_COUNT: {
        return Object.assign({}, state, {
            notificationsCount: action.payload,
        })
    }
    
    default:
        return state
    }
}

export default authReducer;