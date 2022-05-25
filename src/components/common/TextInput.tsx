import React, {memo, ComponentProps} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {TextInput as BaseInput} from 'react-native-paper';
import {Text} from './Text';
import {globalStyles} from '../../styles/globalStyles';
import {hp} from '../../utils/helpers';
import {useSecureTextEntry} from '../../hooks';
import { globalTheme } from "../../utils/themes/themes"

type InputProps = ComponentProps<typeof BaseInput> & {
  errorMsg?: string;
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
      <View style={[containerStyle, styles.containerStyle]}>
        <BaseInput
          label={label}
          mode="outlined"
          placeholder={placeholder}
          placeholderTextColor={globalTheme.white}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          outlineColor={globalTheme.gray}
          theme={{
            roundness: 7,

            colors: {
              primary: globalTheme.bazaraTint,
              background: globalTheme.primaryBg,
              text: globalTheme.bazaraTint,
              placeholder: globalTheme.gray,
            },
          }}
          right={
            isPassword ? (
              <BaseInput.Icon
                color={globalTheme.white}
                onPress={toggleEntry}
                name={secureTextEntry ? 'eye-off' : 'eye'}
              />
            ) : null
          }
          {...rest}
        />
        {errorMsg !== undefined ? (
          <View style={[globalStyles.rowStart, styles.errorHold]}>
            <Text
              text={errorMsg}
              category="s1"
              fontSize={hp(12)}
              style={styles.error}
              textAlign="left"
            />
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
    marginBottom: hp(20),
    width: '90%',
    alignSelf: 'center',
  },
  errorHold: {
    marginTop: hp(10),
  },
});
