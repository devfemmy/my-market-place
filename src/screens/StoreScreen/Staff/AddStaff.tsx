import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView, Text } from '../../../components/common';
import { colors } from '../../../utils/themes';
import { globalStyles } from "../../../styles/globalStyles"
import { hp } from '../../../utils/helpers';
import StoreHeader from '../../../components/resuable/StoreHeader';
import ScrollCard from '../../../components/resuable/ScrollCard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {colorCart, universityLogo, truckLogo, usersLogo, productLogo} from "../../../assets"
import ListCard from '../../../components/resuable/ListCard';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { getPersonalStore, myStore, assignUser } from '../../../redux/slices/StoreSlice';
import { ArrayType } from '../../../utils/types';
import { Input } from '../../../components/common/TextInput';
import { Button } from '../../../components/common/Button';
import { Select } from '../../../components/common/SelectInput';
import { useFormik } from 'formik';
import { StaffFormData, AssignUserFormData } from '../../../utils/types';
import { StaffFormDataSchema } from '../../../utils/constants';
import { getStorePermission, permission} from '../../../redux/slices/StoreSlice';
import CustomSlideModal from '../../../components/common/CustomSlideModal';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { sendPost } from '../../../utils/server';
export const AddStaffScreen = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation<Nav>();
  const [complete, setComplete] = useState(false)
  const permissionList = useAppSelector(permission)
  const mystore = useAppSelector(myStore)

//   useEffect(() => {
//     dispatch(getPersonalStore())
// }, [])

  const initialValues: StaffFormData = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  };

  const { values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue } =
  useFormik({
      initialValues,
      validationSchema: StaffFormDataSchema,
      onSubmit: (val: StaffFormData) => {
        assignRole(val)
      },
  });

  const getRoleKey = (item: string) => {
    if(item = 'Store Owner'){
      return 'owner'
    }
    else if(item == 'Store Manager'){
      return 'manager'
    }else{
      return 'attendant'
    }
  }

  const assignRole = async (data: {firstName: string, lastName: string, email: string, role: string}) => {
    const payload:  AssignUserFormData = {
      role: getRoleKey(data?.role),
      userEmail: data?.email,
      storeId: mystore[0]._id
    }
    console.log(payload)
    try {
      const response = await sendPost("/sidehustle/addUserToStore", payload, 'v2')
      console.log(response?.status)
      setComplete(true)
    } catch (error) {
      console.log(error?.data)
    }
  }

  const permissions = ['View Store Details', 'View Store Analysis', 'Manage Store Locations', 'Manage shipping fee']

  const rolepermissions = (item: {value: string, bool: boolean}) => {
    return (
      <View style={[globalStyles.rowStart, globalStyles.lowerContainer]}>
        <Ionicons name={'checkmark-done'} size={20} color={item.bool ? colors.completed : colors.cancelled} />
        <Text style={{marginLeft: hp(10)}} color={colors.white} fontWeight="500" fontSize={hp(15)} text={item?.value} />
      </View>
    )
  }

  const storeRoles = ['Store Owner', 'Store Manager', 'Store Attendant']

  return (
    <SafeAreaView>
      <ScrollView>
      <View style={[globalStyles.rowStart, globalStyles.lowerContainer]}>
        <Text fontWeight="500" fontSize={hp(18)} text="Kindly provide new user details" />
      </View>
      <Input
        label={'Staff First Name'}
        value={values.firstName}
        onBlur={handleBlur('firstName')}
        onChangeText={handleChange('firstName')}
        errorMsg={touched.firstName ? errors.firstName : undefined}
      />
      <Input
        label={'Staff Last Name'}
        value={values.lastName}
        onBlur={handleBlur('lastName')}
        onChangeText={handleChange('lastName')}
        errorMsg={touched.lastName ? errors.lastName : undefined}
      />
      <Input
        label={'Staff Email Address'}
        value={values.email}
        onBlur={handleBlur('email')}
        onChangeText={handleChange('email')}
        errorMsg={touched.email ? errors.email : undefined}
      />

      <Select
          items={storeRoles}
          defaultValue={values.role}
          placeholder={'Store role'}
          setState={handleChange('role')}
          errorMsg={touched.role ? errors.role : undefined}
          roleSelector
      />

      <View style={[globalStyles.rowStart, globalStyles.lowerContainer]}>
        <Text color={colors.bazaraTint} fontWeight="500" fontSize={hp(18)} text="View role permissions" />
      </View>

      {
        permissionList?.map((item: {}) => {
          return rolepermissions(item)
        })
      }
      </ScrollView>
      <View style={globalStyles.footer}>
        <View style={globalStyles.rowCenter}>
          <Button
            title={'Add Staff'}
            onPress={handleSubmit}
          />
        </View>
      </View>
      <CustomSlideModal 
      onButtonPress={() => navigation.popToTop()} 
      msg={"Necessary instruction has been sent to staff's email you provided!"} 
      headerText={'Staff Added'} 
      visibleBoolean={complete}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cart: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  greyColor: {
    color: colors.gray
  },
  rowMargin: {
    marginVertical: 20
  }
});
