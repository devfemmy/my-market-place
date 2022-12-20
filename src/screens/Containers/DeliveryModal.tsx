import { View, Modal, StyleSheet, ScrollView, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useAppDispatch } from '../../redux/hooks'
import { DeliveryData, locationProp } from '../../utils/types'
import { addAddress, getAddress } from '../../redux/slices/AddressSlice'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { useFormik } from 'formik'
import { DeliverySchema } from '../../utils/schemas'
import { locationData } from '../../utils/constants'
import { hp } from '../../utils/helpers'
import { colors } from '../../utils/themes'
import { globalStyles } from '../../styles'
import { Text } from '../../components/common'
import { cancel } from '../../assets'
import { Input } from '../../components/common/TextInput'
import { Select } from '../../components/common/SelectInput'
import { Button } from '../../components/common/Button'

const DeliveryModal = ({ visible, setVisible }: any) => {
    const dispatch = useAppDispatch()
    const [loader, setLoader] = useState(false)
    const [isDefault, setIsDefault] = useState(false)

    const initialValues: DeliveryData = {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: null,
        street: "",
        state: "",
        city: ""
    }

    const handleFormSubmit = async (data: any) => {
        const payload = {
            ...data
        }

        setLoader(true)

        try {
            const response = await dispatch(addAddress(payload))
            if (addAddress.fulfilled.match(response)) {
                setVisible()
                setLoader(false)
                setIsDefault(false)
                dispatch(getAddress()).then(data => console.log({ data }))
                resetForm()
            }
            else {
                var errMsg = response?.payload as string
                setLoader(false)
                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
            }
        }
        catch (e) {
            setLoader(false)
            console.log({ e })
        }
    }



    const { values, errors, touched, handleChange, handleSubmit, handleBlur, resetForm } =
        useFormik({
            initialValues,
            validationSchema: DeliverySchema,
            onSubmit: (data: DeliveryData) => handleFormSubmit(data),
            enableReinitialize: true
        });

    const locationState = locationData?.map((data: locationProp) => {
        return {
            key: data?.state,
            value: data?.state
        }
    });

    const locationCity = locationData?.find(
        (data: locationProp) => data?.state === values.state,
    )

    const newCity = locationCity?.city?.map(data => {
        return {
          key: data,
          value: data
        }
      })


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible()}
            presentationStyle='pageSheet'
        >
            <View style={styles.contain}>
                <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
                    <View>
                        <View style={globalStyles.rowBetween}>
                            <Text style={{ textTransform: 'capitalize', marginVertical: hp(5) }} text={`Delivery Address`} fontSize={hp(16)} fontWeight='700' />
                            <Pressable onPress={setVisible}>
                                <Image source={cancel} />
                            </Pressable>
                        </View>
                        <View>
                            <Input
                                label='Receiver First name'
                                value={values.first_name}
                                onChangeText={handleChange('first_name')}
                                errorMsg={touched.first_name ? errors.first_name : undefined}
                            />
                            <Input
                                label='Receiver Last name'
                                value={values.last_name}
                                onChangeText={handleChange('last_name')}
                                errorMsg={touched.last_name ? errors.last_name : undefined}
                            />
                            <Input
                                label='Receiver Email'
                                value={values.email}
                                onChangeText={handleChange('email')}
                                errorMsg={touched.email ? errors.email : undefined}
                            />

                            <Input
                                label='Receiver Phone number'
                                number
                                value={values.phone_number?.toString()}
                                onChangeText={handleChange('phone_number')}
                                errorMsg={touched.phone_number ? errors.phone_number : undefined}
                            />

                            <Select
                                items={locationState}
                                defaultValue={values.state}
                                placeholder="Select State"
                                search={true}
                                setState={handleChange('state')}
                                errorMsg={touched.state ? errors.state : undefined}
                            />

                            {
                                values?.state?.length > 0 && <Select
                                    items={newCity}
                                    defaultValue={values.city}
                                    placeholder="Select City"
                                    search={false}
                                    setState={handleChange('city')}
                                    errorMsg={touched.city ? errors.city : undefined}
                                />
                            }

                            <Input
                                label='Delivery Street'
                                value={values.street}
                                onChangeText={handleChange('street')}
                                errorMsg={touched.street ? errors.street : undefined}
                            />
                        </View>
                    </View>

                    <Button isLoading={loader} title='Add Address' onPress={handleSubmit} />
                </ScrollView>
            </View>
            <View style={{height: hp(50)}}></View>
        </Modal>
    )
}

export default DeliveryModal


const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        marginTop: 50
    },
    contain: {
        backgroundColor: 'black',
        marginVertical: hp(10),
        marginHorizontal: hp(10),
        borderRadius: 5,
        padding: hp(10)
    },
})