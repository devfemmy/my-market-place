import React, {memo} from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {Button as BaseButton} from '@ui-kitten/components';
import {Avatar} from '@ui-kitten/components';
import { hp } from '../../utils/helpers';
import { colors } from '../../utils/themes';
import { AuthButtonProps } from '../../utils/types';
import FastImage from 'react-native-fast-image'


export const AuthButton = memo(
  ({
    title,
    image,
    isLoading = false,
    outlined,
    style,
    containerStyle,
    ...rest
  }: AuthButtonProps) => {
    return (
      <View style={[containerStyle, styles.container]}>
        <BaseButton
          disabled={isLoading}
          status={outlined ? 'control' : 'primary'}
          size="medium"
          accessoryLeft={() => <FastImage style={{ width: hp(30), height: hp(30) }} source={image} resizeMode={FastImage.resizeMode.contain} />}
          style={[styles.btn, style]}
          {...rest}>
          {title}
        </BaseButton>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  btn: {
    borderRadius: hp(8),
    height: hp(50),
    backgroundColor: colors.light_gray,
    borderWidth: 0,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
  },
});
