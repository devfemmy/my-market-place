import React, {useContext, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { AuthContext } from '../../../context/context';
import { Button } from '../../../components/common/Button';
import {View, Image, ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';
import {globalStyles} from '../../../styles';
import {hp,wp} from '../../../utils/helpers';
import {NoProducts} from '../../../constants/images';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { reviews, getStoreReviews, loading } from '../../../redux/slices/StoreSlice';
import StarRating from 'react-native-star-rating';
import { colors } from '../../../utils/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar} from 'react-native-paper';

export const Reviews = (): JSX.Element => {

    const navigation = useNavigation<Nav>();

  const dispatch = useAppDispatch()
  const reviewData = useAppSelector(reviews)
  const loader = useAppSelector(loading)

//   useEffect(() => {
//     dispatch(getStoreReviews())
//   }, [])

    useEffect(() => {
        const loadActiveId = async () => {
            const id = await AsyncStorage.getItem('activeId')
            dispatch(getStoreReviews(id))
        }

        loadActiveId()
    }, [])

    const NumReviews = () => {
        const num = reviewData.length
        if (num > 1){
            return num.toString() + ' reviews'
        }else{
            return (num || 0) + ' review'
        }
    }

  if(loader){
    return (
        <SafeAreaView>
            <View style={[globalStyles.rowCenter, {flex: 1}]}>
                <ActivityIndicator size={'small'}/>
            </View>
        </SafeAreaView>
    )
  }

  const getStat = (num: number) => {
    const stat = []
    for(var i = 0; i < reviewData.length; i++){
        if(reviewData[i]?.rating > (num - 1) && reviewData[i]?.rating <= (num)){
            stat.push(reviewData[i])
        }
    }
    return stat.length / reviewData.length
  }

  const getNum = (num: number) => {
    const stat = []
    for(var i = 0; i < reviewData.length; i++){
        if(reviewData[i]?.rating > (num - 1) && reviewData[i]?.rating <= (num)){
            stat.push(reviewData[i])
        }
    }
    return stat.length
  }

  const Progress = (title: string, number: number) => {
    return (
        <View style={globalStyles.ratingsStats}>
            <Text
                text={title}
                fontSize={hp(12)}
                fontWeight='500'
                style={{width: hp(65)}}
            />
            <ProgressBar 
            style={{width: hp(200), marginHorizontal: hp(15), height: hp(10), borderRadius: hp(20)}} 
            progress={getStat(number) || 0} 
            color={colors.gold} 
            />
            <Text
                text={getNum(number)}
                fontSize={hp(12)}
                fontWeight='500'
            />
        </View>
    )
  }

  const Listheader = () => {
    return (
        <>
        <View style={globalStyles.ratingsContainer}>
            <Text
                text={reviewData[0]?.currentRate || 0}
                fontSize={hp(40)}
                fontWeight='bold'
                style={globalStyles.Verticalspacing}
            />
            <StarRating
            disabled={false}
            maxStars={5}
            starSize={35}
            rating={reviewData[0]?.currentRate || 0}
            fullStarColor={colors.gold}
            />
        </View>
        <View style={globalStyles.ratingsSubtitle}>
            <Text
                text={(reviewData[0]?.currentRate || 0) + ' out of 5.0 Rating'}
                fontSize={hp(15)}
                fontWeight='300'
                color={colors.primaryBg}
                style={globalStyles.Verticalspacing}
            />
        </View>
        <View style={globalStyles.lowerContainer}>
            <Text
                text={NumReviews()}
                fontSize={hp(17)}
                fontWeight='500'
                style={globalStyles.Verticalspacing}
            />
            {Progress('Excellent', 5)}
            {Progress('Very Good', 4)}
            {Progress('Average', 3)}
            {Progress('Poor', 2)}
            {Progress('Terrible', 1)}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AllReviews')} style={globalStyles.lowerContainer}>
            <Text
                text={`Comments(${reviewData.length})`}
                fontSize={hp(17)}
                fontWeight='500'
                style={globalStyles.Verticalspacing}
            />
        </TouchableOpacity>
        </>
    )
  }

  const renderComments = ({ item }) => {
    return (
      <View
      style={[globalStyles.lowerContainer, globalStyles.cardSeparator]}
      >
        <Text
            text={`${item?.client?.fName} ${item?.client?.lName}`}
            fontSize={hp(15)}
            fontWeight='500'
            color={colors.dispatched}
        />
        <View style={[globalStyles.rowStart, globalStyles.Verticalspacing]}>
            <StarRating
            disabled={false}
            maxStars={5}
            starSize={10}
            rating={item?.rating || 0}
            fullStarColor={colors.gold}
            containerStyle={{width: hp(70)}}
            />
            <Text
            text={`${new Date(item?.createdAt).toLocaleDateString()}`}
            fontSize={hp(12)}
            fontWeight='500'
            style={globalStyles.Horizontalspacing}
            />
        </View>
        <Text
            text={item?.comment}
            fontSize={hp(14)}
            fontWeight='300'
        />
      </View>
    );
  };


  return (
    <View style={globalStyles.wrapper}>
        <FlatList
            data={reviewData}
            ListHeaderComponent={Listheader}
            renderItem={renderComments}
            keyExtractor={(item) => item._id}
        />
    </View>
  );
};
