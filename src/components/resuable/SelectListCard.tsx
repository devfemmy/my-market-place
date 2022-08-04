import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { ListCardProps } from "../../interfaces"
import { Text } from '../common'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { globalStyles } from '../../styles'
import { colors } from '../../utils/themes'
import { hp } from '../../utils/helpers'



const SelectListCard: React.FC<ListCardProps> = ({ title, icon, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
            <View style={[globalStyles.rowBetween]}>
                <View style={globalStyles.rowStart}>
                    {icon ? <Image source={icon} style={styles.image} /> : null}
                    <Text text={title} fontSize={16} style={styles.text} />
                </View>
                { icon ?
                    <Ionicons
                    name={"chevron-forward-outline"}
                    size={20}
                    color={"grey"}
                    /> : null
                }
            </View>

            <View style={styles.underline}>
            </View>
        </TouchableOpacity>
    )
}

export default SelectListCard


const styles = StyleSheet.create({
    image: {
        width: 25,
        height: 25,
        marginRight: 15,
    },
    cardContainer: {
        flexDirection: 'column',
        height: hp(65),
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    underline: {
        borderBottomWidth: 0.4, 
        borderBottomColor: colors.gray,
        paddingVertical: 10
    },
    text: {
        color: colors.white,
    }
})