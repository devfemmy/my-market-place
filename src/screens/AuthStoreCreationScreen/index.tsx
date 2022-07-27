import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { StatusBar, View, StyleSheet, ScrollView, Image, Pressable, Platform } from 'react-native';
import { SafeAreaView, Text } from '../../components/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input } from '../../components/common/TextInput';
import { StoreFormSchema } from '../../utils/constants';
import { locationData } from '../../utils/constants';
import { Select } from '../../components/common/SelectInput';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/common/Button';
import { globalStyles } from "../../styles/globalStyles"
import { hp, wp } from '../../utils/helpers';
import ImagePicker from 'react-native-image-crop-picker';
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { addStoreImage, createStore, resetStoreImage, storeImage, uploadImage } from "../../redux/slices/StoreSlice"
import { locationProp, Nav, StoreFormData } from '../../utils/types';
import CustomModal from '../../components/common/CustomModal';
import { colors } from '../../utils/themes';

import { launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { styles } from '../main/Product/AddProduct/styles';
import { pictureUpload } from '../../utils/functions';



const AuthStoreCreationScreen = (): JSX.Element => {
  const navigation = useNavigation<Nav>();
  const [loader, setLoader] = useState(false)
  const dispatch = useAppDispatch()
  const [visibleBoolean, setVisibleBoolen] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [headerText, setHeaderText] = useState('');
  const [msg, setMsg] = useState('');
  const [imageData, setImageData] = useState('')

  const [query, setQuery] = useState('');

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
  };

  const handleStoreSubmission = async (data: StoreFormData) => {
    if (imageData?.length < 1) {
      setVisibleBoolen(true)
      setHeaderText('Error')
      setMsg('Image is required')
      return
    }
    const payload = {
      brandName: data.storeName,
      description: data.description,
      imgUrl: imageData,
      address: data.street + " " + data.city + " " + data.state,
      phoneNumber: data.phoneNumber,
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
      setImageData('')
      console.log({resultAction})
      return navigation.navigate('AuthStoreSuccessScreen')
    } else {
      if (resultAction.payload) {
        console.log({resultAction})
        setLoader(false)
        setVisibleBoolen(true)
        setHeaderText('Error')
        setMsg('Problem creating store')
        console.log('error1', `Update failed: ${resultAction?.payload}`)
      } else {
        setLoader(false)
        setVisibleBoolen(true)
        setHeaderText('Error')
        setMsg('Problem creating store')
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
        const ImageUrl = await pictureUpload(image)
        setImageData(ImageUrl)
    });
};




  const resetImage = () => {
    dispatch(resetStoreImage())
  }


  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <ScrollView>
        <View style={[globalStyles.container, globalStyles.rowBetween, gbStyle.StoreCard]}>
          <Ionicons
            name={'chevron-back-outline'}
            size={30}
            color={'white'}
            onPress={() => navigation.goBack()}
          />
          <Text text="Store Information" fontSize={hp(18)} />
          <View />
        </View>

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
                    <AntDesign name="plus" size={hp(30)} style={{ color: colors.white }} />
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
      </ScrollView>
      <CustomModal
        msg={msg}
        headerText={headerText}
        visibleBoolean={visibleBoolean} handleVisible={handleVisible}
        isSuccess={isSuccessful} />
    </SafeAreaView>
  );
};

export default AuthStoreCreationScreen

const gbStyle = StyleSheet.create({
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
  imageContainer: {
    marginHorizontal: 15
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
  horizon: {
    marginHorizontal: 15
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
