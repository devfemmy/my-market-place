/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/prop-types */
import React, {useRef} from 'react';
import {Text} from '../../../components/common';
import {View, FlatList, TouchableOpacity} from 'react-native';
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


export const Products = ({data, store}): JSX.Element => {
  const modalizeRef = useRef(null)
  const {navigate} = useNavigation<Nav>();
  const renderItem = ({item}: any) => (
    <ProductCard onIconPress={() => modalizeRef.current?.open()} item={item}/>
  );

//   console.log(data[0].variants[0].spec[0].price)

// console.log(data[0].variants[0].variantImg)

const renderHeader = () => (
    <View style={globalStyles.modal__header}/>
);

const renderStatus = ({item}: any) => (
    <View style={[globalStyles.minicardSeparator]}>
        <TouchableOpacity style={[globalStyles.rowStart, globalStyles.lowerContainer]}>
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
        icon: <Entypo name="pencil" size={20} color={colors.white} />
    },
    {
        label: 'Activate',
        icon: <AntDesign name="checkcircleo" size={20} color={colors.white} />
    },
    {
        label: 'Deactivate',
        icon: <AntDesign name="warning" size={20} color={colors.white} />
    },
    {
        label: 'Share',
        icon: <AntDesign name="sharealt" size={20} color={colors.white} />
    },
]

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
        <Input
            label={''}
            placeholder={"Search for products"}
            onChangeText={(text) => console.log(text)}
            searchInput
        />
        
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?._id}
            style={{marginBottom: hp(100)}}
        />
        <TouchableOpacity onPress={() => navigate('AddProduct')} style={globalStyles.floating_button}>
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
