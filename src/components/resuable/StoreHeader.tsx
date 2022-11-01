import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView, Text } from "../common"
import { globalStyles } from '../../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { storeImage, checkbox } from "../../assets"
import { colors } from '../../utils/themes'
import { StoreHeaderProps } from '../../interfaces'
import { hp } from '../../utils/helpers'
import { Nav } from '../../utils/types'
import { copyToClipboard } from '../../utils/functions'


const StoreHeader:React.FC<StoreHeaderProps> = ({name, slug}) => {
    const  { navigate } = useNavigation<Nav>();

    const link = `https://bazara.co/store/${slug}`
    return (
            <View style={[globalStyles.container, globalStyles.rowBetween, styles.comp]}>
                <View style={styles.container}>
                    <View style={styles.imageCard}>
                        <Image source={storeImage} style={styles.imageContainer} />
                    </View>
                    <View style={styles.textCard}>
                        <Text text={name} fontSize={hp(14)} style={{textTransform: 'capitalize'}} />
                        <View style={styles.copyCard}>
                        <TouchableOpacity onPress={() => copyToClipboard(link)}>
                            <Ionicons
                                name={"copy-outline"}
                                size={hp(15)}
                                color={'white'}
                            />
                             </TouchableOpacity>
                            <Text text="Copy store link" fontSize={hp(12)} fontWeight='600' style={styles.div} />
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigate('NotificationScreen')} style={styles.iconCard}>
                    <Ionicons
                        name={'notifications-outline'}
                        size={25}
                        color={'white'}
                    />
                </TouchableOpacity>
            </View>
    )
}

export default StoreHeader


const styles = StyleSheet.create({
    comp: {
        paddingTop: hp(15),
    },
    container: {
        flexDirection: 'row'
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: colors.black

    },
    imageContainer: {
        width: 25,
        height: 25
    },
    textCard: {
        marginLeft: 10,
    },
    copyCard: {
        flexDirection: 'row',
        backgroundColor: colors.black,
        padding: 5,
        marginTop: 3,
        borderRadius: 5,
        width: 110,
    },
    iconCard: {
        height: '100%',
        marginTop: 5
    },
    div: {
        marginLeft: 5
    }
})