import React, {memo, ComponentProps} from 'react';
import {StyleSheet, View, StyleProp, ViewStyle, ActivityIndicator} from 'react-native';
import {Button as BaseButton} from '@ui-kitten/components';
import { colors } from '../../utils/themes';
import { hp, wp } from '../../utils/helpers';
// import{ ButtonProps } from '../../utils/types'


export const Button = memo(
  ({
    title,
    isLoading = false,
    outlined,
    style,
    containerStyle,
    small,
    ...rest
  }: any) => {
    return (
      <View style={[small ? styles.container2 : styles.container, containerStyle]}>
        <BaseButton
          disabled={isLoading}
          status={outlined ? 'control' : 'primary'}
          size="medium"
          style={[styles.btn, style]}
          {...rest}>
          {isLoading ? <ActivityIndicator color={"white"} size={"small"}/> : title}
        </BaseButton>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  btn: {
    borderRadius: hp(10),
    height: wp(50),
    backgroundColor: colors.bazaraTint,
    borderWidth: 0,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  container2: {
    alignSelf: 'center',
  },
});
