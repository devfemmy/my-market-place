import { Image, Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from './common'
import { hp, numberFormat, wp } from '../utils/helpers'
import { colors } from '../utils/themes'
import { useNavigation } from '@react-navigation/native'
import { truncate } from '../utils/server'

const Search = ({ data, image, name, amount, slug, mini }: any) => {
    const navigation = useNavigation()
    return (
        <View>
            <Pressable onPress={() => navigation.navigate('Product', {
                params: {
                    id: slug
                }
            })}>
                <Image source={{uri: image}} style={styles.img} />
                <Text text={truncate(name, 16)} />
                <Text
                    text={`₦${numberFormat(Number(amount) || 0)}`}
                    fontSize={hp(18)}
                    color={colors.accent}
                    numberOfLines={1}
                    fontWeight={'600'}
                    style={{ marginTop: hp(5) }}
                />
            </Pressable>
        </View>
    )
}

export default Search


const styles = StyleSheet.create({
    img: {
        width: wp(150),
        height: hp(150)
    }
})