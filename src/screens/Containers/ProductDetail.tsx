import { View, StyleSheet, ScrollView, FlatList, Image, useWindowDimensions, Pressable } from 'react-native'
import React, { Component, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addToCart, CartData, getCarts } from '../../redux/slices/cartSlice'
import { getStoreRating, storeRatings } from '../../redux/slices/StoreSlice'
import { useFormik } from 'formik'
import * as yup from 'yup';
import { deliveryFee } from '../../redux/slices/AddressSlice';
import * as Progress from 'react-native-progress'
import { fetchReviews } from '../../redux/slices/ReviewSlice';
import CommentCard from './CommentCard';
import { getProductBySlugBuyer } from '../../redux/slices/productSlice'
import { locationData } from '../../utils/constants'
import { locationProp } from '../../utils/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MobileHeader from './MobileHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalStyles } from '../../styles'
import { hp, numberFormat, wp } from '../../utils/helpers'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text } from '../../components/common'
import { colors } from '../../utils/themes'
import RenderHtml from 'react-native-render-html';
import ViewMoreText from 'react-native-view-more-text';
import Slick from 'react-native-slick';

import { icons } from '../../utils/constants'
import { Select } from '../../components/common/SelectInput'
import { Button } from '../../components/common/Button'

import { Notifier, NotifierComponents } from 'react-native-notifier'

const ProductDetail = (props: any) => {
    const dispatch = useAppDispatch()
    const [productDetail, setProductDetail] = useState<any>()
    const cartInfo = useAppSelector(CartData);
    const { width } = useWindowDimensions();
    const slugName = props?.route?.params?.params?.id
    const [getUserToken, setGetUserToken] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [activeVariant, setActiveVariant] = useState({
        image: [],
        price: "",
        size: "",
        quantity: 1,
        specId: "",
        variantId: "",
    })

    const [variantList, setVariantList] = useState<any>()
    const [variantSpec, setVariantSpec] = useState<any>()
    const [loader, setLoader] = useState(false)
    const [loader2, setLoader2] = useState(false)
    // const [variantColor, setVariantColor] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [store, setStore] = useState(null)
    const storeRating = useAppSelector(storeRatings)
    const sliderRef = useRef<any>();
    const [deliveryFeeData, setDeliveryFeeData] = useState(0)
    const [productRating, setProductRating] = useState<any>(null)




    const initialValues = {
        state: '',
        city: ''
    }


    const handleLandMark = (data: any) => {

    }

    const { values, errors, touched, handleChange, handleSubmit, handleBlur } =
        useFormik({
            initialValues,
            validationSchema: yup.object().shape({
                city: yup.string().required('City is required'),
                state: yup.string().required('State is required'),
            }),
            onSubmit: (data: { state: string, city: string }) => handleLandMark(data),
        });

    useEffect(() => {
        const getDeliveryFee = async () => {
            const payload = {
                product_id: productDetail?.id,
                location: {
                    state: values.state,
                    city: values.city,
                    street: values.city
                }

            }

            try {
                var response = await dispatch(deliveryFee(payload))
                if (deliveryFee.fulfilled.match(response)) {
                    setDeliveryFeeData(response?.payload?.delivery_Fee)
                }
                else {
                    var errMsg = response.payload as string
                    //   toast.error(errMsg)
                }
            }
            catch (e) {
                console.log({ e })
            }
        }

        if (values?.city.length > 1) {
            getDeliveryFee()
        }
    }, [values.city])

    useEffect(() => {
        const fetchRating = () => {
            dispatch(fetchReviews(productDetail?.id)).then(dd => {
                setProductRating(dd?.payload)
            })
        }
        fetchRating()
    }, [productDetail?.id])

    useEffect(() => {
        dispatch(getProductBySlugBuyer(slugName))
            .then(async (d: any) => {
                const act = d?.payload?.product_variants?.filter((dd: any) => dd.status === 'ACTIVE')

                setActiveVariant({
                    image: act ? act[0]?.img_urls : ['https://res.cloudinary.com/doouwbecx/image/upload/v1660556942/download_fcyeex.png', 'https://res.cloudinary.com/doouwbecx/image/upload/v1660556942/download_fcyeex.png'],
                    price: act && act[0]?.product_variant_specs[0]?.amount,
                    size: act && act[0]?.product_variant_specs[0]?.size,
                    quantity: act && act[0]?.product_variant_specs[0]?.quantity,
                    specId: act && act[0]?.product_variant_specs[0]?.id,
                    variantId: act && act[0]?.id
                })
                setVariantList(act)
                setVariantSpec(act && act[0]?.product_variant_specs)
                setProductDetail(d.payload)

                // setVariantColor(colors)
            }
            )
        if (getUserToken) {
            dispatch(getCarts())
            dispatch(getStoreRating(productDetail?.sidehustle?.id))
        }
    }, [slugName])


    const handleImageChange = (data: any) => {
        setActiveVariant({
            image: data?.img_urls,
            price: data?.product_variant_specs[0]?.amount,
            size: data?.product_variant_specs[0]?.size,
            quantity: data?.product_variant_specs[0]?.quantity,
            specId: data?.product_variant_specs[0]?.id,
            variantId: data?.id
        })
        setVariantSpec(data?.product_variant_specs)
        setQuantity(1)
    }

    const handleSizeChange = (data: any) => {
        setActiveVariant({
            image: activeVariant?.image,
            price: data?.amount,
            size: data?.size,
            quantity: data?.quantity,
            specId: data?.id,
            variantId: activeVariant?.variantId
        })
        setQuantity(1)
    }

    const increment = () => {
        if (quantity >= activeVariant?.quantity) {
            //   toast.error("Quantity in stock exceeded")
            return;
        }
        setQuantity(prev => prev + 1)
    }

    const decrement = () => {
        setQuantity(prev => prev === 1 ? prev : prev - 1)
    }


    const addItemToCart = async () => {
        const data = {
            product_id: productDetail?.id,
            quantity: quantity,
            product_variant_id: activeVariant?.variantId,
            product_variant_spec_id: activeVariant?.specId,
        };

        const offlineData = {
            productId: productDetail?.id,
            variantImg: activeVariant.image,
            variantId: activeVariant?.variantId,
            name: productDetail?.name,
            quantity: quantity,
            price: activeVariant?.price,
            productQuantity: activeVariant?.quantity,
            specId: activeVariant?.specId,
            size: activeVariant?.size
        };

        setLoader(true)
        if (getUserToken) {
            var res = await dispatch(addToCart(data))
            if (addToCart.fulfilled.match(res)) {
                setLoader(false)
                console.log({ res })
                // return toast.success("Product Added to Cart Successfully")
                return Notifier.showNotification({
                    title: 'Product Added to Cart Successfully',
                    // description: "tghdddfdfd",
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });

            }
            else {
                setLoader(false)
                const errMsg = res.payload as string

                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
                // toast.error(errMsg)
            }

        }
        else {

            var getExisting = await AsyncStorage.getItem('cart').then((req: any) => JSON.parse(req))
                .then(json => json)
                .catch(error => console.log('error!')) || [];
            const updatedData = [...getExisting, offlineData];
            await AsyncStorage.setItem(
                'cart',
                JSON.stringify(updatedData)
            ).then(() => {
                setLoader(false)
                return Notifier.showNotification({
                    title: 'Product Added to Cart Successfully',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
            })



        }


    }



    const buyNow = async () => {
        const data = {
            product_id: productDetail?.id,
            quantity: quantity,
            product_variant_id: activeVariant?.variantId,
            product_variant_spec_id: activeVariant?.specId,
        };

        const offlineData = {
            productId: productDetail?.id,
            variantImg: activeVariant.image,
            variantId: activeVariant?.variantId,
            name: productDetail?.name,
            quantity: quantity,
            price: activeVariant?.price,
            productQuantity: activeVariant?.quantity,
            specId: activeVariant?.specId,
            size: activeVariant?.size
        };

        setLoader2(true)
        if (getUserToken) {
            var res = await dispatch(addToCart(data))
            if (addToCart.fulfilled.match(res)) {
                setLoader2(false)
                props.navigation.navigate('CartScreen')
                return Notifier.showNotification({
                    title: 'Product Added to Cart Successfully',
                    // description: "tghdddfdfd",
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
            }
            else {
                setLoader(false)
                const errMsg = res.payload as string
                // toast.error(errMsg)
            }

        }
        else {
            var getExisting = await AsyncStorage.getItem('cart').then((req: any) => JSON.parse(req))
                .then(json => json)
                .catch(error => console.log('error!')) || [];
            const updatedData = [...getExisting, offlineData];
            await AsyncStorage.setItem(
                'cart',
                JSON.stringify(updatedData)
            ).then(() => {
                setLoader2(false)
                props.navigation.navigate('CartScreen')
                return Notifier.showNotification({
                    title: 'Product Added to Cart Successfully',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'error',
                    },
                });
            })
        }

    
    }

    const locationState = locationData?.map((data: locationProp) => data?.state);

    const locationCity = locationData?.find(
        (data: locationProp) => data?.state === values?.state,
    )?.city;



    const excellent = productRating?.filter((data: any) => data?.rating === 5)
    const good = productRating?.filter((data: any) => data?.rating === 4)
    const average = productRating?.filter((data: any) => data?.rating === 3)
    const poor = productRating?.filter((data: any) => data?.rating === 2)
    const terrible = productRating?.filter((data: any) => data?.rating === 1)

    const renderVarList = ({ item, i }: any) => {
        return <Pressable onPress={() => handleImageChange(item)}>
            <View style={styles.cat} key={i}>
                <Image style={styles.img} source={{ uri: item?.img_urls[0] }} />
            </View>
        </Pressable>
    }

    const renderSizeList = ({ item, i }: any) => {
        return <Pressable onPress={() => handleSizeChange(item)}>
            <View key={i} style={[{ backgroundColor: item?.size === activeVariant?.size ? colors.bazaraTint : colors.black }, styles.sizeView]}>
                <Text text={item?.size} textAlign='center' fontSize={hp(16)} />
            </View>
        </Pressable>
    }
    const sizeVarList = variantList?.filter((a: any) => a['color'] !== null)


    const source = {
        html: `${productDetail?.description}`,
    };
    const tagsStyles = {
        body: {
            color: 'white',
        },
        a: {
            color: 'blue'
        }
    };

    const renderViewMore = (onPress: any) => {
        return (
            <Text onPress={onPress} text='View more' color={colors.accent} />
        )
    }
    const renderViewLess = (onPress: any) => {
        return (
            <Text onPress={onPress} text='View less' color={colors.accent} />
        )
    }


    return (
        <SafeAreaView style={globalStyles.containerWrapper}>
            <MobileHeader categoryName={'Product detail page'} props={props} />
            <View style={styles.imageContainer}>
                <Slick style={styles.wrapper} showsButtons={false}>
                    {
                        activeVariant?.image?.map((data: any) => {
                            return <View>
                                <Image style={styles.imgSlick} source={{ uri: data?.length > 0 ? data : "https://res.cloudinary.com/doouwbecx/image/upload/v1660556942/download_fcyeex.png" }} />
                            </View>
                        })
                    }
                </Slick>
            </View>
            <ScrollView>
                <View style={[globalStyles.rowBetween, styles.pd]}>
                    <TouchableOpacity>
                        <View>
                            <Text style={styles.txt} text='Visit Store' fontSize={hp(18)} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View>

                            <Text text={`${productDetail?.rating === undefined ? 'N/A' : productDetail?.rating} stars`} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text
                        text={`₦${numberFormat(Number(activeVariant?.price) || 0)}`}
                        fontSize={hp(18)}
                        color={colors.accent}
                        numberOfLines={1}
                        fontWeight={'600'}
                        style={{ marginTop: hp(5) }}
                    />
                </View>
                {variantList?.some((vd: any) => vd['color'] !== null) &&
                    <View style={styles.contView}>
                        <Text style={styles.sizeText} text='Available Colors' fontSize={hp(18)} />
                        <FlatList
                            data={sizeVarList}
                            keyExtractor={(item) => item?.id}
                            renderItem={renderVarList}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                }
                {variantSpec?.some((vd: any) => vd['size'] !== null) &&
                    <View style={styles.contView}>
                        <Text style={styles.sizeText} text='Available Sizes' fontSize={hp(18)} />
                        <FlatList
                            data={variantSpec}
                            keyExtractor={(item) => item?.id}
                            renderItem={renderSizeList}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                }
                <View style={[styles.contView, styles.row]}>
                    <Text text='Quantity' fontSize={hp(18)} />
                    <Text text='*' color='red' fontSize={hp(18)} />
                </View>
                <View style={[styles.rowDiv]}>
                    <Pressable onPress={() => decrement()}>
                        <View style={styles.box}>
                            <Text text='-' fontWeight='bold' fontSize={hp(18)} />
                        </View>
                    </Pressable>
                    <Text text={quantity?.toString()} fontSize={hp(18)} />
                    <Pressable onPress={() => increment()}>
                        <View style={styles.box}>
                            <Text text='+' fontSize={hp(18)} />
                        </View>
                    </Pressable>
                </View>

                <View style={styles.contView}>
                    <Text fontSize={hp(18)} text='Delivery in 5 - 7 days between Monday, August 8 - Wednesday, August 9.' />
                </View>
                <View style={[styles.contView, styles.row]}>
                    <Text
                        text={`₦${numberFormat(Number(deliveryFeeData) || 0)}`}
                        fontSize={hp(16)}
                        color={colors.accent}
                        numberOfLines={1}
                        fontWeight={'600'}
                    />
                    <Text fontSize={hp(16)} text=' Shipping fee to' />
                </View>
                <View style={styles.contView}>
                    <Text text='Description' fontSize={hp(18)} />
                    <ViewMoreText
                        numberOfLines={1}
                        renderViewMore={renderViewMore}
                        renderViewLess={renderViewLess}
                    >
                        <RenderHtml
                            contentWidth={width}
                            source={source}
                            tagsStyles={tagsStyles}
                        />
                    </ViewMoreText>
                </View>
                <View style={styles.contView}>
                    <Text text='Delivery & Returns' fontSize={hp(18)} />
                    <Text fontSize={hp(16)} text='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
                </View>
                <View style={styles.contView}>
                    <Text text='Choose a Location' style={styles.locationText} fontSize={hp(18)} />
                    <View style={styles.dp}>
                        <Select
                            items={locationState}
                            defaultValue={values.state}
                            placeholder={'Choose State'}
                            setState={handleChange('state')}
                            errorMsg={touched.state ? errors.state : undefined}
                        />
                    </View>
                    <View style={styles.dp}>
                        <Select
                            items={locationCity}
                            defaultValue={values.city}
                            placeholder={'Choose City'}
                            setState={handleChange('city')}
                            errorMsg={touched.city ? errors.city : undefined}
                        />
                    </View>

                </View>
                <View >
                    <Text text='Customers Feedback' fontSize={hp(18)} />
                    <Text text={`${productRating ? productRating?.length : 0} review`} />
                </View>
                <View style={globalStyles.rowBetween}>
                    <View style={styles.textDiv}>
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
                    <View style={styles.textDiv}>
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
                    <View style={styles.textDiv}>
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
                    <View style={styles.textDiv}>
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
                    <View style={styles.textDiv}>
                        <Text text='Terrible' fontSize={hp(16)} />
                    </View>
                    <View style={styles.progressDiv}>
                        <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={terrible ? (terrible?.length / 1000) : 0} width={200} />
                    </View>
                    <View>
                        <Text text={terrible ? terrible?.length : 0} fontSize={hp(16)} />
                    </View>
                </View>
                {
                    productRating?.map((data: any) => {
                        return <CommentCard
                            image={data?.user?.img_url}
                            name={data?.user?.first_name + " " + data?.user?.last_name}
                            comment={data?.comment?.comment}
                            date={data?.created_at}
                            rate={data?.rating}
                            id={data?._id}
                            reply={data?.comment?.reply}
                            commentId={data?.comment?.id}
                            productOwner={productDetail?.user_id}
                        />
                    })
                }
                <View style={styles.br}></View>
            </ScrollView>
            <View style={styles.btn}>
                <Button style={styles.add} containerStyle={{ width: '48%' }} isLoading={loader} title='Add to Cart' onPress={addItemToCart} />
                <Button style={styles.buy} containerStyle={{ width: '48%' }} isLoading={loader2} title='Buy Now' onPress={buyNow} />
            </View>
        </SafeAreaView>
    )
}

export default ProductDetail

const styles = StyleSheet.create({
    imageContainer: {
        backgroundColor: 'black',
        width: '100%',
        height: hp(350)
    },
    txt: {
        textDecorationLine: 'underline'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    pd: {
        paddingVertical: hp(10)
    },
    img: {
        width: wp(40),
        height: hp(40)
    },
    imgSlick: {
        width: '100%',
        height: '100%'
    },
    sizeText: {
        marginVertical: hp(5)
    },
    contView: {
        marginVertical: hp(10)
    },
    cat: {
        marginRight: wp(10)
    },
    sizeView: {
        padding: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: wp(50),
        height: hp(50),
        marginRight: wp(15),
    },
    rowDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: colors.gray,
        borderWidth: 1,
        borderRadius: 5,
        width: wp(150),
        padding: wp(10)
    },
    box: {
        // width: wp(50),
        // height:hp(50)
    },
    locationText: {
        marginBottom: hp(10)
    },
    dp: {
        marginVertical: hp(3)
    },
    progress: {
        backgroundColor: 'white',
    },
    progressDiv: {
        width: '50%'
    },
    textDiv: {
        width: '20%'
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    br: {
        marginBottom: hp(10)
    },
    add: {
        backgroundColor: colors.darkBlack,
    },
    buy: {
        backgroundColor: colors.bazaraTint,
    },
    wrapper: {
    }
})