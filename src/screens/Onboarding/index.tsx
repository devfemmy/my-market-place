import React, {useState, useEffect} from 'react';

import {StatusBar, View, StyleSheet, ScrollView, ActivityIndicator, FlatList, Image, ImageBackground, Dimensions, Pressable} from 'react-native';
import {SafeAreaView, Text} from '../../components/common';
import { colors } from '../../utils/themes';
import { onboard1, onboard2, onboard3, onboard4, onboard5, onboard6, onboard7, onboard8, onboard9, onboarBackground } from '../../constants/images';
import { useNavigation} from '@react-navigation/native';
import {Button} from '../../components/common/Button';
import {hp, wp} from '../../utils/helpers';
import {globalStyles} from "../../styles/globalStyles"
import { Nav } from '../../utils/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loading, getSellerNotificationsStat, notificationStat } from '../../redux/slices/userSilce';
import NotificationCard from '../../components/resuable/NotificationCard';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const OnboardScreen = (): JSX.Element => {
  const  navigation = useNavigation<Nav>();
  const [token, setToken] = useState("")


  useEffect(() => {
      const loadToken = async () => {
          var tokens = await AsyncStorage.getItem('token') as string
          setToken(tokens)
      }

      loadToken()
  }, [])


  return (
    <SafeAreaView>
      <View style={styles.imgCont}>
        
        <Animatable.View duration={3000} animation="slideInDown" iterationCount="infinite" direction="alternate" style={{flex: 1}}>
          <Image resizeMode='cover' source={onboard1} style={styles.largeImgRender} />
          <Image resizeMode='cover' source={onboard2} style={styles.smallImgRender} />
          <Image resizeMode='cover' source={onboard3} style={styles.smallImgRender} />
          <Image resizeMode='cover' source={onboard6} style={styles.largeImgRender} />
        </Animatable.View>

        <Animatable.View duration={2500} easing='ease-in-out' animation="slideInDown" iterationCount="infinite" direction="alternate" style={{flex: 1}}>
          <Image resizeMode='cover' source={onboard4} style={styles.smallImgRender} />
          <Image resizeMode='cover' source={onboard5} style={styles.largeImgRender} />
          <Image resizeMode='cover' source={onboard6} style={styles.largeImgRender} />
          <Image resizeMode='cover' source={onboard4} style={styles.smallImgRender} />
        </Animatable.View>

        <Animatable.View duration={3500} animation="slideInDown" iterationCount="infinite" direction="alternate" style={{flex: 1}}>
          <Image resizeMode='cover' source={onboard7} style={styles.largeImgRender} />
          <Image resizeMode='cover' source={onboard8} style={styles.smallImgRender} />
          <Image resizeMode='cover' source={onboard9} style={styles.largeImgRender} />
          <Image resizeMode='cover' source={onboard2} style={styles.smallImgRender} />
        </Animatable.View>
      </View>
      <View style={styles.btnHolder}>
        <ImageBackground resizeMode='cover' source={onboarBackground} style={styles.btnBckImg}>
          <View style={styles.holder} >
            <Text text="Buy Faster, Sell Easier" fontWeight='bold' fontSize={hp(30)}/>
            <Text 
            text="Get the best fashion items from over 100+ stores on Bazara" 
            fontWeight='600' 
            fontSize={hp(15)}
            color={colors.gray}
            lineHeight={hp(25)}
            style={{marginTop: hp(20)}}
            />
            <Pressable onPress={() => console.log("i press")}>
              <Text text="hello world" />
            </Pressable>
            <View style={[globalStyles.rowCenter, styles.btn]}>
                <Button title={'Get Started'} style={styles.btn} onPress={token ? () => navigation.navigate("BuyerScreen","Home") : () => navigation.navigate("HomeScreen")} />
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imgCont: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  largeImgRender: {
    width: hp(100),
    height: hp(220),
    margin: hp(10),
    borderRadius: hp(50)
  },
  smallImgRender: {
    width: hp(100),
    height: hp(120),
    margin: hp(10),
    borderRadius: hp(50)
  },
  btnHolder: {
    flex: 1,
    position: 'absolute',
  },
  btnBckImg: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    // justifyContent: 'flex-end',
  },
  holder: {
    position: 'absolute',
    bottom: hp(100),
    margin: hp(15)
  },
  btn: {
    width: screenWidth - hp(30),
    alignSelf: 'center',
    marginTop: hp(30)
  },
});
