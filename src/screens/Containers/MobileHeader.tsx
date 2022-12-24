import { View, StyleSheet, Image, Pressable, Platform } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { hp, wp } from '../../utils/helpers'
import { Text } from '../../components/common'
import { cancel } from '../../assets'
import { styles } from '../auth/Login/styles'
import { NavigationContainer } from '@react-navigation/native'

const MobileHeader = ({props,categoryName, auth, cart, myCart, token}: any) => {


    return (
        <View style={[globalStyles.rowBetween, gbStyle.mdTop]}>
            {
                auth ? <Pressable  onPress={() => props?.navigate('HomeScreen')}><Image source={cancel} style={gbStyle.img}  /></Pressable> : <Ionicons
                name={'chevron-back-outline'}
                size={30}
                color={'white'}
                onPress={cart ? () => props?.goBack()  : myCart && token ? () => props.navigation.navigate('BuyerScreen', {screen: 'Home'}) : myCart && !token ? () => props.navigation.navigate('HomeScreen') : () => props?.navigation.goBack()}
            />
            }
            <Text style={{textTransform: 'capitalize'}} text={categoryName} fontSize={hp(18)} />
            <View />
        </View>
    )
}

export default MobileHeader

const gbStyle = StyleSheet.create({
    mdTop: {
        paddingVertical: hp(10),
        // backgroundColor: 'red',
        marginTop: Platform.OS === 'ios' ? hp(20) : 0,
    },
    img: {
        width: wp(25)
    }
});