import { View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState} from 'react'
import { SafeAreaView, Text } from '../../components/common'
import { globalStyles } from '../../styles'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../../utils/themes'
import { hp, wp } from '../../utils/helpers'
import { Nav } from '../../utils/types'
import { firstLetterUppercase } from '../../utils/functions'
import { numberFormat } from '../../utils/helpers'
import QtyBtn from './QtyBtn'
import { icons } from '../../utils/constants'
import { updateCart, deleteCart, getCarts } from '../../redux/slices/cartSlice'
import { useAppDispatch } from '../../redux/hooks'


const CartCard = ({item, onDelete, onAdd, onSubt}) => {
    // const  { navigate } = useNavigation<Nav>();
    // const dispatch = useAppDispatch()
    // const [quant, setQuanty] = useState(0)

    const updateQuantity = async (quantity) => {

    }

    const deleteItem = async () => {
        const dispatch = useAppDispatch()
        console.log("hhhhhh")
        // await dispatch(deleteCart(item?.id))
        // await dispatch(getCarts())
    }

    return (
        <View style={styles.comp}>
            <View style={[globalStyles.rowStart]}>
                <View style={styles.imageCard}>
                    <Image source={{uri: item?.variant_img_url}} resizeMode='cover' style={styles.imageContainer} />
                </View>
                <View style={[globalStyles.rowBetween, {width: wp(280)}]}>
                    <View style={styles.detailsContainer}>
                        {/* <Text
                        text={`Color: ${firstLetterUppercase(item?.color)}, Size: ${item?.size || "N/A"}`} 
                        fontSize={hp(16)}
                        color={colors.white}
                        fontWeight={'400'}
                        textAlign={'center'}
                        numberOfLines={1}
                        style={{marginTop: hp(5)}}
                        /> */}
                        <Text
                        text={`Color: ${firstLetterUppercase(item?.color || "N/A")}`} 
                        fontSize={hp(13)}
                        color={colors.white}
                        fontWeight={'400'}
                        textAlign={'center'}
                        numberOfLines={1}
                        style={{marginTop: hp(5)}}
                        />
                        <Text
                        text={`Size: ${item?.size || "N/A"}`} 
                        fontSize={hp(13)}
                        color={colors.white}
                        fontWeight={'400'}
                        textAlign={'center'}
                        numberOfLines={1}
                        style={{marginTop: hp(5)}}
                        />

                        <Text 
                        text={`₦${numberFormat(Number(item?.amount))}`} 
                        fontSize={hp(18)}
                        color={colors.dispatched}
                        textAlign={'center'}
                        numberOfLines={1}
                        fontWeight={'bold'}
                        style={{marginTop: hp(5)}}
                        />
                    </View>
                    <QtyBtn onAdd={onAdd} onMinus={onSubt} value={item?.quantity} size={hp(10)}/>
                </View>
            </View>
            <TouchableOpacity onPress={onDelete} style={[globalStyles.rowStart, {marginTop: hp(10)}]}>
                <icons.FontAwesome5 name="trash" size={14} color={colors.bazaraTint} />
                <Text
                text={' Remove item'} 
                fontSize={hp(13)}
                color={colors.bazaraTint}
                fontWeight={'300'}
                textAlign={'center'}
                numberOfLines={1}
                />
            </TouchableOpacity>
            
        </View>
    )
}

export default CartCard


const styles = StyleSheet.create({
    comp: {
        marginTop: hp(20),
        width: '100%',
        minHeight: hp(100),
        borderBottomWidth: 1,
        borderColor: colors.black
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(5),
        width: wp(60),
        height: wp(60),
        backgroundColor: colors.dimBlack,
        overflow: 'hidden'
    },
    imageContainer: {
        width: wp(60),
        height: wp(60)
    },
    detailsContainer: {
        marginLeft: hp(15),
        height: wp(60),
        width: wp(160),
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
})