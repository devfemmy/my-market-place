import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { SafeAreaView, Text } from '../components/common';
import { StyleSheet, View } from 'react-native';

import { Input } from '../components/common/TextInput';
import { Button } from '../components/common/Button';
import { globalStyles } from '../styles';
import { ForgotPasswordScreenNavigationProp } from '../navigations/Seller/types';
import { ForgotPasswordFormData } from '../utils/types';
import { ForgotPasswordSchema } from '../utils/constants';
import { hp } from '../utils/helpers';
import { doPost } from '../utils/server';
import { styles } from './auth/Login/styles';
import MobileHeader from './Containers/MobileHeader';
import { forgetPassword } from '../redux/slices/AuthSlice';
import { useAppDispatch } from '../redux/hooks';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch()
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
    const initialValues: ForgotPasswordFormData = {
        email: '',
    };
    const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
        useFormik({
            initialValues,
            validationSchema: ForgotPasswordSchema,
            onSubmit: (data: ForgotPasswordFormData) => {
                handleCredentialSubmit(data);
            },
        });

    const handleCredentialSubmit = async (data: ForgotPasswordFormData) => {

        const payload = {
            email: data?.email,
            redirect_url: `https://bazara.herokuapp.com/new-password`
        }

        setLoading(true)
        const resultAction = await dispatch(forgetPassword(payload))
        if (forgetPassword.fulfilled.match(resultAction)) {
            setLoading(false)
            navigation.navigate('LinkSent');

        } else {
            var errMsg = resultAction?.payload as string
            setLoading(false)


        }
    }

    return (
        <SafeAreaView>
            {/* <Text onPress={() => navigation.goBack()} text="Back to login" /> */}
            <MobileHeader categoryName={'Forgot Password'} props={navigation} auth />
            <View style={[styles.upperContainer, styled.pd]}>
                <Text
                    fontWeight="300"
                    fontSize={hp(17)}
                    lineHeight={hp(27)}
                    text="Provide the email address asssociated with your account and we will send you instructions to set a new password."
                />
            </View>
            <View style={styled.tp}>
                <Input
                    label={'Email'}
                    value={values.email}
                    onBlur={handleBlur('email')}
                    onChangeText={handleChange('email')}
                    errorMsg={touched.email ? errors.email : undefined}
                />

                <View style={globalStyles.rowCenter}>
                    <Button isLoading={loading} title={'Send link'} style={styles.btn} onPress={handleSubmit} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ForgotPassword;


const styled = StyleSheet.create({
    pd: {
        marginHorizontal: hp(10),

    },
    tp: {
        marginHorizontal: hp(10),
        marginTop: hp(20)
    },
})
