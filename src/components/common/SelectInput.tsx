import React from 'react';
import { StyleSheet, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import { hp } from '../../utils/helpers';
import { globalStyles } from '../../styles';
import { Text } from './Text';





type IProp = {
  items: Array<string> | undefined,
  defaultValue: string,
  placeholder: string,
  errorMsg?: string,
  setState: (value: string) => void;
};


export const Select = (props: IProp) => {
  const { items, setState, placeholder, defaultValue, errorMsg } = props;

  return (
    <View style={[styles.containerStyle]}>
      <View style={styles.contain}>
        <View style={[{ marginBottom: hp(20) }, styles.input]}>
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
      </View>

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
};

const styles = StyleSheet.create({
  contain: {
    width: "100%",
  },
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
  dropdownStyle: {
    backgroundColor: 'grey',
  },
  rowStyle: {
    padding: 10,
  },
  rowTextStyle: {
    color: 'white',
    textAlign: 'left',
  },
  errorHold: {
    marginTop: hp(-15),
    marginBottom: hp(10)
  },
});
