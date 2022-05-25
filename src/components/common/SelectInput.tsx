import React from 'react';
import { StyleSheet, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import {hp} from '../../utils/helpers';





type IProp = {
  items: Array<string> | undefined,
  defaultValue: string,
  placeholder: string
  setState: (value: string) => void;
};


export const Select = (props: IProp) => {
  const {items, setState, placeholder, defaultValue} = props;

  return (
    <View style={[{marginBottom: hp(20)}, styles.input]}>
      <SelectDropdown
        defaultValue={defaultValue}
        data={items === undefined ? [] : items}
        onSelect={(selectedItem: string) => {
          setState(selectedItem);
        }}
        defaultButtonText={placeholder}
        buttonStyle={styles.input}
        buttonTextStyle={styles.inputText}
        dropdownStyle={styles.dropdownStyle}
        rowStyle={styles.rowStyle}
        rowTextStyle={styles.rowTextStyle}
        buttonTextAfterSelection={(selectedItem: string) => {
          return selectedItem;
        }}
        rowTextForSelection={(item: string) => {
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
  dropdownStyle: {
    backgroundColor: 'grey',
  },
  rowStyle: {
    padding: 10,
  },
  rowTextStyle:{
    color: 'white',
    textAlign: 'left',
  }
});
