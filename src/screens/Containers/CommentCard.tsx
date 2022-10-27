import { View, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../redux/hooks'
import { getProfile } from '../../redux/slices/ProfileSlice'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { reviewComment } from '../../redux/slices/ReviewSlice'
import { globalStyles } from '../../styles'
import { Text } from '../../components/common'
import { hp, wp } from '../../utils/helpers'

const CommentCard = ({ image, name, comment, date, rate, id, productOwner, commentId, reply }: any) => {
    const [selected, setSelected] = useState('')
    const dispatch = useAppDispatch()
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        dispatch(getProfile()).then((d: any) => setUserId(d.payload?.id))
    }, [])

    const initialValues: { reply: string } = {
        reply: ''
    }

    const handleCommentSubmit = async (data: any) => {

        const payload = {
            comment_id: commentId,
            reply: data?.reply,
        }

        try {
            var response = await dispatch(reviewComment(payload))
            if (reviewComment.fulfilled.match(response)) {
                resetForm()
                // toast.success(response?.payload)
            }
            else {
                var errMsg = response?.payload as string
                //  toast.error(errMsg)
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


    const { values, errors, touched, handleChange, handleSubmit, handleBlur, resetForm } =
        useFormik({
            initialValues,
            validationSchema: yup.object().shape({
                reply: yup.string().min(1, ({ min }) => `Comment must be at least ${min} length`).required('Reply is required'),
            }),
            onSubmit: (data: { reply: string }) => handleCommentSubmit(data),
            enableReinitialize: true
        });


    return (
        <View>
            <View style={globalStyles.rowBetween}>
                <View style={globalStyles.rowStart}>
                    {/* {
                        image?.length < 1 || image === undefined ? <Image source={{uri: image}} style={styles.image} />
                            : <Image source={{uri: image}} style={styles.image} />
                    } */}

                    {/* <Text text={name} /> */}
                </View>
            </View>
        </View>
    )
}

export default CommentCard

// const styles = StyleSheet.create({
//     image: {
//         width: wp(50),
//         height: hp(50),
//         borderRadius: 50,
//     }
// })