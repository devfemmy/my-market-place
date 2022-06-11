import React, {useContext, useState, useEffect, useRef} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image, FlatList, TouchableOpacity, SrcollView} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import {NoProducts} from '../../../../constants/images';
import { Input } from '../../../../components/common/TextInput';
import {useFormik} from 'formik';
import {styles} from './styles';
import { colors } from '../../../../utils/themes';
import { MiniButton } from '../../../../components/common/MiniButton';
import { ImageSelect } from './ImageSelect';
import { Modalize } from 'react-native-modalize';
import { Select } from '../../../../components/common/SelectInput';

export const PublishProduct = (): JSX.Element => {
    const modalizeRef = useRef(null);

    const sizeList = ["S", "M", "L", "XL", "XXL", "XXXL"]

    const renderHeader = () => (
        <View style={styles.modal__header}>
            <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Size Details" />
        </View>
    );

    return (
        <SafeAreaView>
            <Text style={[styles.lowerContainer]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(16)} text="Upload colour images" />
            <ImageSelect/>
            
            <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Size Options" />
            <View style={[globalStyles.rowStart, styles.lowerContainer]}>
                <MiniButton 
                iconSize={hp(15)}
                onPress={() => modalizeRef.current?.open()}
                iconColor={colors.primaryBg} style={globalStyles.littleButton} 
                icon={'plus'}/>

                <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Horizontalspacing]} fontWeight="400"
                color={colors.white}
                textAlign='left'
                fontSize={hp(16)}
                text="Add Sizes" />
            </View>
            {/* <View style={[globalStyles.rowStart, styles.lowerContainer]}>
                <MiniButton 
                iconSize={hp(15)}
                iconColor={colors.primaryBg} style={globalStyles.littleButton} 
                icon={'plus'}/>
                
                <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Horizontalspacing]} fontWeight="400"
                color={colors.white}
                textAlign='left'
                fontSize={hp(16)}
                text="Add Another Colour" />
            </View> */}
            <View style={[globalStyles.rowCenter, globalStyles.footer]}>
                <Button title={'Publish'} style={styles.btn}/>
            </View>
            <Modalize modalStyle={{backgroundColor: colors.primaryBg}} keyboardAvoidingOffset={100} adjustToContentHeight scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }} ref={modalizeRef} overlayStyle={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}} HeaderComponent={renderHeader}>
                {/* <Input
                    label={'Colour Description'}
                /> */}
                <Select
                    items={sizeList}
                    defaultValue={""}
                    placeholder={'Size'}
                />
                <Input
                    label={'Price *'}
                />
                <View style={{alignSelf: 'center', justifyContent: "flex-start", flexDirection: "row", alignItems: "flex-start"}}>
                    <View>
                        <Input
                            label={'Quantity'}
                            style={{height: hp(52), width: hp(220), marginLeft: hp(-10)}}
                        />
                    </View>
                    <MiniButton style={{marginLeft: hp(15)}} icon={'minus'}/>
                    <MiniButton icon={'plus'}/>
                </View>
            </Modalize>
        </SafeAreaView>
    );
};
