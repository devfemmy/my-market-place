import React, {ComponentProps, memo, useMemo} from 'react';
import {StyleProp, StyleSheet, ViewStyle, View, ViewBase} from 'react-native';

import {Text as BaseText} from '@ui-kitten/components';
import { hp } from '../../utils/helpers';
import { colors } from '../../utils/themes';

type SeparatorProps = ComponentProps<typeof ViewBase> & {
  text?: string;
  backgroundColor?: string;
  height?: string | number;
  width?: string | number;
  style?: StyleProp<ViewStyle>;
};

export const Separator = memo(
  ({
    text = 'OR',
    height = 1,
    width = '44%',
    backgroundColor = colors.gray,
    style,
  }: SeparatorProps) => {
    const lineStyle = useMemo(
      () => ({
        height,
        width,
        backgroundColor,
      }),
      [height, width, backgroundColor],
    );

    return (
      <View style={[styles.lineContainer]}>
        <View style={[lineStyle, style]} />
        <BaseText category="p2" style={styles.textStyle}>
          {text}
        </BaseText>
        <View style={[lineStyle, style]} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  lineContainer: {
    paddingHorizontal: '5%',
    marginVertical: hp(20),
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    marginHorizontal: 5,
    color: colors.gray,
  },
});
