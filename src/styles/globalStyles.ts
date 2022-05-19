import {StyleSheet} from 'react-native';
import {colors} from '../constants';
import {wp, hp} from '../utils/index';

export const globalStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  container: {
    paddingHorizontal: wp(15),
    flexGrow: 1,
  },
  itemContainer: {
    paddingHorizontal: wp(15),
  },
  scroll: {
    paddingVertical: hp(25),
  },
  supermartLogo: {
    marginTop: hp(20),
    marginBottom: hp(10),
    borderWidth: 1,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBetweenNoCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  undeline: {
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  authTitle: {
    paddingTop: hp(80),
  },
  footerBtn: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: hp(15),
    paddingHorizontal: wp(15),
  },
  timesIcon: {
    position: 'absolute',
    right: wp(15),
    zIndex: 10,
  },
});
