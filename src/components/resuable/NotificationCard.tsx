import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, {useRef} from 'react'
import { OrderCardProps } from "../../interfaces"
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../utils/types';
import { Text } from '../common'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import { globalStyles } from '../../styles'
import { colors } from '../../utils/themes'
import { hp } from '../../utils/helpers'
import { currencyFormat, statusColor, firstLetterUppercase, copyToClipboard } from '../../utils/functions'
import {Modalize} from 'react-native-modalize';

const NotificationCard: React.FC<OrderCardProps> = ({item }) => {

    const navigation = useNavigation<Nav>();
    if(item == null){
        return null
    }


    return (
        <View style={[styles.cardContainer, globalStyles.rowStart]}>
            <View style={[globalStyles.rowStart]}>

                <TouchableOpacity style={globalStyles.rowStartNoOverflow}>
                    <Image source={item?.image} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.detContainer}>
                    <Text text={item?.title} numberOfLines={1} fontWeight={"600"} fontSize={hp(15)} style={styles.text} />
                    <View style={globalStyles.rowStart}>
                        <Text
                            text={(item?.time)}
                            numberOfLines={1}
                            fontWeight={"500"}
                            color={colors.darkGrey}
                            fontSize={hp(12)}
                            style={styles.text}
                        />
                    </View>
                    
                </View>
                
            </View>
            <TouchableOpacity style={[globalStyles.rowStart]}>
                <Text
                    text={'View'}
                    numberOfLines={1}
                    fontWeight={"500"}
                    color={'#fff'}
                    fontSize={hp(14)}
                    style={styles.text}
                />
                <Feather name={'arrow-right'} size={hp(20)} style={[globalStyles.Horizontalspacing, {color: '#fff'}]} />
            </TouchableOpacity>

        </View>
    )
}

export default NotificationCard


const styles = StyleSheet.create({
    image: {
        height: hp(25),
        width: hp(25),
        marginRight: hp(15),
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