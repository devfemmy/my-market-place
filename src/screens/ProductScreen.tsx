/* eslint-disable @typescript-eslint/no-unsafe-return */
import { View, StyleSheet, ScrollView, Pressable, TouchableOpacity, RefreshControl, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getProduct, products } from '../redux/slices/productSlice'
import { hp } from '../utils/helpers'
import { Text } from '../components/common'
import { Input } from '../components/common/TextInput'
import EmptyState from './Containers/EmptyState'
import { notify, productLogo } from '../assets'
import ProductCard from './Containers/ProductCard'
import ButtonPlus from './Containers/ButtonPlus'
import { myStore } from '../redux/slices/StoreSlice'
import { NoProduct } from './SellerScreens/main/Product/Empty'
import { Products } from './SellerScreens/main/Product/Products'
import { globalStyles } from '../styles/globalStyles'
import Entypo from 'react-native-vector-icons/Entypo'
import { colors } from '../utils/themes'
import { useIsFocused } from "@react-navigation/native";


const wait = (timeout: any) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


const ProductScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch()
    const mystore = useAppSelector(myStore)
    const prod = useAppSelector(products)
    const [productList, setProductList] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [stateLoader, setStateLoader] = useState(false)
    const [id, setId] = useState('')
    const [activeName, setActiveName] = useState('')
    const isFocused = useIsFocused();


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const filteredData = productList?.filter((dd: any) => dd?.name?.toLowerCase().includes(searchValue.toLowerCase()))


    useEffect(() => {
        const loadAsyn = async () => {
            var id = await AsyncStorage.getItem('activeId') as string
            var name = await AsyncStorage.getItem('activeName') as string

            await dispatch(getProduct(id)).then(data => {
                setStateLoader(false)
                setProductList(data?.payload)
            })
            setStateLoader(false)

            setId(id)
            setActiveName(name)
        }
        loadAsyn()
    }, [id, productList?.length, isFocused])


    // useEffect(() => {
    //     setStateLoader(true)
    //     const loadData = async () => {
    //         await dispatch(getProduct(id)).then(data => {
    //             setStateLoader(false)
    //             setProductList(data?.payload)
    //         })
    //         setStateLoader(false)
    //     }

    //     loadData()

    // }, [id])


    const handleChange = (e: any) => {
        setSearchValue(e.target.value)
    }

    const routePage = () => {
        return navigation.navigate('AddProduct')
    }
    return (
        <View style={styles.container}>
            <View>
                <Text style={{ textTransform: 'capitalize' }} text={`${activeName} (${filteredData?.length})`} fontSize={hp(18)} />
                <Input label={'Search for products'} value={searchValue} onChangeText={(e) => setSearchValue(e)} searchInput />
            </View>
            {filteredData?.length < 1 && <EmptyState
                icon={notify}
                title="No Products Yet"
                header='Add products to your store to start selling'
                btn={true}
                route="AddProduct"
                btnText="Add Product"
            />
            }
            <TouchableOpacity onPress={() => routePage()} style={[globalStyles.floating_button, { bottom: hp(20), right: hp(20) }]}>
                <Entypo name={'plus'} size={hp(35)} style={{ color: colors.white }} />
            </TouchableOpacity>
            {/* <ButtonPlus handleClick={() => navigation.navigate('AddProduct')} /> */}
            <View style={{ zIndex: -3, elevation: -3 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {
                        filteredData?.length >= 1 && <View style={styles.lit}>
                            {
                                filteredData?.map((data: any, i: number) => {
                                    return <ProductCard key={i} data={data} setProductList={setProductList} id={id} />
                                })
                            }


                        </View>
                    }

                </ScrollView>

            </View>
        </View>
    )
}

export default ProductScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: Platform.OS === 'ios' ? hp(25) : hp(25),
        paddingHorizontal: hp(15)
    },
    lit: {
        flex: 1,
        marginBottom: hp(40),
    }
})