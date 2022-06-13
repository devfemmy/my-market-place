import {StyleSheet} from 'react-native';
// import {colors} from '../constants';
import {colors} from '../utils/themes';
import {wp, hp} from '../utils/helpers/index';

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
  colStart: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: wp(15)
  },
  rowStartNoOverflow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden'
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
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: hp(15),
  },
  timesIcon: {
    position: 'absolute',
    right: wp(15),
    zIndex: 10,
  },
  line: {
    width: '44%',
  },
  selfCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: hp(210),
    height: '100%',
  },
  selfCenterImage: {
    width: hp(70),
    height: hp(70),
  },
  Verticalspacing: {
    marginVertical: hp(10),
  },
  Horizontalspacing: {
    marginHorizontal: hp(10),
  },
  littleButton: {
    height: hp(20),
    width: hp(20),
    marginLeft: hp(0),
    borderRadius: hp(5),
    backgroundColor: colors.bazaraTint,
    borderWidth: 0
  },
  cardStatus: {
    width: hp(105),
    height: hp(25),
    justifyContent:'center',
    alignItems: 'center',
    position: "absolute",
    bottom: 0,
    borderBottomLeftRadius: hp(5),
    borderBottomRightRadius: hp(5)
  },
  modal__header: {
    paddingVertical: 15,
    marginHorizontal: 15,
    alignItems: "center"
  },
  infoCard: {
    backgroundColor: colors.darkBlack,
    width: wp(340),
    borderRadius: wp(10),
    paddingVertical: hp(10),
    alignSelf: 'center',
    marginBottom: hp(10)
  },
  cardSeparator: {
    marginHorizontal: hp(15),
    borderBottomWidth: 1,
    paddingVertical: hp(12),
    borderColor: colors.black,
  },
  minicardSeparator: {
    borderBottomWidth: 1,
    paddingVertical: hp(5),
    borderColor: colors.black,
    marginVertical: 5
  },
  textOverflow: {
    width: wp(250)
  },
  noSeparator: {
    borderBottomWidth: 0
  },
  cardStatusFull: {
    width: wp(340),
    height: hp(25),
    justifyContent:'center',
    alignItems: 'center',
    position: "absolute",
    top: 0,
    borderTopLeftRadius: hp(5),
    borderTopRightRadius: hp(5)
  },
  marginTop: {
    marginTop: hp(15)
  },
  lowerContainer: {
    width: '90%',
    paddingBottom: hp(15),
    alignSelf: 'center',
  },
  lowerContainerMini: {
    width: '90%',
    paddingBottom: hp(10),
    alignSelf: 'center',
  },
  modal__body: {
    marginHorizontal: 15,
    alignItems: "center",
  },
  mini_button: {
    width: hp(25),
    height: hp(25),
    borderRadius: hp(15),
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: 'center',
    marginHorizontal: hp(5)
  },
});
