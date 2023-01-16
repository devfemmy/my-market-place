/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { hp, wp} from '../../utils/helpers';
import { colors } from '../../utils/themes';
import { Text } from '../common';
import {Input} from '../common/TextInput';


const SearchComponent = ({searchValue, setSearchValue, submitKeyMessage, submitSearch}: any) => {
  return (
    <View style={styles.view}>
      <View style={styles.div2}>
        <View style={styles.input}>
        <Input
          searchInput
          label={'Search for products'}
          value={searchValue}
          onChangeText={e => setSearchValue(e)}
          onKeyPress={e => submitKeyMessage(e)}
        />
        </View>
        <View style={styles.box}>
        <Pressable onPress={() => submitSearch()}>
        <EvilIcons name='search' size={20} color="white" />
        </Pressable> 
        </View>
      </View>
    </View>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '98%',
    paddingHorizontal: '2%',
  },
  input: {
    width: '80%',
    marginRight: "1%"

  },
  div2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    width: "15%",
    padding: hp(20),
    backgroundColor: colors.bazaraTint,
    marginTop: hp(-10),
    borderRadius: hp(10)
  },
});
