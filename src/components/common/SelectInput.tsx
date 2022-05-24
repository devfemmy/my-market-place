import React, {ComponentProps} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import {hp} from '../../utils';
import {useSecureTextEntry} from '../../hooks';
import {colors} from '../../constants';

type SelectProps = ComponentProps<typeof SelectDropdown> & {
  errorMsg?: any;
  searchInput?: boolean;
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export const Select = (props: any) => {
  const {items, setState, placeholder} = props;

  return (
    <View style={[{marginBottom: hp(20)}, styles.input]}>
      <SelectDropdown
        data={items}
        onSelect={(selectedItem, index) => {
          setState(selectedItem);
        }}
        disabled={items?.length < 1}
        defaultButtonText={placeholder}
        buttonStyle={styles.input}
        buttonTextStyle={styles.inputText}
        dropdownStyle={{
          backgroundColor: 'grey',
        }}
        rowStyle={{
          padding: 10,
        }}
        rowTextStyle={{
          color: 'white',
          textAlign: 'left',
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        renderDropdownIcon={() => {
          return (
            <Ionicons name={'chevron-down-outline'} size={20} color={'white'} />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row-reverse',
    backgroundColor: 'transparent',
    borderRadius: hp(15),
    width: '100%',
    borderColor: 'grey',
    borderWidth: 1,
  },
  inputText: {
    color: 'white',
    textAlign: 'left',
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
