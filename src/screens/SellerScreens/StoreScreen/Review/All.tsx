import React, {useContext, useEffect} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image, ActivityIndicator, FlatList, Modal, StyleSheet} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import {NoProducts} from '../../../../constants/images';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { filteredreviews, loading, filterStoreReviews } from '../../../../redux/slices/StoreSlice';
import StarRating from 'react-native-star-rating';
import { colors } from '../../../../utils/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar} from 'react-native-paper';
import { icons } from '../../../../utils/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Menu, Divider} from 'react-native-paper';


export const AllReviews = (): JSX.Element => {

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const dispatch = useAppDispatch()
  const reviewData = useAppSelector(filteredreviews)
  const loader = useAppSelector(loading)

    useEffect(() => {
    }, [])

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

    const Listheader = () => {
    return (
        <>
        <View style={[globalStyles.lowerContainer, globalStyles.rowBetween]}>
            <Text
                text={`All Comments`}
                fontSize={hp(17)}
                fontWeight='500'
                style={globalStyles.Verticalspacing}
            />
            <TouchableOpacity onPress={() => setVisible(true)} style={globalStyles.rowStart}>
                <icons.FontAwesome name='sliders' color={colors.white} size={hp(17)} />
                <Text
                    text={` Filter`}
                    fontSize={hp(15)}
                    fontWeight='500'
                    style={globalStyles.Verticalspacing}
                />
            </TouchableOpacity>
        </View>
        </>
    )
    }

    const starFilter = ['All', '1', '2', '3', '4', '5']

    const timeFilter = ['Newest', 'This week', 'This month']

    const starFilterRender = ({item}) => {
        return (
            <TouchableOpacity onPress={() => dispatch(filterStoreReviews({type: 'size', value: item}))} style={[globalStyles.starFilterButton, globalStyles.rowCenter]}>
                <Text
                text={item}
                fontSize={hp(16)}
                fontWeight='300'
                style={{marginHorizontal: hp(5)}}
                />
                {item !== 'All' ? <icons.AntDesign name='star' size={hp(13)} color={colors.white} /> : null}
            </TouchableOpacity>
        )
    }

    const timeFilterRender = ({item}) => {
        return (
            <TouchableOpacity onPress={() => TimeFilterSelect(item)}>
                <Text
                text={item}
                fontWeight='600'
                style={globalStyles.Verticalspacing}
                />
            </TouchableOpacity>
        )
    }

    const TimeFilterSelect = (item: string) => {
        setVisible(false)
        dispatch(filterStoreReviews({type: 'time', value: item}))
    }


    return (
        <View style={globalStyles.wrapper}>
            <View style={{height: hp(60), justifyContent: 'center'}}>
                <FlatList
                    data={starFilter}
                    renderItem={starFilterRender}
                    keyExtractor={(item) => item}
                    horizontal
                    contentContainerStyle={{alignItems: 'center'}}
                />
            </View>
            <FlatList
                data={reviewData}
                ListHeaderComponent={Listheader}
                renderItem={renderComments}
                keyExtractor={(item) => item._id}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={() => {
                setVisible(!visible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={globalStyles.lowerContainer}>
                            <FlatList
                                data={timeFilter}
                                renderItem={timeFilterRender}
                                keyExtractor={(item) => item}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.black,
      borderRadius: 20,
      paddingHorizontal: 0,
      paddingTop: 15,
      width: hp(300),
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
    },
    }
  });
