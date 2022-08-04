

import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { SafeAreaView, Text } from '../../components/common';
import { View, Image } from 'react-native';

import { Button } from '../../components/common/Button';
import { globalStyles } from '../../styles';

import { StoreSuccessScreenNavigationProp } from '../../navigations/types';
import { colors } from '../../utils/themes';
import { hp } from '../../utils/helpers';

import { SuccesssLogo } from '../../constants/images';
import { styles } from '../AuthStoreSuccessScreen/styles';
import { Nav } from '../../utils/types';
import { AuthContext } from '../../context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoreSuccessScreen = () => {
    const { navigate } = useNavigation<Nav>()
    const { signIn } = useContext(AuthContext)
    const [loader, setLoader] = useState(false)

    const handleClick = async () => {
        setLoader(true)
        const token = await AsyncStorage.getItem('token')
        setLoader(false)
        signIn(token)
    }
    
    return (
        <SafeAreaView>
            <View style={[styles.container, styles.width80]}>
                <Image
                    source={SuccesssLogo}
                    style={styles.logo}
                />
                <Text fontWeight="700" fontSize={hp(26)} text="Great! Store Created" />
                <Text
                    fontWeight="300"
                    fontSize={hp(15)}
                    lineHeight={hp(25)}
                    style={styles.sub}
                    color={colors.gray}
                    textAlign="center"
                    text="You’re almost there. Now let’s add other items to your store"
                />
            </View>
            <View style={[globalStyles.footer, styles.width100]}>
                <Button
                    title={'Continue'}
                    onPress={handleClick}
                />

            </View>
        </SafeAreaView>
    );
};

export default StoreSuccessScreen;
