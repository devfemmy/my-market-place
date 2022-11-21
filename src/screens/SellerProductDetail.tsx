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
import { ProgressBar } from 'react-native-paper'
import { fetchReviews } from '../redux/slices/ReviewSlice'
import * as Progress from 'react-native-progress'


const SellerProductDetail = (props: any) => {
    const dispatch = useAppDispatch()
    const [id, setId] = useState<any>()
    const [loader, setLoader] = useState(false)
    const [loader2, setLoader2] = useState(false)
    const [stateLoader, setStateLoader] = useState(false)
    const { width } = useWindowDimensions();

    const productSlug = props?.route?.params?.params?.slug
    const [productRating, setProductRating] = useState<any>(null)
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
        dispatch(fetchReviews(productBySlugData?.id)).then(dd => {
            setProductRating(dd?.payload)
        })
    }, [productBySlugData])

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

    // const getStat = (num: number) => {
    //     const stat = []
    //     for(var i = 0; i < reviewData.length; i++){
    //         if(reviewData[i]?.rating > (num - 1) && reviewData[i]?.rating <= (num)){
    //             stat.push(reviewData[i])
    //         }
    //     }
    //     return stat.length / reviewData.length
    //   }
    const excellent = productRating?.filter((data: any) => data?.rating === 5)
    const good = productRating?.filter((data: any) => data?.rating === 4)
    const average = productRating?.filter((data: any) => data?.rating === 3)
    const poor = productRating?.filter((data: any) => data?.rating === 2)
    const terrible = productRating?.filter((data: any) => data?.rating === 1)



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
                            <ScrollView  showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
                                <View>
                                    <View style={[styles.div, { backgroundColor: productBySlugData?.status === 'ACTIVE' ? colors.green : productBySlugData?.status === 'INACTIVE' ? colors.red : colors.orange }]} >
                                        <Text style={{ textTransform: 'capitalize' }} textAlign='center' text={productBySlugData?.status} fontSize={hp(14)} />
                                    </View>
                                </View>
                                <View style={{ backgroundColor: 'rgb(23, 23, 23)', padding: hp(10), borderRadius: 5 }}>



                                    <View style={[globalStyles.rowStart]}>
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
                                    <View style={globalStyles.rowStart}>
                                        <View style={styles.minidiv}>
                                            <Text text='Expected delivery duration' fontSize={hp(12)} fontWeight='600' color={colors.gray} />
                                            <Text text={productBySlugData?.estimated_delivery_duration} fontSize={hp(12)} fontWeight='600' />
                                        </View>
                                    </View>
                                    <View style={styles.br}></View>
                                </View>

                                <Text text='Colours' fontSize={hp(14)} fontWeight='400' style={{ marginVertical: hp(10) }} />
                                <View style={[styles.subdiv, { backgroundColor: 'rgb(23, 23, 23)', padding: hp(10), borderRadius: 5 }]}>
                                    {
                                        productBySlugData?.product_variants?.map((data: any, i: any) => {
                                            return <ProductVariantCard key={i} name={productBySlugData?.name} price={data?.product_variant_specs[0]?.amount} image={data?.img_urls[0]} />
                                        })
                                    }
                                </View>
                                <View style={{ marginVertical: hp(10) }} />
                                <View style={{ backgroundColor: 'rgb(23, 23, 23)', padding: hp(10), borderRadius: 5 }}>
                                    <View style={globalStyles.rowBetween}>
                                        <Text text='Reviews & Rating' fontSize={hp(14)} fontWeight='400' style={{ marginVertical: hp(10) }} />
                                        <Pressable onPress={() => props?.navigation.navigate("Ratings", {
                                            params: {
                                                id: productBySlugData?.id,
                                                ownerId: productBySlugData?.user_id,
                                                productRating: productRating
                                            }
                                        })}>
                                            <Text text='view more' fontSize={hp(14)} fontWeight='400' color={colors?.bazaraTint} style={{ marginVertical: hp(10) }} />
                                        </Pressable>
                                    </View>
                                    <View style={globalStyles.rowBetween}>
                                        <View style={styles.textDiv2}>
                                            <Text text='Excellent' fontSize={hp(16)} />
                                        </View>
                                        <View style={styles.progressDiv}>
                                            <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={excellent ? (excellent?.length / 1000) : 0} width={200} />
                                        </View>
                                        <View>
                                            <Text text={excellent ? excellent?.length : 0} fontSize={hp(16)} />
                                        </View>
                                    </View>
                                    <View style={globalStyles.rowBetween}>
                                        <View style={styles.textDiv2}>
                                            <Text text='Very good' fontSize={hp(16)} />
                                        </View>
                                        <View style={styles.progressDiv}>
                                            <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={good ? (good?.length / 1000) : 0} width={200} />
                                        </View>
                                        <View>
                                            <Text text={good ? good?.length : 0} fontSize={hp(16)} />
                                        </View>
                                    </View>
                                    <View style={globalStyles.rowBetween}>
                                        <View style={styles.textDiv2}>
                                            <Text text='Average' fontSize={hp(16)} />
                                        </View>
                                        <View style={styles.progressDiv}>
                                            <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={average ? (average?.length / 1000) : 0} width={200} />
                                        </View>
                                        <View>
                                            <Text text={average ? average?.length : 0} fontSize={hp(16)} />
                                        </View>
                                    </View>
                                    <View style={globalStyles.rowBetween}>
                                        <View style={styles.textDiv2}>
                                            <Text text='Poor' fontSize={hp(16)} />
                                        </View>
                                        <View style={styles.progressDiv}>
                                            <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={poor ? (poor?.length / 1000) : 0} width={200} />
                                        </View>
                                        <View>
                                            <Text text={poor ? poor?.length : 0} fontSize={hp(16)} />
                                        </View>
                                    </View>
                                    <View style={globalStyles.rowBetween}>
                                        <View style={styles.textDiv2}>
                                            <Text text='Terrible' fontSize={hp(16)} />
                                        </View>
                                        <View style={styles.progressDiv}>
                                            <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={terrible ? (terrible?.length / 1000) : 0} width={200} />
                                        </View>
                                        <View>
                                            <Text text={terrible ? terrible?.length : 0} fontSize={hp(16)} />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView >
                        </View>
                        <View style={{marginVertical: hp(20)}} />
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
    textDiv2: {
        width: '20%',
        paddingVertical: hp(5)
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

    },
    progress: {
        backgroundColor: 'white',
    },
    progressDiv: {
        width: '50%'
    },
})