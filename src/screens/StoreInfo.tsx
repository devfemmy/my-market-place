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

const StoreInfo = (props: any) => {
    const info = props?.route.params.params.store
    const [storeInfo, setStoreInfo] = useState<any>()
    const { width } = useWindowDimensions();
    const dispatch = useAppDispatch()
    const [products, setProducts] = useState<any>(null)
    const [loader, setLoader] = useState(false)


    useEffect(() => {
        setLoader(true)
        const loadData = async () => {
            dispatch(getAllStoreBySlugBuyer(info?.slug)).then(async data => {
                setStoreInfo(data?.payload)
                await dispatch(getProductBuyer()).then(dd => {
                    setProducts(dd?.payload)
                    setLoader(false)
                }
                )
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
    const tagsStyles = {
        body: {
            color: 'white',
        },
        a: {
            color: 'blue'
        }
    };

    const pdList = products?.filter((bb: any) => bb?.store?.slug === info?.slug)

    const renderItem = ({item}: any) => (
        <BuyerProductCard item={item} />
        
    );

    if(loader){
        return  <View style={styles.container}>
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
                <View style={styles.div}>
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
            <View style={styles.br} />
            <Text text='Seller Performance' fontSize={hp(18)} fontWeight='400' />
            <View style={styles.meld}>
                <View style={globalStyles.rowBetween}>
                    <Text text='Order fulfilment rate:' />
                    <Text text='Excellent' />
                </View>
            </View>
            <View style={styles.meld}>
                <View style={globalStyles.rowBetween}>
                    <Text text='Successful order rate:' />
                    <Text text='Excellent' />
                </View>
            </View>
            <View style={styles.meld}>
                <View style={globalStyles.rowBetween}>
                    <Text text='Customer rating:' />
                    <Text text='Excellent' />
                </View>
            </View>
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
    div: {
        width: '45%',
    },
    div2: {
        width: '55%',
    },
    meld: {
        marginVertical: hp(8)
    }
})