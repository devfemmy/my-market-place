import {StyleSheet} from 'react-native';
import {hp} from './../../../utils/responsiveDesign';

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
    marginBottom: hp(20),
  },
});
