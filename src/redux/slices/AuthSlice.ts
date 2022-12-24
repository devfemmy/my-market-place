import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { LoginFormData, SignupType, LoginState, OauthAction } from "../../utils/types";
import { deleteRequestNoPayload, postAuthRequest } from "../../utils/server"

import AsyncStorage from '@react-native-async-storage/async-storage';


const initialState: LoginState = {
  userData: [],
  userInfo: null,
  loading: false,
  error: null
}



export const createUser = createAsyncThunk(
  'auth/signUp',
  async (payload: SignupType, { rejectWithValue }) => {

    const data = {
      first_name: payload.fName,
      last_name: payload?.lName,
      email: payload?.email,
      password: payload?.password
    }
    try {
      const response = await postAuthRequest("/auth", data)
      if (response?.status === 200) {
       await AsyncStorage.setItem("token", response?.data?.data?.accessToken)
        return response?.data
      }

    }
    catch (e: any) {

      return rejectWithValue(e?.response?.data?.message)
    }
  }
)


export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async (payload: { email: string, redirect_url: string }, { rejectWithValue }) => {
    try {
      const response = await postAuthRequest("/auth/request_password_reset", payload)
      if (response?.status === 200) {
        return response?.data
      }
    }
    catch (e: any) {
      return rejectWithValue(e?.response?.data?.message)
    }


  }
)


export const activateNewPassword = createAsyncThunk(
  'auth/activateNewPassword',
  async (payload: { token: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await postAuthRequest("/auth/reset_password", payload)
      if (response?.status === 200) {
        return response?.data
      }
    }
    catch (e: any) {
      return rejectWithValue(e?.response?.data?.message)
    }


  }
)



export const oauthLogin = createAsyncThunk(
  'auth/oauthLogin',
  async (payload: OauthAction, { rejectWithValue }) => {
    try {
      var response = await postAuthRequest('/auth/oAuth/google', payload)
      if (response?.status === 200) {
         await AsyncStorage.setItem("token", response?.data?.data?.accessToken)
        return response?.data?.data
      }

    }
    catch (e: any) {
      return rejectWithValue(e?.response?.data?.message)
    }
  }
)
export const oauthAppleLogin = createAsyncThunk(
  'auth/oauthAppleLogin',
  async (payload: OauthAction, { rejectWithValue }) => {
    try {
      var response = await postAuthRequest('/auth/oAuth/apple', payload)
      if (response?.status === 200) {
         await AsyncStorage.setItem("token", response?.data?.data?.accessToken)
        return response?.data?.data
      }

    }
    catch (e: any) {
      return rejectWithValue(e?.response?.data?.message)
    }
  }
)


export const oauthSignup = createAsyncThunk(
  'auth/oauthSignup',
  async (payload: OauthAction, { rejectWithValue }) => {
    try {
      var response = await postAuthRequest('/auth/oAuth/google/register', payload)
      if (response?.status === 200) {
        await AsyncStorage.setItem("token", response?.data?.data?.accessToken)
        return response?.data?.data
      }

    }
    catch (e: any) {
      return rejectWithValue(e?.response?.data?.message)
    }
  }
)
export const oauthAppleSignup = createAsyncThunk(
  'auth/oauthAppleSignup',
  async (payload: OauthAction, { rejectWithValue }) => {
    try {
      var response = await postAuthRequest('/auth/oAuth/apple/register', payload)
      if (response?.status === 200) {
        await AsyncStorage.setItem("token", response?.data?.data?.accessToken)
        return response?.data?.data
      }

    }
    catch (e: any) {
      return rejectWithValue(e?.response?.data?.message)
    }
  }
)


export const signInUser = createAsyncThunk(
  'auth/signin',
  async (payload: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await postAuthRequest("/auth/login", payload)
      if (response?.status === 200) {
       await AsyncStorage.setItem("token", response?.data?.data?.accessToken)
        return response?.data
      }

    }
    catch (e: any) {
      return rejectWithValue(e?.response?.data?.message)
    }

  }
)

export const deleteAccountInfo = createAsyncThunk(
  'auth/deleteAccountInfo',
  async () => {
    try {
      const response = await deleteRequestNoPayload("/auth/account/delete")
      if (response?.status === 200) {
       
        return response?.data
      }

    }
    catch (e) {
     // return rejectWithValue(e?.response?.data?.message)
    }

  }
)


export const signOutUser = createAsyncThunk(
  'auth/signout',
  async () => {
    try {
      return null
    }
    catch (e: any) {
      return console.log(e)
    }

  }
)

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state, action) => {
      state.loading = true
    }),
      builder.addCase(createUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false,
          state.userInfo = action.payload?.data

      }),
      builder.addCase(createUser.rejected, (state, action) => {
        state.loading = false,
          state.error = action.payload
      }),
      builder.addCase(signInUser.pending, (state, action) => {
        state.loading = true
      }),
      builder.addCase(signInUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false,
          state.userInfo = action.payload?.data
      })
    builder.addCase(signInUser.rejected, (state, action) => {
      // state.error = action.error.message
    })
    builder.addCase(forgetPassword.pending, (state, action) => {
      state.loading = true
    }),
      builder.addCase(forgetPassword.fulfilled, (state, action) => {
      })
    builder.addCase(forgetPassword.rejected, (state, action) => {
      state.error = action.error.message
    })
    builder.addCase(oauthLogin.pending, (state, action) => {
      state.loading = true
    }),
      builder.addCase(oauthLogin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false
      })
    builder.addCase(oauthLogin.rejected, (state, action) => {
      // state.error = action.error.message
    })
    builder.addCase(oauthSignup.pending, (state, action) => {
      state.loading = true
    }),
      builder.addCase(oauthSignup.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false
      })
    builder.addCase(oauthSignup.rejected, (state, action) => {
      // state.error = action.error.message
    })
    builder.addCase(signOutUser.pending, (state, action) => {
      state.loading = true
    }),
      builder.addCase(signOutUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false,
        state.userInfo = null
      })
    builder.addCase(signOutUser.rejected, (state, action) => {
      // state.error = action.error.message
    })
    builder.addCase(deleteAccountInfo.pending, (state, action) => {
      state.loading = true
    }),
      builder.addCase(deleteAccountInfo.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false
      })
    builder.addCase(deleteAccountInfo.rejected, (state, action) => {
      // state.error = action.error.message
    })
  }
})

export const loginState = (state: RootState) => state.auth.userData;

export const userState = (state: RootState) => state.auth.userInfo;

export default AuthSlice.reducer;


