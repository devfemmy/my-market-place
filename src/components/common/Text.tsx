import React, {ComponentProps, memo, useMemo} from 'react';
import {StyleProp, TextStyle} from 'react-native';

import {Text as BaseText} from '@ui-kitten/components';
import {hp} from '../../utils';
import {colors} from '../../constants';

type TextProps = ComponentProps<typeof BaseText> & {
  text: string;
  fontSize?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  color?: string;
  lineHeight?: number;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  style?: StyleProp<TextStyle>;
};

export const Text = memo(
  ({
    text,
    fontSize = hp(15),
    lineHeight,
    onPress,
    textAlign,
    color = colors.white,
    fontWeight = '400',
    style,
    ...rest
  }: TextProps) => {
    const propsStyle = useMemo(
      () => ({
        color,
        fontSize,
        textAlign,
        lineHeight,
        fontWeight,
      }),
      [color, textAlign, fontWeight, lineHeight, fontSize],
    );

    return (
      <BaseText
        onPress={onPress}
        category="p1"
        style={[propsStyle, style]}
        {...rest}>
        {text}
      </BaseText>
    );
  },
);
