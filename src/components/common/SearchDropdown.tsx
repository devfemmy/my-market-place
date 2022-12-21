import React, {useState, useEffect} from 'react';
import { StyleSheet, View, StatusBar, FlatList, TouchableOpacity } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import SelectDropdownWithSearch from 'react-native-select-dropdown-with-search'
import { Input } from './TextInput';
import { hp } from '../../utils/helpers';
import { globalStyles } from '../../styles';
import { Text } from './Text';
import { colors } from '../../utils/themes';
import { useAppDispatch } from '../../redux/hooks'
import {getStorePermission} from '../../redux/slices/StoreSlice'
import { getArchtype } from 'immer/dist/internal';


type IProp = {
  items: Array<string> | undefined,
  defaultValue: string,
  placeholder: string,
  errorMsg?: string,
  setState: (value: string) => void;
  roleSelector?: boolean
};




export const SearchDropdown = (props: IProp) => {
  const dispatch = useAppDispatch()
  const { items, setState, placeholder, defaultValue, errorMsg, roleSelector } = props;
  const [raw, setRaw] = useState([])
  const [DATA, setDATA] = useState([])
  const [typable, setTypable] = useState(false)
  const [borderColor, setBorderColor] = useState(colors.gray)
  const [borderWidth, setBorderWidth] = useState(hp(1))

  const [text, setText] = useState(defaultValue)

  useEffect(() => {
    processData()
  }, [])

  const processData = () => {
    const newArr: Array<string> = []
    items?.map((val) => {
        if(!newArr?.includes(val) && val){
            newArr.push(val)
        }
    })
    setRaw(newArr)
    setDATA(newArr)
  }

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => itemSelect(item)} activeOpacity={0.6} style={[styles.itemStyle, , {borderColor: borderColor}]}>
        <Text
        text={item}
        />
    </TouchableOpacity>
  )

  const itemSelect = (item: string) => {
    setState(item)
    setText(item)
    setTypable(false)
  }

  const filterSearch = (query: string) => {
    const newArr = raw?.filter((val) => {
        if(val?.toLowerCase()?.startsWith(query?.toLowerCase())){
            return val
        }
    })
    setDATA(newArr)
  }

  return (
    <View style={{zIndex: 1000}}>
      <View>
        <Input
            label={placeholder}
            value={text}
            // containerStyle={{marginBottom: 0}}
            editable={typable}
            onChangeText={(text) => {setText(text); filterSearch(text)}}
            onPressIn={() => setTypable(true)}
            onFocus={() => {setBorderColor(colors.bazaraTint); setBorderWidth(hp(2))}}
            onBlur={() => {setBorderColor(colors.gray); setBorderWidth(hp(1))}}
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
        {typable ? <View 
        style={[styles.containerStyle, 
        {   borderColor: borderColor,
            borderRightWidth: borderWidth,
            borderLeftWidth: borderWidth,
            borderBottomWidth: borderWidth,
        }]}>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item}
            />
        </View> : null}
        
      </View>

      
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
    borderColor: colors.darkGrey,
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
    marginTop: hp(-35),
    marginBottom: hp(10),
    width: '90%',
    alignSelf: 'center'
  },
  containerStyle: {
    width: '90%',
    alignSelf: 'center',
    maxHeight: hp(150),
    borderBottomRightRadius: hp(10),
    borderBottomLeftRadius: hp(10),
    overflow: 'hidden',
    position: 'absolute',
    zIndex:1000,
    backgroundColor: colors.primaryBg,
    top: hp(55)
  },
  itemStyle: {
    padding: hp(15),
    borderBottomWidth: 1
  }
});
