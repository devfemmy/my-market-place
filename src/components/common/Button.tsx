import React, {memo, ComponentProps} from 'react';
import {StyleSheet, View, StyleProp, ViewStyle, ActivityIndicator} from 'react-native';
import {Button as BaseButton} from '@ui-kitten/components';
import { colors } from '../../utils/themes';
import { hp } from '../../utils/helpers';

type ButtonProps = ComponentProps<typeof BaseButton> & {
  title: string;
  isLoading?: boolean;
  loaderColor?: string;
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export const Button = memo(
  ({
    title,
    isLoading = false,
    outlined,
    style,
    containerStyle,
    ...rest
  }: ButtonProps) => {
    return (
      <View style={[containerStyle, styles.container]}>
        <BaseButton
          disabled={isLoading}
          status={outlined ? 'control' : 'primary'}
          size="medium"
          style={[styles.btn, style]}
          {...rest}>
          {isLoading ? <ActivityIndicator size={"small"}/> : title}
        </BaseButton>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  btn: {
    borderRadius: hp(10),
    height: hp(50),
    backgroundColor: colors.bazaraTint,
    borderWidth: 0,
  },
  container: {
    width: '90%',
    alignSelf: 'center',
  },
});
