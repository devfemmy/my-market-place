import { Image, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles'
import { hp, numberFormat, wp } from '../../utils/helpers'
import { Text } from '../../components/common'
import { colors } from '../../utils/themes'
import { del, edits } from '../../assets'

const ProductVariantCard = ({ image, name, price, edit, handleDeleteClick, handleEditClick }: any) => {
    return (
        <View>
            <View style={globalStyles.rowStart}>
                <Image source={image} style={styles.img} />
                <View style={styles.div}>
                    <Text text={name} fontSize={hp(14)} fontWeight='400' />
                    <Text text={`₦ ${numberFormat(price)}`} fontSize={hp(12)} />

                </View>
                {
                    edit && <View style={styles.subdiv}>
                        <Pressable onPress={handleEditClick}>
                            <Image source={edits} />
                        </Pressable>

                        <Pressable onPress={handleDeleteClick}>
                             <Image source={del}  />
                        </Pressable>
                        
                       
                    </View>
                }
            </View>
            <View style={styles.br}></View>
        </View>
    )
}

export default ProductVariantCard

const styles = StyleSheet.create({
    img: {
        width: hp(40),
        height: hp(40)
    },
    div: {
        flex: 1,
        marginLeft: hp(10)
    },
    subdiv: {
        width: wp(60),
        justifyContent: 'space-around',
    },
    br: {
        background: colors.lightwhite,
        marginVertical: hp(10),
    }
})