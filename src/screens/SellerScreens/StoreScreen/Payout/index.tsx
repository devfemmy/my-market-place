import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, Text } from '../../../../components/common';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import { View, Image, ActivityIndicator, ImageBackground, StyleSheet, Pressable, ScrollView } from 'react-native';
import { globalStyles } from '../../../../styles';
import { hp, wp } from '../../../../utils/helpers';
import { NoProducts, PayoutBack } from '../../../../constants/images';
import { NoAccount } from './Empty';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { useIsFocused } from "@react-navigation/native";
import { Payouts } from './Payouts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deletePayout, getPayouts } from '../../../../redux/slices/PayoutSlice';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../../../../utils/themes';
import { icons } from '../../../../utils/constants';
import { bank, payoutBack } from '../../../../assets';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PayoutModal from '../../../Containers/PayoutModal';

const Account = ({ navigation }: any) => {

  const dispatch = useAppDispatch()
  const [visible, setVisible] = useState(false)
  const [payout, setPayout] = useState<any>()
  const [editPayout, setEditPayout] = useState(null)
  const [loader, setLoader] = useState(false)
  const [activeId, setActiveId] = useState<any>()
  const isFocused = useIsFocused()

  useEffect(() => {
    const loadAsync = async () => {
      var id = await AsyncStorage.getItem('activeId') as string
      setActiveId(id)
    }
    loadAsync()
  }, [activeId, isFocused])

  useEffect(() => {
    dispatch(getPayouts(activeId)).then(data => setPayout(data?.payload))
  }, [activeId, isFocused])


  const deletePayouts = async (data: string) => {

    try {
      var resultAction = await dispatch(deletePayout(data))
      if (deletePayout.fulfilled.match(resultAction)) {
        return dispatch(getPayouts(activeId))
      }
      else {

        console.log('error', `Update failed`)
      }

    }
    catch (e) {
      console.log({ e })
    }
  }


  const showModal = (data?: any) => {
    setVisible(true)
    setEditPayout(data)
  }

  if (loader) {
    return (
      <SafeAreaView>
        <View style={[globalStyles.rowCenter, { flex: 1 }]}>
          <ActivityIndicator size={'small'} />
        </View>
      </SafeAreaView>
    )
  }




  return (
    <View style={[globalStyles.wrapper]}>
      <View style={styles.container}>
        <View style={styles.justify} >
          <View style={styles.divsub} >
            <Ionicons
              name={'chevron-back-outline'}
              size={30}
              color={'white'}
              onPress={() => navigation.goBack()}
            />
          </View>
          <Text text={'Payment'} fontSize={hp(18)} fontWeight='400' />
          <Pressable onPress={() => showModal(payout)}>
            <View style={styles.sub} >
              {
                payout !== null && payout !== undefined && <Text text={'Edit'} fontSize={hp(14)} fontWeight='400' />
              }

            </View>
          </Pressable>
        </View>
        <View style={styles.column}>
          {
            payout === null || payout === undefined && <View style={styles.columnglobal}>
              <Image
                source={bank}
                style={styles.img}
              />
              <Text text='No Account Details Added' fontSize={hp(16)} fontWeight='600' textAlign='center' />
              <View style={styles.div}>
                <Text text='You can’t see any transaction until you add a payment account' color={colors.gray} fontSize={hp(14)} fontWeight='400' textAlign='center' />
              </View>
              <View style={styles.br} />
              <View style={{ width: '90%' }}>
                <Button title="Add account details" onPress={() => showModal()} />
              </View>
            </View>
          }

          {
            payout !== null && payout !== undefined &&
            <View style={{marginHorizontal: hp(15)}}>
              
              <ImageBackground source={payoutBack} resizeMode="cover" style={[styles.card]}>
                <Text text={payout?.account_name} textAlign='center' fontSize={hp(14)} fontWeight='600' />
                <Text text={`${payout?.bank_account_number} - ${payout?.bank_name}`} textAlign='center' fontSize={hp(11)} fontWeight='600' style={{ marginVertical: hp(5) }} />
              </ImageBackground>


              <View style={{marginTop: hp(10)}}>
                <Text text='Transactions' color={colors.white} style={{ marginVertical: hp(10) }} />

                <View style={styles.carddiv}>
                  <Image
                    source={bank}
                    style={styles.img3}
                  />
                  <Text text='No Transactions at the moment' fontSize={hp(16)} fontWeight='600' textAlign='center' />
                </View>
              </View>
            </View>
          }
        </View>
        {/* 
        <Pressable onPress={() => deletePayouts(payout?.id)}>
                <Text text='Delete' fontSize={hp(16)} fontWeight='600' textAlign='center' />
            </Pressable>  */}

        <PayoutModal
          visible={visible}
          setVisible={() => setVisible(false)}
          editPayout={editPayout}
          setPayout={(value: any) => setPayout(value)}
          activeId={activeId}
        />
      </View>
    </View>
  );
};

export default Account

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  justify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp(10)
  },
  divsub: {},
  column: {
    width: '100%',
    flex: 1
  },
  card: {
    marginTop: hp(5),
    borderRadius: 15,
    padding: hp(10),
    justifyContent: 'center',
    height: hp(150)
  },
  carddiv: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  div: {
    width: '90%',
    marginVertical: wp(8),
    marginHorizontal: hp(10)
  },
  img: {
    width: wp(100),
    height: hp(100)
  },
  img2: {
    width: wp(24),
    height: hp(24)
  },
  img3: {
    width: wp(70),
    height: hp(70)
  },
  sub: {},
  columnglobal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(450),
    width: '100%',
    marginHorizontal: hp(10),
  },
  br: {
    marginVertical: hp(10)
  }
})