import React, {useContext, useState} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import {View, Image, TouchableOpacity, FlatList} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import { colors } from '../../../../utils/themes';
import {styles} from './styles';
import {launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { addImage, images } from '../../../../redux/slices/productSlice';
import { pictureUpload } from '../../../../utils/functions';

export const ImageSelect = (): JSX.Element => {

    // const [images, setImages] = useState<Array<string>>(["", "", "", "", "", ""])
    const dispatch = useAppDispatch()
    const imageList = useAppSelector(images)

    const pickImage = async (index: number) => {
        let result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 1,
        });
        if (!result.didCancel) {
            // await pictureUpload(result?.assets[0])
            dispatch(addImage({index: index, uri: result?.assets[0]?.uri}))
        }
    };

    const _renderItem = ({item, index}) => {
        if(item !== ""){
            return (
                <TouchableOpacity activeOpacity={.8} >
                    <View>
                        <Image resizeMode='cover' style={styles.imgStyle2} source={{uri: item}}/>
                    </View>
                </TouchableOpacity>
            )
        }else{
            return (
                <TouchableOpacity onPress={() => pickImage(index)} activeOpacity={.8}>
                    <View style={styles.imgStyle2} >
                        <AntDesign name="plus" size={hp(30)} style={{color: colors.white}} />
                    </View>
                </TouchableOpacity>
            )
        }
    }

  return (
    <View style={[styles.width90, globalStyles.Verticalspacing]}>
        <FlatList
        data={imageList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={_renderItem}
        numColumns={3}
        />
    </View>
  );
};
