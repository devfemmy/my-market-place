import React, {useContext, useRef} from 'react';
import {Text} from '../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../utils/types';
import { AuthContext } from '../../../context/context';
import { Button } from '../../../components/common/Button';
import {View, Image, SafeAreaView} from 'react-native';
import {globalStyles} from '../../../styles';
import {hp,wp} from '../../../utils/helpers';
import {UniversityLogo} from '../../../constants/images';
import { colors } from '../../../utils/themes';
import { Modalize } from 'react-native-modalize';
import { Select } from '../../../components/common/SelectInput';
import { Input } from '../../../components/common/TextInput';
import { styles } from './styles';

export const NoAccount = (): JSX.Element => {
  const {navigate} = useNavigation<Nav>();
  const {signIn} = useContext(AuthContext)
  const modalizeRef = useRef(null);
  
  const bankList = ["Access", "UBA", "First Bank", "Gtb"]

  const renderHeader = () => (
        <View style={styles.modal__header}>
            <Text style={[globalStyles.rowStart, globalStyles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Payout Account" />
        </View>
    );

  const renderBody = () => (
        <>
            <Select
                items={bankList}
                placeholder={'Bank'}
            />
            <Input
                label={'Account Number'}
            />
            <Input
                label={'Account Name'}
            />
            <Button onPress={() => console.log('Bank')} title={'Add Payout Account'}/>
        </>
    );

  return (
    <>
      <View style={[globalStyles.selfCenter]}>
        <Image source={UniversityLogo} style={[globalStyles.selfCenterImage, globalStyles.Verticalspacing]} resizeMode="contain" />
        <Text style={[globalStyles.Verticalspacing]} fontWeight="500" fontSize={hp(20)} text="No Payout Account" />
        <Text style={[globalStyles.Verticalspacing]} fontWeight="400" color={colors.darkGrey} textAlign='center' fontSize={hp(15)} text="Add your preferred business bank account" />
        <Button 
        title={'Add Account'}
        size='medium'
        style={[globalStyles.Verticalspacing, {height: hp(55)}]}
        onPress={() => modalizeRef.current?.open()} />
      </View>
      <Modalize
      modalStyle={{backgroundColor: colors.primaryBg}}
      keyboardAvoidingOffset={100}
      adjustToContentHeight
      scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
      ref={modalizeRef}
      overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}
      handlePosition={'inside'}
      handleStyle={{backgroundColor: colors.darkGrey}}
      HeaderComponent={renderHeader}
      FooterComponent={<SafeAreaView/>}
      >
          {renderBody()}
          
      </Modalize>
    </>
  );
};
