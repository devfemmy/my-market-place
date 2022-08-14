import React, {useContext, useEffect, useRef, useState} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import { View, ActivityIndicator, StatusBar, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import { globalStyles } from '../../../../styles';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { colors } from '../../../../utils/themes';
import { hp } from '../../../../utils/helpers';
import CartCard from '../../../../components/resuable/CartCard';
import { CART_DATA } from '../../DummyData';
import { getCart, cart, loading, error } from '../../../../redux/slices/cartSlice';
import { numberFormat } from '../../../../utils/helpers';
import { Modalize } from 'react-native-modalize';
import { Input } from '../../../../components/common/TextInput';
import { Select } from '../../../../components/common/SelectInput';
import { locationData } from '../../../../utils/constants';
import { useFormik } from 'formik';
import { DeliveryAddressFormData } from '../../../../utils/types';

export const Cart = (): JSX.Element => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch()
  const cartData = useAppSelector(cart)

  const [cities, setCities] = useState([])

  const modalizeRef = useRef(null);

  const getCities = (state) => {
    const arr = locationData?.filter((val) => {
        if(state == val?.state){
            return val
        }
    })
    setCities(arr[0]?.city)
  }

  const initialValues: DeliveryAddressFormData = {
    address: '',
    state: '',
    city: ''
  };

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } =
    useFormik({
      initialValues,
      onSubmit: (val: DeliveryAddressFormData) => console.log(val),
    });

  useEffect(() => {
    dispatch(getCart())
  }, [])

  const Bill = ({title, value, size, total}) => (
    <View style={[globalStyles.rowBetween, {marginTop: hp(10)}]}>
        <Text
        text={title} 
        fontSize={size}
        color={colors.white}
        fontWeight={'400'}
        textAlign={'center'}
        numberOfLines={1}
        />
        <Text
        text={value} 
        fontSize={size}
        color={total ? colors.bazaraTint : colors.white}
        fontWeight={total ? 'bold' : '400'}
        textAlign={'center'}
        numberOfLines={1}
        />
    </View>
  )

  const locationState: Array<any> = locationData && locationData?.map((data: locationProp, index: number) => {
    return data?.state
  });

  return (
    <View style={[globalStyles.wrapper, {paddingHorizontal: hp(15)}]}>
        <FlatList
            data={CART_DATA}
            renderItem={CartCard}
            keyExtractor={(item) => item?._id}
        />
        <View style={[globalStyles.rcolCenter]}>
            <Bill title={'Sub total'} value={`₦${numberFormat(8000)}`} size={hp(15)} total={false} />
            <Bill title={'Delivery fee'} value={`₦${numberFormat(1000)}`} size={hp(15)} total={false} />
            <Bill title={'Total Payment'} value={`₦${numberFormat(9000)}`} size={hp(18)} total={true} />
            <Button isLoading={false} title={'Proceed'} style={styles.btn} onPress={() => modalizeRef.current?.open()} />
        </View>
        <Modalize
        modalStyle={{backgroundColor: colors.primaryBg}}
        keyboardAvoidingOffset={100}
        adjustToContentHeight
        // modalHeight={hp(600)}
        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
        ref={modalizeRef}
        overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}
        handlePosition={'inside'}
        handleStyle={{backgroundColor: colors.darkGrey}}
        >
            <View style={{width: '100%', height: hp(500), paddingTop: hp(40)}}>
            <Text
            text={'Delivery Address'} 
            fontSize={hp(18)}
            color={colors.white}
            fontWeight={'400'}
            textAlign={'left'}
            numberOfLines={1}
            style={{marginLeft: hp(20), marginBottom: hp(20)}}
            />
            <Input
                label={'Delivery Address'}
            />
            <Select
                items={locationState}
                defaultValue={values.state}
                placeholder={'State'}
                setState={(val) => {setFieldValue('state', val); getCities(val)}}
                errorMsg={touched.state ? errors.state : undefined}
            />
            <Select
                items={cities}
                defaultValue={values.city}
                placeholder={'City'}
                setState={handleChange('city')}
                errorMsg={touched.city ? errors.city : undefined}
            />
            </View>
            <View style={[globalStyles.colCenter, {width: '90%', alignSelf: 'center'}]}>
                <Button isLoading={false} title={'Add Address'} style={styles.btn} onPress={() => console.log('help')} />
            </View>
        </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  imageCard: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    height: hp(180),
    paddingHorizontal: hp(15)
  },
  imageContainer: {
      width: '100%',
  },
  btn: {
    marginTop: hp(30),
    marginBottom: hp(50),
    height: hp(55),
    width: '110%',
    alignSelf: 'center'
  },
})
