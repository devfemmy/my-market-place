import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { StatusBar, View, StyleSheet, ScrollView, Image, Pressable, Platform } from 'react-native';
import { SafeAreaView, Text } from '../../components/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input } from '../../components/common/TextInput';
import { StoreFormSchema } from '../../utils/constants';
import { locationData } from '../../utils/constants/locations';
import { Select } from '../../components/common/SelectInput';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/common/Button';
import { globalStyles } from "../../styles/globalStyles"
import { hp, wp } from '../../utils/helpers';
;
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { addStoreImage, createStore, getStoreById, resetStoreImage, storebyId, storeImage } from "../../redux/slices/StoreSlice"
import { locationProp, Nav, StoreFormData } from '../../utils/types';
import CustomModal from '../../components/common/CustomModal';
import { colors } from '../../utils/themes';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NavHeader from '../../components/resuable/NavHeader';
import { launchImageLibrary } from 'react-native-image-picker';

import { styles } from '../main/Product/AddProduct/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';

const EditStore = (): JSX.Element => {
  const navigation = useNavigation<Nav>();
  const [loader, setLoader] = useState(false)
  const dispatch = useAppDispatch()
  const [visibleBoolean, setVisibleBoolen] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const imageData = useAppSelector(storeImage)
  const storeIdData = useAppSelector(storebyId)
  const [activeId, setActiveId] = useState<string>('')
  const [editImg, setEditImg] = useState<string>(storeIdData?.imgUrl)


  useEffect(() => {
    const loadActiveId = async () => {
      const id = await AsyncStorage.getItem('activeId')
       setActiveId(id)
      dispatch(getStoreById(id))
    }

    loadActiveId()
  }, [activeId])



  const initialValues: StoreFormData = {
    storeName: storeIdData?.brandName,
    description: storeIdData?.description,
    phoneNumber: '',
    street: storeIdData?.location.street,
    city: storeIdData?.location?.city,
    state: storeIdData?.location?.state,
  };

  const handleStoreSubmission = async (data: StoreFormData) => {
    const payload = {
      category: "Men's Clothing",
      brandName: data.storeName,
      description: data.description,
      imgUrl: imageData?.length > 1 ? imageData : editImg,
      address: data.street + " " + data.city + " " + data.state,
      shippingFees: {
        withinLocation: 1000,
        outsideLocation: 2000
      },
      location: {
        state: data.state,
        city: data.city,
        street: data.street,
      },
    };

    setLoader(true)
    const resultAction = await dispatch(createStore(payload))
    if (createStore.fulfilled.match(resultAction)) {
      setLoader(false)
      return navigation.navigate('AuthStoreSuccessScreen')
    } else {
      if (resultAction.payload) {
        setLoader(false)
        setVisibleBoolen(true)
        console.log('error1', `Update failed: ${resultAction?.payload}`)
      } else {
        setLoader(false)
        setVisibleBoolen(true)
        console.log('error', `Updated failed: ${resultAction?.payload}`)
      }
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
      enableReinitialize: true
    });


  const locationState = locationData?.map((data: locationProp) => data?.state);

  const locationCity = locationData?.find(
    (data: locationProp) => data?.state === values.state,
  )?.city;


  const pickImage = async () => {
    let result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
    if (!result.didCancel) {
      dispatch(addStoreImage({ uri: result?.assets[0]?.uri }))
    }
  };


  const resetImage = () => {
    dispatch(resetStoreImage())
  }

  const removeImage = () => {
    setEditImg('')
  }


  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <ScrollView>
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
                <Pressable onPress={editImg?.length > 1 ? () => removeImage() :() => resetImage()}>
                  <View style={gbStyles.image}>
                    <View style={gbStyles.round}>
                      <AntDesign name="minus" size={hp(15)} style={{ color: colors.white }} />
                    </View>
                    <Image source={{ uri: editImg ? editImg : imageData }} style={gbStyles.image} />
                  </View>
                </Pressable>
                :
                <Pressable onPress={() => pickImage()}>
                  <View style={styles.imgStyle2} >
                    <AntDesign name="plus" size={hp(30)} style={{ color: colors.white }} />
                  </View>
                </Pressable>
            }
          </View>
        </View>

        <View style={globalStyles.container}>
          <View style={gbStyles.formContainer}>
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
      </ScrollView>
      <CustomModal
        msg="You have successfully updated your store information"
        headerText="Success"
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
    marginHorizontal: 30
  },
  image: {
    width: 100,
    height: 100,
    paddingLeft: 5
  },
  imageBox: {
    backgroundColor: colors.dimBlack,
    height: hp(120),
    width: wp(120),
    borderRadius: 10,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  round: {
    backgroundColor: colors.cancelled,
    width: hp(15),
    height: hp(15),
    justifySelf: 'flex-end',
    alignSelf: 'flex-end',
    borderRadius: 50,
    marginBottom: -15,
    zIndex: 1111,
  }
});
