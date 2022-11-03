import { View, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { colors } from '../../utils/themes'
import { hp, wp } from '../../utils/helpers'
import { plus } from '../../assets'

const ButtonPlus = ({ handleClick }: any) => {
    return (
        <Pressable onPress={handleClick}>
            <View style={styles.div} >
                <Image
                    source={plus}
                    style={styles.img}
                />
            </View>
        </Pressable>
    )
}

export default ButtonPlus

const styles = StyleSheet.create({
    div: {
        backgroundColor: colors.bazaraTint,
        width: wp(50),
        height: hp(50),
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: hp(490),
        right: 0,
        zIndex: 3,
        elevation: 3
    },
    img: {
        width: wp(30),
        height: hp(30)
    }
})