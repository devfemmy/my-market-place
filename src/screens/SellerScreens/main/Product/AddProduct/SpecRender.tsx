import React, {useContext, useState, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import {View, Image, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import {globalStyles} from '../../../../../styles';
import {hp,wp} from '../../../../../utils/helpers';
import { colors } from '../../../../../utils/themes';
import {styles} from './styles';
import {launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { addImage, images } from '../../../../../redux/slices/productSlice';
import { pictureUpload } from '../../../../../utils/functions';
import ImagePicker from 'react-native-image-crop-picker';
import { deleteProductVariantSpec, getProductVariants } from '../../../../../redux/slices/productSlice';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { currencyFormat } from '../../../../../utils/functions';
import { getRequest } from '../../../../../utils/server';

export const VariantSpecRender = ({slugId, variantId, loading}: {slugId: string, variantId: string, loading: boolean}): JSX.Element => {

  const dispatch = useAppDispatch()

  const [spec, setSpec] = useState([])


  useEffect(() => {
    getSpec()
  }, [loading])

    const getSpec = async () => {
        const response = await getRequest(`/product/variant/spec?product_variant_id=${variantId}`)
        if (response?.status === 200) {
            setSpec(response?.data?.data)
        }
    }

    const RenderSpecList = ({item, index}: {item: any, index?: number}) => {
        
        return (
            <View style={[globalStyles.minicardSeparator, globalStyles.rowBetween, {paddingHorizontal: hp(15), paddingVertical: hp(15), width: '100%'}]}>
                <View style={[globalStyles.rowStart]}>
                    <View style={styles.detContainer}>
                        <Text text={`Price: ${currencyFormat(item?.amount)}`} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                        <Text text={`Size: ${item?.size}`} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={[styles.text, {marginVertical: hp(10)}]} />
                        <Text text={`Quantity: ${item?.quantity}`} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                    </View>
                </View>

                <View style={[globalStyles.rowStart]}>
                    {/* <TouchableOpacity onPress={() => HandleVariantEdit(item)} style={globalStyles.mini_button}>
                        <MaterialIcons name={'edit'} size={hp(15)} style={{color: colors.white}} />
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => deleteVariantSpec(item?.id)} style={globalStyles.mini_button}>
                        <FontAwesome name={'trash-o'} size={hp(16)} style={{color: colors.white}} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const deleteVariantSpec = async (id: string) => {
        await dispatch(deleteProductVariantSpec(id))
        await dispatch(getProductVariants(slugId))
    }


  return (
    <View style={[styles.width90, globalStyles.Verticalspacing]}>
        {
            spec?.map((val) => {
                return (
                    <RenderSpecList item={val}/>
                )
            })
        }
    </View>
  );
};
