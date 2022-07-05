
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, {useRef} from 'react';
import Modal from 'react-native-modal';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import {CustomSlideModalProps} from './types';
import { Button } from './Button';
import { FailedLogo, SuccesssLogo } from '../../constants/images';
import { hp } from '../../utils/helpers';
import { Modalize } from 'react-native-modalize';
import { colors } from '../../utils/themes';
import { globalStyles } from '../../styles';
import { Text } from './Text';

const CustomSlideModal = ({
  isSuccess,
  visibleBoolean,
  msg,
  headerText,
  footerText,
  onButtonPress
}: CustomSlideModalProps) => {
  const statusRef = useRef(null);

  if(visibleBoolean){
    statusRef.current?.open()
  }else{
    statusRef.current?.close()
  }

  const renderHeader = () => (
    <View style={styles.modal__header}>
    </View>
   );

  return (
    <Modalize
    modalStyle={{backgroundColor: colors.primaryBg}}
    keyboardAvoidingOffset={100}
    adjustToContentHeight
    scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
    ref={statusRef}
    overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}
    handlePosition={'inside'}
    withHandle={false}
    closeOnOverlayTap={false}
    closeSnapPointStraightEnabled={false}
    velocity={1000000000}
    threshold={100000}
    HeaderComponent={renderHeader}
    >
        <>
            <View style={globalStyles.modal__body}>
                <Image source={SuccesssLogo} style={[globalStyles.selfCenterImage, globalStyles.Verticalspacing]} resizeMode="contain" />
                <Text style={[globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text={headerText} />
                <Text style={[globalStyles.Verticalspacing]} numberOfLines={2} fontWeight="400" color={colors.darkGrey} textAlign='center' fontSize={hp(15)} text={msg} />
            </View>
            <View style={{marginVertical: hp(20)}}>
                <Button onPress={onButtonPress} title={'Dismiss'}/>
            </View>
            { footerText ?
                <TouchableOpacity onPress={() => statusRef.current?.close()}>
                    <Text style={[globalStyles.Verticalspacing, {alignSelf: 'center'}]} fontWeight="400" color={colors.white} textAlign='center' fontSize={hp(15)} text={footerText} />
                </TouchableOpacity>
                :
                null
            }
            <SafeAreaView/>
        </>
    </Modalize>
  );
};

export default CustomSlideModal;

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
  modal__header: {
    paddingVertical: 15,
    marginHorizontal: 15,
    alignItems: "center"
  },
});
