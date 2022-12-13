import { View, StyleSheet, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { fetchReviews } from '../redux/slices/ReviewSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { hp } from '../utils/helpers'
import MobileHeader from './Containers/MobileHeader'
import { globalStyles } from '../styles'
import * as Progress from 'react-native-progress'
import { Text } from '../components/common'
import { colors } from '../utils/themes'
import CommentCard from './Containers/CommentCard'
import StarRating from 'react-native-star-rating'
import { Button } from '../components/common/Button'



const RatingScreen = (props: any) => {
    const id = props?.route?.params?.params?.id
    const ownerId = props?.route?.params?.params?.ownerId
    const productRating = props?.route?.params?.params?.productRating
    const overAllRating = props?.route?.params?.params?.ratings


    const excellent = productRating?.filter((data: any) => data?.rating === 5)
    const good = productRating?.filter((data: any) => data?.rating === 4)
    const average = productRating?.filter((data: any) => data?.rating === 3)
    const poor = productRating?.filter((data: any) => data?.rating === 2)
    const terrible = productRating?.filter((data: any) => data?.rating === 1)



    return (
        <View style={styles.container}>
            <MobileHeader categoryName='Ratings' props={props} />

            <View>
                <View style={styles.jt}>
                    <Text text={overAllRating ? overAllRating : 0} fontSize={hp(36)} textAlign='center' fontWeight='bold' />
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: hp(10) }}>
                        <View style={{ width: hp(150) }}>
                            <StarRating
                                maxStars={5}
                                starSize={25}
                                rating={overAllRating ? overAllRating : 0}
                                fullStarColor={colors.bazaraTint}
                                disabled
                            />
                        </View>
                    </View>
                    
                    <View style={styles.bg}>
                        <Text text={productRating?.length > 0 ? `${overAllRating ? overAllRating : 0} out of 5.0 Rating` : 'No review yet'} color='black' textAlign='center' />
                    </View>
                </View>
                <Text text={`${productRating?.length} review`} style={{ marginTop: hp(20) }} fontWeight='bold' />
                <View style={globalStyles.rowBetween}>
                    <View style={styles.textDiv2}>
                        <Text text='Excellent' fontSize={hp(16)} />
                    </View>
                    <View style={styles.progressDiv}>
                        <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={excellent ? (excellent?.length / 1000) : 0} width={200} />
                    </View>
                    <View>
                        <Text text={excellent ? excellent?.length : 0} fontSize={hp(16)} />
                    </View>
                </View>
                <View style={globalStyles.rowBetween}>
                    <View style={styles.textDiv2}>
                        <Text text='Very good' fontSize={hp(16)} />
                    </View>
                    <View style={styles.progressDiv}>
                        <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={good ? (good?.length / 1000) : 0} width={200} />
                    </View>
                    <View>
                        <Text text={good ? good?.length : 0} fontSize={hp(16)} />
                    </View>
                </View>
                <View style={globalStyles.rowBetween}>
                    <View style={styles.textDiv2}>
                        <Text text='Average' fontSize={hp(16)} />
                    </View>
                    <View style={styles.progressDiv}>
                        <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={average ? (average?.length / 1000) : 0} width={200} />
                    </View>
                    <View>
                        <Text text={average ? average?.length : 0} fontSize={hp(16)} />
                    </View>
                </View>
                <View style={globalStyles.rowBetween}>
                    <View style={styles.textDiv2}>
                        <Text text='Poor' fontSize={hp(16)} />
                    </View>
                    <View style={styles.progressDiv}>
                        <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={poor ? (poor?.length / 1000) : 0} width={200} />
                    </View>
                    <View>
                        <Text text={poor ? poor?.length : 0} fontSize={hp(16)} />
                    </View>
                </View>
                <View style={globalStyles.rowBetween}>
                    <View style={styles.textDiv2}>
                        <Text text='Terrible' fontSize={hp(16)} />
                    </View>
                    <View style={styles.progressDiv}>
                        <Progress.Bar style={styles.progress} height={8} color={colors.bazaraTint} progress={terrible ? (terrible?.length / 1000) : 0} width={200} />
                    </View>
                    <View>
                        <Text text={terrible ? terrible?.length : 0} fontSize={hp(16)} />
                    </View>
                </View>
            </View>

            <View>
                <Text text='Comments' style={{ marginTop: hp(20) }} />
                {
                    productRating?.map((data: any) => {
                        return <CommentCard
                            image={data?.user?.img_url}
                            name={data?.user?.first_name + " " + data?.user?.last_name}
                            comment={data?.comment?.comment}
                            date={data?.created_at}
                            rate={data?.rating}
                            id={data?._id}
                            reply={data?.comment?.reply}
                            commentId={data?.comment?.id}
                            productOwner={ownerId}
                        />
                    })
                }
            </View>
        </View>
    )
}

export default RatingScreen


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        paddingHorizontal: hp(10),
        paddingTop: Platform.OS === 'ios' ? hp(20) : hp(15),
        flex: 1,
    },
    textDiv2: {
        width: '20%',
        paddingVertical: hp(5)
    },
    progress: {
        backgroundColor: 'white',
    },
    progressDiv: {
        width: '50%'
    },
    jt: {

    },
    bg: {
        backgroundColor: 'white',
        padding: hp(10),
        borderRadius: 20,
        marginTop: hp(10),
        marginBottom: hp(20)  
    }
})