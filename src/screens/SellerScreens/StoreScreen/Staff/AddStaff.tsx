import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView, Text } from '../../../../components/common';
import { colors } from '../../../../utils/themes';
import { globalStyles } from "../../../../styles/globalStyles"
import { hp } from '../../../../utils/helpers';
import StoreHeader from '../../../../components/resuable/StoreHeader';
import ScrollCard from '../../../../components/resuable/ScrollCard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {colorCart, universityLogo, truckLogo, usersLogo, productLogo} from "../../../../assets"
import ListCard from '../../../../components/resuable/ListCard';
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"

import { Input } from '../../../../components/common/TextInput';
import { Button } from '../../../../components/common/Button';
import { Select } from '../../../../components/common/SelectInput';
import { useFormik } from 'formik';

import { AddStaffSchema, StaffFormDataSchema } from '../../../../utils/constants';

import CustomSlideModal from '../../../../components/common/CustomSlideModal';
import { useNavigation } from '@react-navigation/native';
import { AddStaffData, Nav } from '../../../../utils/types';
import { sendPost, getRequest } from '../../../../utils/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addStaff, getRoles, storeRolesList } from '../../../../redux/slices/StaffSlice';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import MobileHeader from '../../../Containers/MobileHeader';



const AddStaffScreen = ({navigation}: any) => {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('')
  const dispatch = useAppDispatch()
  const userRoles = useAppSelector(storeRolesList)
  const initialValues: AddStaffData = {
      email: '',
      role: ''
  }

  const [id, setId] = useState<any>()


  useEffect(() => {
    const loadData = async () => {
      var ids = await AsyncStorage.getItem('activeId') as string
      setId(ids)
    }
    loadData()
  }, [id])

  useEffect(() => {
    dispatch(getRoles())
  }, [])

  
  const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
  useFormik({
      initialValues,
      validationSchema: AddStaffSchema,
      onSubmit: (data: AddStaffData) => handleAddStaff(data),
  });


  const roleId = userRoles?.find((data: any) => data?.id === values.role)?.id

  const userRoleData = userRoles?.map((data: any )=> {
    return {
      key: data?.id.toString(),
      value: data?.role
    }
  })

  const handleAddStaff = async (data: any) => {
    setLoading(true)
    const paylaod = {
        email: data?.email,
        role_id: roleId,
        store_id: id
    }

    try {
        const response = await dispatch(addStaff(paylaod))
        if(addStaff.fulfilled.match(response)) {
          Notifier.showNotification({
            title: 'Staff Added',
            description: '',
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
                alertType: 'success',
            },
        });
            setLoading(false)
            return navigation.navigate('Staffs', {
              params: {
                random: data?.email
              }
            })
        }
        else {
          var errMsg = response?.payload as string
          Notifier.showNotification({
            title: errMsg,
            description: '',
            Component: NotifierComponents.Alert,
            hideOnPress: false,
            componentProps: {
                alertType: 'error',
            },
        });
            setLoading(false)
           
        }
    }
    catch(e) {
        console.log({e})
        setLoading(false)
    }
}


  //const permissionData = userRoles?.find(data => data?.role === values?.role)?.permissions



  const handleRoleChange = (e: any) => {
    setRole(e)
  
  }








  return (
    <SafeAreaView>
       <MobileHeader
        props={navigation}
        cart
        categoryName="Add New Staff"
      />
      <ScrollView>
      <View style={[globalStyles.rowStart, globalStyles.lowerContainer]}>
        <Text fontWeight="500" fontSize={hp(18)} text="Kindly provide new user details" />
      </View>
      <Input
        label={'Email'}
        value={values.email}
        onBlur={handleBlur('email')}
        onChangeText={handleChange('email')}
        errorMsg={touched.email ? errors.email : undefined}
      />

      <Select
          items={userRoleData}
          defaultValue={values.role}
          placeholder={'Store role'}
          setState={handleChange('role')}
          errorMsg={touched.role ? errors.role : undefined}
          roleSelector
      />

      </ScrollView>
      <View style={globalStyles.footer}>
        <View style={globalStyles.rowCenter}>
          <Button
            isLoading={loading}
            title={'Add Staff'}
            onPress={handleSubmit}
          />
        </View>
      </View>
  
    </SafeAreaView>
  );
};

export default AddStaffScreen

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
})
