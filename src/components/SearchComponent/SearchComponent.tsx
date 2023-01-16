/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Input} from '../common/TextInput';


const SearchComponent = ({searchValue, setSearchValue, submitKeyMessage}: any) => {
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
    width: '100%',
  },
  div2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
