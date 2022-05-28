
import React from 'react'
import { StatusBar, View, StyleSheet, Image } from 'react-native';
import { correctLogo } from '../../assets';

import { SafeAreaView, Text } from '../../components/common';
import { Button } from '../../components/common/Button';
import { globalStyles } from "../../styles/globalStyles"
import { hp, wp } from '../../utils/helpers';
import { colors } from '../../utils/themes';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../utils/types';


const StoreSuccessScreen = () => {
    const  { navigate } = useNavigation<Nav>()

    return (
        <SafeAreaView>
            <StatusBar translucent={true} backgroundColor={'white'} />
            <View style={[globalStyles.rowCenter, styles.columnDisplay]}>
                <Image
                    source={correctLogo}
                    style={styles.image}
                />
                <Text text="Great! Store Created" fontSize={22} style={styles.header} />
                <Text text="You’re almost there. Now let’s add other items to your store" fontSize={14} style={styles.text} />
            </View>
            <View style={globalStyles.footer}>
                <View style={globalStyles.rowCenter}>
                    <Button title={'Continue'} style={styles.btn} onPress={() => navigate("Store")} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default StoreSuccessScreen

const styles = StyleSheet.create({
    containerView: {
        marginTop: 30,
        flexDirection: 'column',
        flex: 1,
        height: hp(700),
    },
    image: {
        width: wp(200),
        height: hp(150),
    },
    div: {
        flexDirection: 'column',
        flex: 8,
        marginTop: 10,
    },
    text: {
        lineHeight: 20,
        color: colors.darkGrey,
        textAlign: 'center',
        width: '80%',
    },
    btn: {
        marginTop: 20,
        flex: 1,
    },
    columnDisplay: {
        flexDirection: 'column',
        height: '80%'
    },
    header: {
        fontWeight: 'bold'
    }
});
