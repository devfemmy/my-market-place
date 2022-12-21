import { Modal, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getRoles, getStaff, storeRolesList, updateStaff } from '../../redux/slices/StaffSlice'
import { useFormik } from 'formik'
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { capitalizeSentence, hp, wp } from '../../utils/helpers'
import { colors } from '../../utils/themes'
import { Button } from '../common/Button'
import { Select } from '../common/SelectInput'
import { Text } from '../common/Text'



const UpdateStaffModal = ({ staffModalVisible, closeModal, storeRoleId }: any) => {
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const userRoles = useAppSelector(storeRolesList)


    const initialValues: { role: string } = {
        role: '',
    }



    useEffect(() => {
        dispatch(getRoles())
    }, [])

    const handleAddStaff = async (data: any) => {
        var id = await AsyncStorage.getItem('activeId') as string
        setLoading(true)
        const paylaod = {
            role_id: roleId,
            store_role_id: storeRoleId
        }

        try {
            const response = await dispatch(updateStaff(paylaod))
            if (updateStaff.fulfilled.match(response)) {
                Notifier.showNotification({
                    title: 'Staff updated successfully',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
                closeModal()
                dispatch(getStaff(id))
                setLoading(false)
                resetForm()
            }
            else {
                var errMsg = response?.payload as string
                setLoading(false)
                Notifier.showNotification({
                    title: 'Error',
                    description: errMsg,
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
            }
        }
        catch (e) {
            console.log({ e })
            setLoading(false)
        }
    }

    const { values, errors, touched, handleChange, handleSubmit, handleBlur, resetForm } =
        useFormik({
            initialValues,
            validationSchema: yup.object().shape({
                role: yup.string().required('Role is required')
            }),
            onSubmit: (data: { role: string }) => handleAddStaff(data),
        });

    const roleId = userRoles?.find((data: any) => data?.id === values.role)?.id

    const userRoleData = userRoles?.map((data: any) => {
        return {
            key: data?.id.toString(),
            value: capitalizeSentence(data?.role)
        }
    })

   
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={staffModalVisible}
            onRequestClose={closeModal}

        >
            <View style={styles.containerDiv}>
                <View style={{marginVertical: hp(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text text='Update Staff' fontSize={hp(20)} fontWeight='bold' />
                <Text text='X' fontSize={hp(20)} fontWeight='bold' onPress={closeModal}  />

                </View>
                <Select
                    items={userRoleData}
                    defaultValue={values.role}
                    placeholder={'Store role'}
                    setState={handleChange('role')}
                    errorMsg={touched.role ? errors.role : undefined}
                    roleSelector
                />
                
                <Button isLoading={loading} title={"Update"} onPress={handleSubmit} />
            </View>

        </Modal>
    )
}

export default UpdateStaffModal



const styles = StyleSheet.create({
    containerDiv: {
        width: '95%',
        backgroundColor: 'black',
        padding: hp(15),
        marginVertical: hp(250),
        marginHorizontal: hp(10),
        borderRadius: 10
    },
    containerDiv2: {
        width: '100%',
    },
    div: {
        paddingVertical: hp(10)
    },
    rowStart: {
        flexDirection: 'row',
        // justifyContent: 'flex-start',
        // alignItems: 'center',
    },
    activeBox: {
        width: wp(20),
        height: hp(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bazaraTint,
        borderRadius: 50
    },
    inactiveBox: {
        width: wp(20),
        height: hp(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkBlack,
        borderWidth: 0.3,
        borderColor: colors.white,
        borderRadius: 50
    },
    span: {
        paddingVertical: hp(10)
    },
    iconImage: {

    },
    input: {
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        color: 'white'
    }
})