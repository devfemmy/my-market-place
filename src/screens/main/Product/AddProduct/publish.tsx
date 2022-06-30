import React, {useContext, useState, useEffect, useRef} from 'react';
import {Text, SafeAreaView} from '../../../../components/common';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { Button } from '../../../../components/common/Button';
import {View, Image, FlatList, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {globalStyles} from '../../../../styles';
import {hp} from '../../../../utils/helpers';
import { Input } from '../../../../components/common/TextInput';
import {styles} from './styles';
import { colors } from '../../../../utils/themes';
import { MiniButton } from '../../../../components/common/MiniButton';
import { ImageSelect } from './ImageSelect';
import { Modalize } from 'react-native-modalize';
import { Select } from '../../../../components/common/SelectInput';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { addSize, newSizes, deleteSize, editSize, addColour, 
    newColours, editColour, deleteColour, images, resetImage, 
    addImage, createProduct, updateProduct, productBySlug, 
    getAllProducts, getProductBySlug, loading, addSizeColour,
    UpdateEditableSlug, editableSlug
 } from '../../../../redux/slices/productSlice';
import { currencyFormat, Notify, firstLetterUppercase } from '../../../../utils/functions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useRoute } from '@react-navigation/native';
import { userProfile } from '../../../../redux/slices/userSilce';
import { ProductCreateFormData } from '../../../../utils/types';

import { myStore } from '../../../../redux/slices/StoreSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PublishProduct = (): JSX.Element => {
    const navigation = useNavigation<Nav>();
    const route = useRoute();
    const data = route?.params?.data
    const [slug, setSlug] = useState('')
    
    const modalizeRef = useRef(null);
    const sizeList = ["S", "M", "L", "XL", "XXL", "XXXL"]

    const dispatch = useAppDispatch()
    const sizes = useAppSelector(newSizes)
    const items_by_colors = useAppSelector(newColours)
    const item_images = useAppSelector(images)

    const loader = useAppSelector(loading)

    const product_slug = useAppSelector(productBySlug)

    const user = useAppSelector(userProfile)[0]
    const mystore = useAppSelector(myStore)


    const [edit, setEdit] = useState(false)
    const [editable, setEditable] = useState(0)

    const [editData, setEditData] = useState(route?.params?.editData)

    const [selectedSize, setSelectedSize] = useState('')
    const [colorDescription, setColorDescription] = useState('')
    const [selectedPrice, setSelectedPrice] = useState('0')
    const [selectedQuantity, setSelectedQuantity] = useState('0')



    

    useEffect(() => {
        const loadData = async () => {
            const data = await AsyncStorage.getItem('slug')
            setSlug(data)
            dispatch(getProductBySlug(data))
        }
        if(editData == null){
            loadData()
        }else{
            editData.variantImg.map((val: string, index: number) => {
                dispatch(addImage({index: index, uri: val}))
            })
        }
    }, [slug])

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
                                // text={currencyFormat(item?.price)}
                                text={item?.price}
                                fontWeight={"300"}
                                fontSize={hp(12)}
                                color={colors.bazaraTint}
                                style={styles.text} />
                            </View>
                        </View>
                    </View>

                    <View style={[globalStyles.rowStart]}>
                        <TouchableOpacity onPress={() => editPrevColor(index, item)} style={globalStyles.mini_button}>
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

    const editPrevColor = (index: number, item: {colour: string, price: number, quantity: number, images: Array<any>}) => {
        dispatch(resetImage())
        item.images.map((val: string, index: number) => {
            dispatch(addImage({index: index, uri: val}))
        })
        setColorDescription(item.colour)
        setSelectedPrice(item.price.toString())
        setSelectedQuantity(item.quantity.toString())
        setEditable(index)
        setEdit(true)
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

    const addNewColour = async () => {
        const processedImages = item_images.filter((val: string) => {
            if(val != null && val != ''){
                return val
            }
        })
        if(processedImages.length < 1 || Number(selectedPrice) < 1 || Number(selectedQuantity) < 1 || colorDescription == ''){
            Notify('Error!', 'Please check your form', 'error')
            return
        }

        if(edit){
            await dispatch(editColour({index: editable, item: {colour: colorDescription, price: Number(selectedPrice), quantity: Number(selectedQuantity), images: processedImages}}))
            setEdit(false)
        }else{
            await dispatch(addColour({colour: colorDescription, price: Number(selectedPrice), quantity: Number(selectedQuantity), images: processedImages}))
            navigation.goBack()
        }
        dispatch(resetImage())
    }

    const addNewSizeColour = async () => {
        const processedImages = item_images.filter((val: string) => {
            if(val != null && val != ''){
                return val
            }
        })
        if(processedImages.length < 1 || colorDescription == ''){
            Notify('Error!', 'Please check your form', 'error')
            return
        }
        if(sizes?.length < 1){
            Notify('Failed!', 'Minimum of 1 size option is required', 'error')
            return
        }
        if(colorDescription == ''){
            Notify('Failed!', 'Check your color descrption.', 'error')
            return
        }
        await dispatch(addSizeColour({colour: colorDescription, size: sizes, images: processedImages}))
        navigation.goBack()

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
                {/* <FlatList
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
                    text={edit ? "Update" : "Add Another Colour"} />
                </View> */}
            </>
        )
    }

    const renderColourAndSizePage = () => {
        return (
            <>
                <View>
                    <Input
                        label={'Colour Description'}
                        value={colorDescription}
                        onChangeText={(text) => setColorDescription(text)}
                    />
                </View>
                <Text style={[globalStyles.rowStart, styles.lowerContainer, globalStyles.Verticalspacing]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(17)} text="Colour sizes *" />
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

    const SubmitForm = async () => {
        if(!data.sizes && !data.colours){
            handleBasic(false, selectedPrice, selectedQuantity, mystore[0]._id, item_images, data)
        }
        else if(data.sizes && !data.colours){
            handleSizeAlone(false, sizes, mystore[0]._id, item_images, data)
        }
        else if(!data.sizes && data.colours){
            addNewColour()
        }
        else if(data.sizes && data.colours){
            addNewSizeColour()
        }else{
            return
        }
    }

    const handleBasic = async (
        draft: boolean, 
        price: string,
        quantity: string,
        id: string,
        item_images: Array<string>,
        data: {name: string, description: string, category: string}
        ) => {
        const processedImages = item_images.filter((val: string) => {
            if(val != null && val != ''){
                return val
            }
        })
        if(processedImages.length < 1){
            Notify('Failed!', 'Minimum of 1 image upload is required', 'error')
            return
        }

        console.log(price)
        console.log(quantity)

        if(Number(price) < 500){
            Notify('Failed!', 'Minimum price of N500', 'error')
            return
        }

        if(Number(quantity) < 1){
            Notify('Failed!', 'Invalid quantity', 'error')
            return
        }
    
        const payload: ProductCreateFormData = {
            id: product_slug._id,
            name: data?.name,
            description: data?.description,
            categories: data?.category,
            variants: [
                {
                    spec: [
                        {
                            price: price,
                            quantity: quantity
                        }
                    ],
                    variantImg: processedImages
                }
            ],
            isDraft: draft,
            status: 'active'
        }
        try {
            var resultAction = await dispatch(updateProduct(payload))
            if(updateProduct.fulfilled.match(resultAction)){
                Notify('Product Added!', 'Your product was successfully added', 'success')
                await dispatch(getAllProducts(id))
                // Lets check
                navigation.popToTop() 
            }else{
                Notify('Product not Added!', 'Your product was not added', 'error')
            }
        } catch (error) {
            Notify('Product not Added!', 'Your product was not added', 'error')
            console.log(error)
        }
    }

    const handleSizeAlone = async (
        draft: boolean, 
        sizes: Array<any>,
        id: string,
        item_images: Array<string>,
        data: {name: string, description: string, category: string}
        ) => {
        if(product_slug?._id == null){
            navigation.goBack()
            return
        }
        const processedImages = item_images.filter((val: string) => {
            if(val != null && val != ''){
                return val
            }
        })
        if(sizes?.length < 1){
            Notify('Failed!', 'Minimum of 1 size option is required', 'error')
            return
        }
        if(processedImages.length < 1){
            Notify('Failed!', 'Minimum of 1 image upload is required', 'error')
            return
        }

        const payload: ProductCreateFormData = {
            id: product_slug._id,
            name: data?.name,
            description: data?.description,
            categories: data?.category,
            variants: [
                {
                    spec: sizes,
                    variantImg: processedImages
                }
            ],
            isDraft: draft,
            status: 'active'
        }

        try {
            var resultAction = await dispatch(updateProduct(payload))
            if(updateProduct.fulfilled.match(resultAction)){
                Notify('Product Added!', 'Your product was successfully added', 'success')
                await dispatch(getAllProducts(id));
                // Lets check
                navigation.popToTop() 
            }else{
                Notify('Product not Added!', 'Your product was not added', 'error')
            }
        } catch (error) {
            Notify('Product not Added!', 'Your product was not added', 'error')
            console.log(error)
        }
    }

    const BtnTitle = () => {
        if(!data.sizes && data.colours){
            return 'Add this colour'
        }
        else if(data.sizes && data.colours){
            return 'Add this colour'
        }
        else if(editData != null && edit){
            return 'Update'
        }
        else if(editData != null && !edit){
            return 'Done'
        }
        else{
            return 'Publish'
        }

    }

    const renderEditableList = ({index, item}) => {
        
        return (
        <View style={globalStyles.minicardSeparator}>
            <View style={[globalStyles.rowStart, globalStyles.lowerContainerMini]} >
                <Text fontWeight="500" color={colors.darkGrey} textAlign='left' fontSize={hp(15)} text={"Size: "} />
                <Text fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(15)} text={item?.size} />
            </View>
            <View style={[globalStyles.rowStart, globalStyles.lowerContainerMini]} >
                <Text fontWeight="500" color={colors.darkGrey} textAlign='left' fontSize={hp(15)} text={"Price: "} />
                <Text fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(15)} text={currencyFormat(item?.price)} />
            </View>

            <View style={[globalStyles.rowBetween, globalStyles.lowerContainerMini]} >
                <View style={[globalStyles.rowStart]} >
                    <Text fontWeight="500" color={colors.darkGrey} textAlign='left' fontSize={hp(15)} text={"Quantity: "} />
                    <Text fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(15)} text={item?.quantity} />
                </View>
                <View style={[globalStyles.rowBetween]}>
                    <TouchableOpacity onPress={() => onEdit(item, index)} style={globalStyles.mini_button}>
                        <MaterialIcons name={'edit'} size={hp(15)} style={{color: colors.white}} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => dispatch(deleteSize(index))} style={globalStyles.mini_button}>
                        <FontAwesome name={'trash-o'} size={hp(16)} style={{color: colors.white}} />
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
        )
    }

    const onEdit = (item: any, index: number) => {
        setEdit(true)
        setEditable(index)
        setSelectedPrice(item.price.toString())
        setSelectedQuantity(item.quantity.toString())
    }

    const onEditUpdate = () => {
        var newEditData = editData
        newEditData.spec[editable].quantity = selectedQuantity
        setEditData(newEditData)
    }

    const RenderHandleEdit = () => {
        return (
            <FlatList
                data={editData.spec}
                renderItem={renderEditableList}
                scrollEnabled={false}
            />
        )
    }

    return (
        <>
        <ScrollView style={[globalStyles.wrapper, {paddingTop: hp(20)}]}>
            <Text style={[styles.lowerContainer]} fontWeight="500" color={colors.white} textAlign='left' fontSize={hp(16)} text="Upload colour images" />
            <ImageSelect/>
            { editData == null ?
                <>
                    {data?.sizes && data?.colours ? renderColourAndSizePage():null}
                    {!data?.sizes && !data?.colours ? renderPage():null}
                    {data?.sizes && !data?.colours ? renderSizePage():null}
                    {!data?.sizes && data?.colours ? renderColourPage():null}
                    <View style={[globalStyles.rowCenter, {marginBottom: hp(50)}]}>
                        <Button isLoading={loader} title={BtnTitle()} onPress={SubmitForm} style={styles.btn}/>
                    </View>
                </>
                :
                <>
                    {renderPage()}
                    {RenderHandleEdit()}
                    <View style={[globalStyles.rowCenter, {marginBottom: hp(50)}]}>
                        <Button isLoading={loader} title={BtnTitle()} onPress={() => onEditUpdate()} style={styles.btn}/>
                    </View>
                </>
            }
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