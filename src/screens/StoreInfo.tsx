import { View, StyleSheet, Image, useWindowDimensions, FlatList, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { colors } from '../utils/themes'
import MobileHeader from './Containers/MobileHeader'
import { globalStyles } from '../styles'
import { hp, wp } from '../utils/helpers'
import { Text } from '../components/common/Text'
import { Rating } from 'react-native-ratings';
import ViewMoreText from 'react-native-view-more-text'
import RenderHtml from 'react-native-render-html';
import { useAppDispatch } from '../redux/hooks'
import { getAllStoreBySlugBuyer } from '../redux/slices/StoreSlice'
import { getProductBuyer } from '../redux/slices/productSlice'

import BuyerProductCard from '../components/resuable/BuyerProductCard'
import { ActivityIndicator } from 'react-native-paper'
import { orderSuccessRate } from '../redux/slices/orderSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import StarRating from 'react-native-star-rating'
import HTMLView from 'react-native-htmlview'

const StoreInfo = (props: any) => {
    const info = props?.route.params.params.store
    const [storeInfo, setStoreInfo] = useState<any>()
    const { width } = useWindowDimensions();
    const dispatch = useAppDispatch()
    const [products, setProducts] = useState<any>(null)
    const [loader, setLoader] = useState(false)
    const [success, setSuccess] = useState<number>()


    useEffect(() => {
        setLoader(true)
        const loadData = async () => {
            var activeId = await AsyncStorage.getItem('activeId') as string
            dispatch(getAllStoreBySlugBuyer(info?.slug)).then(async data => {
                setStoreInfo(data?.payload)
                await dispatch(getProductBuyer()).then(dd => {
                    setProducts(dd?.payload)
                    setLoader(false)
                }
                )
            })
            dispatch(orderSuccessRate(activeId)).then(data => {
                var rate = (data?.payload?.order_success_rating / 100) * 5
                var pp = Math.round(rate * 10) / 10
                setSuccess(pp)
            })
        }
        loadData()
    }, [info?.slug])

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

    const source = {
        html: `${storeInfo?.description ? storeInfo?.description : 'N/A'}`,
    };
    const htmlContent = `${storeInfo?.description ? storeInfo?.description : 'N/A'}`;

    const tagsStyles = {
        body: {
            color: 'white',
        },
        a: {
            color: 'blue'
        }
    };

    const pdList = products?.filter((bb: any) => bb?.store?.slug === info?.slug)

    const renderItem = ({ item }: any) => (
        <BuyerProductCard item={item} />

    );

    if (loader) {
        return <View style={styles.container}>
            <ActivityIndicator />
        </View>
    }

    return (
        <View style={styles.container}>
            <MobileHeader
                props={props}
                categoryName="Store detail page"
            />
            <View style={styles.br} />
            <View style={globalStyles.rowStart}>
                <View style={styles.div1}>
                    <Image style={styles.img} source={{ uri: info?.img_url }} />
                </View>
                <View style={styles.div2}>
                    <Text text={info?.brand_name} fontSize={hp(16)} fontWeight='700' />
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        <Rating
                            type='custom'
                            startingValue={info?.rating || 0}
                            ratingCount={5}
                            ratingBackgroundColor='white'
                            imageSize={15}
                            ratingColor={colors.bazaraTint}
                            tintColor='black'
                            style={{ paddingVertical: 5 }}
                            readonly
                        />
                    </View>
                    <Text text={`${info?.rating ? info?.rating : 'N/A'} stars (${storeInfo?.ratingCount ? storeInfo?.ratingCount : 0} review(s))`} fontSize={hp(16)} fontWeight='700' />

                </View>
            </View>
            <View style={styles.br} />
            <Text text='Store Description' fontSize={hp(18)} fontWeight='400' />
            {/* <ViewMoreText
                numberOfLines={1}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
            >
                <RenderHtml
                    contentWidth={width}
                    source={source}
                    tagsStyles={tagsStyles}
                />
            </ViewMoreText> */}
            <HTMLView
                value={htmlContent}
                stylesheet={styles}
            />
            <View style={styles.br} />
            <Text text='Seller Performance' fontSize={hp(18)} fontWeight='400' />
            <View style={styles.meld}>
                <View style={globalStyles.rowBetween}>
                    <Text text='Successful order rate:' />
                    {/* <Text text='Excellent' /> */}
                    <StarRating
                        maxStars={5}
                        starSize={20}
                        rating={success ? success : 0}
                        fullStarColor={colors.bazaraTint}
                        disabled
                    />
                </View>
            </View>
            {/* <View style={styles.meld}>
                <View style={globalStyles.rowBetween}>
                    <Text text='Customer rating:' />
                    <Text text='Excellent' />
                </View>
            </View> */}
            <View style={styles.br} />
            <Text text='Other Items' fontSize={hp(18)} fontWeight='400' />
            <FlatList
                data={pdList}
                renderItem={renderItem}
                keyExtractor={(item: any) => item?.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default StoreInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingHorizontal: hp(10),
        paddingTop: Platform.OS === 'ios' ? hp(20) : hp(15),
    },
    br: {
        marginVertical: hp(15)
    },
    img: {
        width: wp(130),
        height: hp(130),
        borderRadius: 65,
    },
    div1: {
        width: '45%',
    },
    div2: {
        width: '55%',
    },
    meld: {
        marginVertical: hp(8)
    },
    p: {
        fontWeight: '300',
        color: 'white',
    },
    div: {
        color: 'white'
    },
    a: {
        color: colors.bazaraTint
    },
    li: {
        color: 'white'
    },
    ul: {
        color: 'white'
    }
})