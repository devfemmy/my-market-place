import React, {useContext, useRef} from 'react';
import {Text} from '../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { AuthContext } from '../../../context/context';
import { Button } from '../../../components/common/Button';
import {View, Image, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import {globalStyles} from '../../../styles';
import {hp,wp} from '../../../utils/helpers';
import {NoOrders} from '../../../constants/images';
import { colors } from '../../../utils/themes';
import OrderCard from '../../../components/resuable/OrderCard';
import { Input } from '../../../components/common/TextInput';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { filterOrders, availableStatus, selected, searchOrders, searching } from '../../../redux/slices/orderSlice';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Modalize } from 'react-native-modalize';
import SelectListCard from '../../../components/resuable/SelectListCard';
import { firstLetterUppercase } from '../../../utils/functions';

export const Orders = ({data}): JSX.Element => {
  const modalizeRef = useRef(null);
  const {navigate} = useNavigation<Nav>();
  const dispatch = useAppDispatch()
  const status = useAppSelector(availableStatus)
  const selectedStatus = useAppSelector(selected)
  const search = useAppSelector(searching)

  const renderItem = ({item}: any) => (
    <OrderCard item={item}/>
  );

  const renderStatus = ({item}: any) => (
    <SelectListCard onPress={() => dispatch(filterOrders(item))} title={firstLetterUppercase(item)} />
  );

  const renderHeader = () => (
    <View style={globalStyles.modal__header}/>
  );

  const getStatusData = () => ['All'].concat(status)

  return (
    <>
      <View>
        <View style={[globalStyles.rowBetween, styles.lowerContainer]}>
            <Text
                text={'Orders (' + data.length + ')'}
                numberOfLines={1}
                fontWeight={"700"}
                color={colors.white}
                fontSize={hp(18)}
            />
            <TouchableOpacity onPress={() => modalizeRef.current?.open()} style={globalStyles.rowStart}>
                <Text
                    text={ selectedStatus == '' ? 'All ' : firstLetterUppercase(selectedStatus)}
                    numberOfLines={1}
                    fontWeight={"400"}
                    color={colors.white}
                    fontSize={hp(16)}
                />
                <Ionicons name={'chevron-down'} size={hp(22)} style={{color: colors.bazaraTint}} />
            </TouchableOpacity>
            
        </View>
        <Input
            label={''}
            placeholder={"Search orders by name or id"}
            onChangeText={(text) => dispatch(searchOrders(text))}
            searchInput
        />
        
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item?._id}
            style={{marginBottom: hp(100)}}
        />
        
      </View>
      <Modalize
      ref={modalizeRef}
      adjustToContentHeight
      flatListProps={{
        data: getStatusData(),
        renderItem: renderStatus,
        showsVerticalScrollIndicator: false,
      }}
      withHandle={false}
      handlePosition={'inside'}
      handleStyle={{backgroundColor: colors.darkGrey}}
      HeaderComponent={renderHeader}
      modalStyle={{backgroundColor: colors.primaryBg, bottom: hp(-20)}}
      overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}/>
      </>
  );
};
