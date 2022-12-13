import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { getWishlist, removeFromWishlist } from '../redux/slices/Wishlist'
import { Notifier, NotifierComponents } from 'react-native-notifier'
import { hp, wp } from '../utils/helpers'
import MobileHeader from './Containers/MobileHeader'
import { Text } from '../components/common'
import { love, rem } from '../assets'
import { truncate } from '../utils/server'
import { colors } from '../utils/themes'
import EmptyState from './Containers/EmptyState'

const Wishlist = (props: any) => {
    const dispatch = useAppDispatch()

    const [wishlist, setWishlist] = useState<any>(null)


    useEffect(() => {
        dispatch(getWishlist()).then(dd => {
            setWishlist(dd?.payload)
        })
    }, [])

    const removeWishlist = async (id: string) => {
        try {
            const payload = {
                id
            }
            var response = await dispatch(removeFromWishlist(payload))
            if (removeFromWishlist?.fulfilled.match(response)) {
                Notifier.showNotification({
                    title: 'Item removed Successfully',
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
                dispatch(getWishlist()).then(dd => {
                    setWishlist(dd?.payload)
                })
            }
            else {
                var errMsg = response?.payload as string
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
        <View style={styles.container}>
            <MobileHeader categoryName={'My Saved Items'} props={props} />
            {
                wishlist?.length > 0 && <>
                    <Text text={`You have ${wishlist?.length} saved items`} fontSize={hp(16)} lineHeight={30} />
                    <ScrollView showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}>
                        {
                            wishlist?.map((data: any) => {
                                return <View>
                                    <View style={styles.row}>
                                        <Image source={{ uri: data?.product_details?.product_variants?.img_urls[0] }} style={styles.img} />
                                        <View style={styles.row2}>
                                            <Pressable onPress={() => props?.navigation.navigate('ProductDetail', {
                                                params: {
                                                    id: data?.product_details?.slug
                                                }
                                            })}>
                                                <View>
                                                    <Text text={truncate(data?.product_details?.name, 30)} fontSize={hp(14)} />
                                                </View>
                                            </Pressable>
                                            <Pressable onPress={() => removeWishlist(data?.id)}>
                                                <View style={styles.row3}>
                                                    <Image source={rem} />
                                                    <Text text='REMOVE' fontSize={hp(12)} color={colors.bazaraTint} style={styles.tt} />
                                                </View>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            })
                        }
                    </ScrollView>
                </>
            }
            {
                wishlist?.length < 1 && <>
                    <EmptyState icon={love} header={'Items saved for later will appear here'} title={'No Item Saved'}
                    />
                </>
            }
        </View>
    )
}

export default Wishlist

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: hp(15),
        paddingTop: Platform.OS === 'ios' ? hp(20) : hp(15),
        backgroundColor: 'black',
        flex: 1,
    },
    img: {
        width: wp(50),
        height: hp(50),
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        marginVertical: hp(10)
    },
    row2: {
        marginLeft: hp(10)
    },
    row3: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(10)
    },
    tt: {
        marginLeft: hp(5)
    }
})