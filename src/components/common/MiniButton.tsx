import React, {memo, ComponentProps} from 'react';
import {StyleSheet, View, StyleProp, ViewStyle, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Button as BaseButton, Icon} from '@ui-kitten/components';
import { colors } from '../../utils/themes';
import { hp, wp } from '../../utils/helpers';
import{ MiniButtonProps } from '../../utils/types'
import AntDesign from 'react-native-vector-icons/AntDesign'

export const MiniButton = memo(
  ({
    icon,
    iconColor = colors.white,
    iconSize = hp(25),
    isLoading = false,
    outlined,
    style,
    containerStyle,
    ...rest
  }: MiniButtonProps) => {
    return (
      <View style={[containerStyle, styles.container]}>
        <TouchableOpacity
          disabled={isLoading}
          style={[styles.btn, style]}
          {...rest}>
              <AntDesign name={icon} size={iconSize} style={{color: iconColor}} />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  btn: {
    borderRadius: hp(10),
    height: wp(55),
    width: wp(55),
    backgroundColor: colors.primaryBg,
    borderWidth: 1,
    borderColor: colors.darkGrey,
    marginLeft: hp(5),
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    // width: '90%',
    alignSelf: 'center',
    marginBottom: hp(14),
    // marginLeft: hp(5)
  },
});
