import React, { useContext, useState, useEffect } from 'react'
import { View, Image, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, Text, Separator } from '../../../components/common';
import { AuthContext } from '../../../context/context';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { userProfile, loading, error, getUserDetails, updateUserDetails, updateUserPassword } from '../../../redux/slices/userSilce';
import { globalStyles } from '../../../styles';
import { hp, wp } from '../../../utils/helpers';
import { Input } from '../../../components/common/TextInput';
import { colors } from '../../../utils/themes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFormik } from 'formik';
import { InfoCircle } from '../../../constants/images'
import { updateSchema, icons, ProfileFormSchema } from '../../../utils/constants';
import { styles } from './styles';
import { ProfileFormData } from '../../../utils/types';
import { getProfile, updateProfile } from '../../../redux/slices/ProfileSlice';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import { forgetPassword, signOutUser } from '../../../redux/slices/AuthSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import { pictureUpload } from '../../../utils/functions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MobileHeader from '../../Containers/MobileHeader';
import { plus, remove } from '../../../assets';




const Profile = ({ navigation }: any) => {
    const dispatch = useAppDispatch()
    const [loader, setLoader] = useState(false)
    const [profileData, setProfileData] = useState<any>()
    const [edit, setEdit] = useState(false)
    const [editing, setEditing] = useState(false)
    // const [userInfo, setUserInfo] = useState<any>(typeof window !== 'undefined' ? secureLocalStorage.getItem('userInfo') : null)
    // const [dob, setDob] = React.useState(userInfo ? userInfo?.dob : "");

    const antIcon = <ActivityIndicator />;
    const [stateLoader, setStateLoader] = useState(false)


    const initialValues: ProfileFormData = {
        lName: profileData ? profileData?.last_name : '',
        fName: profileData ? profileData?.first_name : '',
        email: profileData ? profileData?.email : '',
        mobile: profileData ? profileData?.mobile : '',
        gender: profileData ? profileData?.sex : "",

    }
    const [imageLoader, setImageLoader] = useState(false)
    const [imageData, setImageData] = useState(profileData ? profileData?.img_url : "")

  
    useEffect(() => {
        setStateLoader(true)
        const loadData = async () => {
            await dispatch(getProfile()).then(d => {
                setProfileData(d?.payload)
            })
            setStateLoader(false)
        }
        loadData()
    }, [])


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

    const resetImage = () => {
        //dispatch(resetStoreImage())
        setImageData('')
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
            // img_url: profileData?.img_url
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
    
      useEffect(() => {
        const loadImage = () => {
          setImageData(profileData?.img_url)
        }
        loadImage()
      }, [profileData])

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
            redirect_url: `https//bazara.herokuapp.com/new-password`
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


    if (loader) {
        return (
            <SafeAreaView>
                <View style={[globalStyles.rowCenter, { flex: 1 }]}>
                    <ActivityIndicator size={'small'} />
                </View>
            </SafeAreaView>
        )
    }


    const removeImage = () => {
        setImageData("")
    }


    return (
        <View style={[globalStyles.wrapper, { paddingTop: hp(10) }]}>
            <MobileHeader props={navigation} categoryName='Profile' cart />
            <ScrollView>
                <View style={gbStyle.imageContainer}>
                    <View style={gbStyle.divContain}>
                        <View style={gbStyle.contain}>
                            {
                                imageData ? <View>
                                    <Pressable onPress={() => removeImage()}>
                                        <Image source={remove} style={gbStyle.img1} />
                                    </Pressable>
                                    <Image source={{ uri: imageData }} style={gbStyle.multContainer} />
                                </View>
                                    : <Pressable onPress={() => pickImage(0)}>
                                        <View style={gbStyle.multContainer2}>
                                            {
                                                stateLoader ? <ActivityIndicator size={15} color={'white'} /> :
                                                    <Image source={plus} style={gbStyle.img2} />
                                            }

                                        </View>

                                    </Pressable>
                            }
                        </View>
                        <Text text={profileData?.last_name + " " + profileData?.first_name} fontSize={hp(14)} fontWeight="400" style={{ marginLeft: hp(5) }} />
                    </View>
                </View>
                {/* <Text fontWeight="500" fontSize={hp(18)} text={profileData?.last_name + " " + profileData?.first_name} /> */}
                <View style={globalStyles.list_header}>
                    <View style={[globalStyles.rowBetween, globalStyles.Verticalspacing, globalStyles.lowerContainer, globalStyles.list_header_content]}>
                        <Text fontWeight="500" fontSize={hp(14)} text={'Basic Information'} />
                        {editing ?
                            <TouchableOpacity onPress={() => handleSubmit()}><Text color={colors.bazaraTint} fontWeight="500" fontSize={hp(14)} text={'Save'} /></TouchableOpacity> :
                            <TouchableOpacity onPress={() => setEditing(true)}><Text fontWeight="500" fontSize={hp(14)} text={'Edit'} /></TouchableOpacity>
                        }
                    </View>
                </View>
                {
                    editing ? (
                        <View>
                            <Input
                                label={'Surname'}
                                value={values?.lName}
                                defaultValue={profileData?.last_name}
                                editable={editing}
                                onBlur={handleBlur('lName')}
                                onChangeText={handleChange('lName')}
                                disabled={!edit}
                                errorMsg={touched.lName ? errors.lName : undefined}
                            />
                            <Input
                                label={'First Name'}
                                value={values?.fName}
                                defaultValue={profileData?.first_name}
                                editable={editing}
                                onBlur={handleBlur('fName')}
                                onChangeText={handleChange('fName')}
                                disabled={!edit}
                                errorMsg={touched.fName ? errors.fName : undefined}
                            />

                            <Input
                                label='Phone number'
                                value={values.mobile}
                                onChangeText={handleChange('mobile')}
                                errorMsg={touched.mobile ? errors.mobile : undefined}
                            />
                            <View style={gbStyle.box}>
                                <Text text='Email' fontSize={hp(12)} color={colors.ashes} />
                                <Text text={profileData?.email} fontSize={hp(15)} style={{ marginVertical: hp(5) }} />
                            </View>
                        </View>
                    ) :
                        <View style={styles.marginB}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label} fontSize={hp(14)} text={'Surname'} />
                                <Text fontSize={hp(14)} text={profileData?.first_name} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label} fontSize={hp(14)} text={'First Name'} />
                                <Text fontSize={hp(14)} text={profileData?.last_name} />
                            </View>
                            <View style={gbStyle.box2}>
                                <Text text='Phone number' fontSize={hp(12)} color={colors.ashes} />
                                <Text text={profileData?.mobile} fontSize={hp(15)} style={{ marginVertical: hp(5) }} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label} fontSize={hp(14)} text={'Email'} />
                                <Text fontSize={hp(14)} text={profileData?.email} />
                            </View>
                        </View>
                }
                <View style={globalStyles.list_header}>
                    <View style={[globalStyles.rowBetween, globalStyles.Verticalspacing, globalStyles.lowerContainer, globalStyles.list_header_content]}>
                        <Text fontWeight="500" fontSize={hp(14)} text={'Security'} />
                        <Text fontWeight="500" fontSize={hp(14)} text={''} />
                    </View>
                </View>
                <View style={[globalStyles.lowerContainer]}>
                    <Text color={colors.gray} fontWeight="500" fontSize={hp(13)} text={'Password'} />
                    <View style={[globalStyles.rowBetween, globalStyles.Verticalspacing]}>
                        <Text color={colors.white} fontWeight="500" fontSize={hp(14)} text={'xxxxxxxxxxxxx'} />
                        <TouchableOpacity onPress={() => dispatch(updateUserPassword({ email: profileData?.email }))}><Text color={colors.bazaraTint} fontWeight="500" fontSize={hp(14)} text={'Change password'} /></TouchableOpacity>
                    </View>
                </View>


            </ScrollView >
        </View >
    )
}

export default Profile

const gbStyle = StyleSheet.create({
    StoreCard: {
        paddingVertical: hp(20),
        cursor: 'pointer',
    },
    formContainer: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: hp(10),
        backgroundColor: colors.artBoard,
        width: wp(150),
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        marginTop: 20,
        marginBottom: 100
    },
    locationText: {
        marginVertical: 15
    },
    imageContainer: {
        marginHorizontal: hp(5),
        height: hp(150)
    },
    image: {
        width: 100,
        height: 100,
        paddingLeft: 5
    },
    imageBox: {
        backgroundColor: colors.black,
        height: hp(120),
        width: wp(120),
        borderRadius: 10,
        marginVertical: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    round: {
        backgroundColor: colors.red,
        width: hp(15),
        height: hp(15),
        justifySelf: 'flex-end',
        alignSelf: 'flex-end',
        borderRadius: 50,
        marginBottom: -15,
        zIndex: 1111,
    },
    horizon: {
        marginHorizontal: 15
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
    box2: {
        paddingVertical: hp(5),
        paddingHorizontal: hp(15),
        borderBottomColor: colors.artBoard,
        borderBottomWidth: 1,
    },
    box: {
        paddingVertical: hp(3),
        paddingHorizontal: hp(15),
      },
});

