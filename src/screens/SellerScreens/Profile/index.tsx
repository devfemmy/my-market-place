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
import { forgetPassword } from '../../../redux/slices/AuthSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import { pictureUpload } from '../../../utils/functions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MobileHeader from '../../Containers/MobileHeader';




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

    const [imageUrl, setImageUrl] = useState(profileData ? profileData?.img_url : "")

    const initialValues: ProfileFormData = {
        lName: profileData ? profileData?.last_name : '',
        fName: profileData ? profileData?.first_name : '',
        email: profileData ? profileData?.email : '',

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
            setImageLoader(true)
            const ImageUrl = await pictureUpload(image)
            setImageData(ImageUrl)
            setImageLoader(false)
        });
    };

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
                profile_cover_img: profileData?.img_url
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
                        alertType: 'error',
                    },
                })
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
                })

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

                setLoader(false)
                // return navigation.navigate()
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

    // if(Error){
    //     return (
    //         <SafeAreaView>
    //             <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
    //             <Image
    //                 source={InfoCircle}
    //                 style={{width: hp(50), height: hp(50), marginBottom:hp(20)}}
    //             />
    //             <Text fontWeight="500" fontSize={hp(14)} text={'Seems something went wrong.'} />
    //             <TouchableOpacity onPress={() => dispatch(getUserDetails())}>
    //                 <icons.Ionicons style={{marginTop: hp(20)}} name="refresh-circle" size={40} color={colors.bazaraTint} />
    //             </TouchableOpacity>
    //             </View>
    //         </SafeAreaView>
    //     )
    // }

    console.log({ imageData })

    return (
        <View style={[globalStyles.wrapper, { paddingTop: hp(10) }]}>
            <MobileHeader props={navigation} categoryName='Profile' cart />
            <ScrollView>
                <View style={gbStyle.imageContainer}>
                    <Text text="Store Cover Image" fontSize={hp(16)} />


                    {
                        imageData?.length > 0 ?
                            <Pressable onPress={() => resetImage()}>

                                <View style={[gbStyle.image, { marginTop: hp(10) }]}>
                                    <View style={gbStyle.round}>
                                        <AntDesign name="minus" size={hp(15)} style={{ color: colors.white }} />
                                    </View>
                                    <Image source={{ uri: imageData }} style={gbStyle.image} />
                                </View>
                            </Pressable>
                            :
                            <View style={gbStyle.formContainer}>
                                <Pressable onPress={() => pickImage(1)}>

                                    {
                                        imageLoader ? <ActivityIndicator /> : <AntDesign name="plus" size={hp(30)} style={{ color: colors.white }} />
                                    }

                                </Pressable> </View>
                        // <AntDesign name="plus" size={hp(30)} style={{ color: colors.white }} />
                    }
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
                                errorMsg={touched.lName ? errors.lName : undefined}
                            />
                            <Input
                                label={'First Name'}
                                value={values?.fName}
                                defaultValue={profileData?.first_name}
                                editable={editing}
                                onBlur={handleBlur('fName')}
                                onChangeText={handleChange('fName')}
                                errorMsg={touched.fName ? errors.fName : undefined}
                            />
                            <Input
                                label={'Email'}
                                value={values?.email}
                                defaultValue={profileData?.email}
                                editable={editing}
                                onBlur={handleBlur('email')}
                                onChangeText={handleChange('email')}
                                disabled
                                errorMsg={touched.email ? errors.email : undefined}
                            />
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
        height: hp(200)
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
});

