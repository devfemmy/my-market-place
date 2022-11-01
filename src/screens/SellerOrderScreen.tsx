import { View, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getSellerOrders } from '../redux/slices/orderSlice'
import { globalStyles } from '../styles'
import { Text } from '../components/common'
import { hp } from '../utils/helpers'
import { Menu, Button } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo'
import { colors } from '../utils/themes'
import { Input } from '../components/common/TextInput'
import EmptyState from './Containers/EmptyState'
import { productLogo } from '../assets'
import OrderCard from './Containers/OrderCard'

const SellerOrderScreen = ({ navigation }: any) => {
    const dispatch = useAppDispatch()
    const [sellerOrderList, setSellerOrderList] = useState<any>(null)
    const [searchValue, setSearchValue] = useState('')
    const [status, setStatus] = useState("All")
    const [stateLoader, setStateLoader] = useState(false)
    const [id, setId] = useState('')
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);

    const closeMenu = () => setVisible(false)

    const filterData = status === "All" ? sellerOrderList : sellerOrderList?.filter((d: any) => d.status === status)

    useEffect(() => {
        const loadAsyn = async () => {
            var id = await AsyncStorage.getItem('activeId') as string
            setId(id)
        }
        loadAsyn()
    }, [])


    useEffect(() => {
        setStateLoader(true)
        const loadData = async () => {
            const payload = {
                id,
                status
            }
            await dispatch(getSellerOrders(payload)).then(data => {
                setSellerOrderList(data?.payload)
            })
            setStateLoader(false)
        }
        loadData()
    }, [id, status])


    return (
        <View style={styles.container}>
            <View style={globalStyles.rowBetween}>
                <Text text={`Orders (${filterData?.length})`} fontSize={hp(18)} fontWeight='600' />
                <View>
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<Button onPress={openMenu}> <Text text={status} /><Entypo name='dots-three-vertical' color={colors.white} />

                        </Button>}>

                        <Menu.Item onPress={() => setStatus('All')} title={'All'} />
                        <Menu.Item onPress={() => setStatus('PENDING')} title={'Pending'} />
                        <Menu.Item onPress={() => setStatus('PROCESSING')} title={'Processing'} />
                        <Menu.Item onPress={() => setStatus('DISPATCHED')} title={'Dispatched'} />
                        <Menu.Item onPress={() => setStatus('CANCELLED')} title={'Cancelled'} />
                        <Menu.Item onPress={() => setStatus('REJECTED')} title={'Rejected'} />
                        <Menu.Item onPress={() => setStatus('COMPLETED')} title={'Completed'} />

                    </Menu>
                </View>
            </View>
            <View>
                <Input label={'Search for orders'} searchInput />
            </View>
            {filterData?.length < 1 && <EmptyState
                icon={productLogo}
                title="No Orders Yet"
                header='All your store orders will be listed here'

            />
            }

            <ScrollView>
            {
                filterData?.length >= 1 && filterData?.map((data: any, i: number) => {
                    return <OrderCard
                        key={i}
                        image={data?.variant_img_url}
                        name={data?.meta?.product_details?.name}
                        size={data?.size}
                        color={data?.color}
                        price={data?.amount}
                        receiverName={data?.delivery_information?.receivers_name}
                        receiverAddress={data?.delivery_information?.receivers_name}
                        orderId={data?.id}
                        status={data?.status}
                        handleClick={() => navigation.navigate('OrderDetails', {
                            params: {
                                id: data?.id
                            }
                        })}
                    />
                })

            }
            </ScrollView>
        </View>
    )
}

export default SellerOrderScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: hp(10)
    },
    txt: {

    }
})