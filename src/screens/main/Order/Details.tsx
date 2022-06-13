import React, {useContext, useRef, useState} from 'react';
import {Text} from '../../../components/common';
import { Input } from '../../../components/common/TextInput';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { AuthContext } from '../../../context/context';
import { Button } from '../../../components/common/Button';
import {View, Image, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {globalStyles} from '../../../styles';
import {hp,wp} from '../../../utils/helpers';
import {NoOrders} from '../../../constants/images';
import { colors } from '../../../utils/themes';
import { useRoute } from '@react-navigation/native';
import { Separator } from '../../../components/common';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { currencyFormat, copyToClipboard } from '../../../utils/functions';
import {Layout} from '@ui-kitten/components';
import { statusColor, statusMessage, buttonMessage, rejectionMsg } from '../../../utils/functions';
import { Modalize } from 'react-native-modalize';
import { CheckBox } from '../../../components/common/CheckBox';
import { SuccesssLogo } from '../../../constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';


export const OrderDetails = ({order}: any): JSX.Element => {
  const {navigate} = useNavigation<Nav>();
  const [cancelled, setCancelled] = useState(false)

  const [selectedReason, setSelectedreason] = useState('')
  const [otherReason, setOtherreason] = useState('')

  const [modalDesc, setModalDesc] = useState('')
  const [modalBtn, setModalBtn] = useState('')

  const modalizeRef = useRef(null);
  const route = useRoute();

  const item = route?.params?.order

  const renderHeader = () => (
    <View style={[globalStyles.Verticalspacing]}>
        <Text style={[globalStyles.rowStart, globalStyles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text={cancelled ? "" : "Reject Order"} />
    </View>
  );

  const rejectBody = () => (
    <>
        <View style={[globalStyles.rowStart, globalStyles.lowerContainer]}>
            <Text fontWeight="500" fontSize={hp(16)} color={colors.darkGrey} text="Why do you want to reject this order?" />
        </View>
        <View style={globalStyles.modal__body}>
            
            <View style={[globalStyles.colStart, globalStyles.lowerContainer, {marginHorizontal: hp(25)}]}>
                <CheckBox
                    label={'Product out of stock'}
                    labelStyle={{color: colors.white}}
                    status={selectedReason == 'Product out of stock' ? 'checked' : 'unchecked'}
                    handleChange={() => setSelectedreason('Product out of stock')}
                />
                <CheckBox
                    label={'Seller currently unavailable'}
                    labelStyle={{color: colors.white}}
                    status={selectedReason == 'Seller currently unavailable' ? 'checked' : 'unchecked'}
                    handleChange={() => setSelectedreason('Seller currently unavailable')}
                />
                <CheckBox
                    label={'Others'}
                    labelStyle={{color: colors.white}}
                    status={selectedReason == 'Others' ? 'checked' : 'unchecked'}
                    handleChange={() => setSelectedreason('Others')}
                />
                
            </View>
        </View>
        <Input
        label={'Tell us why you want to cancel this order'}
            onChangeText={(text) => setOtherreason(text)}
            multiline={true}
            disabled={selectedReason == 'Others' ? false : true}
        />
        <Button onPress={() => submitRejection()} title={'Submit'}/>
    </>
  );

  const successBody = () => [
    <>
        <View style={globalStyles.modal__body}>
            <Image source={SuccesssLogo} style={[globalStyles.selfCenterImage, globalStyles.Verticalspacing]} resizeMode="contain" />
            <Text style={[globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Order Rejected" />
            <Text style={[globalStyles.Verticalspacing]} numberOfLines={2} fontWeight="400" color={colors.darkGrey} textAlign='center' fontSize={hp(15)} text={modalDesc} />
        </View>
        <View style={{marginVertical: hp(20)}}>
            <Button title={modalBtn}/>
        </View>
        <TouchableOpacity onPress={() => modalizeRef.current?.close()}>
            <Text style={[globalStyles.Verticalspacing, {alignSelf: 'center'}]} fontWeight="400" color={colors.white} textAlign='center' fontSize={hp(15)} text="I'll do this later" />
        </TouchableOpacity>
    </>
  ]

  const submitRejection = () => {
    if(selectedReason == ''){
        return
    }

    const response = rejectionMsg(selectedReason)

    setModalDesc(response.desc)
    setModalBtn(response.btn)
    modalizeRef.current?.close()
    setTimeout(() => {setCancelled(true)}, 1000)
    setTimeout(() => {modalizeRef.current?.open()}, 1000)

  }

  return (
        <>
            <ScrollView style={[globalStyles.wrapper, {paddingTop: hp(20)}]}>
                <View style={[globalStyles.infoCard]}>
                    <View style={[globalStyles.cardStatusFull, {backgroundColor: statusColor(item?.orderInfo?.status)}]}>
                        <Text
                        text={statusMessage(item?.orderInfo?.status)}
                        fontWeight={"500"}
                        fontSize={hp(13)}
                        style={styles.text} />
                    </View>
                    <View style={[globalStyles.rowStart, globalStyles.cardSeparator, globalStyles.marginTop]}>
                        <View style={[globalStyles.rowStartNoOverflow]}>
                            <Image source={{uri: item?.orderInfo?.variantImg}} style={styles.image} />
                        </View>
                        <View style={styles.detContainer}>
                            <Text text={item?.orderInfo?.name} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                            <View style={globalStyles.rowStart}>
                                <Text
                                text={"Size - "}
                                fontWeight={"300"}
                                fontSize={hp(12)}
                                style={styles.text} />
                                <Text
                                text={item?.orderInfo?.size}
                                fontWeight={"300"}
                                fontSize={hp(11)}
                                color={colors.bazaraTint}
                                style={styles.text} />
                            </View>
                        </View>
                    </View>
                    <View style={[globalStyles.rowStart, globalStyles.cardSeparator]}>
                        <View style={[styles.iconContainer]}>
                            <EvilIcons name={'location'} size={hp(30)} style={{color: colors.bazaraTint}} />
                        </View>
                        <View style={styles.detContainer}>
                            <Text text={'Delivery Details'} color={colors.gray} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                            <Text text={item?.deliveryInfo?.deliveryAddress} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                        </View>
                    </View>
                    <View style={[globalStyles.rowStart, globalStyles.cardSeparator, globalStyles.noSeparator]}>
                        <View style={[styles.iconContainer]}>
                            <EvilIcons name={'calendar'} size={hp(30)} style={{color: colors.bazaraTint}} />
                        </View>
                        <View style={styles.detContainer}>
                            <Text text={'Estimated Delivery Date'} color={colors.gray} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                            <Text text={new Date(item?.deliveryInfo?.expectedDeliveryDate).toDateString()} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                        </View>
                    </View>
                </View>

                <View style={[globalStyles.infoCard]}>
                    <View style={[globalStyles.rowBetween, globalStyles.cardSeparator]}>
                        <Text text={'Item Total'} color={colors.gray} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                        <Text text={currencyFormat(item?.orderInfo?.price)} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                    </View>
                    <View style={[globalStyles.rowBetween, globalStyles.cardSeparator]}>
                        <Text text={'Quality'} color={colors.gray} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                        <Text text={item?.orderInfo?.quantity} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                    </View>
                    <View style={[globalStyles.rowBetween, globalStyles.cardSeparator, globalStyles.noSeparator]}>
                        <Text text={'Delivery Fee'} color={colors.gray} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                        <Text text={currencyFormat(item?.orderInfo?.price - item?.orderInfo?.calculatedAmount)} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                    </View>
                </View>

                <View style={[globalStyles.infoCard]}>
                    <View style={[globalStyles.rowBetween, globalStyles.cardSeparator]}>
                        <Text text={'Order ID'} color={colors.gray} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                        <View style={globalStyles.rowStart}>
                            <Text text={item?.orderInfo?.orderRef} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                            <TouchableOpacity onPress={() => copyToClipboard(item?.orderInfo?.orderRef)} style={globalStyles.Horizontalspacing}>
                                <Ionicons name={'ios-copy-outline'} size={hp(16)} style={{color: colors.darkGrey}} />
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    <View style={[globalStyles.rowBetween, globalStyles.cardSeparator]}>
                        <Text text={'Order Date'} color={colors.gray} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                        <Text text={new Date(item?.createdAt).toDateString()} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                    </View>
                    <View style={[globalStyles.rowBetween, globalStyles.cardSeparator, globalStyles.noSeparator]}>
                        <Text text={"Buyer's Name"} color={colors.gray} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                        <Text text={" "} numberOfLines={1} fontWeight={"400"} fontSize={hp(13)} style={styles.text} />
                    </View>
                </View>
                { item?.orderInfo?.status == 'completed' || item?.orderInfo?.status == 'rejected' || item?.orderInfo?.status == 'cancelled' ? null :
                <View style={[globalStyles.Verticalspacing, {marginBottom: hp(50)}]}>
                    <Button title={buttonMessage(item?.orderInfo?.status)}/>
                    <View style={[item?.orderInfo?.status == 'pending' || item?.orderInfo?.status == 'processing' ? globalStyles.rowBetween : globalStyles.rowCenter, globalStyles.cardSeparator, globalStyles.noSeparator, globalStyles.Verticalspacing]}>
                        <TouchableOpacity ><Text text={"Message Buyer"} color={colors.white} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text}/></TouchableOpacity>
                        { item?.orderInfo?.status == 'pending' || item?.orderInfo?.status == 'processing' ?
                        <TouchableOpacity
                        onPress={() => modalizeRef.current?.open()}
                        >
                            <Text text={ item?.orderInfo?.status == 'pending' ? 'Reject Order' : 'Cancel Order'} 
                            color={colors.cancelled}
                            numberOfLines={1}
                            fontWeight={"400"}
                            fontSize={hp(15)}
                            style={styles.text} />
                        </TouchableOpacity> : null
                        }
                    </View>
                </View>
                }
            </ScrollView>

            <Modalize
            ref={modalizeRef}
            keyboardAvoidingOffset={100}
            scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
            adjustToContentHeight
            withHandle={false}
            HeaderComponent={renderHeader}
            FooterComponent={<SafeAreaView />}
            modalStyle={{backgroundColor: colors.primaryBg}}
            overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
                {cancelled ? successBody() : rejectBody()}
            </Modalize>
        </>
  );
};

const styles = StyleSheet.create({
    image: {
        height: hp(50),
        width: hp(50),
        borderRadius: hp(5),
        marginRight: hp(15),
    },
    cardContainer: {
        flexDirection: 'column',
        paddingVertical: hp(10),
        paddingHorizontal: hp(15)
    },
    underline: {
        borderBottomWidth: 1, 
        borderBottomColor: colors.gray,
        paddingVertical: hp(10)
    },
    text: {
        // marginTop: "-2%"
    },
    detContainer: {
        height: hp(50),
        justifyContent: 'space-evenly',
        width: hp(250)
    },
    iconContainer: {
        height: hp(50),
        width: hp(50),
        marginRight: hp(15),
        alignItems: 'center',
        justifyContent: 'center'
    }
})
