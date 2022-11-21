import { View, StyleSheet, Pressable, Switch, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from '../components/common/Button'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { forgetPassword, signOutUser, userState } from '../redux/slices/AuthSlice'
import { getProfile, profileLoader, updateProfile } from '../redux/slices/ProfileSlice'
import { getPersonalStore, myStore } from '../redux/slices/StoreSlice'
import { ProfileFormData } from '../utils/types'
import { deleteAddress, getAddress, updateAddress, updateAddressDefault } from '../redux/slices/AddressSlice'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { useFormik } from 'formik'
import { ProfileFormSchema } from '../utils/schemas'
import { hp, wp } from '../utils/helpers'
import { ActivityIndicator } from 'react-native-paper'
import MobileHeader from './Containers/MobileHeader'
import { Text } from '../components/common/Text'
import { globalStyles } from '../styles'
import { colors } from '../utils/themes'
import { Input } from '../components/common/TextInput'
import DeliveryModal from './Containers/DeliveryModal'
import ImagePicker from 'react-native-image-crop-picker';
import { pictureUpload } from '../utils/functions'
import { deleteIcon, plus, remove } from '../assets'
import AntDesign from 'react-native-vector-icons/AntDesign'



const BuyerProfileScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch()
  const [loader, setLoader] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const profileLoading = useAppSelector(profileLoader)
  const [edit, setEdit] = useState(false)

  const [stateLoader, setStateLoader] = useState(false)
  const myStoreList = useAppSelector(myStore)
  //const [userInfo, setUserInfo] = useState<any>(typeof window !== 'undefined' ? secureLocalStorage.getItem('userInfo') : null)
  const [imageUrl, setImageUrl] = useState<any>(profileData ? profileData?.img_url : "")
  const [imageLoader, setImageLoader] = useState(false)

  const initialValues: ProfileFormData = {
    lName: profileData ? profileData?.last_name : '',
    fName: profileData ? profileData?.first_name : '',
    email: profileData ? profileData?.email : '',
    mobile: profileData ? profileData?.mobile : '',
    gender: profileData ? profileData?.sex : "",
  }

  const [addressList, setAddressList] = useState<any>(null)
  const [visible, setVisible] = useState(false)

  const openVisible = () => {
    setVisible(true)
  }

  const closeVisible = () => {
    setVisible(false)
    dispatch(getAddress()).then((d) => {
      setAddressList(d.payload)
    })
  }



  useEffect(() => {
    setStateLoader(true)
    const loadData = async () => {

      await dispatch(getProfile()).then(d => {
        setProfileData(d?.payload)
      })
      await dispatch(getAddress()).then((d) => {
        setAddressList(d.payload)
      })
      await dispatch(getPersonalStore())
      setStateLoader(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    const loadImage = () => {
      setImageUrl(profileData?.img_url)
    }
    loadImage()
  }, [profileData])


  const updateDelivery = async (data: any) => {
    const payload = {
      id: data?.id
    }

    try {
      var response = await dispatch(updateAddressDefault(payload))
      if (updateAddressDefault.fulfilled.match(response)) {
        dispatch(getAddress()).then((data) => {
          setAddressList(data?.payload)
          Notifier.showNotification({
            title: "Address updated successfully",
            description: '',
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
              alertType: 'success',
            },
          });
        })

      }
      else {
        var errMsg = response?.payload as string
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




  const removeImage = () => {
    setImageUrl("")
  }

  const handleProfileUpdate = async (data: any) => {
    setLoader(true)
    setStateLoader(true)
    try {
      var newData = {
        first_name: data?.fName,
        last_name: data?.lName,
        email: data?.email,
        mobile: data?.mobile?.toString(),
        img_url: profileData?.img_url
      }

      var resultResponse = await dispatch(updateProfile(newData))
      if (updateProfile.fulfilled.match(resultResponse)) {
        await dispatch(getProfile()).then(d => {
          setProfileData(d?.payload)
        })
        setLoader(false)
        setStateLoader(false)
        setEdit(false)
        Notifier.showNotification({
          title: "Profile Image updated successfully",
          description: '',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'success',
          },
        });
      }
      else {
        var errMsg = resultResponse?.payload as string
        setLoader(false)
        setStateLoader(false)
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
      setLoader(false)
      setStateLoader(false)
      console.log(e)
    }
  }

  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: ProfileFormSchema,
      onSubmit: (data: ProfileFormData) => handleProfileUpdate(data),
      enableReinitialize: true
    });


  const requestPassowrdChange = async () => {
    setLoader(true)
    const data = {
      email: profileData?.email,
      redirect_url: `http://localhost:3000/new-password`
    }
    try {
      var resultAction = await dispatch(forgetPassword(data))
      if (forgetPassword.fulfilled.match(resultAction)) {
        await AsyncStorage.clear()
        await dispatch(signOutUser()).then(dd => {
          return navigation.navigate('Home')
        })
        setLoader(false)
        return navigation.navigate('Home')
      }
      else {
        console.log("error")
        setLoader(false)
      }
    }
    catch (e) {
      console.log({ e })
    }
  }

  const changeMode = async (item: any) => {
    await AsyncStorage.setItem('mode', item)
    if (item === "Buyer") {
      return navigation.navigate('BuyerScreen', { screen: 'Home' })
    }
    else {
      return navigation.navigate('SellerScreen', { screen: 'Store' })
    }
  }

  const signOut = async () => {
    await AsyncStorage.clear()
    await dispatch(signOutUser()).then(dd => {
      return navigation.navigate('Home')
    })
    return navigation.navigate('Home')
  }


  if (stateLoader) {
    return <View style={styles.container}>
      <ActivityIndicator />
    </View>
  }



  const pickImage = async (index: number) => {
    ImagePicker.openPicker({
      width: 500,
      height: 600,
      cropping: true,
      mediaType: "photo",
      multiple: false,
    }).then(async image => {
      setStateLoader(true)
      const ImageUrl = await pictureUpload(image)
      const pd = {
        img_url: ImageUrl
      }

      var resultResponse = await dispatch(updateProfile(pd))

      if (updateProfile.fulfilled.match(resultResponse)) {
        await dispatch(getProfile()).then(d => {
          setProfileData(d?.payload)
        })
        setStateLoader(false)
        Notifier.showNotification({
          title: "Profile Image updated successfully",
          description: '',
          Component: NotifierComponents.Alert,
          hideOnPress: false,
          componentProps: {
            alertType: 'success',
          },
        });
      }
      else {
        var errMsg = resultResponse?.payload as string
        setStateLoader(false)
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
    })
  }


  const deleteDelivery = async (data: any) => {
    const payload = {
      id: data?.id,
    }

    try {
      var response = await dispatch(deleteAddress(payload))
      if (deleteAddress.fulfilled.match(response)) {
        dispatch(getAddress()).then((data) => {
          setAddressList(data?.payload)
          Notifier.showNotification({
            title: "Address deleted successfully",
            description: '',
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
              alertType: 'success',
            },
          });
        })

      }
      else {
        var errMsg = response?.payload as string
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


  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.containerBox}>

          <View>
            <View style={styles.containerDiv}>
              <MobileHeader
                props={navigation}
                categoryName="Profile"
                cart
              />
            </View>
            <View>
              <View style={styles.divContain}>
                <View style={styles.contain}>
                  {
                    imageUrl ? <View>
                      <Pressable onPress={() => removeImage()}>
                        <Image source={remove} style={styles.img1} />
                      </Pressable>
                      <Image source={{ uri: imageUrl }} style={styles.multContainer} />
                    </View>
                      : <Pressable onPress={() => pickImage(0)}>
                        <View style={styles.multContainer2}>
                          {
                            stateLoader ? <ActivityIndicator size={15} color={'white'} /> :
                              <Image source={plus} style={styles.img2} />
                          }

                        </View>

                      </Pressable>
                  }
                </View>
                <Text text={profileData?.last_name + " " + profileData?.first_name} fontSize={hp(14)} fontWeight="400" style={{ marginLeft: hp(5) }} />
              </View>

              <View style={styles.subdiv}>
                <View style={globalStyles.rowBetween}>
                  <Text text={`Basic Information`} fontSize={hp(14)} fontWeight="400" />
                  <Pressable onPress={edit ? () => handleSubmit() : () => setEdit(true)}>
                    <View style={styles.pointerdiv}>
                      <Text text={edit ? 'Save' : 'Edit'} fontSize={hp(12)} fontWeight="400" color={colors.bazaraTint} />
                    </View>
                  </Pressable>
                </View>
              </View>
              {
                edit ?
                  <View style={styles.boxdiv}>
                    <Input
                      label='Surname'
                      value={values.lName}
                      onChangeText={handleChange('lName')}
                      errorMsg={touched.lName ? errors.lName : undefined}
                      disabled={edit}
                    />
                    <Input
                      label='First name'
                      value={values.fName}
                      onChangeText={handleChange('fName')}
                      disabled={edit}
                      errorMsg={touched.fName ? errors.fName : undefined}
                    />
                    <Input
                      label='Phone number'
                      value={values.mobile}
                      onChangeText={handleChange('mobile')}
                      disabled={!edit}
                      errorMsg={touched.mobile ? errors.mobile : undefined}
                    />
                    <View style={styles.box}>
                      <Text text='Email' fontSize={hp(12)} color={colors.ashes} />
                      <Text text={profileData?.email} fontSize={hp(15)} style={{ marginVertical: hp(5) }} />
                    </View>
                  </View>
                  :
                  <View>
                    <View style={styles.box2}>
                      <Text text='Surname' fontSize={hp(12)} color={colors.ashes} />
                      <Text text={profileData?.last_name} fontSize={hp(15)} style={{ marginVertical: hp(5) }} />
                    </View>
                    <View style={styles.br}></View>
                    <View style={styles.box2}>
                      <Text text='First name' fontSize={hp(12)} color={colors.ashes} />
                      <Text text={profileData?.first_name} fontSize={hp(15)} style={{ marginVertical: hp(5) }} />
                    </View>
                    <View style={styles.br}></View>
                    <View style={styles.box2}>
                      <Text text='Phone number' fontSize={hp(12)} color={colors.ashes} />
                      <Text text={profileData?.mobile} fontSize={hp(15)} style={{ marginVertical: hp(5) }} />
                    </View>
                    <View style={styles.br}></View>
                    <View style={styles.box2}>
                      <Text text='Email' fontSize={hp(12)} color={colors.ashes} />
                      <Text text={profileData?.email} fontSize={hp(15)} style={{ marginVertical: hp(5) }} />
                    </View>

                  </View>
              }

              <View style={styles.subdiv}>
                <View style={globalStyles.rowBetween}>
                  <Text text="Security" fontSize={hp(14)} fontWeight="400" />
                </View>
              </View>
              <View style={styles.box}>
                <Text text='Password' fontSize={hp(12)} fontWeight="600" color={colors.gray} style={{ marginVertical: hp(10) }} />
                <View style={globalStyles.rowBetween}>
                  <Text text='xxxxxxxxxxx' fontSize={hp(14)} fontWeight="400" />
                  <Pressable onPress={() => requestPassowrdChange()}>
                    <View style={styles.pointerdiv}>
                      <Text text='Change password' fontSize={hp(12)} fontWeight="400" color={colors.bazaraTint} />
                    </View>
                  </Pressable>

                </View>
              </View>
              <View style={styles.br} />
              <View style={styles.subdiv}>
                <View style={globalStyles.rowBetween}>
                  <Text text="Delivery Address" fontSize={hp(14)} fontWeight="400" />
                </View>

              </View>
              <View style={styles.div1}>
                {
                  addressList?.map((data: any) => {
                    return <View style={styles.rowBtw}>
                      <Pressable onPress={() => updateDelivery(data)}>
                        <View style={[globalStyles.rowStart, styles.mindiv]}>
                          <View style={[styles.checkbox, { backgroundColor: data?.default ? colors.bazaraTint : 'transparent' }]} ></View>
                          <Text text={data?.street + " " + data?.city + " " + data?.state} fontSize={hp(14)} fontWeight='400' />
                        </View>
                      </Pressable>

                      <Pressable onPress={() => deleteDelivery(data)}>
                          <Image source={deleteIcon} />
                      </Pressable>
                    </View>
                  })
                }

                <Pressable onPress={() => openVisible()}>
                  <Text style={{ marginVertical: hp(10) }} text='+  Add delivery Address' fontSize={hp(12)} color={colors.bazaraTint} fontWeight='600' />
                </Pressable>
              </View>

              <View style={styles.divbox}>
                {
                  myStoreList?.length > 0 && <View style={globalStyles.rowBetween}>
                    <Text text='Switch to Seller' fontSize={hp(14)} fontWeight='400' />
                    <Switch onChange={() => changeMode("Seller")} />
                  </View>
                }

                {
                  myStoreList?.length < 1 && <Pressable onPress={() => navigation.navigate('CreateStoreScreen')}>
                    <View style={globalStyles.rowBetween}>
                      <Text text='Become a Seller' color={colors.bazaraTint} fontSize={hp(14)} fontWeight='400' style={{ marginBottom: hp(10) }} />
                    </View>
                  </Pressable>
                }


                <Pressable onPress={() => signOut()}>
                  <Text text='Logout' fontSize={hp(14)} color={colors.bazaraTint} fontWeight='400' />
                </Pressable>
              </View>


            </View>


          </View>

          <DeliveryModal
            visible={visible}
            setVisible={closeVisible}
          />

        </View>
      </ScrollView>
    </View>
  )
}

export default BuyerProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: hp(1),
    paddingBottom: hp(30)
  },
  containerBox: {

  },
  containerDiv: {
    paddingVertical: hp(10),
    paddingHorizontal: hp(15)
  },
  divContain: {
    flexDirection: 'row',
    marginTop: hp(5),
    marginRight: hp(10),
    marginBottom: hp(10),
    alignItems: 'center',
    paddingHorizontal: hp(15)
  },
  contain: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  div: {
    position: 'relative',
    width: '100%',
    maxWidth: wp(200),
  },
  divbox: {
    paddingHorizontal: hp(15),
    marginTop: hp(10)
  },
  checkbox: {
    width: wp(20),
    height: hp(20),
    borderRadius: 50,
    borderColor: colors.bazaraTint,
    borderWidth: 1,
    marginRight: hp(10)
  },
  subdiv: {
    paddingVertical: hp(10),
    paddingHorizontal: hp(15),
    backgroundColor: colors.artBoard
  },
  pointerdiv: {

  },
  boxdiv: {
    paddingVertical: hp(0),
    paddingHorizontal: hp(15),
  },
  box: {
    paddingVertical: hp(3),
    paddingHorizontal: hp(15),
  },
  br: {
    marginVertical: hp(10)
  },
  div1: {
    paddingVertical: hp(0),
    paddingHorizontal: hp(15),
  },
  box2: {
    paddingVertical: hp(5),
    paddingHorizontal: hp(15),
    borderBottomColor: colors.artBoard,
    borderBottomWidth: 1,
  },
  mindiv: {
    paddingVertical: hp(10)
  },
  img1: {
    width: wp(15),
    height: hp(15),
    position: 'absolute',
    top: 20,
    right: 20,
  },
  multContainer2: {
    width: wp(100),
    height: hp(120),
    backgroundColor: colors.artBoard,
    marginVertical: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: hp(15)
  },
  img2: {
    width: wp(30),
    height: hp(30)
  },
  multContainer: {
    width: wp(100),
    height: hp(120),
    backgroundColor: colors.artBoard,
    marginVertical: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: hp(15),
    zIndex: -3,
    elevation: -3

  },
  rowBtw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})