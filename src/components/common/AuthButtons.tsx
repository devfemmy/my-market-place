import React, {memo, ComponentProps} from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import {Button as BaseButton} from '@ui-kitten/components';
import {Avatar} from '@ui-kitten/components';
import { hp } from '../../utils/helpers';
import { colors } from '../../utils/themes';


type ButtonProps = ComponentProps<typeof BaseButton> & {
  title: string;
  image?: ImageSourcePropType;
  isLoading?: boolean;
  loaderColor?: string;
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export const AuthButton = memo(
  ({
    title,
    image,
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
          size="large"
          accessoryLeft={() => <Avatar size="small" source={image} />}
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
    width: '45%',
    alignSelf: 'center',
  },
});
