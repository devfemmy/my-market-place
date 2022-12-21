import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Text } from '../../components/common'
import { truncate } from '../../utils/server'
import { hp, numberFormat, wp } from '../../utils/helpers'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

const MobileProductContainer = ({ data }: any) => {
    const navigation = useNavigation()

    return (
        <View>
            {
                data ? <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", {
                    params: { id: data?.slug }
                })}>
                    <View>
                        <View>
                            <Image style={styles.image} source={{ uri: data?.img_url?.length > 0 ? data?.img_url : "https://res.cloudinary.com/doouwbecx/image/upload/v1660556942/download_fcyeex.png" }} />
                            <Text text={truncate(data?.name, 15)} fontSize={hp(18)} />
                            <Text text={`₦${numberFormat(Number(data?.amount) || 0)}`} />
                        </View>
                    </View>
                </TouchableOpacity>
                    : null
            }

            
        </View>
    )
}

export default MobileProductContainer

const styles = StyleSheet.create({
    image: {
        width: wp(160),
        height: hp(180),
        borderRadius: 3,
    }
})