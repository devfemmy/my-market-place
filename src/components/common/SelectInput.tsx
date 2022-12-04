import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import SelectDropdownWithSearch from 'react-native-select-dropdown-with-search'
import { hp } from '../../utils/helpers';
import { globalStyles } from '../../styles';
import { Text } from './Text';
import { colors } from '../../utils/themes';
import { useAppDispatch } from '../../redux/hooks'
//import {getStorePermission} from '../../redux/slices/StoreSlice'
import { getArchtype } from 'immer/dist/internal';
import SelectList from 'react-native-dropdown-select-list'
import { icons } from '../../utils/constants'


type IProp = {
  items: Array<any> | undefined,
  defaultValue: string,
  placeholder: string,
  errorMsg?: string,
  setState: (value: string) => void;
  roleSelector?: boolean,
};


export const Select = (props: IProp) => {
  const dispatch = useAppDispatch()
  const { items, setState, placeholder, defaultValue, errorMsg, roleSelector } = props;

  return (
    // <View style={[styles.containerStyle]}>
    //   <StatusBar translucent={false}/>
    //   <View style={styles.contain}>
    //     <View style={[{}, styles.input]}>
    //       <SelectDropdown
    //         defaultValue={defaultValue}
    //         data={items === undefined ? [] : items}
    //         onSelect={(selectedItem: string) => {
    //           setState(selectedItem);
    //           if(roleSelector){
    //            // dispatch(getStorePermission(selectedItem))
    //           }
    //         }}
    //         defaultButtonText={placeholder}
    //         buttonStyle={styles.input}
    //         buttonTextStyle={styles.inputText}
    //         dropdownStyle={styles.dropdownStyle}
    //         rowStyle={styles.rowStyle}
    //         rowTextStyle={styles.rowTextStyle}
    //         dropdownOverlayColor={'transparent'}
    //         buttonTextAfterSelection={(selectedItem: string) => {
    //           return selectedItem;
    //         }}
    //         rowTextForSelection={(item: string) => {
    //           return item;
    //         }}
    //         renderDropdownIcon={() => {
    //           return (
    //             <Ionicons name={'chevron-down-outline'} size={20} color={'white'} />
    //           );
    //         }}
    //       />
    //     </View>
    //   </View>

    //   {errorMsg !== undefined ? (
    //     <View style={[globalStyles.rowStart, styles.errorHold]}>
    //       <Text
    //         text={errorMsg}
    //         category="s1"
    //         fontSize={hp(12)}
    //         style={styles.error}
    //         textAlign="left"
    //       />
    //     </View>
    //   ) : null}
    // </View>
    <View style={{marginBottom: hp(15)}}>
      <SelectList
        placeholder={defaultValue ? defaultValue : placeholder}
        value={defaultValue}
        setSelected={setState}
        boxStyles={{ borderRadius: 5, height: hp(60), alignItems: 'center' }}
        inputStyles={{ color: 'white' }}
        dropdownTextStyles={{ color: 'white' }}
        arrowicon={<icons.Ionicons name="chevron-down" size={hp(12)} color="white" />}
        searchicon={<icons.Ionicons name="search" size={hp(12)} color="white" />}
        data={items}
        onSelect={() => console.log(defaultValue)} 
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
};

const styles = StyleSheet.create({
  contain: {
    width: "100%",
  },
  input: {
    flexDirection: 'row-reverse',
    backgroundColor: 'transparent',
    borderRadius: hp(7),
    width: '100%',
    borderColor: colors.artBoard,
    borderWidth: 0.4,
  },
  inputText: {
    color: 'white',
    textAlign: 'left',
    fontSize: hp(15),
  },
  textStyle: {
    fontSize: hp(15),
  },
  error: {
    paddingTop: hp(25),
    color: 'tomato',
  },
  dropdownStyle: {
    backgroundColor: colors.darkBlack,
    height: hp(200),
    borderBottomLeftRadius: hp(10),
    borderBottomRightRadius: hp(10),
    borderWidth: 1,
    borderColor: colors.gray,
  },
  rowStyle: {
    padding: 10,
  },
  rowTextStyle: {
    color: 'white',
    textAlign: 'left',
    fontSize: hp(15),
  },
  errorHold: {
    marginTop: hp(-15),
    marginBottom: hp(10)
  },
  containerStyle: {
    marginBottom: hp(20),
    width: '100%',
    alignSelf: 'center',
  },
});
