import { View, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getProduct } from '../redux/slices/productSlice'
import { hp } from '../utils/helpers'
import { Text } from '../components/common'
import { Input } from '../components/common/TextInput'
import EmptyState from './Containers/EmptyState'
import { productLogo } from '../assets'
import ProductCard from './Containers/ProductCard'
import ButtonPlus from './Containers/ButtonPlus'
import { myStore } from '../redux/slices/StoreSlice'
import { NoProduct } from './SellerScreens/main/Product/Empty'
import { Products } from './SellerScreens/main/Product/Products'


const ProductScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch()
    const mystore = useAppSelector(myStore)
    const [productList, setProductList] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [stateLoader, setStateLoader] = useState(false)
    const [id, setId] = useState('')
    const [activeName, setActiveName] = useState('')

    useEffect(() => {
        const loadAsyn = async () => {
            var id = await AsyncStorage.getItem('activeId') as string
            var name = await AsyncStorage.getItem('activeName') as string

            setId(id)
            setActiveName(name)
        }
        loadAsyn()
    }, [id])

    useEffect(() => {
        setStateLoader(true)
        const loadData = async () => {
            await dispatch(getProduct(id)).then(data => {
                setStateLoader(false)
                setProductList(data?.payload)
            })
            setStateLoader(false)
        }

        loadData()

    }, [id])

    const handleChange = (e: any) => {
        setSearchValue(e.target.value)
    }
    return (
        <View style={styles.container}>
            <View>
                <Text style={{textTransform: 'capitalize'}} text={`${activeName} (${productList?.length})`} fontSize={hp(18)} />
                <Input label={'Search for products'} searchInput />
            </View>
            {productList?.length < 1 && <EmptyState
                icon={productLogo}
                title="No Products Yet"
                header='Add products to your store to start selling'
                btn={true}
                route="AddProduct"
                btnText="Add Product"
            />
            }

            <ScrollView>
            {
                productList?.length >= 1 && <View style={styles.lit}>
                    {
                        productList?.map((data: any, i: number) => {
                            return <ProductCard key={i} data={data} setProductList={setProductList} />
                        })
                    }

                    <ButtonPlus handleClick={() => navigation.navigate('AddProduct')} />
                </View>
            }
            
            </ScrollView>
        </View>
    )
}

export default ProductScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: hp(10)
    },
    lit: {
        height: hp(800),
        flex: 1
    }
})