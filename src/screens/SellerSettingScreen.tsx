
import React, { useContext, useState, useEffect } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'
import { globalStyles } from '../styles'
import { SafeAreaView, Text, Separator } from '../components/common';
import { styles } from '../screens/auth/Register/styles';
import { Button } from '../components/common/Button';

import { AuthContext } from '../context/context';
import { hp, wp } from '../utils/helpers';
import { colors } from '../utils/themes';
import { blueUni, blueUser, storeActive, truckLogo, universityLogo, usersLogo } from '../assets';
import ListCard from '../components/resuable/ListCard';
import { useNavigation } from '@react-navigation/native'
import { Nav } from '../utils/types'
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { activateStore, deactivateStore, deleteAccount, getPersonalStore, getStoreById, myStore, storebyId, updateStore } from '../redux/slices/StoreSlice';
import CustomModal from '../components/common/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoreBySlug, storeBySlug } from '../redux/slices/CategorySlice';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import { deleteAccountInfo, signOutUser } from '../redux/slices/AuthSlice';
import { useIsFocused } from "@react-navigation/native";
import DeleteAccountModal from './Containers/DeleteAccountModal';
import DeleteAccountInfoModal from './Containers/DeleteAccountInfoModal';



const SellerSettingScreen = ({ navigation }: any) => {
  const [deleteAccountVisible, setDeleteAccountVisible] = useState(false)
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState('')
  const [type, setType] = useState(false)
  const myStoreData = useAppSelector(myStore)
  const [visible, setVisible] = useState(false)
  const storeIdData = useAppSelector(storebyId)
  const [activeId, setActiveId] = useState('')
  const [isEnabled, setIsEnabled] = useState(storeIdData?.status === 'active' ? true : false);
  const storeInfo = useAppSelector(storeBySlug)
  const [activeSlug, setActiveSlug] = useState<any>()
  const [mode, setMode] = useState<any>()
  const isFocused = useIsFocused();
  const [checked, setChecked] = useState<string>(storeInfo?.status)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deleteAccountLoader, setDeleteAccountLoader] = useState(false)
  const [loader, setLoader] = useState(false)


  const closeDelete = () => {
    setDeleteVisible(false)
  }

  const deleteAccountData = async () => {
    setLoader(true)
    try {
      var response = await dispatch(deleteAccountInfo())
      if (deleteAccountInfo.fulfilled.match(response)) {
        await AsyncStorage.clear()
        setLoader(false)
        return navigation.navigate("Home")
      }
      else {
        // var errMsg = response as string
        // toast.error(errMsg)
        setLoader(false)
      }
    }
    catch (e) {
      setLoader(false)
      console.log({ e })
    }
  }


  const handleDeleteAccountClose = () => {
    setDeleteAccountVisible(false)
  }
  const handleDeleteAccountOpen = () => {
    setDeleteAccountVisible(true)
  }

  const handleVisible = () => {
    setVisible(false)
  }



  useEffect(() => {
    const loadActiveId = async () => {
      const id = await AsyncStorage.getItem('activeId') as string
      var activeSlug = await AsyncStorage.getItem('activeSlug') as string
      var modes = await AsyncStorage.getItem('mode') as string
      setMode(modes)
      dispatch(getStoreBySlug(activeSlug)).then(dd => {
        setChecked(dd?.payload?.status)
      })

      dispatch(getPersonalStore()).then(dd => console.log("paylod", dd?.payload))
      dispatch(getStoreById(id))
      setActiveId(id)
    }
    loadActiveId()
  }, [activeId, isFocused])

  useEffect(() => {
    const loadStatus = async () => {
      const isEnab = storeIdData?.status === 'active' ? true : false

      setIsEnabled(isEnab)
    }
    loadStatus()
  }, [storeIdData])


  const onChange = async (check: boolean) => {
    if (!check) {
      const resultAction = await dispatch(deactivateStore(activeId))
      if (deactivateStore.fulfilled.match(resultAction)) {
        Notifier.showNotification({
          title: 'Store deactivated successfully',
          description: '',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'success',
          },
        });
        dispatch(getStoreBySlug(activeSlug)).then(dd => {
          setChecked(dd?.payload?.status)
        })
      }
      else {
        Notifier.showNotification({
          title: 'Unable to update store',
          description: '',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'error',
          },
        });
      }
    }
    else {
      const resultAction = await dispatch(activateStore(activeId))
      if (activateStore.fulfilled.match(resultAction)) {
        Notifier.showNotification({
          title: 'Store deactivated successfully',
          description: '',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'success',
          },
        });
        setVisible(true)
        dispatch(getStoreBySlug(activeSlug)).then(dd => {
          setChecked(dd?.payload?.status)
        })
      }
      else {
        Notifier.showNotification({
          title: 'Unable to update store',
          description: '',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'error',
          },
        });
        setVisible(true)
      }
    }
  };

  const changeMode = async (item: any) => {
    await AsyncStorage.setItem('mode', item)
    if (item === "Buyer") {
      return navigation.navigate('BuyerScreen', { screen: 'Home' })
    }
    else {
      return navigation.navigate('SellerScreen', { screen: 'Store' })
    }
  }




  const LogOut = async () => {
    await AsyncStorage.clear()
    await dispatch(signOutUser()).then(dd => {
      return navigation.navigate('HomeScreen')
    })
    return navigation.navigate('HomeScreen')
  }

  const SwitchToBuyer = async () => {
    // buyerJourney()
  }

  const quickActionArray = [
    {
      id: 1,
      title: "Store Information",
      icon: storeActive,
      route: 'EditStore'
    },
    {
      id: 2,
      title: "User / Staff Management",
      icon: usersLogo,
      route: 'Staffs'
    },
    // {
    //   id: 4,
    //   title: "Reviews and Ratings",
    //   icon: universityLogo,
    //   route: 'Reviews'
    // }

  ]

  const quickActionPersonal = [
    {
      id: 1,
      title: "Profile",
      icon: blueUser,
      route: 'Profile'
    },
    {
      id: 2,
      title: "Payout Bank Account",
      icon: blueUni,
      route: 'Account'
    }

  ]

  const changeStore = async (item: any) => {
    // console.log({item})
    AsyncStorage.setItem('activeId', item?.id)
    AsyncStorage.setItem('activeSlug', item?.slug)
    AsyncStorage.setItem('activeName', item?.brand_name)
    AsyncStorage.setItem('role', item?.storeRole)

    Notifier.showNotification({
      title: `You are switching over to ${item?.brand_name} store `,
      description: '',
      Component: NotifierComponents.Alert,
      hideOnPress: false,
      componentProps: {
        alertType: 'success',
      },
    });

    navigation.navigate('Store')

    dispatch(getStoreById(activeId))
    dispatch(getPersonalStore())
    // dispatch(getAssignedStoresRole())

  }



  const deleteAccountFunc = async () => {
    setDeleteAccountLoader(true)
    var activeId = await AsyncStorage.getItem('activeId') as string
    const responseAction = await dispatch(deleteAccount(activeId))
    if (deleteAccount.fulfilled.match(responseAction)) {

      handleDeleteAccountClose()
      setDeleteAccountLoader(false)
      Notifier.showNotification({
        title: "Store successfully deleted",
        description: '',
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'success',
        },
      });

      LogOut()

    }
    else {
      const erroMsg = responseAction?.payload as string
      setDeleteAccountLoader(false)
      Notifier.showNotification({
        title: erroMsg,
        description: '',
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'success',
        },
      });
    }

  }



  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
          <Text text='Store Information' fontSize={hp(22)} fontWeight="600" lineHeight={28} />
          <Pressable onPress={LogOut}>
            <Text text='Log out' fontSize={hp(16)} fontWeight="600" color={colors.bazaraTint} />
          </Pressable>
        </View>
        <View style={[localStyle.mTop, styles.width90]}>
          {
            quickActionArray?.map((data: any) => {
              return <ListCard key={data?.id} {...data} onPress={() => navigation.navigate(data?.route)} props={navigation} />
            })
          }
        </View>
        <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
          <Text text='Personal Information' fontSize={hp(16)} fontWeight="600" lineHeight={28} />
        </View>
        <View style={[localStyle.mTop, styles.width90]}>
          {
            quickActionPersonal?.map((data: any) => {
              return <ListCard key={data?.id} {...data} props={navigation} />
            })
          }
        </View>
        <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
          <Text text='Stores' fontSize={hp(16)} fontWeight="600" lineHeight={28} />
        </View>
        <View style={localStyle.subdiv}>
          {
            myStoreData?.filter((n, i) => n && i <= 3)?.map((data, j) => {
              return (
                <Pressable onPress={() => changeStore(data)}>
                  <View style={localStyle.listdiv} key={j} >
                    <View style={globalStyles.rowBetween}>
                      <View style={localStyle.menudiv}>
                        <Text text={data?.brand_name} />
                        <Text text={data?.store_role} color={colors.gray} />
                      </View>
                      {
                        data?.id === activeId && <Image style={localStyle.image} source={{ uri: "https://res.cloudinary.com/doouwbecx/image/upload/v1659439185/Group_10652_tia6rl.png" }} />
                      }

                    </View>
                  </View>
                </Pressable>
              )
            })
          }
          {
            myStoreData?.filter((n) => n)?.length < 3 && <Pressable onPress={() => navigation.navigate('CreateStoreScreen')}>
              <Text text="+ Add another store" color={colors.bazaraTint} style={{ marginTop: hp(5) }} />
            </Pressable>
          }
        </View>

        {
          storeInfo?.status !== "IN-REVIEW" && <View>
            <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
              <Text text='Activate / Deactivate Store' fontSize={hp(16)} fontWeight="400" lineHeight={28} />
              <Switch
                trackColor={{ false: colors.black, true: colors.bazaraTint }}
                thumbColor={isEnabled ? colors.bazaraTint : colors.white}
                ios_backgroundColor={colors.black}
                onValueChange={onChange}
                value={isEnabled}
              />
            </View>
          </View>

        }
        {
          mode === "Buyer" ? <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
            <Text text='Switch to Seller' fontSize={hp(16)} fontWeight="400" lineHeight={28} />
            <Switch
              trackColor={{ false: colors.black, true: colors.bazaraTint }}
              thumbColor={isEnabled ? colors.bazaraTint : colors.white}
              ios_backgroundColor={colors.black}
              onValueChange={() => changeMode('Seller')}
            // value={isEnabled}
            />
          </View>
            :
            <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
              <Text text='Switch to Buyer' fontSize={hp(16)} fontWeight="400" lineHeight={28} />
              <Switch
                trackColor={{ false: colors.black, true: colors.bazaraTint }}
                thumbColor={isEnabled ? colors.bazaraTint : colors.white}
                ios_backgroundColor={colors.black}
                onValueChange={() => changeMode('Buyer')}
              // value={isEnabled}
              />
            </View>
        }

        <Pressable onPress={() => setDeleteVisible(true)}>
          <View style={[globalStyles.rowStart, { marginHorizontal: hp(15) }]} >
            <Text text='Delete Account' fontSize={hp(14)} color={colors.bazaraTint} style={{ marginVertical: hp(10) }} />
          </View>
        </Pressable>

        <Pressable onPress={() => handleDeleteAccountOpen()}>
          <View style={[globalStyles.rowStart, { marginHorizontal: hp(15) }]} >
            <Text text='Delete Store' fontSize={hp(14)} color={colors.bazaraTint} style={{ marginVertical: hp(10) }} />
          </View>
        </Pressable>

      </ScrollView>

      <CustomModal
        handleVisible={handleVisible}
        visibleBoolean={visible}
        isSuccess={type}
        headerText={title}
      />

      <DeleteAccountModal
        deleteVisible={deleteAccountVisible}
        closeDelete={handleDeleteAccountClose}
        deleteAction={deleteAccountFunc}
        loading={deleteAccountLoader}
      />

      <DeleteAccountInfoModal
        deleteVisible={deleteVisible}
        closeDelete={closeDelete}
        deleteAction={deleteAccountData}
        loading={loader}
      />

    </SafeAreaView>
  )
}

export default SellerSettingScreen


const localStyle = StyleSheet.create({
  mTop: {
    marginVertical: 10
  },
  image: {
    width: wp(20),
    height: hp(20)
  },
  subdiv: {
    marginBottom: hp(10),
    marginHorizontal: hp(15)
  },
  listdiv: {
    paddingVertical: hp(10),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lightwhite,
  },
  menudiv: {

  }
})


