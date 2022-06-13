import React, {memo, ComponentProps} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle, TextStyle} from 'react-native';

import {Checkbox as BaseCheckbox} from 'react-native-paper';
import {Text} from './Text';
import {globalStyles} from '../../styles/globalStyles';
import {hp} from '../../utils/helpers';
import {useSecureTextEntry} from '../../hooks';
import { colors } from "../../utils/themes/themes"

type CheckBoxProps = ComponentProps<typeof BaseCheckbox> & {
  label: string;
  status?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  handleChange: () => void;
};

export const CheckBox = memo(
  ({
    label,
    status = 'unchecked',
    containerStyle,
    style,
    labelStyle,
    handleChange,
    ...rest
  }: CheckBoxProps) => {
    return (
      <View style={[containerStyle, styles.containerStyle]}>
        <BaseCheckbox.Item
          label={label}
          color={colors.bazaraTint}
          uncheckedColor={colors.darkGrey}
          status={status}
          labelStyle={[styles.textStyle, labelStyle]}
          mode="android"
          style={style}
          onPress={handleChange}
          {...rest}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
    borderRadius: hp(15),
  },
  textStyle: {
    fontSize: hp(15),
    fontWeight: '400',
    color: colors.darkGrey
  },
  error: {
    paddingTop: hp(-8),
    color: 'tomato',
  },
  containerStyle: {
    marginBottom: hp(0),
    width: hp(370),
    alignSelf: 'center',
  },
  errorHold: {
    marginTop: hp(10),
  },
});
