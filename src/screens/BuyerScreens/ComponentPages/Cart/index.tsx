import React, {useContext, useEffect, useRef, useState} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import { View, ActivityIndicator, StatusBar, StyleSheet, Image, ScrollView, FlatList, Alert } from 'react-native';
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
import { getCarts, CartData, loading, error, deleteCart, updateCart } from '../../../../redux/slices/cartSlice';
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
  const cartData = useAppSelector(CartData)
  const loader = useAppSelector(loading)
  const [cities, setCities] = useState([])

  const modalizeRef = useRef(null);

  const getCities = (state: any) => {
    const arr: Array<any> = locationData?.filter((val) => {
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
    dispatch(getCarts())
  }, [])

  const Bill = ({title, value, size, total}:{title: string, value: any, size: any, total: any}) => (
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

  const getSubTotal = (data: any) => {
    if(!data || data?.length < 1){
      return 0
    }
    const amounts = data?.map((val) => {
      if(val?.amount){
        return val?.amount * val?.quantity
      }
    })
    const sum = amounts.reduce(add, 0)
    return sum
  }

  const add = (accumulator: any, a: any) => {
    return accumulator + a;
  }

  const confirmDelete = async (id) => {
    await dispatch(deleteCart(id))
    await dispatch(getCarts())
  }

  const deleteItem = (id: any) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        {text: 'yes', onPress: () => confirmDelete(id)},
        {text: 'no', onPress: () => console.log('Nothing!')},
      ]
    );
  }

  const updateItem = async (id: string, qty: number, action: any) => {
    let newQuant = qty
    if(action == "minus"){
      newQuant = newQuant - 1
    }else{
      newQuant = newQuant + 1
    }
    const payload = {
      id: id,
      quantity: newQuant
    }
    if(newQuant < 1){
      deleteItem(id)
      return
    }
    await dispatch(updateCart(payload))
    await dispatch(getCarts())
  }

  if(loader){
    return (
        <SafeAreaView>
            <View style={[globalStyles.rowCenter, {flex: 1}]}>
                <ActivityIndicator size={'small'}/>
            </View>
        </SafeAreaView>
    )
  }

  return (
    <View style={[globalStyles.wrapper, {paddingHorizontal: hp(15)}]}>
        <FlatList
            data={cartData}
            renderItem={
              ({item}) => 
              <CartCard 
              item={item} 
              onDelete={() => deleteItem(item?.id)}
              onAdd={() => updateItem(item?.id, item?.quantity, "plus")}
              onSubt={() => updateItem(item?.id, item?.quantity, "minus")}
              />
            }
            keyExtractor={(item) => item?._id}
            showsVerticalScrollIndicator={false}
        />
        <View style={[globalStyles.rcolCenter]}>
            <Bill title={'Sub total'} value={`₦${numberFormat(getSubTotal(cartData))}`} size={hp(15)} total={false} />
            <Bill title={'Delivery fee'} value={`₦${numberFormat(1000)}`} size={hp(15)} total={false} />
            <Bill title={'Total Payment'} value={`₦${numberFormat(getSubTotal(cartData) + 1000)}`} size={hp(18)} total={true} />
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
