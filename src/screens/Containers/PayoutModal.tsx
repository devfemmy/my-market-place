import { Image, Modal, Pressable, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAppDispatch } from '../../redux/hooks'
import { PayoutFormData } from '../../utils/types'
import { addPayouts, getPayouts, updatePayout, verifyAccount } from '../../redux/slices/PayoutSlice'
import { useFormik } from 'formik'
import { PayoutSchema } from '../../utils/constants'
import { bankCodes } from '../../utils/banks'
import { hp } from '../../utils/helpers'
import { colors } from '../../utils/themes'
import { globalStyles } from '../../styles'
import { Text } from '../../components/common'
import { cancel } from '../../assets'

import { Select } from '../../components/common/SelectInput'
import { Input } from '../../components/common/TextInput'
import { Button } from '../../components/common/Button'

const PayoutModal = ({ visible, setVisible, editPayout, setPayout, activeId }: any) => {
    const navigation = useNavigation()
    const [loader, setLoader] = useState(false)
    const dispatch = useAppDispatch()
    const [name, setName] = useState('')
    const [codes, setCodes] = useState<any>('')
    const [error, setError] = useState('')
    const [verifyErr, setVerifyErr] = useState('')


    const initialValues: PayoutFormData = {
        bankName: editPayout !== undefined || editPayout !== null ? editPayout?.bank_name : '',
        bankNumber: editPayout !== undefined || editPayout !== null ? editPayout?.bank_account_number : ''
    };

    const handleModalFormSubmit = async (data: any) => {
        setLoader(true)
        // setError('')
        // setName('')
        // setVerifyErr('')

        try {
            const payload = {
                id: activeId,
                bankName: data?.bankName,
                account: data?.bankNumber,
                name: name
            }

            const uppdatePayload = {
                id: editPayout?.id,
                name: name,
                account: data?.bankNumber,
                bankName: data?.bankName,
            }

            if (editPayout === undefined || editPayout === null) {
                var responseAction = await dispatch(addPayouts(payload))
                if (addPayouts.fulfilled.match(responseAction)) {
                    setLoader(false)
                    setVisible()
                    resetForm()
                    setName('')
                    setVerifyErr('')
                    dispatch(getPayouts(activeId)).then(data => setPayout(data?.payload))
                }
                else {
                    if ((responseAction).payload) {
                        setLoader(false)
                        console.log('error', `Update failed: ${responseAction?.payload}`)
                    }
                    else {
                        setLoader(false)
                        console.log('error', `Update failed: ${responseAction?.payload}`)
                    }
                }
            }
            else {
                var updateResponseAction = await dispatch(updatePayout(uppdatePayload))
                if (updatePayout.fulfilled.match(updateResponseAction)) {
                    setLoader(false)
                    setVisible()
                    resetForm()
                    setName('')
                    setVerifyErr('')
                    dispatch(getPayouts(activeId)).then(data => setPayout(data?.payload))
                }
                else {
                    setLoader(false)
                    console.log('error', `Update failed`)
                }

            }
        }
        catch (e) {
            console.log({ e })
            setLoader(false)
        }
    }

    const { values, errors, touched, handleChange, handleSubmit, resetForm } =
        useFormik({
            initialValues,
            validationSchema: PayoutSchema,
            onSubmit: (data: PayoutFormData) => handleModalFormSubmit(data),
            enableReinitialize: true
        });



    const bankCode = bankCodes?.map((data: any) => {
        return {
            key: data?.name,
            value: data?.name
        }
    })

    useEffect(() => {
        const dd = async () => {
            var code = bankCodes?.find((item: any) => item.name=== values.bankName)

            const resData = {
                bankCode: code?.code,
                bankAccount: values?.bankNumber
            }
            try {
                var resultAction = await dispatch(verifyAccount(resData))
                if (verifyAccount.fulfilled.match(resultAction)) {
                    setName(resultAction?.payload?.data?.data?.account_name)
                    setCodes(code)
                    setVerifyErr('yes')
                }
                else {
                    setLoader(false)
                    setName("")
                    setVerifyErr('no')
                    setError('Account Information not valid')
                }
            }
            catch (e) {
                console.log(e)
            }
        }
        if (values.bankNumber?.length === 10) {
            dd()
        }
        else {
            setName("")
            setVerifyErr('')
            setError('')
        }
    }, [values.bankNumber, values.bankName])



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible()}
            presentationStyle='pageSheet'
        >
            <View style={styles.container}>
                <View style={styles.containerdiv}>

                    <View style={globalStyles.rowBetween}>
                        <Text style={{ marginVertical: hp(5), textTransform: 'capitalize' }} text={`Payout Account`} fontSize={hp(16)} fontWeight='700' />
                        <Pressable onPress={setVisible}>
                            <Image source={cancel} />
                        </Pressable>
                    </View>
                    <View style={styles.br} />
                    <View style={styles.br} />
                    <View style={styles.columncontainer}>
                        <Select
                            items={bankCode}
                            defaultValue={values.bankName}
                            placeholder="Bank Name"
                            setState={handleChange('bankName')}
                            errorMsg={touched.bankName ? errors.bankName : undefined}
                        />

                        <Input
                            label='Bank Number'
                            value={values.bankNumber}
                            onChangeText={handleChange('bankNumber')}
                            errorMsg={touched.bankNumber ? errors.bankNumber : undefined}
                        />
                        {
                            verifyErr === 'no' ? <View style={styles.divopp}>
                                <Text text={error} fontSize={hp(12)} color={colors.white} fontWeight='400' />
                            </View>
                                : verifyErr === 'yes' ?
                                    <View style={styles.div}>
                                        <Text text={name} fontSize={hp(14)} color={colors.white} fontWeight='400' />
                                    </View>
                                    : null
                        }

                    </View>

                    <View style={styles.br} />
                    <View style={styles.br} />
                    <View style={styles.br} />
                    <View>
                        <Button isLoading={loader} style={{color: 'white', backgroundColor: !name || name?.length < 1 ? colors.gray : colors.bazaraTint }}  title="Save" onPress={handleSubmit} disabled={name?.length < 1} />
                    </View>
                    <View style={styles.br} />
                    <View style={styles.br} />
                </View>
            </View>

        </Modal>
    )
}

export default PayoutModal

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.black,
        marginVertical: hp(200),
        marginHorizontal: hp(10),
        borderRadius: 5,
        padding: hp(10)
    },
    containerdiv: {
        width: '100%'
    },
    div: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: colors.green,
        padding: hp(10),
        borderRadius: 5,
    },
    divopp: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: colors.red,
        padding: hp(10),
        borderRadius: 5,
    },
    br: {
        marginVertical: hp(10)
    },
    columncontainer: {}
})