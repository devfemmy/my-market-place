

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { StatusBar, View, StyleSheet, ScrollView, Image, Pressable, Platform } from 'react-native';
import { SafeAreaView, Text } from '../components/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input } from '../components/common/TextInput';
import { StoreFormSchema } from '../utils/constants';
import { locationData } from '../utils/constants';
import { Select } from '../components/common/SelectInput';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/common/Button';
import { globalStyles } from "../styles/globalStyles"
import { hp, wp } from '../utils/helpers';
import { pictureUpload } from '../utils/functions';
import { useAppDispatch, useAppSelector } from "../redux/hooks"

import { locationProp, Nav, StoreFormData } from '../utils/types';
import CustomModal from '../components/common/CustomModal';
import { colors } from '../utils/themes';
import ImagePicker from 'react-native-image-crop-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from '../screens/SellerScreens/main/Product/AddProduct/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createStore } from '../redux/slices/StoreSlice';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CreateStoreScreen = (): JSX.Element => {
  const navigation = useNavigation<Nav>();
  const [loader, setLoader] = useState(false)
  const dispatch = useAppDispatch()
  const [visibleBoolean, setVisibleBoolen] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [headerText, setHeaderText] = useState('');
  const [msg, setMsg] = useState('');
  const [imageLoader, setImageLoader] = useState(false)


  const [query, setQuery] = useState('');
  const [imageData, setImageData] = useState('')


  const onSearch = (text: any) => {
    setQuery(text);
  };

  const initialValues: StoreFormData = {
    storeName: '',
    description: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    estimatedDeliveryDuration: ''
  };

  const handleStoreSubmission = async (data: StoreFormData) => {
    if (imageData?.length < 1) {
      Notifier.showNotification({
        title: 'Image is required',
        description: '',
        Component: NotifierComponents.Alert,
        hideOnPress: false,
        componentProps: {
          alertType: 'error',
        },
      });
      return
    }
    const payload = {
      brandName: data.storeName,
      description: data.description,
      coverImg: imageData,
      address: data.street + " " + data.city + " " + data.state,
      phoneNumber: data.phoneNumber.toString(),
      estimated_delivery_duration: data?.estimatedDeliveryDuration,
      location: {
        state: data.state,
        city: data.city,
        street: data.street,
      },
    };

    setLoader(true)
    const resultAction = await dispatch(createStore(payload))
    
    if (createStore.fulfilled.match(resultAction)) {
     
      //await dispatch(resetImage())
      await AsyncStorage.setItem('activeId', resultAction?.payload?.id)
      await AsyncStorage.setItem('activeName', resultAction?.payload?.brand_name)
      await AsyncStorage.setItem('activeSlug',  resultAction?.payload?.slug)
      setLoader(false)
      setImageData('')
      return navigation.navigate('StoreSuccessScreen')
    } else {
      setLoader(false)
      var errMsg = resultAction?.payload as string
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



  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: StoreFormSchema,
      onSubmit: (val: StoreFormData) => handleStoreSubmission(val),
    });


  const locationState: Array<any> = locationData && locationData?.map((data: locationProp, index: number) => {
    return data?.state
  });

  const locationCity = locationData?.find(
    (data: locationProp) => data?.state === values.state,
  );

  const newCity = locationCity?.city





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


  return (
    <SafeAreaView style={globalStyles.wrapper}>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <View style={[globalStyles.rowBetween, gbStyle.StoreCard]}>
        <Ionicons
          name={'chevron-back-outline'}
          size={30}
          color={'white'}
          onPress={() => navigation.goBack()}
        />
        <Text text="Store Information" fontSize={hp(18)} />
        <View />
      </View>
      <KeyboardAwareScrollView>


        <View style={gbStyle.imageContainer}>
          <Text text="Store Cover Image" fontSize={hp(16)} />

          <View style={gbStyle.formContainer}>
            {
              imageData?.length > 1 ?
                <Pressable onPress={() => resetImage()}>
                  <View style={gbStyle.image}>
                    <View style={gbStyle.round}>
                      <AntDesign name="minus" size={hp(15)} style={{ color: colors.white }} />
                    </View>
                    <Image source={{ uri: imageData }} style={gbStyle.image} />
                  </View>
                </Pressable>
                :
                <Pressable onPress={() => pickImage(1)}>
                  <View style={styles.imgStyle2} >
                    {
                      imageLoader ? <AntDesign name="loading1" size={hp(30)} style={{ color: colors.white }} /> : <AntDesign name="plus" size={hp(30)} style={{ color: colors.white }} />
                    }
                  </View>
                </Pressable>
            }
          </View>
        </View>

        <View>
          <View style={gbStyle.formContainer}>
            <Input
              label={'Store Name'}
              value={values.storeName}
              onBlur={handleBlur('storeName')}
              onChangeText={handleChange('storeName')}
              errorMsg={touched.storeName ? errors.storeName : undefined}
            />

            <Input
              label={'Description'}
              value={values.description}
              multiline={true}
              numberOfLines={4}
              onBlur={handleBlur('description')}
              onChangeText={handleChange('description')}
              errorMsg={touched.description ? errors.description : undefined}
            />

            <Input
              label={'Phone Number'}
              value={values.phoneNumber}
              onBlur={handleBlur('phoneNumber')}
              onChangeText={handleChange('phoneNumber')}
              errorMsg={touched.phoneNumber ? errors.phoneNumber : undefined}
            />
            <View>
              <Select
                placeholder='Estimated Delivery Date'
                items={['1', '2', '3', '4', '5']}
                defaultValue={values.estimatedDeliveryDuration}
                setState={handleChange('estimatedDeliveryDuration')}
                errorMsg={touched.estimatedDeliveryDuration ? errors.estimatedDeliveryDuration : undefined}
              />
            </View>

            <Text
              text="Store Location"
              fontSize={hp(16)}
              style={[gbStyle.locationText, gbStyle.horizon]}
            />
            <View >
              <Select
                items={locationState}
                defaultValue={values.state}
                placeholder={'state'}
                setState={handleChange('state')}
                errorMsg={touched.state ? errors.state : undefined}
              />

            </View>
            <View>
              <Select
                items={newCity}
                defaultValue={values.city}
                placeholder={'city'}
                setState={handleChange('city')}
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

          <View style={gbStyle.btn}>
            <Button isLoading={loader} title={'Create Store'} onPress={handleSubmit} />
          </View>
        </View>

      </KeyboardAwareScrollView>
      <CustomModal
        msg={msg}
        headerText={headerText}
        visibleBoolean={visibleBoolean} handleVisible={handleVisible}
        isSuccess={isSuccessful} />
    </SafeAreaView>
  );
};


export default CreateStoreScreen


const gbStyle = StyleSheet.create({
  StoreCard: {
    paddingVertical: hp(20),
    cursor: 'pointer',
  },
  formContainer: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: hp(10)
  },
  btn: {
    marginTop: 20,
    marginBottom: 100
  },
  locationText: {
    marginVertical: 15
  },
  imageContainer: {
    marginHorizontal: hp(5)
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

