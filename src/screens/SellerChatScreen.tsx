import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text } from '../components/common'
import { hp, wp } from '../utils/helpers'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getProfile, profileInfo } from '../redux/slices/ProfileSlice'
// import { collection, getDocs } from 'firebase/firestore'
// import { db } from '../firebase/firebase'
import MobileHeader from './Containers/MobileHeader'
import { truncate } from '../utils/server'
import { colors } from '../utils/themes'
import moment from "moment"
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'



const SellerChatScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch()
  const [messageData, setMessageData] = useState<any>([])
  const userProfile = useAppSelector(profileInfo)


  useEffect(() => {
    dispatch(getProfile())
  }, [])




  useEffect(() => {
    const loadData = async () => {
      // const arr: any = []
      const id = await AsyncStorage.getItem('activeId')
      await dispatch(getProfile()).then(async (dd: any) => {

        firestore().collection('messaging').onSnapshot((documentSnapshot: any) => {
          const arr: any = []
          documentSnapshot?.forEach((doc: any) => {
            if (
              doc.data().sender?.id === id ||
              doc.data().receiver?.id === id
            ) {
              var data = {
                messageId: doc.id,
                id: doc.data().sender?.id === id ? doc.data().receiver?.id : doc.data().receiver?.id === id ? doc.data().sender?.id : "",
                name: doc.data().sender?.id === id ? doc.data().receiver?.name : doc.data().receiver?.id === id ? doc.data().sender?.name : "",
                image: doc.data().sender?.id === id ? doc.data().receiver?.imageUrl : doc.data().receiver?.id === id ? doc.data().sender?.imageUrl : "",
                createdAt: doc.data().createdAt,
                message: doc.data().message,
                new: doc?.data()?.new,
                senderId: doc.data().sender?.id,
              }


              arr.push(data)
            }

          });
          const ids = arr?.map((o: any) => o.id)
          const filtered = arr?.filter(({ id }: any, index: any) => !ids.includes(id, index + 1))

          setMessageData(filtered);
        })

      })


    }
    loadData()
  }, [])



  const routeChat = (data: any) => {

    return navigation.navigate('SellerChatBox', {
      params: {
        id: data?.id,
        storeName: data?.name,
        storeImage: data?.image
      }
    })
  }

  return (
    <View style={styles.container}>
      <MobileHeader categoryName="Chat" props={navigation} cart />

      <ScrollView>
        {
          messageData && messageData?.length > 0 && messageData?.map((data: any) => {
            return (
              <Pressable onPress={() => routeChat(data)}>
                <View style={styles.container2} key={data?.id} >
                  <View style={styles.div1}>
                    <Image source={{ uri: data?.image }} style={styles.img} />
                  </View>
                  <View style={styles.div2}>
                    <Text text={truncate(data?.name, 35)} fontSize={hp(14)} />
                    <Text text={truncate(data?.message, 35)} color={colors.gray} fontSize={hp(14)} />
                  </View>
                  <View style={styles.div3}>
                    <Text text={`${moment(new Date(data?.createdAt?.seconds * 1000)).format("DD-MM-YY")}`} fontSize={hp(14)} />
                    {data?.new && <View style={styles.min}></View>}
                  </View>
                </View>
              </Pressable>
            )
          })
        }

        {messageData && messageData?.length < 1 && (
          <View style={styles.divbox}>
            <View style={styles.chatdiv}>
              <Image source={{ uri: "https://res.cloudinary.com/doouwbecx/image/upload/v1637242678/Group_10396_lekrzj.png" }} />
              <Text text='No Messages Yet' color={colors.bazaraTint} style={{ marginVertical: hp(10) }} />
              <Text text='All your messages will appear here' />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default SellerChatScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: hp(10)
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp(10),
    borderBottomWidth: 0.4,
    borderBottomColor: '#202020'
  },
  div1: {

  },
  div2: {
    width: "60%",
    marginHorizontal: hp(10),
  },
  div3: {
    width: '20%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  img: {
    width: wp(50),
    height: hp(50),
    borderRadius: 50
  },
  min: {
    backgroundColor: colors.bazaraTint,
    width: wp(10),
    height: hp(10),
    borderRadius: 50,
  },
  divbox: {

  },
  chatdiv: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(500),
  }
})