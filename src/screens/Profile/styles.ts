import {StyleSheet} from 'react-native';
import { hp } from '../../utils/helpers';

export const styles = StyleSheet.create({
  inputContainer: {
    height: hp(50),
    borderBottomColor: 'rgba(69, 68, 68, 1)',
    borderBottomWidth: 1,
    paddingHorizontal: hp(18),
    marginBottom: hp(10),
    // justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  label: {
    marginBottom: hp(5),
    opacity: 0.5,
  },
  marginB: {
    marginBottom: 10,
  }
});
