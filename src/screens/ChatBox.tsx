import { View, StyleSheet, Pressable, Image, ActivityIndicator, TextInput, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getProfile, profileInfo } from '../redux/slices/ProfileSlice'
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { pictureUpload } from '../utils/functions';
import { hp, numberFormat, wp } from '../utils/helpers';
import MobileHeader from './Containers/MobileHeader';
import { Text } from '../components/common/Text';
import { attachment, telegram } from '../assets';
import { Input } from '@ui-kitten/components';
import { colors } from '../utils/themes';
import { truncate } from '../utils/server';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from "@react-navigation/native";


const ChatBox = (props: any) => {
  const id = props?.route?.params?.params?.id
  const receiverName = props?.route?.params?.params?.storeName as string
  const receiverImage = props?.route?.params?.params?.storeImage
  const [messageData, setMessageData] = useState<any>()
  const [message, setMessage] = useState("")
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch()
  const userProfile = useAppSelector(profileInfo)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const scrollViewRef = useRef();

  useEffect(() => {
    dispatch(getProfile())
  }, [])




  useEffect(() => {
    const loadData = async () => {
      await dispatch(getProfile()).then(async (dd: any) => {

        firestore().collection('messaging').orderBy('createdAt', 'asc').onSnapshot((documentSnapshot: any) => {
          const arr: any = []
          documentSnapshot?.forEach((doc: any) => {
            if (
              (doc.data().sender?.id === dd?.payload?.id && doc.data().receiver?.id === id) ||
              (doc.data().sender?.id === id && doc.data().receiver?.id === dd?.payload?.id)
            ) {

              var data = {
                id: doc.id,
                ...doc.data()
              }
              arr.push(data)
            }

          });

          setMessageData(arr);
        })


      })

    }
    loadData()
  }, [])


  const sendMessage = async () => {
    var data = message?.replace(/^\s+|\s+$/gm, '');
    if (message?.length < 1 || message === "" || data === '' || data === undefined) {
      return;
    }
    setBtnDisabled(true)
    try {
      const docRef = await firestore()
        .collection('messaging')
        .add({
          message: message,
          createdAt: firestore.FieldValue.serverTimestamp(),
          receiver: {
            id: id,
            imageUrl: receiverImage,
            name: receiverName
          },
          sender: {
            id: userProfile?.id,
            imageUrl: userProfile?.img_url,
            name: userProfile?.first_name
          }
        })
        .then( async (item) => {
         await dispatch(getProfile()).then(async (dd: any) => {
            setMessage('')
            firestore().collection('messaging').orderBy('createdAt', 'asc').onSnapshot((documentSnapshot: any) => {
              const arr: any = []
              documentSnapshot?.forEach((doc: any) => {
                if (
                  (doc.data().sender?.id === dd?.payload?.id &&
                    doc.data().receiver?.id === id) ||
                  (doc.data().sender?.id === id && doc.data().receiver?.id === dd?.payload?.id)
                ) {
                  var data = {
                    id: doc.id,
                    ...doc.data()
                  }
                  arr.push(data)
                }

              });
              setMessageData(arr);
              setBtnDisabled(false)
            })
          })


        });

    } catch (e) {
      setBtnDisabled(false)
      console.error("Error adding document: ", e);
    }
  }

  const submitKeyMessage = async (e: any) => {
    var data = message?.replace(/^\s+|\s+$/gm, '');
    if (message?.length < 1 || message === "" || data === '' || data === undefined) {
      return;
    }
    if (e.key === "Enter") {
      setBtnDisabled(true)
      try {
        const docRef = await firestore()
          .collection('messaging')
          .add({
            message: message,
            createdAt: firestore.FieldValue.serverTimestamp(),
            receiver: {
              id: id,
              imageUrl: receiverImage,
              name: receiverName
            },
            sender: {
              id: userProfile?.id,
              imageUrl: userProfile?.img_url,
              name: userProfile?.first_name
            }
          })
          .then(() => {
            dispatch(getProfile()).then(async (dd: any) => {
              setMessage('')
              setBtnDisabled(false)
              firestore().collection('messaging').orderBy('createdAt', 'asc').onSnapshot((documentSnapshot: any) => {
                const arr: any = []
                documentSnapshot?.forEach((doc: any) => {
                  if (
                    (doc.data().sender?.id === dd?.payload?.id &&
                      doc.data().receiver?.id === id) ||
                    (doc.data().sender?.id === id && doc.data().receiver?.id === dd?.payload?.id)
                  ) {
                    var data = {
                      id: doc.id,
                      ...doc.data()
                    }
                    arr.push(data)
                  }

                });
                setMessageData(arr);
              })
            })
          });

      } catch (e) {
        setBtnDisabled(false)
        console.error("Error adding document: ", e);
      }
    }
  };

  const pickImage = async (index: number) => {
    ImagePicker.openPicker({
      width: 500,
      height: 600,
      cropping: true,
      mediaType: "photo",
      multiple: false,
    }).then(async image => {
      setBtnDisabled(true)
      const ImageUrl = await pictureUpload(image)

      await firestore()
        .collection('messaging')
        .add({
          message: message,
          createdAt: firestore.FieldValue.serverTimestamp(),
          attachment: ImageUrl,
          receiver: {
            id: id,
            imageUrl: receiverImage,
            name: receiverName
          },
          sender: {
            id: userProfile?.id,
            imageUrl: userProfile?.img_url,
            name: userProfile?.first_name
          }
        })
        .then(() => {
          dispatch(getProfile()).then(async (dd: any) => {
            setMessage('')
            setBtnDisabled(false)
            firestore().collection('messaging').onSnapshot((documentSnapshot: any) => {
              const arr: any = []
              documentSnapshot?.forEach((doc: any) => {
                if (
                  (doc.data().sender?.id === dd?.payload?.id &&
                    doc.data().receiver?.id === id) ||
                  (doc.data().sender?.id === id && doc.data().receiver?.id === dd?.payload?.id)
                ) {
                  var data = {
                    id: doc.id,
                    ...doc.data()
                  }
                  arr.push(data)
                }

              });
              setMessageData(arr);
            })
          })
        });
    })
  }


  // console.log({ messageData })



  return (
    <SafeAreaView style={styles.container}>
      <MobileHeader
        props={props}
        categoryName={receiverName}
      />


      <View style={styles.top}>
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })} >
          <View style={styles.chatfield}>
            {messageData
              ?.sort((a: any, b: any) => b.createdAt - a.createdAt)
              .map((data: any, i: any) =>
                data.sender?.id !== userProfile?.id ? (
                  <>
                    {
                      data?.details && <View style={styles.detail}>
                        <View style={styles.rowstart}>
                          <Image source={{ uri: data?.details?.imageUrl }} style={styles.img3} />
                          <View style={styles.secondDiv}>
                            <Text text={data?.details?.title} fontSize={hp(14)} />
                            <View style={styles.secondDiv2}>
                              <Text text={`Size: ${data?.details?.size}`} fontSize={hp(14)} />
                              <Text text={`Quantity: ${data?.details?.quantity}`} fontSize={hp(14)} style={{ marginHorizontal: hp(10) }} />
                              <Text
                                text={`₦${numberFormat(Number(data?.details?.price) || 0)}`}
                                fontSize={hp(16)}
                                color={colors.accent}
                                numberOfLines={1}
                                fontWeight={'600'}
                              />
                            </View>
                          </View>
                        </View>
                        <Pressable onPress={() => props?.navigation.navigate("ProductDetail", {
                          params: {
                            id: data?.details?.slug
                          }
                        })}>
                          <View style={styles.rowstart2}>
                            <Text text={'view product'} fontSize={hp(14)} style={{ textDecorationLine: 'underline' }} />
                          </View>
                        </Pressable>
                      </View>
                    }

                    <View style={styles.senderDiv} key={i}>
                      <View style={{ marginLeft: "2%" }}>
                        {data?.attachment && (
                          <Image
                            source={{ uri: data?.attachment }}
                            style={{ width: wp(300), height: hp(200) }}
                          />
                        )}
                       
                        {
                          data?.message ? <View style={styles.senderText}><Text text={data?.message} /></View> : null
                        }

                        {
                          (data?.message || data?.attachment) && (
                            <View style={styles.time}>
                              {data?.attachment && <AntDesign name="download" />}
                              <View>
                                <Image
                                  source={{ uri: "https://res.cloudinary.com/doouwbecx/image/upload/v1637099453/circle-checked_ixmu3w.png" }}
                                  style={{ marginRight: "1%" }}
                                />
                              </View>
                              <Text text={`sent ${moment(new Date(data?.createdAt?.seconds * 1000)).format("DD-MM-YY")}`} fontSize={hp(10)} />

                            </View>
                          )
                        }
                       
                      </View>

                    </View>

                  </>
                ) : (
                  <>
                    {
                      data?.details && <View style={styles.detail}>
                        <View style={styles.rowstart}>
                          <Image source={{ uri: data?.details?.imageUrl }} style={styles.img3} />
                          <View style={styles.secondDiv}>
                            <Text text={data?.details?.title} fontSize={hp(14)} />
                            <View style={styles.secondDiv2}>
                              <Text text={`Size: ${data?.details?.size}`} fontSize={hp(14)} />
                              <Text text={`Quantity: ${data?.details?.quantity}`} fontSize={hp(14)} style={{ marginHorizontal: hp(10) }} />
                              <Text
                                text={`₦${numberFormat(Number(data?.details?.price) || 0)}`}
                                fontSize={hp(16)}
                                color={colors.accent}
                                numberOfLines={1}
                                fontWeight={'600'}
                              />
                            </View>
                          </View>
                        </View>
                        <Pressable onPress={() => props?.navigation.navigate("ProductDetail", {
                          params: {
                            id: data?.details?.slug
                          }
                        })}>
                          <View style={styles.rowstart2}>
                            <Text text={'view product'} fontSize={hp(14)} style={{ textDecorationLine: 'underline' }} />
                          </View>
                        </Pressable>
                      </View>
                    }
                    <View style={styles.receiverDiv} key={i}>
                      <View>
                        {data?.attachment && (
                          <Image
                            source={{ uri: data?.attachment }}
                            style={{ width: wp(300), height: hp(200) }}
                          />
                        )}
                        {data?.message && (
                          <View style={styles.receiverText}><Text text={data?.message} /></View>
                        )}
                        {
                          (data?.message || data?.attachment) && (
                            <View style={styles.receiverTime}>
                              {data?.attachment && <AntDesign name="download" />}
                              <View>
                                <Image
                                  source={{ uri: "https://res.cloudinary.com/doouwbecx/image/upload/v1637099453/circle-checked_ixmu3w.png" }}
                                  style={{ marginRight: "1%" }}
                                />
                              </View>
                              <Text text={`sent ${moment(new Date(data?.createdAt?.seconds * 1000)).format("DD-MM-YY")}`} fontSize={hp(10)} />
                            </View>
                          )}
                      </View>
                    </View>
                  </>
                )
              )}
          </View>

        </ScrollView>
      </View>
      <View style={styles.bottom}>
        <View style={styles.buttonDiv}>
          <Pressable onPress={() => pickImage(0)}>
            <View style={styles.div}>
              {btnDisabled ? <ActivityIndicator /> : <Image source={attachment} style={styles.img} />}
            </View>
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Write Message...."
            placeholderTextColor='white'
            onChangeText={(e) => setMessage(e)}
            value={message}
            onKeyPress={btnDisabled ? () => { } : (e) => submitKeyMessage(e)}
          />

          <Pressable onPress={btnDisabled ? () => { } : () => sendMessage()}>
            <View style={styles.div}>
              {btnDisabled ? <ActivityIndicator /> : <Image source={telegram} style={styles.img} />}
            </View>
          </Pressable>
        </View>
      </View>






    </SafeAreaView>
  )
}

export default ChatBox

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: hp(1),
    paddingBottom: hp(30)
  },
  top: {
    flex: 7,

  },
  bottom: {
    flex: 1,
  },
  img: {

  },
  img2: {
    width: wp(200),
    height: hp(200)
  },
  buttonDiv: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  div: {
    backgroundColor: colors.bazaraTint,
    flexDirection: 'row',
    padding: hp(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  input: {
    backgroundColor: '#1D1D1D',
    padding: hp(13),
    border: 'none',
    borderRadius: 5,
    color: 'white',
    flex: 1,
  },
  detail: {
    backgroundColor: '#7B61FF',
    borderRadius: 10,
    marginVertical: hp(10)
  },
  rowstart: {
    flexDirection: 'row',
    padding: hp(10)
  },
  rowstart2: {
    flexDirection: 'row',
    paddingHorizontal: hp(10),
    paddingBottom: hp(10)
  },
  secondDiv: {
    marginLeft: hp(10),
  },
  secondDiv2: {
    flexDirection: 'row',
  },
  senderDiv: {
    flexDirection: 'row',
    paddingVertical: hp(20),
    paddingHorizontal: hp(10),
  },
  senderText: {
    backgroundColor: '#f80595',
    borderTopStartRadius: 3,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    //  borderRadiusT: 3px 10px 10px 10px;
    padding: hp(10),
    color: 'white',
    width: hp(250),
    marginBottom: hp(10),
  },
  time: {

  },
  receiverDiv: {
    flexDirection: 'row',
    paddingVertical: hp(20),
    paddingHorizontal: hp(10),
    justifyContent: 'flex-end',
  },
  receiverText: {
    backgroundColor: '#242424',
    borderTopStartRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 3,
    padding: hp(10),
    color: 'white',
    marginBottom: hp(10),
  },
  receiverTime: {

  },
  chatfield: {
    flexDirection: 'column-reverse',

  },
  img3: {
    width: wp(50),
    height: hp(50),
    borderRadius: 5
  }
})