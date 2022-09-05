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

const StaffCard: React.FC<OrderCardProps> = ({ item }) => {

    const navigation = useNavigation<Nav>();

    if(item == null){
        return null
    }

    const statusBackColor = () => {
        if(item?.role?.role?.toLowerCase() == 'owner'){
            return '#11222E'
        }
        else if(item?.role?.role?.toLowerCase() == 'manager'){
            return '#27251E'
        }
        else if(item?.role?.role?.toLowerCase() == 'admin'){
            return '#29001A'
        }
        else {
            return '#1B1631'
        }
    }

    const statusTextColor = () => {
        if(item?.role?.role?.toLowerCase() == 'owner'){
            return '#5CBEFF'
        }
        else if(item?.role?.role?.toLowerCase() == 'manager'){
            return '#FEE6AA'
        }
        else if(item?.role?.role?.toLowerCase() == 'admin'){
            return '#F20083'
        }
        else {
            return '#BAAAFF'
        }
    }

    return (
        <View style={[styles.cardContainer, globalStyles.rowBetween]}>
            <View style={styles.detContainer}>
                <Text 
                    text={`${firstLetterUppercase(item?.user?.first_name)} ${firstLetterUppercase(item?.user?.last_name)}`} 
                    numberOfLines={1} 
                    fontWeight={"400"} 
                    fontSize={hp(17)} 
                    style={styles.text}
                />
                <Text
                    text={item?.user?.email}
                    numberOfLines={1}
                    fontWeight={"500"}
                    color={colors.darkGrey}
                    fontSize={hp(14)}
                    style={styles.text}
                />
            </View>
            <View style={[styles.status, {backgroundColor: statusBackColor()}]}>
                <Text
                    text={item?.role?.role}
                    numberOfLines={1}
                    fontWeight={"500"}
                    color={statusTextColor()}
                    fontSize={hp(12)}
                    style={styles.text}
                />
            </View>
        </View>
    )
}

export default StaffCard


const styles = StyleSheet.create({
    image: {
        height: hp(50),
        width: hp(50),
        borderRadius: hp(5),
        marginRight: hp(10),
    },
    cardContainer: {
        flexDirection: 'column',
        paddingVertical: hp(15),
        borderBottomWidth: 1,
        borderColor: colors.black,
        paddingHorizontal: hp(15)
    },
    underline: {
        borderBottomWidth: 1, 
        borderBottomColor: colors.black,
        paddingVertical: hp(10)
    },
    status: {
        padding: hp(8),
        borderRadius: hp(5)
    },
    detContainer: {
        height: hp(45),
        width: hp(250),
        justifyContent: 'space-between'
    }
})