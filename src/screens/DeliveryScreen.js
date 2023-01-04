import { View, StyleSheet, Pressable, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { colors } from '../utils/themes'
import MobileHeader from './Containers/MobileHeader'
import { Text } from '../components/common/Text'
import { getStorage, hp,  numberFormat, wp } from '../utils/helpers'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { globalStyles } from '../styles'
import { getAddress, updateAddress, updateAddressDefault } from '../redux/slices/AddressSlice'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import DeliveryModal from './Containers/DeliveryModal'
import AddressBooklistModal from './Containers/AddressBooklistModal'
import { Button } from '../components/common/Button'
import { cartCheckout, getCarts, getDeliveryFeeData } from '../redux/slices/cartSlice'
import { getProfile, profileInfo } from '../redux/slices/ProfileSlice'
//import { Paystack } from 'react-native-paystack-webview';
import config from "../config/config"
import { Paystack, paystackProps } from 'react-native-paystack-webview';

const DeliveryScreen = (props) => {
  const [getUserToken, setGetUserToken] = useState('')
  const dispatch = useAppDispatch()
  const profileData = useAppSelector(profileInfo)
  const [addressList, setAddressList] = useState(null)
  const [set, setSet] = useState(null)
  const [choosenAddress, setChoosenAddress] = useState(null)
  const isFocused = useIsFocused();
  const [activeDelivery, setActiveDelivery] = useState('')
  const [phoneModalVisible, setPhoneModalVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [getCartData, setGetCartData] = useState()
  const paystackWebViewRef = useRef()
  const itemAmount = props.route.params.params.amount
  const [subTotal, setSubTotal] = useState(0)
  const [totalDeliveryFee, setTotalDeliveryFee] = useState(0)

  const cartsId = getCartData && getCartData?.map((data) => data.id);

  useEffect(() => {
    const fetchStorage = async () => {
      var checkToken = await getStorage('token')

      setGetUserToken(checkToken)

    }
    fetchStorage()
  }, [getUserToken, isFocused])

  useEffect(() => {
    dispatch(getCarts()).then((data) => {
      setGetCartData(data?.payload)
    })
    dispatch(getAddress()).then((data) => {
      var filterDefault = data?.payload?.find((d) => d.default)
      setActiveDelivery(filterDefault)
      setAddressList(data?.payload)
      setChoosenAddress(filterDefault)
    })
    dispatch(getProfile())

  }, [getUserToken, isFocused])

  useEffect(() => {
    const loadPost = async () => {
        const payload = {
            cart_ids: cartsId,
            address_book_id: choosenAddress?.id
        }

        var response = await dispatch(getDeliveryFeeData(payload))
        if (getDeliveryFeeData.fulfilled.match(response)) {
            setTotalDeliveryFee(response?.payload?.total_delivery_fee)
            setSubTotal(response?.payload?.sub_total)
        }
        else {
            var errMsg = response?.payload
        }
    }

    loadPost()
}, [cartsId, choosenAddress])



  const openPhoneVisible = () => {
    setPhoneModalVisible(true)
  }
  const closePhoneVisible = () => {
    setPhoneModalVisible(false)
  }

  const openVisible = () => {
    setVisible(true)
  }



  const closeVisible = () => {
    setVisible(false)
    dispatch(getAddress()).then((data) => {
      var filterDefault = data?.payload?.find((d) => d.default)
      setActiveDelivery(filterDefault)
      setAddressList(data?.payload)
    })
  }


  const updateDelivery = async (data) => {
    const payload = {
      id: data?.id
    }

    try {
      var response = await dispatch(updateAddressDefault(payload))
      if (updateAddressDefault.fulfilled.match(response)) {
        dispatch(getAddress()).then((data) => {
          var filterDefault = data?.payload?.find((d) => d.default)
          setActiveDelivery(filterDefault)
          setAddressList(data?.payload)
          closePhoneVisible()
        })

      }
      else {
        var errMsg = response?.payload
        Notifier.showNotification({
          title: errMsg,
          description: '',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'error',
          },
        });
      }
    }
    catch (e) {
      console.log({ e })
    }
  }

 

  const handlePaystackSuccessAction = async (response) => {


    const payload = {
      cart_ids: cartsId,
      address_book_id: choosenAddress?.id,
      payment_reference: response?.transactionRef?.reference,
    }

    try {
      var response = await dispatch(cartCheckout(payload))
      if (cartCheckout.fulfilled.match(response)) {
        Notifier.showNotification({
          title: 'Payment Successfull',
          description: '',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'success',
          },
        });
        return props.navigation.navigate('BuyerScreen', { screen: 'Order' })
        // ({name: "BuyerScreen", key: 'Order'})
      }
      else {
        var errMsg = response?.payload
        Notifier.showNotification({
          title: errMsg,
          description: '',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'error',
          },
        });

      }

    }
    catch (e) {
      console.log({ e })
    }
  };


  const requiredAddress = () => {
    if (activeDelivery === null || activeDelivery === undefined) {
      return Notifier.showNotification({
        title: 'Delivery address information is not complete for this transaction',
        description: '',
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'error',
        },
      });
  }
  else if (!profileData?.mobile) {
    return Notifier.showNotification({
      title: 'Kindly update your phone number in your profile settings to proceed',
      description: '',
      Component: NotifierComponents.Alert,
      hideOnPress: false,
      componentProps: {
        alertType: 'error',
      },
    });
}
  else {
    Notifier.showNotification({
      title: 'No Item in cart',
      description: '',
      Component: NotifierComponents.Alert,
      hideOnPress: false,
      componentProps: {
        alertType: 'error',
      },
    });
  }
    
  }

  return (
    <View style={styles.container}>
      <MobileHeader
        props={props}
        categoryName='Add Delivery'
      />

      <View style={styles.top}>
        <View>
          <Text text='Delivery Address' fontSize={hp(14)} />

          <View>
            <View style={styles.div1}>
              {
                choosenAddress && <View style={styles.cod}>
                  <View style={globalStyles.rowStart}>
                    <Pressable onPress={() => updateDelivery(choosenAddress)}>
                      <View style={[styles.checkbox, { backgroundColor: choosenAddress?.default ? colors.bazaraTint : 'transparent' }]}></View>
                    </Pressable>
                    <Text text={choosenAddress?.street + " " + choosenAddress?.city + " " + choosenAddress?.state} fontSize={hp(14)} fontWeight='400' />
                  </View>
                </View>
              }
            </View>
            {
              choosenAddress ? <Pressable onPress={() => openPhoneVisible()}>
                <View style={{ marginTop: hp(10) }}>
                  <Text text='+ Change address' style={{ textTransform: 'capitalize' }} fontSize={hp(14)} color={colors.bazaraTint} fontWeight='400' />
                </View>
              </Pressable>
                : <Pressable onPress={() => openVisible()}>
                  <View style={{ marginTop: hp(10) }}>
                    <Text text='+ Add address' style={{ textTransform: 'capitalize' }} fontSize={hp(14)} color={colors.bazaraTint} fontWeight='400' />
                  </View>
                </Pressable>
            }
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={globalStyles.rowBetween}>
          <Text text="Sub total" />
          <Text
            text={`₦${numberFormat(Number(subTotal) || 0)}`}
            fontSize={hp(16)}
            color={colors.bazaraTint}
            numberOfLines={1}
            fontWeight={'600'}
          />
        </View>
        <View style={globalStyles.rowBetween}>
          <Text text="Delivery fee" />
          <Text
            text={`₦${numberFormat(Number(totalDeliveryFee) || 0)}`}
            fontSize={hp(16)}
            color={colors.bazaraTint}
            numberOfLines={1}
            fontWeight={'600'}
          />
        </View>
        <View style={globalStyles.rowBetween}>
          <Text text="Total Payment" />
          <Text
            text={`₦${numberFormat(Number(subTotal + totalDeliveryFee) || 0)}`}
            fontSize={hp(16)}
            color={colors.bazaraTint}
            numberOfLines={1}
            fontWeight={'600'}
          />
        </View>
        <Paystack
          paystackKey={config.payStack.testSecretKey}
          billingEmail={profileData?.email}
          amount={(subTotal + totalDeliveryFee)}
          billingMobile={profileData?.mobile}
          onCancel={(e) => {
            // handle response here
          }}
          onSuccess={(res) => {
            // handle response here
            handlePaystackSuccessAction(res)
          }}
          ref={paystackWebViewRef}
        />

        {
          getCartData?.length > 0 && profileData ? <Button title='Pay Now' onPress={() => paystackWebViewRef.current.startTransaction()} />
            : <Button title='Pay Now' onPress={() => requiredAddress()} />

        }
      </View>

      <DeliveryModal
        visible={visible}
        setVisible={closeVisible}
        setChoosenAddress={(e) => setChoosenAddress(e)}
      />

      <AddressBooklistModal
        visible={phoneModalVisible}
        setVisible={closePhoneVisible}
        addressList={addressList}
        updateDelivery={(data) => updateDelivery(data)}
        openVisible={openVisible}
      />
    </View>
  )
}

export default DeliveryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: Platform.OS === 'ios' ? hp(20) : hp(15),
    paddingHorizontal: hp(15)
  },
  div1: {},
  cod: {
    paddingVertical: hp(10)
  },
  checkbox: {
    width: wp(20),
    height: hp(20),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.bazaraTint,
    marginRight: wp(10)
  },
  top: {
    flex: 9,
    padding: hp(15)
  },
  bottom: {
    flex: 2
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})

