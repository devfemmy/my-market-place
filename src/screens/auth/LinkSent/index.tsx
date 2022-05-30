import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, Text} from '../../../components/common';
import {View, Image} from 'react-native';
import {styles} from './styles';
import {Button} from '../../../components/common/Button';
import {globalStyles} from '../../../styles';

import {LinkSentScreenNavigationProp} from '../../../navigations/types';
import { colors } from '../../../utils/themes';
import { hp } from '../../../utils/helpers';
import LinkLogo from '../../../constants/images';

const LinkSent = () => {
  const navigation = useNavigation<LinkSentScreenNavigationProp>();
  return (
    <SafeAreaView>
      <View style={[styles.container, styles.width80]}>
        <Image
          style={styles.logo}
          source={LinkLogo}
        />
        <Text fontWeight="400" fontSize={hp(26)} text="Check your email" />
        <Text
          fontWeight="300"
          fontSize={hp(15)}
          lineHeight={hp(25)}
          style={styles.sub}
          textAlign="center"
          text="We have sent a password recovery instruction to your email"
        />
        <View style={[globalStyles.rowCenter, styles.btnContainer]}>
          <Button
            title={'Return to sign in'}
            onPress={() => navigation.replace('Login')}
          />
        </View>
      </View>
      <View style={[globalStyles.footer, styles.width100]}>
        <Text
          fontWeight="300"
          fontSize={hp(15)}
          // lineHeight={hp(25)}
          style={styles.sub}
          textAlign="center"
          text="Did not receive the email? Check your"
        />
        <View style={[globalStyles.rowCenter, styles.textBtm]}>
          <Text
            fontWeight="300"
            fontSize={hp(15)}
            lineHeight={hp(25)}
            style={styles.sub}
            textAlign="center"
            text="spam folder or "
          />
          <Text
            fontWeight="400"
            onPress={() => navigation.goBack()}
            color={colors.bazaraTint}
            fontSize={hp(16)}
            lineHeight={hp(25)}
            style={styles.sub}
            textAlign="left"
            text=" Resend Link"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LinkSent;
