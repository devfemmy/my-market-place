import React, { useContext, useState, useEffect } from 'react'
import { Pressable, StyleSheet, Switch, View } from 'react-native'
import { globalStyles } from '../../styles'
import { SafeAreaView, Text, Separator } from '../../components/common';
import { styles } from '../auth/Login/styles';
import { Button } from '../../components/common/Button';

import { AuthContext } from '../../context/context';
import { hp } from '../../utils/helpers';
import { colors } from '../../utils/themes';
import { blueUni, blueUser, storeActive, truckLogo, universityLogo, usersLogo } from '../../assets';
import ListCard from '../../components/resuable/ListCard';
import { ArrayType } from '../../utils/types';
import { useNavigation } from '@react-navigation/native'
import { Nav } from '../../utils/types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getStoreById, storebyId, updateStore } from '../../redux/slices/StoreSlice';
import CustomModal from '../../components/common/CustomModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = () => {
    const navigation = useNavigation<Nav>();
    const dispatch = useAppDispatch()
    const { signOut } = useContext(AuthContext)
    const [title, setTitle] = useState('')
    const [type, setType] = useState(false)
    const [visible, setVisible] = useState(false)
    const storeIdData = useAppSelector(storebyId)
    const [activeId, setActiveId] = useState('')
    const [isEnabled, setIsEnabled] = useState(storeIdData?.status === 'active' ? true : false);


    const handleVisible = () => {
        setVisible(false)
    }

    45
useEffect(() => {
        const loadActiveId = async () => {
            const id = await AsyncStorage.getItem('activeId')
            dispatch(getStoreById(id))
            setActiveId(id)
        }
        loadActiveId()
    }, [activeId])


const toggleSwitch = async () => {
        setIsEnabled(previousState => !previousState)
        const payload = {
            id: activeId,
            brandName: storeIdData.brandName,
            description: storeIdData.description,
            imgUrl: storeIdData?.imgUrl,
            address: storeIdData?.location?.street + " " + storeIdData?.location?.city + " " + storeIdData?.location?.state,
            phoneNumber: storeIdData.phoneNumber,
            status: isEnabled ? 'inactive' : 'active',
            location: {
                state: storeIdData?.location?.state,
                city: storeIdData?.location?.city,
                street: storeIdData?.location?.street,
            },
        }

        const resultAction = await dispatch(updateStore(payload))
        if (updateStore.fulfilled.match(resultAction)) {
            setType(true)
            setTitle('Store updated successfully')
            setVisible(true)
        }
        else {
            setType(false)
            setTitle('Unable to update store')
            setVisible(true)
        }
    }

    const LogOut = async () => {
        signOut(null)
        AsyncStorage.clear()
    }

    const quickActionArray = [
        {
            id: 1,
            title: "Store Information",
            icon: storeActive,
            route: 'EditStore'
        },
        {
            id: 2,
            title: "User / Staff Management",
            icon: usersLogo,
            route: ''
        },
        {
            id: 3,
            title: "Delivery / Shipping Fee",
            icon: truckLogo,
            route: 'DeliveryScreen'
        },
        {
            id: 4,
            title: "Reviews and Ratings (4,5)",
            icon: universityLogo,
            route: ''
        }

    ]

    const quickActionPersonal = [
        {
            id: 1,
            title: "Profile",
            icon: blueUser,
            route: 'Profile'
        },
        {
            id: 2,
            title: "Payout Bank Account",
            icon: blueUni,
            route: 'Account'
        }

    ]

    return (
        <SafeAreaView>
            <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
                <Text text='Store Information' fontSize={hp(22)} fontWeight="600" lineHeight={28} />
                <Pressable onPress={LogOut}>
                    <Text text='Log out' fontSize={hp(16)} fontWeight="600" color={colors.bazaraTint} />
                </Pressable>
            </View>
            <View style={[localStyle.mTop, styles.width90]}>
                {
                    quickActionArray?.map((data: ArrayType) => {
                        return <ListCard key={data?.id} {...data} />
                    })
                }
            </View>
            <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
                <Text text='Personal Information' fontSize={hp(16)} fontWeight="600" lineHeight={28} />
            </View>
            <View style={[localStyle.mTop, styles.width90]}>
                {
                    quickActionPersonal?.map((data: ArrayType) => {
                        return <ListCard key={data?.id} {...data} />
                    })
                }
            </View>
            <View style={[globalStyles.rowBetween, styles.width90, localStyle.mTop]}>
                <Text text='Activate / Deactivate Store' fontSize={hp(16)} fontWeight="400" lineHeight={28} />
               <Switch
                    trackColor={{ false: colors.dimBlack, true: colors.bazaraTint }}
                    thumbColor={isEnabled ? colors.bazaraTint : colors.white}
                    ios_backgroundColor={colors.dimBlack}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
            <CustomModal
                handleVisible={handleVisible}
                visibleBoolean={visible}
                isSuccess={type}
                headerText={title}
            />
        </SafeAreaView>
    )
}

export default Setting


const localStyle = StyleSheet.create({
    mTop: {
        marginVertical: 10
    }
})


