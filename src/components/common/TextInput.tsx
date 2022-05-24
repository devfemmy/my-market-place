import React, {memo, ComponentProps} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {TextInput as BaseInput} from 'react-native-paper';
import {Text} from './Text';
import {globalStyles} from '../../styles/globalStyles';
import {hp} from '../../utils';
import {useSecureTextEntry} from '../../hooks';
import {colors} from '../../constants';
import { ViewPager } from '@ui-kitten/components';

type InputProps = ComponentProps<typeof BaseInput> & {
  errorMsg?: any;
  label: string;
  isPassword?: boolean;
  searchInput?: boolean;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export const Input = memo(
  ({
    errorMsg,
    isPassword = false,
    containerStyle,
    placeholder,
    label,
    ...rest
  }: InputProps) => {
    const {secureTextEntry, toggleEntry} = useSecureTextEntry(isPassword);
    return (
      <View style={[{marginBottom: hp(20), width: "90%", alignSelf: "center"}, containerStyle]}>
        <BaseInput
          label={label}
          mode="outlined"
          placeholder={placeholder}
          placeholderTextColor={'#BABABA'}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          outlineColor={colors.gray}
          theme={{
            roundness: 7,

            colors: {
              primary: colors.bazaraTint,
              background: colors.primaryBg,
              text: colors.bazaraTint,
              placeholder: colors.gray,
            },
          }}
          right={
            isPassword ? (
              <BaseInput.Icon
                color={colors.white}
                onPress={toggleEntry}
                name={secureTextEntry ? 'eye-off' : 'eye'}
              />
            ) : null
          }
          {...rest}
        />
        {errorMsg !== undefined ? (
          <View style={globalStyles.rowStart}>
            {/* <Text
              text={errorMsg}
              category="s1"
              style={styles.error}
              textAlign="left"
            /> */}
          </View>
        ) : null}
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
  },
  error: {
    paddingTop: hp(-8),
    color: 'tomato',
  },
  containerStyle: {
    backgroundColor: 'yellow',
  },
});
