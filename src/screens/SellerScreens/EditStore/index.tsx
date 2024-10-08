import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { StatusBar, View, StyleSheet, ScrollView, Image, Pressable, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView, Text } from '../../../components/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input } from '../../../components/common/TextInput';
import { StoreFormSchema } from '../../../utils/constants';
import { locationData } from '../../../utils/constants/locations';
import { Select } from '../../../components/common/SelectInput';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../../components/common/Button';
import { globalStyles } from "../../../styles/globalStyles"
import { hp, wp } from '../../../utils/helpers';
;
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { createStore, getStoreById, storebyId, updateStore, myStore, getPersonalStore } from "../../../redux/slices/StoreSlice"
import { locationProp, Nav, StoreFormData } from '../../../utils/types';
import CustomModal from '../../../components/common/CustomModal';
import { colors } from '../../../utils/themes';

import AsyncStorage from '@react-native-async-storage/async-storage';

import NavHeader from '../../../components/resuable/NavHeader';
import { launchImageLibrary } from 'react-native-image-picker';
import { pictureUpload } from '../../../utils/functions';
import ImagePicker from 'react-native-image-crop-picker';
import { styles } from '../main/Product/AddProduct/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Notifier, NotifierComponents } from 'react-native-notifier';
import Editor from '../../../components/resuable/Editor';


const EditStore = (): JSX.Element => {
  const navigation = useNavigation<Nav>();
  const [loader, setLoader] = useState(false)
  const dispatch = useAppDispatch()
  const myStoreList = useAppSelector(myStore)
  const [loading, setLoading] = useState(false)
  const [imgLoader, setImgLoader] = useState(false)
  const [visibleBoolean, setVisibleBoolen] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [customMsg, setCustomMsg] = useState('')
  const [imageData, setImageData] = useState('')
  const storeIdData = useAppSelector(storebyId)
  const [activeId, setActiveId] = useState<string>('')
  const [editImg, setEditImg] = useState<string>('')


  useEffect(() => {
    setLoader(true)
    loadActiveId()
  }, [activeId])



  useEffect(() => {
    setEditImg(storeIdData?.imgUrl)
  }, [storeIdData])

  const loadActiveId = async () => {
    const id = await AsyncStorage.getItem('activeId') as string

    if (!id) {
      navigation.navigate('AuthStoreCreationScreen')
    }
    await dispatch(getPersonalStore())
    setActiveId(id)
    // dispatch(getStoreById(id))
    const selectedStore = await myStoreList?.filter((val) => {
      if (val?.id == id) {
        setEditImg(val?.img_url)
        setFieldValue('state', val?.state)
        setFieldValue('storeName', val?.brand_name)
        setFieldValue('description', val?.description)
        setFieldValue('phoneNumber', val?.phone_number)
        setFieldValue('street', val?.street)
        setFieldValue('estimatedDeliveryDuration', val?.estimated_delivery_duration)
        setFieldValue('city', val?.city)
      }
    })
    setLoader(false)
  }



  const initialValues: StoreFormData = {
    storeName: '',
    description: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    // estimatedDeliveryDuration: ''
  };

  const handleStoreSubmission = async (data: StoreFormData) => {
    const payload = {
      id: activeId,
      brandName: data.storeName,
      description: data.description,
      coverImg: imageData?.length > 1 ? imageData : editImg,
      address: data.street + " " + data.city + " " + data.state,
      phoneNumber: data.phoneNumber.toString(),
      // estimated_delivery_duration: data?.estimatedDeliveryDuration,
      location: {
        state: data.state,
        city: data.city,
        street: data.street,
      },
    };

    setLoader(true)
    const resultAction = await dispatch(updateStore(payload))
    if (updateStore.fulfilled.match(resultAction)) {
      setLoader(false)
      Notifier.showNotification({
        title: 'Success',
        description: '',
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'success',
        },
      });
    } else {
      var errMsg = resultAction?.payload as string
      setLoader(false)
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

  const handleVisible = useCallback(() => {
    setVisibleBoolen(!visibleBoolean);
  }, [visibleBoolean]);



  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: StoreFormSchema,
      onSubmit: (val: StoreFormData) => handleStoreSubmission(val),
      enableReinitialize: true
    });


  const locationState = locationData?.map((data: locationProp) => data?.state);

  const locationCity = locationData?.find(
    (data: locationProp) => data?.state === values.state,
  )?.city;


  const pickImage = async (index: number) => {
    ImagePicker.openPicker({
      width: 500,
      height: 600,
      cropping: true,
      mediaType: "photo",
      multiple: false,
    }).then(async image => {
      setImgLoader(true)
      const ImageUrl = await pictureUpload(image)
      setImageData(ImageUrl)
      setImgLoader(false)
    });
  };

  const resetImage = () => {
    setImageData('')
  }

  const removeImage = () => {
    setEditImg('')
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


  return (
    <SafeAreaView style={globalStyles.wrapper}>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <KeyboardAwareScrollView>
        <NavHeader
          icon='chevron-back-outline'
          handlePress={() => navigation.goBack()}
          title="Store Information"
        />

        <View style={gbStyles.imageContainer}>
          <Text text="Edit Cover Image" fontSize={hp(16)} fontWeight='700' />

          <View style={gbStyles.formContainer}>
            {
              editImg || imageData?.length > 1 ?
                <Pressable onPress={editImg?.length > 1 ? () => removeImage() : () => resetImage()}>
                  <View style={gbStyles.image}>
                    <View style={gbStyles.round}>
                      <AntDesign name="minus" size={hp(15)} style={{ color: colors.white }} />
                    </View>
                    <Image source={{ uri: editImg ? editImg : imageData }} style={gbStyles.image} />
                  </View>
                </Pressable>
                :
                <Pressable onPress={() => pickImage(1)}>
                  <View style={styles.imgStyle2} >
                    {
                      imgLoader ? <AntDesign name='loading1' /> : <AntDesign name="plus" size={hp(30)} style={{ color: colors.white }} />
                    }

                  </View>
                </Pressable>
            }
          </View>
        </View>

        <View>
          <View style={gbStyles.formContainer}>
            <Input
              label={'Store Name'}
              value={values.storeName}
              onBlur={handleBlur('storeName')}
              onChangeText={handleChange('storeName')}
              errorMsg={touched.storeName ? errors.storeName : undefined}
            />

             <Editor
              placeholder='Description'
              value={values.description}
              onBlur={handleBlur('description')}
              onChangeText={handleChange('description')}
              errorMsg={touched.description ? errors.description : undefined}
            />

            <Input
              number
              label={'Phone Number'}
              value={values.phoneNumber}
              onBlur={handleBlur('phoneNumber')}
              onChangeText={handleChange('phoneNumber')}
              errorMsg={touched.phoneNumber ? errors.phoneNumber : undefined}
            />
            {/* <View>
              <Select
                placeholder='Estimated Delivery Date'
                items={['1', '2', '3', '4', '5']}
                defaultValue={values.estimatedDeliveryDuration}
                setState={handleChange('estimatedDeliveryDuration')}
                errorMsg={touched.estimatedDeliveryDuration ? errors.estimatedDeliveryDuration : undefined}
              />
            </View> */}

            <Text
              text="Store Location"
              fontSize={hp(16)}
              fontWeight='700'
              style={[gbStyles.locationText, gbStyles.horizon]}
            />

            <View>
              <Select
                defaultValue={values.state}
                items={locationState}
                setState={handleChange('state')}
                placeholder="Select State"
                errorMsg={touched.state ? errors.state : undefined}
              />
            </View>
            <View>
              <Select
                defaultValue={values.city}
                items={locationCity}
                setState={handleChange('city')}
                placeholder="Select City"
                errorMsg={touched.city ? errors.city : undefined}
              />
            </View>

            <Input
              label={'Street name'}
              value={values.street}
              onBlur={handleBlur('street')}
              onChangeText={handleChange('street')}
              errorMsg={touched.street ? errors.street : undefined}
            />
          </View>

          <View style={gbStyles.btn}>
            <Button isLoading={loader} title={'Update Store'} onPress={handleSubmit} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <CustomModal
        msg=""
        headerText={customMsg}
        visibleBoolean={visibleBoolean} handleVisible={handleVisible}
        isSuccess={isSuccessful} />
    </SafeAreaView>
  );
};

export default EditStore

const gbStyles = StyleSheet.create({
  StoreCard: {
    paddingVertical: hp(20),
    cursor: 'pointer',
  },
  formContainer: {
    flex: 1,
    marginVertical: 10
  },
  btn: {
    marginTop: 20,
    marginBottom: 10
  },
  locationText: {
    marginVertical: 15
  },
  horizon: {
    marginHorizontal: 15
  },
  imageContainer: {
    marginHorizontal: 15
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
  }
});
