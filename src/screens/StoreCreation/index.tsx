import React, { useState } from 'react';
import { useFormik } from 'formik';
import { StatusBar, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, Text } from '../../components/common'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input } from '../../components/common/TextInput';
import { StoreFormData } from '../../models';
import { StoreFormSchema } from '../../constants';
import { locationData } from '../../utils/locationJson';
import { Select } from '../../components/common/SelectInput';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/common/Button';


export const StoreCreation = (): JSX.Element => {
  const navigation = useNavigation()

  const [state, setState] = useState("")
  const [city, setCity] = useState("")


  const locationState = locationData?.map((data: any) => data?.state)

  const locationCity = locationData?.find((data: any) => data?.state === state)?.city



  const initialValues: StoreFormData = {
    storeName: '',
    description: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",

  };
  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: StoreFormSchema,
      onSubmit: (values: StoreFormData) => console.log(values),
    });

  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={"white"} />
      <ScrollView>
        <View style={styles.StoreCard}>
          <Ionicons name={"chevron-back-outline"} size={30} color={"white"} onPress={() => navigation.goBack()} />
          <Text text="Store Information" fontSize={18} />
          <View></View>
        </View>

        <View style={styles.container}>
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

            <Text text='Store Location' fontSize={18} style={{ marginVertical: 15 }} />

            <Select
              items={locationState}
              setState={setState}
              placeholder="Select State"
            />

            <Select
              items={locationCity}
              setState={setCity}
              placeholder="Select City"
            />

            <Input
              label={'Street name'}
              value={values.street}
              onBlur={handleBlur('street')}
              onChangeText={handleChange('street')}
              errorMsg={touched.street ? errors.street : undefined}
            />
          </View>

          <View style={styles.btn}>
            <Button text="Create Store" onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  StoreCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    cursor: 'pointer'
  },
  container: {
    paddingHorizontal: 20,
   
  },
  formContainer: {
    flex: 1,
  },
  btn: {
    marginTop: 20
  }
})