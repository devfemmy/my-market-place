import React, {useEffect, useState} from "react"
import { View, Pressable, StyleSheet, Image } from "react-native"
import { colors } from "../../constants"
import { hp, wp } from "../../utils"
import { Text } from "../common"


interface IProp {
    header: string,
    title: string,
    type: string,
    selected: string,
    handleClick?: () => void
}


const WelcomeCard: React.FC<IProp> = ({header, title,selected, type, handleClick}) => {


    return (
        <Pressable onPress={handleClick}>
            <View style={selected === type ? styles.selected : styles.container}>
                <View style={styles.cardView}>
                    <Text text={header} fontSize={20} style={styles.header} />
                    <View style={selected !== type && styles.checkbox}>
                        {
                            selected === type && <Image source={require('../../assets/Checkbox.png')} style={styles.image} />
                        }
                    </View>
                </View>
                <Text text={title} fontSize={18} style={styles.title} />
            </View>
        </Pressable>

    )
}

export default WelcomeCard

const styles = StyleSheet.create({
    container: {
        padding: 10,
       // borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 10,
        marginVertical: 10,
        height: hp(150),
        backgroundColor: colors.darkBlack
    },
    image: {
        width: 20,
        height: 20,
    },
    selected: {
        borderColor: colors.bazaraTint,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
        height: hp(150),
        backgroundColor: colors.darkBlack
    },
    cardView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    header: {

    },
    title: {
        color: colors.gray,
        width: wp(284)
    },
    checkbox: {
        backgroundColor: colors.black,
        borderWidth: 1,
        borderColor: colors.gray,
        width: 20,
        height: 20,
        borderRadius: 50
    }
})