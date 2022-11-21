import React, { useState } from 'react'
import { Modal, Image, StyleSheet, View, TextInput, Pressable, Dimensions, ScrollView } from "react-native"
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { useAppDispatch } from '../../redux/hooks'
import { rejectAndCancelOrder } from '../../redux/slices/orderSlice'
import { hp, wp } from '../../utils/helpers'
import { ModalType } from '../../utils/types'
import { Text } from '../common'
import { colors } from '../../utils/themes'
import { Button } from '../common/Button'
import { checkbox } from '../../assets'



const OrderActionModal = ({ action, modalVisible, setModalVisible, orderId }: any) => {
    const [selected, setSelected] = useState('')
    const [other, setOther] = useState('')
    const [loader, setLoader] = useState(false)

    const dispatch = useAppDispatch()


    const handleModalSubmit = async () => {
        setLoader(true)

        const payload = {
            status: action === 'reject' ? 'REJECTED' : 'CANCELLED',
            orderId,
            reason: selected === "Others" ? other : selected
        }

        console.log({payload})

        try {
            const resultAction = await dispatch(rejectAndCancelOrder(payload))
            if (rejectAndCancelOrder.fulfilled.match(resultAction)) {
                setModalVisible()
                setLoader(false)
                Notifier.showNotification({
                    title: 'Success',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
            } else {
                var errMsg = resultAction?.payload as string
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
            console.log(e)
        }
    }


    return (
       <ScrollView  showsVerticalScrollIndicator={false}
       showsHorizontalScrollIndicator={false}>
         <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={setModalVisible}

        >
            <View style={styles.containerDiv}>
                <Text style={{ marginVertical: hp(5), textTransform: 'capitalize' }} text={`${action} order`} fontSize={hp(16)} fontWeight='700' />
                <Text text={`Why do you want to ${action} this order?`} fontSize={hp(14)} fontWeight='400' color={colors.gray} />
                <View style={styles.div}>
                    <View style={styles.span}>
                        <View style={styles.rowStart}>
                            {
                                selected === 'Product out of stock' ? <Pressable onPress={() => setSelected('PRODUCT OUT OF STOCK')} ><View style={styles.activeBox}><Image source={checkbox} style={styles.iconImage} /></View></Pressable> : <Pressable onPress={() => setSelected('Product out of stock')} ><View style={styles.inactiveBox}></View></Pressable>
                            }
                            <Text text="Product out of stock" fontSize={hp(14)} fontWeight='400' style={{ marginHorizontal: hp(5) }} />
                        </View>
                    </View>
                    <View style={styles.span}>
                        <View style={styles.rowStart}>
                            {
                                selected === 'Seller currently unavailable' ? <Pressable onPress={() => setSelected('SELLER CURRENTLY NOT AVAILABLE')}>
                                    <View style={styles.activeBox}><Image source={checkbox} style={styles.iconImage} /></View>
                                </Pressable> : <Pressable  onPress={() => setSelected('Seller currently unavailable')}>
                                <View style={styles.inactiveBox}></View>
                                </Pressable>
                            }
                            <Text text="Seller currently unavailable" fontSize={hp(14)} fontWeight='400' style={{ marginHorizontal: hp(5) }} />
                        </View>
                    </View>

                    <View style={styles.span}>
                        <View style={styles.rowStart}>
                            {
                                selected === 'Others' ? <Pressable onPress={() => setSelected('Others')}>
                                     <View style={styles.activeBox} ><Image source={checkbox} style={styles.iconImage} /></View>
                                </Pressable> : <Pressable onPress={() => setSelected('Others')}>
                                <View style={styles.inactiveBox}></View>
                                </Pressable>
                            }
                            <Text text="Others" fontSize={hp(14)} fontWeight='400' style={{ marginHorizontal: hp(5) }} />
                        </View>

                    </View>
                    <View style={styles.rowStart}>
                        {
                            selected === 'Others' &&
                            <View style={styles.containerDiv2}>
                                <TextInput
                                    placeholder={`Tell us why you want to ${action} this order`}
                                    multiline={true}
                                    numberOfLines={5}
                                    value={other}
                                    style={styles.input}
                                    onChangeText={(e) => setOther(e)}
                                />
                            </View>

                        }
                    </View>
                </View>
                <Button isLoading={loader} title={"Submit"} onPress={handleModalSubmit} />
            </View>

        </Modal>
       </ScrollView>
    )
}

export default OrderActionModal



const styles = StyleSheet.create({
    containerDiv: {
         width: '95%',
        backgroundColor: 'black',
        padding: hp(15),
        marginVertical: hp(130),
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