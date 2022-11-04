import { View, StyleSheet, Modal, Pressable, Image } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../../utils/themes'
import { hp, wp } from '../../utils/helpers'
import { globalStyles } from '../../styles'
import { cancel } from '../../assets'
import { Text } from '../../components/common/Text'

const AddressBooklistModal = ({ visible, setVisible, openVisible, addressList, updateDelivery }: any) => {
    const [selected, setSelected] = useState<any>(null)

    const handleUpdate = (data: any) => {
        setSelected(data)
        updateDelivery(data)
    }

    const newAddress = () => {
        setVisible()
        openVisible()
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible()}
            presentationStyle='pageSheet'
        >
            <View style={styles.contain}>
                <View style={globalStyles.rowBetween}>
                    <Text style={{ textTransform: 'capitalize', marginVertical: hp(5) }} text={`Change Delivery Address`} fontSize={hp(16)} fontWeight='700' />
                    <Pressable onPress={setVisible}>
                        <Image source={cancel} />
                    </Pressable>
                </View>

                <Pressable onPress={() => newAddress()}>
                <View style={styles.div}>
                    <View style={[styles.checkbox, { backgroundColor: 'transparent' }]} ></View>
                    <View style={styles.subdiv}>
                        <Text text='New Address' fontSize={hp(14)} fontWeight='600' lineHeight={19} />
                        <Text text='Add an address here for your product delivery' fontSize={hp(12)} fontWeight='400' lineHeight={16} color={colors.gray} />
                    </View>
                </View>
                </Pressable>

                <View style={styles.div2}>
                    <View style={[styles.checkbox, { backgroundColor: 'transparent' }]} ></View>
                    <View style={styles.subdiv}>
                        <Text text='Address book' fontSize={hp(14)} fontWeight='600' lineHeight={19} />
                        <Text text='Use from your existing address' fontSize={hp(12)} fontWeight='400' style={{marginBottom: hp(10)}} lineHeight={16} color={colors.gray} />
                        {
                            addressList?.map((data: any) => {
                                return (
                                    <View>
                                        <Pressable onPress={() => handleUpdate(data)}>
                                        <View style={[styles.mindiv,{borderWidth: selected?.id === data?.id && 1, borderColor: selected?.id === data?.id && colors?.bazaraTint }]} >
                                            <Text text={data?.street + " " + data?.city + " " + data?.state} fontSize={hp(14)} fontWeight='600' lineHeight={19} />
                                            <View style={globalStyles.rowStart}>
                                                <Text text={data?.state} fontSize={hp(10)} fontWeight='400' lineHeight={10} color={colors.gray} />
                                                <View style={styles.emptydiv}/>
                                                <Text text={data?.city} fontSize={hp(10)} fontWeight='400' lineHeight={14} color={colors.gray} />
                                            </View>

                                        </View>
                                        </Pressable>
                                        <View style={styles.hr} />
                                    </View>
                                )
                            })
                        }



                    </View>
                </View>

            </View>
        </Modal>
    )
}

export default AddressBooklistModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        marginTop: 50
    },
    contain: {
        backgroundColor: colors.black,
        marginVertical: hp(100),
        marginHorizontal: hp(10),
        borderRadius: 5,
        padding: hp(10)
    },
    div: {
        width: '100%',
        flexDirection: 'row',
        marginTop: hp(10)
    },
    div2: {
        width: '100%',
        flexDirection: 'row',
        marginTop: hp(20)
    },
    checkbox: {
        width: wp(20),
        height: hp(20),
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.bazaraTint,
        marginRight: wp(10)
    },
    subdiv: {

    },
    emptydiv: {
        width: wp(10),
        height: hp(10),
        borderRadius: 50,
        backgroundColor: colors.white,
        marginHorizontal: hp(10),
    },
    hr: {
        width: '100%',
        height: hp(2),
        backgroundColor: colors.lightGray
    },
    mindiv: {
        marginTop: hp(10),
        paddingVertical: hp(10),
        paddingHorizontal: hp(5),
        borderRadius: 5
    }
})