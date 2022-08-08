import React, { useEffect } from 'react';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { StatusBar, View, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import { SafeAreaView, Text } from '../../../components/common';
import { colors } from '../../../utils/themes';
import { globalStyles } from "../../../styles/globalStyles"
import StoreHeader from '../../../components/resuable/StoreHeader';
import ScrollCard from '../../../components/resuable/ScrollCard';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { LockClosed, LockOpened, Sale, Profile, Union } from '../../../constants/images';
import ListCard from '../../../components/resuable/ListCard';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { filteredStaffs, getPayouts, getPersonalStore, getStaff, myStore, payouts } from '../../../redux/slices/StoreSlice';
import { ArrayType } from '../../../utils/types';
import { hp, wp } from '../../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllOrders, selectedOrders } from '../../../redux/slices/orderSlice';
import { getAllProducts, myProducts } from '../../../redux/slices/productSlice';
import { numberFormat } from '../../../utils/helpers';
import {
    LineChart,
    BarChart,
  } from "react-native-chart-kit";
  

export const Home = (): JSX.Element => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch()
  const myStoreList = useAppSelector(myStore)
  const orders = useAppSelector(selectedOrders)
  const payoutData = useAppSelector(payouts)
  const AllStaffs = useAppSelector(filteredStaffs)
  const myproducts = useAppSelector(myProducts)
  AsyncStorage.setItem('activeId', myStoreList[0]?.id)

  const data={
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ]
      }
    ]
  }

  const ViewsData={
    labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100)
        ]
      }
    ]
  }

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => colors.bazaraTint,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const AnalyticsData = [
     {
      id: 1,
      title: "Expected Earning",
      value: myStoreList[0]?.wallet?.escrow,
      icon: LockClosed,
     },
     {
      id: 2,
      title: "Store Balance",
      value: myStoreList[0]?.wallet?.balance,
      icon: LockOpened,
     }

  ]

  const StoreInfoData = [
    {
     id: 1,
     title: "Product",
     value: myproducts?.length,
     icon: Union,
    },
    {
     id: 2,
     title: "Staff",
     value: AllStaffs?.length,
     icon: Profile,
    }

 ]

  const AnalyticsRender = ({item}) => (
    <View style={styles.analyticsCard}>
        <Image resizeMode='contain' source={item.icon} style={styles.image} />
        <Text text={item.title} fontWeight='300' fontSize={hp(14)}/>
        <Text text={`₦ ${numberFormat(item.value)}`} fontWeight='600' fontSize={hp(20)}/>
    </View>
  )

  const StoreInfoRender = ({item}) => (
    <View style={styles.storeInfoCard}>
        <View style={globalStyles.rowStart}>
            <Image resizeMode='contain' source={item.icon} style={[styles.miniimage, {tintColor: colors.bazaraTint}]} />
            <Text text={item.title} fontWeight='600' fontSize={hp(18)} style={{marginLeft: wp(20)}}/>
        </View>
        <Text text={item.value} fontWeight='bold' fontSize={hp(30)}/>
    </View>
  )

  return (
    <SafeAreaView>
      <StatusBar translucent={true} backgroundColor={'white'} />
      <ScrollView>
        <StoreHeader name={myStoreList[0]?.brandName} slug={myStoreList[0]?.slug} />
        <View style={styles.analyticsHolder}>
            <View style={[globalStyles.lowerContainer, {width: wp(280)}]}>
                <Text text="Analytics" fontWeight='600' fontSize={hp(14)}/>
            </View>
            {
                AnalyticsData.map((val) => {
                    return (
                        <AnalyticsRender item={val}/>
                    )
                })
            }
        </View>
        <FlatList
            data={StoreInfoData}
            renderItem={StoreInfoRender}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
        <View style={styles.graphHolder}>
            <View style={[globalStyles.lowerContainer, {width: wp(300)}]}>
                <Text text="Total Sales" fontWeight='600' fontSize={hp(15)}/>
            </View>
            <LineChart
            data={data}
            width={wp(330)}
            height={220}
            chartConfig={chartConfig}
            bezier
            />
        </View>
        <View style={styles.graphHolder}>
            <View style={[globalStyles.lowerContainer, {width: wp(300)}]}>
                <Text text="Store Views" fontWeight='600' fontSize={hp(15)}/>
            </View>
            <BarChart
            // style={graphStyle}
            data={ViewsData}
            width={wp(310)}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  analyticsCard: {
    width: wp(280), 
    height: hp(140),
    backgroundColor: colors.primaryBg,
    marginBottom: hp(10),
    alignSelf: 'center',
    borderRadius: hp(5),
    padding: hp(20),
    justifyContent: 'space-between'
  },
  storeInfoCard: {
    width: wp(170),
    height: wp(120),
    backgroundColor: colors.darkBlack,
    marginTop: hp(20),
    marginLeft: wp(20),
    borderRadius: hp(5),
    padding: wp(20),
    justifyContent: 'space-between'
  },
  analyticsHolder: {
    width: '90%',
    paddingVertical: hp(20),
    marginTop: hp(30),
    alignSelf: 'center',
    backgroundColor: colors.darkBlack,
    borderRadius: hp(5)
  },
  graphHolder: {
    width: '90%',
    paddingVertical: hp(20),
    marginTop: hp(30),
    alignSelf: 'center',
    backgroundColor: colors.darkBlack,
    borderRadius: hp(5),
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: wp(30),
    height: wp(30),
  },
  miniimage: {
    width: wp(25),
    height: wp(25),
  },
});
