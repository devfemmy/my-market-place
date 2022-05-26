import React from 'react';
import { useFormik } from 'formik';
import { StatusBar, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, Text } from '../../components/common';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input } from '../../components/common/TextInput';
import { StoreFormData } from '../../utils/types';
import { StoreFormSchema } from '../../utils/constants';
import { locationData } from '../../utils/constants/locations';
import { Select } from '../../components/common/SelectInput';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/common/Button';
import { globalStyles } from "../../styles/globalStyles"
import { hp } from '../../utils/helpers';


type locationProp = {
  state: string,
  city: Array<string>,
}

export const StoreCreation = (): JSX.Element => {
  const navigation = useNavigation();


  const initialValues: StoreFormData = {
    storeName: '',
    description: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
  };
  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: StoreFormSchema,
      onSubmit: (val: StoreFormData) => console.log("valuessss", val),
    });


    const locationState = locationData?.map((data: locationProp) => data?.state);

  const locationCity = locationData?.find(
    (data: locationProp) => data?.state === values.state,
  )?.city;


  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <ScrollView>
        <View style={[globalStyles.container, globalStyles.rowBetween, styles.StoreCard]}>
          <Ionicons
            name={'chevron-back-outline'}
            size={30}
            color={'white'}
            onPress={() => navigation.goBack()}
          />
          <Text text="Store Information" fontSize={18} />
          <View />
        </View>

        <View style={globalStyles.container}>
          <View style={styles.formContainer}>
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
              fontSize={18}
              style={[styles.locationText, styles.horizon]}
            />

            <View style={styles.horizon}>
              <Select
                defaultValue={values.state}
                items={locationState}
                setState={handleChange('state')}
                placeholder="Select State"
                errorMsg={touched.state ? errors.state : undefined}
              />
            </View>
            <View style={styles.horizon}>
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

          <View style={styles.btn}>
            <Button title={'Create Store'} onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  StoreCard: {
    paddingVertical: hp(20),
    cursor: 'pointer',
  },
  formContainer: {
    flex: 1,
  },
  btn: {
    marginTop: 20,
    marginBottom: 10
  },
  locationText: {
    marginVertical: 15
  },
  horizon: {
    marginHorizontal: 20
  }
});
