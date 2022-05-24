import React, {ComponentProps, memo, useMemo} from 'react';
import {StyleProp, TextStyle, ViewStyle, View} from 'react-native';

import {Text as BaseText} from '@ui-kitten/components';
import {hp} from '../../utils';
import {colors} from '../../constants';

type SeparatorProps = ComponentProps<typeof BaseText> & {
  text?: string;
  color?: string;
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
};

export const Separator = memo(
  ({
    text = "OR",
    height = 1,
    width,
    color = colors.gray,
    style,
    ...rest
  }: SeparatorProps) => {
    const propsStyle = useMemo(
      () => ({
        text,
        height,
        width,
        color,
      }),
      [text, height, width, color],
    );

    return (
      <View style={{paddingHorizontal: "5%", marginBottom: hp(30), flexDirection: "row", alignSelf: "center", alignItems: "center"}}>
        <View
        style={{
            height: height,
            width: "44%",
            backgroundColor: color
        }}
        />
        <BaseText
        category="p2"
        style={{fontSize: 20, marginHorizontal: 5, color: colors.gray}}
        >
          {text}
        </BaseText>
        <View
        style={{
            height: height,
            width: "44%",
            backgroundColor: color
        }}
        />
      </View>
    );
  },
);
