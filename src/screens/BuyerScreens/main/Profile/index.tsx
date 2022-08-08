import React, {useContext, useState, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import { Pressable, StyleSheet, Switch, View, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native'
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import { colors } from '../../../../utils/themes';
import { globalStyles } from '../../../../styles';
import { styles } from '../../../auth/Login/styles';
import { hp, wp } from '../../../../utils/helpers';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { userProfile, loading, error, getUserDetails, updateUserDetails, updateUserPassword } from '../../../../redux/slices/userSilce';
import { useFormik } from 'formik';
import { updateSchema } from '../../../../utils/constants';
import { Input } from '../../../../components/common/TextInput';
import { InfoCircle } from '../../../../constants/images';
import { styles as LocalStyles } from './styles';

export const Profile = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();
  const dispatch = useAppDispatch()

  const { authContext: { signOut }, journeyContext: { sellerJourney }} = useContext(AuthContext)
  const user = useAppSelector(userProfile)[0]
  const Error = useAppSelector(error)
  const [editing, setEditing] = useState(false);
  const loader = useAppSelector(loading)

  useEffect(() => {
    dispatch(getUserDetails())
  }, [])

  const SwitchToSeller = async () => {
    sellerJourney()
  }

  const initialValues: {fName: string, lName: string} = {
      fName: user?.fName,
      lName: user?.lName,
  };

  const {values, errors, touched, handleChange, handleSubmit, handleBlur} =
  useFormik({
    initialValues,
    validationSchema: updateSchema,
    onSubmit: (data: {fName: string, lName: string}) => {setEditing(false); dispatch(updateUserDetails(data)); dispatch(getUserDetails())},
  });


  if(loader){
    return (
        <SafeAreaView>
            <View style={[globalStyles.rowCenter, {flex: 1}]}>
                <ActivityIndicator size={'small'}/>
            </View>
        </SafeAreaView>
    )
  }

  if(Error){
      return (
          <SafeAreaView>
              <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
              <Image
                  source={InfoCircle}
                  style={{width: hp(50), height: hp(50), marginBottom:hp(20)}}
              />
              <Text fontWeight="500" fontSize={hp(14)} text={'Seems something went wrong.'} />
              </View>
          </SafeAreaView>
      )
  }

  return (
    <View style={globalStyles.wrapper} >
      <ScrollView>
      <View style={[globalStyles.rowStart, globalStyles.lowerContainer, globalStyles.Verticalspacing]}>
          <View style={localStyle.imageCard}>
              <Image source={{uri: user?.imgUrl}} resizeMode='cover' style={localStyle.imageContainer} />
          </View>
          <Text fontWeight="500" fontSize={hp(18)} text={user?.lName + " " + user?.fName} />
      </View>
      <View style={globalStyles.list_header}>
          <View style={[globalStyles.rowBetween, globalStyles.Verticalspacing, globalStyles.lowerContainer, globalStyles.list_header_content]}>
              <Text fontWeight="500" fontSize={hp(14)} text={'Basic Information'} />
              { editing ? 
                  <TouchableOpacity onPress={() => handleSubmit()}><Text color={colors.bazaraTint} fontWeight="500" fontSize={hp(14)} text={'Save'} /></TouchableOpacity> :
                  <TouchableOpacity onPress={() => setEditing(true)}><Text fontWeight="500" fontSize={hp(14)} text={'Edit'} /></TouchableOpacity>
              }
          </View>
      </View>
      {editing ? (
            <View>
                <Input
                    label={'Surname'}
                    value={values?.lName}
                    defaultValue={user?.lName }
                    editable={editing}
                    onBlur={handleBlur('lName')}
                    onChangeText={handleChange('lName')}
                    errorMsg={touched.lName ? errors.lName : undefined}
                />
                <Input
                    label={'First Name'}
                    value={values?.fName}
                    defaultValue={user?.fName}
                    editable={editing}
                    onBlur={handleBlur('fName')}
                    onChangeText={handleChange('fName')}
                    errorMsg={touched.fName ? errors.fName : undefined}
                />
                <Input
                    label={'Email'}
                    value={user?.email}
                    editable={false}
                />
            </View>
        ) : 
        <View style={LocalStyles.marginB}>
            <View style={LocalStyles.inputContainer}>
                <Text style={LocalStyles.label} fontSize={hp(14)} text={'Surname'} />
                <Text fontSize={hp(14)} text={user?.fName} />
            </View>
            <View style={LocalStyles.inputContainer}>
                <Text style={LocalStyles.label} fontSize={hp(14)} text={'First Name'} />
                <Text fontSize={hp(14)} text={user?.lName} />
            </View>
            <View style={LocalStyles.inputContainer}>
                <Text style={LocalStyles.label} fontSize={hp(14)} text={'Email'} />
                <Text fontSize={hp(14)} text={user?.email} />
            </View>
        </View>
        }
      <View style={globalStyles.list_header}>
          <View style={[globalStyles.rowBetween, globalStyles.Verticalspacing, globalStyles.lowerContainer, globalStyles.list_header_content]}>
              <Text fontWeight="500" fontSize={hp(14)} text={'Security'} />
              <Text fontWeight="500" fontSize={hp(14)} text={''} />
          </View>
      </View>
      <View style={[globalStyles.lowerContainer]}>
          <Text color={colors.gray} fontWeight="500" fontSize={hp(13)} text={'Password'} />
          <View style={[globalStyles.rowBetween, globalStyles.Verticalspacing]}>
              <Text color={colors.white} fontWeight="500" fontSize={hp(14)} text={'xxxxxxxxxxxxx'} />
              <TouchableOpacity onPress={() => dispatch(updateUserPassword({email: user?.email}))}><Text color={colors.bazaraTint} fontWeight="500" fontSize={hp(14)} text={'Change password'} /></TouchableOpacity>
          </View>
      </View>
      <View style={globalStyles.list_header}>
          <View style={[globalStyles.rowBetween, globalStyles.Verticalspacing, globalStyles.lowerContainer, globalStyles.list_header_content]}>
              <Text fontWeight="500" fontSize={hp(14)} text={'Delivery Address'} />
              <Text fontWeight="500" fontSize={hp(14)} text={''} />
          </View>
      </View>
      <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
          <Text text='Switch to seller' fontSize={hp(16)} fontWeight="400" lineHeight={28} />
          <Switch
              trackColor={{ false: colors.dimBlack, true: colors.bazaraTint }}
              thumbColor={colors.bazaraTint}
              ios_backgroundColor={colors.dimBlack}
              onValueChange={SwitchToSeller}
              value={false}
          />
      </View>
      </ScrollView>
    </View>
  );
};

const localStyle = StyleSheet.create({
  mTop: {
      marginVertical: 10
  },
  imageCard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: 60,
    height: 60,
    backgroundColor: colors.dimBlack,
    overflow: 'hidden',
    marginRight: wp(15)
  },
  imageContainer: {
      width: 60,
      height:60
  },
})