import {StyleSheet} from 'react-native';
import { hp } from '../../../utils/helpers';
import { colors } from '../../../utils/themes';

export const styles = StyleSheet.create({
  header: {
    paddingBottom: hp(36),
    alignItems: 'center',
  },
  forms: {},
  btn: {
    marginTop: hp(30),
    marginBottom: hp(10),
  },
  forgotPassword: {
    marginTop: hp(-1),
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: hp(15),
  },
  lowerContainer: {
    width: '90%',
    paddingBottom: hp(15),
    alignSelf: 'center',
  },
  upperContainer: {
    width: '90%',
    paddingTop: hp(15),
    alignSelf: 'center',
  },
  width90: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center'
  },
  margTop: {
    marginTop: hp(20),
  },
  spacerStyle: {
    marginBottom: 15,
  },
  imgStyle2: {
    flex: 1,
    height: hp(105),
    width: hp(105),
    borderRadius: hp(5),
    backgroundColor: colors.black,
    margin: hp(5),
    alignItems: "center",
    justifyContent: "center"
  },
  modal__header: {
    paddingVertical: 15,
    marginHorizontal: 15,
    alignItems: "center"
  },
  image: {
    height: hp(50),
    width: hp(50),
    borderRadius: hp(5),
    marginRight: hp(15),
  },
  cardContainer: {
      flexDirection: 'column',
      paddingVertical: hp(10),
      paddingHorizontal: hp(15)
  },
  underline: {
      borderBottomWidth: 1, 
      borderBottomColor: colors.gray,
      paddingVertical: hp(10)
  },
  text: {
      // marginTop: "-2%"
  },
  detContainer: {
      height: hp(50),
      justifyContent: 'space-evenly',
  },
  iconContainer: {
      height: hp(50),
      width: hp(50),
      marginRight: hp(15),
      alignItems: 'center',
      justifyContent: 'center'
  },
  namePreview: {
    height: hp(60),
    width: hp(340),
    borderRadius: hp(10),
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: hp(70),
    paddingHorizontal: hp(20),
    backgroundColor: colors.completed
  }
});
