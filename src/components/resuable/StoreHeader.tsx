import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView, Text } from "../common"
import { globalStyles } from '../../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { storeImage, checkbox } from "../../assets"
import { colors } from '../../utils/themes'
import { StoreHeaderProps } from '../../interfaces'



const StoreHeader:React.FC<StoreHeaderProps> = ({name}) => {
    return (
            <View style={[globalStyles.container, globalStyles.rowBetween, styles.comp]}>
                <View style={styles.container}>
                    <View style={styles.imageCard}>
                        <Image source={storeImage} style={styles.imageContainer} />
                    </View>
                    <View style={styles.textCard}>
                        <Text text={name} fontSize={18} />
                        <View style={styles.copyCard}>
                            <Ionicons
                                name={"copy-outline"}
                                size={15}
                                color={'white'}
                            />
                            <Text text="Copy store link" />
                        </View>
                    </View>
                </View>
                <View style={styles.iconCard}>
                    <Ionicons
                        name={'notifications-outline'}
                        size={20}
                        color={'white'}
                    />
                </View>
            </View>
    )
}

export default StoreHeader


const styles = StyleSheet.create({
    comp: {
        paddingTop: 15,
    },
    container: {
        flexDirection: 'row'
    },
    imageCard: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 50,
        height: 50,
        backgroundColor: colors.darkBlack

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
    },
    iconCard: {
        height: '100%',
        marginTop: 5
    }
})