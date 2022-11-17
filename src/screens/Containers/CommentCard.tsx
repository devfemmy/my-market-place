import { View, Image, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../redux/hooks'
import { getProfile } from '../../redux/slices/ProfileSlice'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { reviewComment } from '../../redux/slices/ReviewSlice'
import { globalStyles } from '../../styles'
import { Text } from '../../components/common'
import { getCurrentDate, hp, wp } from '../../utils/helpers'
import { colors } from '../../utils/themes'
import { Rating } from 'react-native-ratings';
import { TextInput } from 'react-native-gesture-handler'
import { Input } from '../../components/common/TextInput'
import { Notifier, NotifierComponents } from 'react-native-notifier'

const CommentCard = ({ image, name, comment, date, rate, id, productOwner, commentId, reply }: any) => {
    const [selected, setSelected] = useState('')
    const [replyM, setReplyM] = useState('')
    const dispatch = useAppDispatch()
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        dispatch(getProfile()).then((d: any) => setUserId(d.payload?.id))
    }, [])

  

    const handleCommentSubmit = async () => {
        if(replyM?.length < 1) {
            Notifier.showNotification({
                title: 'Reply message is required',
                description: '',
                Component: NotifierComponents.Alert,
                hideOnPress: false,
                componentProps: {
                    alertType: 'success',
                },
            });
            return
        }
        const payload = {
            comment_id: commentId,
            reply: replyM,
        }
        console.log("yekkkii",{payload})
        try {
            var response = await dispatch(reviewComment(payload))
            if (reviewComment.fulfilled.match(response)) {
                setReplyM('')
                Notifier.showNotification({
                    title: response?.payload,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
            }
            else {
                var errMsg = response?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                        alertType: 'success',
                    },
                });
            }
        }
        catch (e) {
            console.log({ e })
        }
    }

    const handleSelectChange = (id: any) => {
        if (selected?.length > 1) {
            setSelected('')
        }
        else {
            setSelected(id)
        }

    }





    return (
        <View style={styles.commentCard}>
            <View style={globalStyles.rowBetween}>
                <View style={globalStyles.rowStart}>
                    {
                        image?.length < 1 || image === undefined ? <Image source={{ uri: image }} style={styles.image} />
                            : <Image source={{ uri: image }} style={styles.image} />
                    }

                    <Text text={name} color={colors.accent} style={styles.txt} fontSize={hp(16)} />
                </View>
            </View>
            <View style={globalStyles.rowStart}>
                <Rating
                    type='custom'
                    startingValue={rate}
                    ratingCount={5}
                    ratingBackgroundColor='white'
                    imageSize={15}
                    ratingColor={colors.bazaraTint}
                    tintColor='black'
                    style={{ paddingVertical: 10 }}
                    readonly
                />
                <Text text={date ? getCurrentDate(date) : 'N/A'} />
            </View>
            <View>
                <Text text={comment} fontSize={hp(16)} />
            </View>
            <View>
                {
                    userId === productOwner && !reply && <Pressable onPress={() => handleSelectChange(id)}>
                        <View>
                            <Text text={'Reply'} color={colors.purple} />
                        </View>
                    </Pressable>
                }
            </View>

            <View>
                {
                    selected === id ? <View>
                        <Input
                            label='Reply'
                            value={replyM}
                            multiline
                            numberOfLines={4}
                            onChangeText={(e) => setReplyM(e)}
                        />
                        <Pressable onPress={() => handleCommentSubmit()}>
                            <Text text={'Send'} color={colors.purple} textAlign='right' />
                        </Pressable>
                    </View>
                        : null
                }
            </View>
        </View>
    )
}

export default CommentCard

const styles = StyleSheet.create({
    image: {
        width: wp(30),
        height: hp(30),
        borderRadius: 50,
        marginRight: hp(5)
    },
    commentCard: {
        marginVertical: hp(10)
    },
    txt: {
        textTransform: 'capitalize'
    }
})