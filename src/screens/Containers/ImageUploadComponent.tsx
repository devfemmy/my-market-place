import { View, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { hp, wp } from '../../utils/helpers'
import { colors } from '../../utils/themes'
import { plus, upload } from '../../assets'
import AntDesign from 'react-native-vector-icons/AntDesign'

const ImageUploadComponent = ({ single, profileImageChange, imageLoader }: any) => {
    return (
        <View>
            {
                single ? <Pressable onPress={profileImageChange}>
                    <View style={styles.container}>
                        {
                            imageLoader ? <AntDesign name='loading1' color={'white'} /> :
                                <Image source={upload} style={styles.img} />
                        }
                    </View>
                </Pressable>
                    : <Pressable onPress={profileImageChange}>
                        <View style={styles.multContainer}>
                            {
                                imageLoader ? <AntDesign name='loading1' color={'white'} /> :
                                    <Image source={plus} style={styles.img} />
                            }
                        </View>
                    </Pressable>

            }
        </View>
    )
}

export default ImageUploadComponent

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: hp(200),
        backgroundColor: colors.artBoard,
        marginVertical: hp(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width: wp(30),
        height: hp(30)
    },
    multContainer: {
        width: wp(120),
        height: hp(120),
        backgroundColor: colors.artBoard,
        marginVertical: hp(10),
        justifyContent: 'center',
        alignItems: 'center'
    }
})