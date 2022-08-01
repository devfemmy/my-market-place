import React, {useContext, useState} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import {View, Image, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp,wp} from '../../../../utils/helpers';
import { colors } from '../../../../utils/themes';
import {styles} from './styles';
import {launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { addImage, images } from '../../../../redux/slices/productSlice';
import { pictureUpload } from '../../../../utils/functions';
import ImagePicker from 'react-native-image-crop-picker';

export const ImageSelect = (): JSX.Element => {

    // const [images, setImages] = useState<Array<string>>(["", "", "", "", "", ""])
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(null)
    const imageList = useAppSelector(images)

    console.log(imageList)

    const pickImage = async (index: number) => {
        setLoading(index)
        ImagePicker.openPicker({
            width: 500,
            height: 600,
            cropping: true,
            mediaType: "photo",
            multiple: false,
        }).then(async image => {
            const ImageUrl = await pictureUpload(image)
            await dispatch(addImage({index: index, uri: ImageUrl}))
            setLoading(null)
        });
        
    };

    const _renderItem = ({item, index}) => {
        if(item !== ""){
            return (
                <TouchableOpacity  onPress={() => pickImage(index)} activeOpacity={.8} >
                    <View>
                        <Image resizeMode='cover' style={styles.imgStyle2} source={{uri: item}}/>
                        { loading == index ? <ActivityIndicator size={'small'} 
                        style={{position: 'absolute', alignSelf: 'center', top: 0, bottom: 0}} /> :
                            null
                        }
                    </View>
                </TouchableOpacity>
            )
        }else {
            return (
                <TouchableOpacity onPress={() => pickImage(index)} activeOpacity={.8}>
                    <View style={styles.imgStyle2} >
                        { loading == index ? <ActivityIndicator size={'small'} /> :
                            <AntDesign name="plus" size={hp(30)} style={{color: colors.white}} />
                        }
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
