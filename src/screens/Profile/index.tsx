import React, { useContext, useState, useEffect } from 'react'
import {View, Image, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView, Text, Separator } from '../../components/common';
import { AuthContext } from '../../context/context';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { userProfile, loading, error, getUserDetails, updateUserDetails, updateUserPassword } from '../../redux/slices/userSilce';
import { globalStyles } from '../../styles';
import { hp } from '../../utils/helpers';
import { Input } from '../../components/common/TextInput';
import { colors } from '../../utils/themes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFormik} from 'formik';
import {InfoCircle} from '../../constants/images'
import { updateSchema } from '../../utils/constants';
import { styles } from './styles';

const Profile = () => {
    const { signOut } = useContext(AuthContext)
    const user = useAppSelector(userProfile)[0]
    const Error = useAppSelector(error)
    const [editing, setEditing] = useState(false);
    const dispatch = useAppDispatch()
    
    const loader = useAppSelector(loading)

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

    useEffect(() => {
        dispatch(getUserDetails())
    }, [])
 
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
        <View style={globalStyles.wrapper}>
            <ScrollView>
            <View style={[globalStyles.rowStart, globalStyles.lowerContainer, globalStyles.Verticalspacing]}>
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
            <View style={styles.marginB}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label} fontSize={hp(14)} text={'Surname'} />
                    <Text fontSize={hp(14)} text={user?.fName} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label} fontSize={hp(14)} text={'First Name'} />
                    <Text fontSize={hp(14)} text={user?.lName} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label} fontSize={hp(14)} text={'Email'} />
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
                    <Text fontWeight="500" fontSize={hp(14)} text={'Company'} />
                    <Text fontWeight="500" fontSize={hp(14)} text={''} />
                </View>
            </View>
            <View style={[globalStyles.minicardSeparator]}>
                <View style={[globalStyles.rowBetween, globalStyles.lowerContainer]}>
                    <Text fontWeight="500" fontSize={hp(14)} text={'About Bazara'} />
                    <MaterialCommunityIcons name="arrow-top-right" size={hp(24)} color={colors.black} />
                </View>
            </View>
            <View style={[globalStyles.minicardSeparator]}>
                <View style={[globalStyles.rowBetween, globalStyles.lowerContainer]}>
                    <Text fontWeight="500" fontSize={hp(14)} text={'Terms and Conditions'} />
                    <MaterialCommunityIcons name="arrow-top-right" size={hp(24)} color={colors.black} />
                </View>
            </View>
            <View style={[globalStyles.minicardSeparator]}>
                <View style={[globalStyles.rowBetween, globalStyles.lowerContainer]}>
                    <Text fontWeight="500" fontSize={hp(14)} text={'Privacy Policy'} />
                    <MaterialCommunityIcons name="arrow-top-right" size={hp(24)} color={colors.black} />
                </View>
            </View>
            <SafeAreaView/>
            </ScrollView>
        </View>
    )
}

export default Profile



