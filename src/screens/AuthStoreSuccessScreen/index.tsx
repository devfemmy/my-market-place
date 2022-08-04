

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text } from '../../components/common';
import { View, Image } from 'react-native';

import { Button } from '../../components/common/Button';
import { globalStyles } from '../../styles';

import { StoreSuccessScreenNavigationProp } from '../../navigations/types';
import { colors } from '../../utils/themes';
import { hp } from '../../utils/helpers';
import { styles } from './styles';
import { correctLogo } from '../../assets';
import { SuccesssLogo } from '../../constants/images';

const AuthStoreSuccessScreen = () => {
    const navigation = useNavigation<StoreSuccessScreenNavigationProp>();
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
                    onPress={() => navigation.navigate('Store')}
                />

            </View>
        </SafeAreaView>
    );
};

export default AuthStoreSuccessScreen;
