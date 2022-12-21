import { View, Image, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAppDispatch } from '../../redux/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { activateProduct, deactivateProduct, deleteProduct, getProduct } from '../../redux/slices/productSlice'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { globalStyles } from '../../styles'
import { Menu, Button } from 'react-native-paper';
import { hp, wp } from '../../utils/helpers'
import { colors } from '../../utils/themes'
import { Text } from '../../components/common'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { truncate } from '../../utils/server'

const ProductCard = ({ data, setProductList, id }: any) => {
    const dispatch = useAppDispatch()
    const navigation = useNavigation()
    //const [id, setId] = useState('')
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false)

    const updateProductStatus = async (data: any) => {

        if (data?.status === "ACTIVE") {
            const resultAction = await dispatch(deactivateProduct(data?.id))
            if (deactivateProduct.fulfilled.match(resultAction)) {
                Notifier.showNotification({
                    title: 'Product status updated successfully',
                    // description: "tghdddfdfd",
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
                dispatch(getProduct(id)).then((data) => {
                    setProductList(data?.payload)
                })
            }
            else {
                var errMsg = resultAction?.payload as string
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
        else {
            const resultAction = await dispatch(activateProduct(data?.id))
            if (activateProduct.fulfilled.match(resultAction)) {
                Notifier.showNotification({
                    title: 'Product status updated successfully',
                    // description: "tghdddfdfd",
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
                dispatch(getProduct(id)).then((data) => {
                    setProductList(data?.payload)
                })
            }
            else {
                var errMsg = resultAction?.payload as string
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

    }

    const deleteProd = async (data: any) => {
        try {
          var res = await dispatch(deleteProduct(data?.id))
          if (deleteProduct.fulfilled.match(res)) {
            dispatch(getProduct(id)).then(data => {
              setProductList(data?.payload)
            })
            Notifier.showNotification({
                title: 'Product deleted successfully',
                // description: "tghdddfdfd",
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'success',
                },
            });
          }
          else {
            var errMsg = res?.payload as string
            Notifier.showNotification({
                title: errMsg,
                // description: "tghdddfdfd",
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
        }
      }


    return (
        <View style={[globalStyles.rowBetween, styles.bbf]}>
            <View style={{ width: '80%' }}>
                <Pressable onPress={() => navigation.navigate('SellerProductDetail', {
                    params: {
                        slug: data.slug
                    }
                })}>
                    <View style={styles.columnDiv}>
                        <View style={globalStyles.rowStart}>
                            <Image source={{ uri: data?.img_url ? data?.img_url : "https://res.cloudinary.com/doouwbecx/image/upload/v1660556942/download_fcyeex.png" }} style={styles.img} />
                            <View style={styles.subDiv}>
                                <View style={{ width: '100%' }}>
                                    <Text text={truncate(data?.name, 60)} fontSize={hp(12)} fontWeight='600' />
                                </View>
                                <View style={globalStyles.rowStart}>
                                    {/* <CurrencyFormat value={data?.product_variants[0]?.spec[0]?.price} displayType={'text'} thousandSeparator={true} prefix={'₦'} renderText={value => <Paragraph color={GlobalStyle.color.gray} text={value} fontSize={GlobalStyle.size.size12} fontWeight='600' />} /> */}
                                    <View style={styles.cont}>
                                        {
                                            data?.status === 'ACTIVE'
                                                ? <View style={styles.contActiveDiv}></View>
                                                : data?.status === 'INACTIVE'
                                                    ? <View style={styles.contInactiveDiv}></View>
                                                    : <View style={styles.contDraftDiv}></View>
                                        }
                                        <Text text={data?.status} style={{ textTransform: 'capitalize' }} fontSize={hp(10)} fontWeight='600' />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </View>
            <View>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Button onPress={openMenu}> <Entypo name='dots-three-vertical' color={colors.white} />

                    </Button>}>
                    <Menu.Item onPress={() => navigation.navigate('SellerProductDetail', {
                        params: {
                            slug: data.slug
                        }
                    })} title="Edit" />
                    <Menu.Item onPress={() => updateProductStatus(data)} title={data?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} />
                    <Menu.Item onPress={() => deleteProd(data)} title="Delete" />
                </Menu>
            </View>
        </View>
    )
}

export default ProductCard

const styles = StyleSheet.create({
    img: {
        width: wp(40),
        height: hp(40)
    },
    columnDiv: {
        paddingVertical: hp(10),
        borderBottomWidth: 1,
        borderColor: colors.darkBlack,
    },
    subDiv: {
        marginLeft: hp(10)
    },
    contActiveDiv: {
        width: wp(5),
        height: hp(5),
        marginRight: hp(5),
        // marginLeft: hp(10),
        marginTop: hp(5),
        borderRadius: 50,
        backgroundColor: colors.green
    },
    contInactiveDiv: {
        width: wp(5),
        height: hp(5),
        marginRight: hp(5),
        // marginLeft: hp(10),
        marginTop: hp(5),
        borderRadius: 50,
        backgroundColor: colors.red
    },
    contDraftDiv: {
        width: wp(5),
        height: hp(5),
        marginRight: hp(5),
        // marginLeft: hp(10),
        borderRadius: 50,
        backgroundColor: colors.orange
    },
    cont: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },
    bbf: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',

    }


})