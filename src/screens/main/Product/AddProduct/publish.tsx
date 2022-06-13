import React, {useContext, useState, useEffect, useRef} from 'react';
import {Text, SafeAreaView} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import {View, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
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
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { addSize, newSizes, deleteSize, editSize, addColour, newColours, deleteColour, images, resetImage } from '../../../../redux/slices/productSlice';
import { currencyFormat, Notify, firstLetterUppercase } from '../../../../utils/functions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useRoute } from '@react-navigation/native';
import { Alert } from 'react-native-notifier/lib/typescript/components';

export const PublishProduct = (): JSX.Element => {
    const route = useRoute();
    const data = route?.params?.data

    const modalizeRef = useRef(null);
    const sizeList = ["S", "M", "L", "XL", "XXL", "XXXL"]

    const dispatch = useAppDispatch()
    const sizes = useAppSelector(newSizes)
    const items_by_colors = useAppSelector(newColours)
    const item_images = useAppSelector(images)


    const [edit, setEdit] = useState(false)
    const [editable, setEditable] = useState(0)

    const [selectedSize, setSelectedSize] = useState('')
    const [colorDescription, setColorDescription] = useState('')
    const [selectedPrice, setSelectedPrice] = useState('0')
    const [selectedQuantity, setSelectedQuantity] = useState('0')

    const updateQuantity = (val: string) => {
        if(val == 'minus' && Number(selectedQuantity) < 1){
            return
        }
        if(val == 'plus'){
            setSelectedQuantity((Number(selectedQuantity) + 1).toString())
        }else{
            setSelectedQuantity((Number(selectedQuantity) - 1).toString())
        }
    }

    const renderHeader = () => (
        <View style={styles.modal__header}>
            <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Size Details" />
        </View>
    );

    const renderSizeBody = () => (
        <>
        <Select
            items={sizeList}
            setState={item => setSelectedSize(item)}
            defaultValue={selectedSize}
            placeholder={'Size'}
        />
        <Input
            label={'Price *'}
            value={selectedPrice}
            onChangeText={(text) => setSelectedPrice(text)}
            keyboardType={"number-pad"}
        />
        <View style={{alignSelf: 'center', justifyContent: "flex-start", flexDirection: "row", alignItems: "flex-start"}}>
            <View>
                <Input
                    label={'Quantity'}
                    value={selectedQuantity}
                    style={{height: hp(52), width: hp(220), marginLeft: hp(-10)}}
                    onChangeText={(text) => setSelectedQuantity(text)}
                    keyboardType={"number-pad"}
                />
            </View>
            <MiniButton onPress={() => updateQuantity('minus')} style={{marginLeft: hp(15)}} icon={'minus'}/>
            <MiniButton onPress={() => updateQuantity('plus')} icon={'plus'}/>
        </View>
        <Button onPress={() => addNewSize()} title={'Save and add new'}/>
        <View style={[globalStyles.rowCenter, globalStyles.cardSeparator, globalStyles.noSeparator, globalStyles.Verticalspacing]}>
            <TouchableOpacity onPress={() => addNewSize('close')}>
                <Text text={"Save and close"} color={colors.white} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)}/>
            </TouchableOpacity>
        </View>
        </>
    );

    const renderSizesList = ({index, item}) => {
        return(
            <View style={globalStyles.minicardSeparator}>
                <View style={[globalStyles.rowStart, globalStyles.lowerContainerMini]} >
                    <Text fontWeight="500" color={colors.darkGrey} textAlign='left' fontSize={hp(15)} text={"Size: "} />
                    <Text fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(15)} text={item.size} />
                </View>
                <View style={[globalStyles.rowStart, globalStyles.lowerContainerMini]} >
                    <Text fontWeight="500" color={colors.darkGrey} textAlign='left' fontSize={hp(15)} text={"Price: "} />
                    <Text fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(15)} text={currencyFormat(item.price)} />
                </View>

                <View style={[globalStyles.rowBetween, globalStyles.lowerContainerMini]} >
                    <View style={[globalStyles.rowStart]} >
                        <Text fontWeight="500" color={colors.darkGrey} textAlign='left' fontSize={hp(15)} text={"Quantity: "} />
                        <Text fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(15)} text={item.quantity} />
                    </View>
                    <View style={[globalStyles.rowBetween]}>
                        <TouchableOpacity onPress={() => editPrevSize(index, item)} style={globalStyles.mini_button}>
                            <MaterialIcons name={'edit'} size={hp(15)} style={{color: colors.white}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => dispatch(deleteSize(index))} style={globalStyles.mini_button}>
                            <FontAwesome name={'trash-o'} size={hp(16)} style={{color: colors.white}} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    const renderColorList = ({index, item}) => {
        return(
                <View style={[globalStyles.rowBetween, globalStyles.minicardSeparator, {paddingHorizontal: hp(15), paddingVertical: hp(15)}]}>
                    <View style={[globalStyles.rowStart]}>
                        <View style={[globalStyles.rowStartNoOverflow]}>
                            <Image source={{uri: item?.images[0]}} style={styles.image} />
                        </View>
                        <View style={styles.detContainer}>
                            <Text text={firstLetterUppercase(item?.colour)} numberOfLines={1} fontWeight={"400"} fontSize={hp(15)} style={styles.text} />
                            <View style={globalStyles.rowStart}>
                                <Text
                                text={"Price: "}
                                fontWeight={"300"}
                                fontSize={hp(12)}
                                style={styles.text} />
                                <Text
                                text={item?.price}
                                fontWeight={"300"}
                                fontSize={hp(11)}
                                color={colors.bazaraTint}
                                style={styles.text} />
                            </View>
                        </View>
                    </View>

                    <View style={[globalStyles.rowStart]}>
                        <TouchableOpacity style={globalStyles.mini_button}>
                            <MaterialIcons name={'edit'} size={hp(15)} style={{color: colors.white}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => dispatch(deleteColour(index))} style={globalStyles.mini_button}>
                            <FontAwesome name={'trash-o'} size={hp(16)} style={{color: colors.white}} />
                        </TouchableOpacity>
                    </View>
                </View>
        )
    }

    const editPrevSize = (index: number, item: {size: string, quantity: string, price: string}) => {
        console.log(item)
        setSelectedSize(item.size.toString())
        setSelectedPrice(item.price.toString())
        setSelectedQuantity(item.quantity.toString())
        setEditable(index)
        setEdit(true)
        setTimeout(() => {modalizeRef.current?.open()}, 200)
    }

    const addNewSize = (val?: string) => {
        console.log(Number(selectedQuantity))
        if(selectedSize == '' || Number(selectedPrice) < 1 || Number(selectedQuantity) < 1){
            return
        }
        if(edit){
            dispatch(editSize({index: editable, item: {size: selectedSize, quantity: Number(selectedQuantity), price: Number(selectedPrice)}}))
            setEdit(false)
        }else{
            dispatch(addSize({size: selectedSize, price: Number(selectedPrice), quantity: Number(selectedQuantity)}))
        }
        setSelectedSize('')
        setSelectedPrice('0')
        setSelectedQuantity('0')

        if(val == 'close'){
            modalizeRef.current?.close()
        }
    }

    const addNewColour = () => {
        const processedImages = item_images.filter((val: string) => {
            if(val != null && val != ''){
                return val
            }
        })
        if(processedImages.length < 3 || Number(selectedPrice) < 1 || Number(selectedQuantity) < 1 || colorDescription == ''){
            Notify('Error!', 'Please check your form', 'error')
            return
        }
        dispatch(addColour({colour: colorDescription, price: Number(selectedPrice), quantity: Number(selectedQuantity), images: processedImages}))
        dispatch(resetImage())
    }

    const renderPage = () => {
        return (
            <>
                <View>
                    <Input
                        label={'Price *'}
                        value={selectedPrice}
                        onChangeText={(text) => setSelectedPrice(text)}
                        keyboardType={"number-pad"}
                    />
                    <View style={{alignSelf: 'center', justifyContent: "flex-start", flexDirection: "row", alignItems: "flex-start"}}>
                        <View>
                            <Input
                                label={'Quantity'}
                                value={selectedQuantity}
                                style={{height: hp(52), width: hp(220), marginLeft: hp(-10)}}
                                onChangeText={(text) => setSelectedQuantity(text)}
                                keyboardType={"number-pad"}
                            />
                        </View>
                        <MiniButton onPress={() => updateQuantity('minus')} style={{marginLeft: hp(15)}} icon={'minus'}/>
                        <MiniButton onPress={() => updateQuantity('plus')} icon={'plus'}/>
                    </View>
                </View>
            </>
        )
    }

    const renderSizePage = () => {
        return (
            <>
                <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Size Options" />
                <FlatList
                    data={sizes}
                    renderItem={renderSizesList}
                    scrollEnabled={false}
                />
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
            </>
        )
    }

    const renderColourPage = () => {
        return (
            <>
                <View style={globalStyles.minicardSeparator}>
                    <Input
                        label={'Colour Description'}
                        value={colorDescription}
                        onChangeText={(text) => setColorDescription(text)}
                    />
                    <Input
                        label={'Price *'}
                        value={selectedPrice}
                        onChangeText={(text) => setSelectedPrice(text)}
                        keyboardType={"number-pad"}
                    />
                    <View style={{alignSelf: 'center', justifyContent: "flex-start", flexDirection: "row", alignItems: "flex-start"}}>
                        <View>
                            <Input
                                label={'Quantity'}
                                value={selectedQuantity}
                                style={{height: hp(52), width: hp(220), marginLeft: hp(-10)}}
                                onChangeText={(text) => setSelectedQuantity(text)}
                                keyboardType={"number-pad"}
                            />
                        </View>
                        <MiniButton onPress={() => updateQuantity('minus')} style={{marginLeft: hp(15)}} icon={'minus'}/>
                        <MiniButton onPress={() => updateQuantity('plus')} icon={'plus'}/>
                    </View>
                </View>
                <FlatList
                    data={items_by_colors}
                    renderItem={renderColorList}
                    scrollEnabled={false}
                />
                <View style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]}>
                    <MiniButton 
                    iconSize={hp(15)}
                    onPress={() => addNewColour()}
                    iconColor={colors.primaryBg} style={globalStyles.littleButton} 
                    icon={'plus'}/>
                    
                    <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Horizontalspacing]} fontWeight="400"
                    color={colors.white}
                    textAlign='left'
                    fontSize={hp(16)}
                    text="Add Another Colour" />
                </View>
            </>
        )
    }

    const renderColourAndSizePage = () => {
        return (
            <>
                <View>
                    <Input
                        label={'Colour Description'}
                        value={""}
                    />
                </View>
                <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Colour sizes *" />
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
            </>
        )
    }



    return (
        <>
        <ScrollView style={[globalStyles.wrapper, {paddingTop: hp(20)}]}>
            <Text style={[styles.lowerContainer]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(16)} text="Upload colour images" />
            <ImageSelect/>
            {data.sizes && data.colours ? renderColourAndSizePage():null}
            {!data.sizes && !data.colours ? renderPage():null}
            {data.sizes && !data.colours ? renderSizePage():null}
            {!data.sizes && data.colours ? renderColourPage():null}
            <View style={[globalStyles.rowCenter, {marginBottom: hp(50)}]}>
                <Button title={'Publish'} style={styles.btn}/>
            </View>
        </ScrollView>
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
        >
            {renderSizeBody()}
            
        </Modalize>
        </>
    );
};
