/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/prop-types */
import React, {useRef, useState} from 'react';
import {Text} from '../../../components/common';
import {View, FlatList, TouchableOpacity, Share} from 'react-native';
import {globalStyles} from '../../../styles';
import {hp} from '../../../utils/helpers';
import { colors } from '../../../utils/themes';
import OrderCard from '../../../components/resuable/OrderCard';
import { Input } from '../../../components/common/TextInput';
// import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { filterOrders, availableStatus, selected, searchOrders} from '../../../redux/slices/orderSlice';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Modalize} from 'react-native-modalize';
import SelectListCard from '../../../components/resuable/SelectListCard';
import {firstLetterUppercase} from '../../../utils/functions';
import ProductCard from '../../../components/resuable/ProductCard';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { searchProducts, searching, updateProduct, getAllProducts, UpdateEditableSlug } from '../../../redux/slices/productSlice';
import { Notify } from '../../../utils/functions';
import { myStore } from '../../../redux/slices/StoreSlice';

export const Products = ({data, store}): JSX.Element => {
  const modalizeRef = useRef(null)

  const dispatch = useAppDispatch()

  const {navigate} = useNavigation<Nav>();

  const searcher = useAppSelector(searching)

  const [selectedItem, setSelectedItem] = useState({})

  const mystore = useAppSelector(myStore)

  const renderItem = ({item}: any) => (
    <ProductCard onIconPress={() => {setSelectedItem(item); modalizeRef.current?.open()}} item={item}/>
  );

//   console.log(data[0].variants[0].spec[0].price)

// console.log(data[0].variants[0].variantImg)

const renderHeader = () => (
    <View style={globalStyles.modal__header}/>
);

const renderStatus = ({item}: any) => (
    <View style={[globalStyles.minicardSeparator]}>
        <TouchableOpacity onPress={item.onPress} style={[globalStyles.rowStart, globalStyles.lowerContainer]}>
            {item.icon}
            <View style={globalStyles.Horizontalspacing}/>
            <Text fontWeight="300" fontSize={hp(16)} text={item.label} />
        </TouchableOpacity>
    </View>
);

const getDataa = () => ['Edit', 'Activate', 'Deactivate', 'Share']

const getData = () => [
    {
        label: 'Edit',
        icon: <Entypo name="pencil" size={20} color={colors.white} />,
        onPress: () => editItem(selectedItem)
    },
    {
        label: 'Activate',
        icon: <AntDesign name="checkcircleo" size={20} color={colors.white} />,
        onPress: () => ActivateProduct()
    },
    {
        label: 'Deactivate',
        icon: <AntDesign name="warning" size={20} color={colors.white} />,
        onPress: () => DeactivateProduct()
    },
    {
        label: 'Share',
        icon: <AntDesign name="sharealt" size={20} color={colors.white} />,
        onPress: () => onShare()
    },
]

const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Bazara!!!',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

const editItem = (item: any) => {
  dispatch(UpdateEditableSlug(item))
  setTimeout(() => {navigate('AddProduct')}, 500)
}

const routeToAdd = () => {
  dispatch(UpdateEditableSlug(null))
  setTimeout(() => {navigate('AddProduct')}, 200)
}

const DeactivateProduct = async () => {
    const payload = {
        id: selectedItem?.id,
        status: 'inactive'
    }
    try {
        var resultAction = await dispatch(updateProduct(payload))
        if(updateProduct.fulfilled.match(resultAction)){
            Notify('Product Deactivated!', 'Your product was successfully deactivated', 'success')
            await dispatch(getAllProducts(mystore[0]._id))
        }else{
            Notify('Product not Deactivated!', 'Your product was not deactivated', 'error')
        }
    } catch (error) {
        Notify('Product not Deactivated!', 'Seems something went wrong.', 'error')
        console.log(error)
    }
}

const ActivateProduct = async () => {
    const payload = {
        id: selectedItem?.id,
        status: 'active'
    }
    try {
        var resultAction = await dispatch(updateProduct(payload))
        if(updateProduct.fulfilled.match(resultAction)){
            Notify('Product Activated!', 'Your product was successfully activated', 'success')
            await dispatch(getAllProducts(mystore[0]._id))
        }else{
            Notify('Product not Activated!', 'Your product was not activated', 'error')
        }
    } catch (error) {
        Notify('Product not Activated!', 'Seems something went wrong.', 'error')
        console.log(error)
    }
}

  return (
    <>
      <View style={[globalStyles.wrapper]}>
        <View style={[globalStyles.rowBetween, globalStyles.lowerContainer]}>
            <Text
                text={firstLetterUppercase(store.brandName) + ' (' + data.length + ')'}
                numberOfLines={1}
                fontWeight={"700"}
                color={colors.white}
                fontSize={hp(18)}
            />
            <View/>
        </View>
        <View style={{paddingHorizontal: hp(15)}}>
          <Input
              label={''}
              placeholder={"Search for products"}
              onChangeText={(text) => dispatch(searchProducts(text))}
              searchInput
              containerStyle={{width: '100%'}}
          />
        </View>
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?._id}
            contentContainerStyle={{paddingBottom: hp(100)}}
            style={{marginBottom: hp(-50)}}
        />
        <TouchableOpacity onPress={() => routeToAdd()} style={globalStyles.floating_button}>
            <Entypo name={'plus'} size={hp(35)} style={{color: colors.white}} />
        </TouchableOpacity>
      </View>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        flatListProps={{
            data: getData(),
            renderItem: renderStatus,
            showsVerticalScrollIndicator: false,
        }}
        withHandle={false}
        handlePosition={'inside'}
        handleStyle={{backgroundColor: colors.darkGrey}}
        HeaderComponent={renderHeader}
        modalStyle={{backgroundColor: colors.primaryBg, bottom: hp(-20)}}
        overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}
      />
    </>
  );
};
