import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useRef} from 'react'
import { OrderCardProps } from "../../interfaces"
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../utils/types';
import { Text } from '../common'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { globalStyles } from '../../styles'
import { colors } from '../../utils/themes'
import { hp } from '../../utils/helpers'
import { currencyFormat, statusColor, firstLetterUppercase, copyToClipboard } from '../../utils/functions'
import {Modalize} from 'react-native-modalize';

const ProductCard: React.FC<OrderCardProps> = ({ onIconPress, item }) => {

    const navigation = useNavigation<Nav>();
    if(item == null){
        return null
    }

    const statusColor = () => {
        if(item?.status == 'active'){
            return colors.completed
        }
        else if(item?.status == 'draft'){
            return colors.pending
        }else{
            return colors.cancelled
        }
    }

    return (
        <View style={[styles.cardContainer, globalStyles.rowStart]}>
            <View style={[globalStyles.rowStart]}>

                <TouchableOpacity style={globalStyles.rowStartNoOverflow}>
                    <Image source={{uri: item?.variants[0]?.variantImg}} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.detContainer}>
                    <Text text={item?.name} numberOfLines={1} fontWeight={"600"} fontSize={hp(17)} style={styles.text} />
                    <View style={globalStyles.rowStart}>
                        <Text
                            text={currencyFormat(item?.variants[0]?.spec[0].price)}
                            numberOfLines={1}
                            fontWeight={"500"}
                            color={colors.darkGrey}
                            fontSize={hp(14)}
                            style={styles.text}
                        />
                        <Entypo name={'dot-single'} size={hp(20)} style={{color: statusColor()}} />
                        <Text
                            text={firstLetterUppercase(item?.status)}
                            numberOfLines={1}
                            fontWeight={"500"}
                            color={colors.darkGrey}
                            fontSize={hp(14)}
                            style={styles.text}
                        />
                    </View>
                    
                </View>
                
            </View>
            <TouchableOpacity onPress={onIconPress} style={globalStyles.Horizontalspacing}>
                <Entypo name={'dots-three-vertical'} size={hp(16)} style={{color: colors.darkGrey}} />
            </TouchableOpacity>

        </View>
    )
}

export default ProductCard


const styles = StyleSheet.create({
    image: {
        height: hp(50),
        width: hp(50),
        borderRadius: hp(5),
        marginRight: hp(10),
        marginLeft: hp(15)
    },
    cardContainer: {
        flexDirection: 'column',
        paddingVertical: hp(15),
        paddingHorizontal: hp(0),
        borderBottomWidth: 1,
        borderColor: colors.black
    },
    underline: {
        borderBottomWidth: 1, 
        borderBottomColor: colors.black,
        paddingVertical: hp(10)
    },
    text: {
        // marginTop: "-2%"
    },
    detContainer: {
        height: hp(45),
        width: hp(250),
        justifyContent: 'space-between'
    }
})