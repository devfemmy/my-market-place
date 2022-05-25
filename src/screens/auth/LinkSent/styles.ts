import {StyleSheet} from 'react-native';
import {hp} from './../../../utils/responsiveDesign';

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
    height: '100%',
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
    width: hp(100),
    height: hp(100),
    marginBottom: hp(20),
  },
  sub: {
    marginTop: hp(10),
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
