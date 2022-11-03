import { View, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { hp } from '../utils/helpers'
import MobileHeader from './Containers/MobileHeader'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { activateProduct, deactivateProduct, getProductBySlug, productBySlug } from '../redux/slices/productSlice'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { Text } from '../components/common'
import { colors } from '../utils/themes'
import { Button } from '../components/common/Button'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { globalStyles } from '../styles'
import ProductVariantCard from './Containers/ProductVariantCard'
import RenderHtml from 'react-native-render-html';



const SellerProductDetail = (props: any) => {
    const dispatch = useAppDispatch()
    const [id, setId] = useState<any>()
    const [loader, setLoader] = useState(false)
    const [loader2, setLoader2] = useState(false)
    const [stateLoader, setStateLoader] = useState(false)
    const { width } = useWindowDimensions();

    const productSlug = props?.route?.params?.params?.slug

    const productBySlugData = useAppSelector(productBySlug)

    const tagsStyles = {
        body: {
            color: 'white',
        },
        a: {
            color: 'blue'
        }
    };

    useEffect(() => {
        const loadAsync = async () => {
            var activeId = await AsyncStorage.getItem('activeId') as string

            setId(activeId)
        }
        loadAsync()

    }, [id])

    useEffect(() => {
        setStateLoader(true)
        const loadData = async () => {

            await dispatch(getProductBySlug(productSlug))
            setStateLoader(false)
        }
        loadData()

    }, [productSlug, id])

    const updateProductStatus = async (data: any) => {
        setLoader2(true)
        if (data !== "ACTIVE") {
            const resultAction = await dispatch(deactivateProduct(productBySlugData?.id))
            if (deactivateProduct.fulfilled.match(resultAction)) {
                Notifier.showNotification({
                    title: 'Product status updated successfully',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
                setLoader2(false)
                dispatch(getProductBySlug(productSlug))
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
                setLoader2(false)
            }
        }
        else {
            const resultAction = await dispatch(activateProduct(productBySlugData?.id))
            if (activateProduct.fulfilled.match(resultAction)) {
                Notifier.showNotification({
                    title: 'Product status updated successfully',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
                dispatch(getProductBySlug(productSlug))
                setLoader2(false)
            }
            else {
                var errMsg = resultAction?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
                setLoader2(false)
            }
        }

    }

    const source = {
        html: `${productBySlugData?.description}`,
    };

    return (
       <View style={styles.container}>
        {
            stateLoader ? <AntDesign name='loading1' /> :
            <View style={styles.container}>
            <MobileHeader
                categoryName={'Product Detail'}
                props={props}
            />
            <View style={styles.top}>
                <ScrollView>
                    <View>
                        <View style={[styles.div, { backgroundColor: productBySlugData?.status === 'ACTIVE' ? colors.green : productBySlugData?.status === 'INACTIVE' ? colors.red : colors.orange }]} >
                            <Text style={{ textTransform: 'capitalize' }} textAlign='center' text={productBySlugData?.status} fontSize={hp(14)} />
                        </View>
                    </View>


                    <View style={globalStyles.rowStart}>
                        <View style={styles.minidiv}>
                            <Text text='Product Name' fontSize={hp(12)} fontWeight='600' color={colors.gray} />
                            <Text text={productBySlugData?.name} fontSize={hp(12)} fontWeight='600' />
                        </View>
                    </View>
                    <View style={styles.br}></View>
                    <View style={globalStyles.rowStart}>
                        <View style={styles.minidiv}>
                            <Text text='Description' fontSize={hp(12)} fontWeight='600' color={colors.gray} />
                            <View style={styles.descDiv}>
                                {/* {renderHTML(`<div>${productBySlugData?.description}</div>`)} */}
                                <RenderHtml
                            contentWidth={width}
                            source={source}
                            tagsStyles={tagsStyles}
                        />
                            </View>


                        </View>
                    </View>
                    <View style={styles.br}></View>
                    <View style={globalStyles.rowStart}>
                        <View style={styles.minidiv}>
                            <Text text='Category' fontSize={hp(12)} fontWeight='600' color={colors.gray} />
                            <Text text={productBySlugData?.category} fontSize={hp(12)} fontWeight='600' />
                        </View>
                    </View>
                    <View style={styles.br}></View>


                    <Text text='Colours' fontSize={hp(14)} fontWeight='400' />
                    <View style={styles.subdiv}>
                        {
                            productBySlugData?.product_variants?.map((data: any, i: any) => {
                                return <ProductVariantCard key={i} name={productBySlugData?.name} price={data?.product_variant_specs[0]?.amount} image={data?.img_urls[0]} />
                            })
                        }
                    </View>
                </ScrollView >
            </View >
            <View style={styles.bottom}>
                <Button isLoading={loader} title='Edit Product' onPress={() => props?.navigation.navigate('ProductDetailEdit', {
                    params: {
                        slug: productSlug
                    }
                })} />
                <Pressable onPress={productBySlugData?.status === 'ACTIVE' ? () => updateProductStatus('INACTIVE') : () => updateProductStatus('ACTIVE')}>
                    <View style={styles.textDiv}>
                        {loader2 ? <AntDesign name='loading1' /> : <Text text={productBySlugData?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} />}
                    </View>
                </Pressable>
            </View>
        </View >
        }
       </View>
    )
}

export default SellerProductDetail

const styles = StyleSheet.create({
    container: {
        paddingTop: hp(10),
        flex: 1,
        backgroundColor: 'black'
    },
    div: {
        marginTop: hp(20),
        marginBottom: hp(10),
        height: hp(40),
        padding: hp(5),
        borderRadius: hp(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    top: {
        flex: 6,
    },
    bottom: {
        flex: 1,
    },
    textDiv: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: hp(10)
    },
    minidiv: {
        marginLeft: hp(7),
        width: '100%'
    },
    br: {
        backgroundColor: colors.lightwhite,
        marginVertical: hp(10)
    },
    subdiv: {
        background: colors.darkBlack,
        padding: hp(10),
        borderRadius: 10,
        marginTop: hp(5)
    },
    descDiv: {

    }
})