import {StyleSheet} from 'react-native';
import { hp, wp } from '../../../utils/helpers';

export const styles = StyleSheet.create({
  header: {
    paddingBottom: hp(36),
    alignItems: 'center',
  },
  layout: {
    justifyContent: 'center',
  },
  upperContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
  },
  width80: {
    width: '80%',
    // alignSelf: 'center',
  },
  width100: {
    width: '100%',
    paddingHorizontal: '8%',
    alignSelf: 'center',
  },
  margTop: {
    marginTop: hp(20),
  },
  logo: {
    width: hp(120),
    height: hp(120),
    marginBottom: hp(40),
  },
  sub: {
    marginTop: hp(10)
  },
  trucksub: {
    marginTop: hp(10),
    width: wp(220)
  },
  btnContainer: {
    marginVertical: hp(35),
    width: '80%',
  },
  textBtm: {
    alignItems: 'center',
    justifyContent: 'center',
  },

});
