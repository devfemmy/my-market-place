import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { ListCardProps } from "../../interfaces"
import { Text } from '../common'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { globalStyles } from '../../styles'
import { colors } from '../../utils/themes'



const ListCard: React.FC<ListCardProps> = ({ title, icon, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.cardContainer}>
            <View style={[globalStyles.rowBetween]}>
                <View style={globalStyles.rowStart}>
                    <Image source={icon} style={styles.image} />
                    <Text text={title} fontSize={16} style={styles.text} />
                </View>
                <Ionicons
                    name={"chevron-forward-outline"}
                    size={20}
                    color={"grey"}
                />
            </View>

            <View style={styles.underline}>
            </View>
        </TouchableOpacity>
    )
}

export default ListCard


const styles = StyleSheet.create({
    image: {
        width: 25,
        height: 25,
        marginRight: 15,
    },
    cardContainer: {
        flexDirection: 'column',
        paddingVertical: 10,
    },
    underline: {
        borderBottomWidth: 0.4, 
        borderBottomColor: colors.gray,
        paddingVertical: 10
    },
    text: {
        color: colors.gray,
        marginTop: "-2%"
    }
})