import React, {ComponentProps, memo, useMemo} from 'react';
import {Pressable, StyleProp, TextStyle} from 'react-native';

import {Text as BaseText} from '@ui-kitten/components';
import {hp} from '../../utils';
import {colors} from '../../constants';

type ButtonProps = ComponentProps<typeof BaseText> & {
  text: string;
  fontSize?: number;
  backgroundColor?: string;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  color?: string;
  padding?: number;
  lineHeight?: number;
  borderRadius?: number;
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

export const Button = memo(
  ({
    text,
    backgroundColor = colors.bazaraTint,
    fontSize = hp(15),
    lineHeight,
    onPress,
    textAlign = 'center',
    borderRadius = 10,
    color = colors.white,
    padding = 15,
    fontWeight = '400',
    style,
    ...rest
  }: ButtonProps) => {
    const propsStyle = useMemo(
      () => ({
        color,
        fontSize,
        textAlign,
        lineHeight,
        fontWeight,
        backgroundColor,
        padding,
        borderRadius,
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
