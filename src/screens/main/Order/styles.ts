import {StyleSheet} from 'react-native';
import {hp} from '../../../utils/helpers/responsiveDesign';

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
    width: '90%',
    alignSelf: 'center',
  },
  margTop: {
    marginTop: hp(20),
  },
});
