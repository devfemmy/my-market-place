import React, {memo, ComponentProps, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle, TextStyle} from 'react-native';

import {Checkbox as BaseCheckbox} from 'react-native-paper';
import {Text} from './Text';
import {globalStyles} from '../../styles/globalStyles';
import {hp} from '../../utils/helpers';
import {useSecureTextEntry} from '../../hooks';
import { colors } from "../../utils/themes/themes"
import DropDown from "react-native-paper-dropdown";

type DropDownProps = ComponentProps<typeof DropDown> & {
  label: string;
  list: Array<[]>;
  visible?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  dropDownStyle?: StyleProp<ViewStyle>;
  dropDownItemSelectedStyle?: StyleProp<ViewStyle>;
  dropDownItemStyle?: StyleProp<ViewStyle>;
  dropDownItemSelectedTextStyle?: StyleProp<TextStyle>;
  dropDownItemTextStyle?: StyleProp<TextStyle>;
};

export const DropDownPicker = memo(
  ({
    label,
    visible = false,
    containerStyle,
    dropDownStyle,
    dropDownItemSelectedStyle,
    dropDownItemStyle,
    dropDownItemSelectedTextStyle,
    dropDownItemTextStyle,
    ...rest
  }: DropDownProps) => {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState("");
    return (
      <View style={[containerStyle, styles.containerStyle]}>
        <DropDown
          label={label}
          mode={"outlined"}
          value={value}
          setValue={setValue}
          dropDownStyle={[dropDownStyle, styles.dropDown]}
          {...rest}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: 'red'
  }
});
