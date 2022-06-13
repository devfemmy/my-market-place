import { Image, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import React, { useState, useMemo, useEffect } from 'react'
import { SafeAreaView, Text } from '../../components/common'
import NavHeader from '../../components/resuable/NavHeader'
import { useNavigation } from '@react-navigation/native'
import { DeliveryFormData, LandmarkFormData, locationProp, Nav } from '../../utils/types'

import { DeliveryFormSchema, LandmarkFormSchema, locationData } from '../../utils/constants'
import { colors } from '../../utils/themes'
import { hp } from '../../utils/helpers'
import { Select } from '../../components/common/SelectInput'
import { useFormik } from 'formik'
import { Input } from '../../components/common/TextInput'
import { Button } from '../../components/common/Button'
import { globalStyles } from '../../styles'
import { styles } from '../AuthStoreSuccessScreen/styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { plusActive } from '../../assets'

const AddShippingFee = () => {
  const navigation = useNavigation<Nav>()
  const [data, setData] = useState();
  const [selected, setSelected] = useState(undefined);
  const [landmark, setLandmark] = useState([])
  const [loader, setLoader] = useState()

  const [query, setQuery] = useState('');


  const initialValues: DeliveryFormData = {
    state: '',
    price: ''
  };


  const initialLandmarkValues: LandmarkFormData = {
    city: '',
    price: ''
  };


  const handleAddDelivery = (data: DeliveryFormData) => {
    console.log({ data })
  }

  const handleLandmarkDelivery = (data: LandmarkFormData) => {
    console.log({ data })
  }

  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: DeliveryFormSchema,
      onSubmit: (val: DeliveryFormData) => handleAddDelivery(val),
    });

  const { values: modalValues, errors: modalErrors, touched: modalTouched, handleChange: handleModalChange, handleSubmit: handleModalSubmit, handleBlur: handleModalBlur } =
    useFormik({
      initialValues: initialLandmarkValues,
      validationSchema: LandmarkFormSchema,
      onSubmit: (data: LandmarkFormData) => handleLandmarkDelivery(data),
    });


  const deleteLandmark = (item: any) => {
    const update = landmark?.filter((data, i) => i !== item)
    setLandmark(update)
  }


  const locationState: Array<any> = locationData && locationData?.map((data: locationProp, index: number) => {
    return data?.state
  });

  const locationCity = locationData?.find(
    (data: locationProp) => data?.state === values.state,
  );

  const newCity = locationCity?.city

  const onSearch = (text: any) => {
    setQuery(text);
  };

  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <ScrollView>

        <NavHeader
          icon='chevron-back-outline'
          handlePress={() => navigation.goBack()}
          title="Add Shipping Fee"
        />

        <View style={globalStyles.container}>

          <View style={subStyle.formContainer}>
            <Select
              items={locationState}
              defaultValue={values.state}
              placeholder={'state'}
              setState={handleChange('state')}
              errorMsg={touched.state ? errors.state : undefined}
            />

            <Input
              label={'Price'}
              value={values.price}
              onBlur={handleBlur('price')}
              onChangeText={handleChange('price')}
              errorMsg={touched.price ? errors.price : undefined}
            />
          </View>

          {
            values.state === 'Lagos' && <View style={subStyle.cont}>
              <Text text='Suggested landmarks' fontSize={hp(16)} />
              <View>
                <View>
                  <View style={[globalStyles.rowBetween, subStyle.div]}>
                    <Text text='Lagos Island' fontSize={14} />
                    <Text text='Add Price' fontSize={14} color={colors.bazaraTint} />
                  </View>
                </View>
                <View>
                  <View style={[globalStyles.rowBetween, subStyle.div]}>
                    <Text text='Lagos Island' fontSize={14} />
                    <Text text='Add Price' fontSize={14} color={colors.bazaraTint} />
                  </View>
                </View>
              </View>
            </View>
          }

          <View style={[globalStyles.rowStart, subStyle.md]}>
            <Image source={plusActive} style={subStyle.image} />
            <Text text='Add landmarks' fontSize={14} />
          </View>
        </View>
      </ScrollView>

      <View style={globalStyles.footer}>
        <View style={globalStyles.rowCenter}>
          <Button isLoading={loader} title={'Set Fee'} onPress={handleSubmit} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AddShippingFee


const subStyle = StyleSheet.create({
  contain: {
    paddingVertical: 10,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.5,
  },
  formContainer: {
    flex: 1,
    marginVertical: 10
  },
  btn: {
    marginTop: 20,
    marginBottom: 10
  },
  div: {
    paddingVertical: 20,
    borderBottomColor: colors.gray,
    borderBottomWidth: 0.3
  },
  image: {
    width: 20,
    marginRight: 5
  },
  md: {
    marginHorizontal: 15
  },
  cont: {
    marginHorizontal: 15,
    marginBottom: 20
  }
})