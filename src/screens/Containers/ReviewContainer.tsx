/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { forSlideRight } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/HeaderStyleInterpolators'
import React from 'react'
import {View, StyleSheet} from "react-native"
import StarRating from 'react-native-star-rating'
import { Text } from '../../components/common'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/TextInput'
import { hp, wp } from '../../utils/helpers'
import { colors } from '../../utils/themes'

function ReviewContainer({handleRateSubmit, comment, setComment, loader, rate, setRate}: any) {

    
  return (
    <View style={styles.div}>
        <Text text='Leave a Review' fontSize={hp(18)} />
        <View style={styles.columnContainer2}>
                        <Text text='How would you rate this item?' style={{ marginVertical: hp(10) }} fontSize={hp(14)} fontWeight='400' />
                        <View style={styles.div2}>
                            <StarRating
                                maxStars={5}
                                starSize={25}
                                rating={rate || 0}
                                fullStarColor={colors.bazaraTint}
                                selectedStar={(rating) => setRate(rating)}
                            />
                        </View>

                        <Input
                            label={'Review'}
                            value={comment}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(e: any) => setComment(e)}

                        />
                    <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                    <View style={styles.ft}>
                       <Button isLoading={loader} title={"Submit"} onPress={handleRateSubmit} />
                       </View>
                    </View>


                    </View>
    </View>
  )
}

export default ReviewContainer

const styles = StyleSheet.create({
    div: {
        marginVertical: hp(10)
    },
    tag: {
        width: '100%',
        padding: hp(13),
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    txt: {
        textTransform: 'capitalize'
    },
    img: {
        width: wp(60),
        height: hp(60),
        borderRadius: 5
    },
    minDiv: {
        marginLeft: hp(10),
    },
    subdiv: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    top: {
        marginVertical: hp(20)
    },
    ft: {
        width: wp(150)
    },
    alignStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingVertical: hp(15)
    },
    txt2: {
        marginHorizontal: hp(5)
    },
    txt3: {
        marginTop: hp(-5)
    },
    hr: {
        backgroundColor: colors.lightGray,
        width: '100%',
        height: 1
    },
    cont: {
        backgroundColor: colors?.artBoard,
        marginVertical: hp(10),
        paddingHorizontal: hp(10),
        borderRadius: 5
    },
    cont2: {
        marginVertical: hp(10),
        paddingHorizontal: hp(10),
        borderRadius: 5
    },
    big: {
        padding: hp(10)
    },
    contdiv: {
        justifyContent: 'center',
        marginTop: hp(10)
    },
    sheet: {
        backgroundColor: 'black'
    },
    columnContainer2: {
        paddingVertical: hp(5)
    },
    div2: {
        marginVertical: hp(5),
        width: wp(150)
    }
})