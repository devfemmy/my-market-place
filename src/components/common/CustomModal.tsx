
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import Modal from 'react-native-modal';
import {Text} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
} from 'react-native';
import {CustomModalProps} from './types';
import { Button } from './Button';
import { FailedLogo, SuccesssLogo } from '../../constants/images';
import { hp } from '../../utils/helpers';
const CustomModal = ({
  isSuccess,
  visibleBoolean,
  handleVisible,
  msg,
  headerText,
}: CustomModalProps) => {
  return (
    <Modal
      backdropOpacity={0.6}
      coverScreen={true}
      isVisible={visibleBoolean}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={800}
      animationOutTiming={800}>
      <View style={styles.modalWrapper}>
        <View style={styles.containerWrapper}>
          <Image
            source={isSuccess ? SuccesssLogo : FailedLogo}
            style={styles.imageStyle}
          />
          <View>
            <Text style={styles.mainText}>{headerText}</Text>
            <Text style={styles.msgText}>{msg}</Text>
          </View>
          <View style={styles.buttonContainer}>
          <Button title={'Dismiss'} onPress={() => handleVisible()} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalWrapper: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: '11%',
  },
  containerWrapper: {
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 16,
    backgroundColor: '#333333',
    height: hp(290),
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  mainText: {
    fontSize: hp(22),
    color: '#fff',
    fontStyle: 'normal',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: hp(10),
  },
  msgText: {
    color: 'white',
    textAlign: 'center',
  },
  imageStyle: {
    width: 60,
    height: 60,
  },
  buttonContainer: {
    width: '100%'
  },
});
