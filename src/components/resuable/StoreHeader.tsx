import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView, Text } from "../common"
import { globalStyles } from '../../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { storeImage, checkbox } from "../../assets"
import { globalTheme } from '../../utils/themes'



const StoreHeader = () => {
    return (
        <SafeAreaView>
            <View style={[globalStyles.container, globalStyles.rowBetween, styles.comp]}>
                <View style={styles.container}>
                    <View style={styles.imageCard}>
                        <Image source={storeImage} style={styles.imageContainer} />
                    </View>
                    <View style={styles.textCard}>
                        <Text text="Justbubu Store" fontSize={18} />
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
                <Ionicons
                    name={'notifications-outline'}
                    size={30}
                    color={'white'}
                />
            </View>
        </SafeAreaView>
    )
}

export default StoreHeader


const styles = StyleSheet.create({
    comp: {
        paddingTop: 10,
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
        backgroundColor: globalTheme.darkBlack

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
        backgroundColor: globalTheme.black,
        padding: 5,
        marginTop: 3
    }
})