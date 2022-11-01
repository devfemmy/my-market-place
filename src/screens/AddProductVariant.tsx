import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { deleteProductVariantSpec, getProductBySlug, productBySlug } from '../redux/slices/productSlice'
import { sizes } from '../utils/constants/sizes'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ProductColorAloneData, ProductColorData, ProductNoColorData, ProductSizeData } from '../utils/types'
import ImagePicker from 'react-native-image-crop-picker';
import { pictureUpload } from '../utils/functions'
import { Notifier, NotifierComponents } from 'react-native-notifier'




const AddProductVariant = () => {
    const [loader, setLoader] = useState(false)
    const dispatch = useAppDispatch()
    const productSlug = useAppSelector(productBySlug)

    const [openCrop, setOpenCrop] = useState(false)
    const [photoUrl, setPhotoUrl] = useState<any>()
    const [file, setFile] = useState(null)
    const [imageUrl, setImageUrl] = useState([])
    const [multiple, setMultiple] = useState(true)

    const [isModalVisible, setIsModalVisible] = useState(false);




    const [size, setSize] = useState(sizes)
    const [responseModal, setResponseModal] = useState(false)
    const [title, setTitle] = useState('')
    const [type, setType] = useState('')

    const [productInDraft, setProductInDraft] = useState<any>()
    const [activeId, setActiveId] = useState<any>()
    const [prodId, setProdId] = useState<any>()
    const [editableItem, setEditableItem] = useState<any>()
    const [sizeList, setSizeList] = useState([])
    const [sizeLists, setSizeLists] = useState([])
    const [multipleUpload, setMultipleUpload] = useState<any>([])
    const [quantity, setQuantity] = useState(1)
    const [price, setPrice] = useState()
    const [dummyUploadImage, setDummyUploadImage] = useState([""])
    const [getSlug, setGetSlug] = useState<any>()
    const [editSizeData, setEditSizeData] = useState<{ amount: number, size: string }>()
    const [modalQuantity, setModalQuantity] = useState(1)
    const [editDataId, setEditDataId] = useState('')
    const [color, setColor] = useState()
    const [prodVarId, setProdVarId] = useState<any>()
    const [colorAloneVar, setColorAloneVar] = useState<any>([])
    // const [color, setColor] = useState<string>('')

    const initialValues: ProductNoColorData = {
        price: 0
    };

    const init: ProductColorAloneData = {
        price: price ? price : 0,
        description: ''
    };


    const _initialValues: ProductColorData = {
        description: color ? color : ''
    };

    const modalInitialValues: ProductSizeData = {
        price: editSizeData ? editSizeData?.amount : 0,
        size: editSizeData ? editSizeData?.size : "Select new Size",
    };

    useEffect(() => {
        
        const loadDispatch = async () => {
            if (prodVarId && productInDraft?.isColor && productInDraft?.isSize) {
                dispatch(getProductBySlug(getSlug)).then(dd => {
                    var filterData = dd?.payload?.product_variants?.find((data: any) => data?.id === prodVarId)
                    if (filterData === undefined) {
                        return;
                    }
                    setColor(filterData?.color)
                    setMultipleUpload(filterData?.img_urls)
                    setDummyUploadImage([...filterData?.img_urls, ""])
                    setSizeLists(filterData?.product_variant_specs)
                })
            }
    
    
            if (prodVarId && productInDraft?.isColor && !productInDraft?.isSize) {
                dispatch(getProductBySlug(getSlug)).then(dd => {
                    setColorAloneVar(dd?.payload)
                })
                return;
            }
    
            else {
                var vard = await AsyncStorage.getItem('prodVarId')
                dispatch(getProductBySlug(getSlug))
                setProdVarId(vard)
            }
        }

        loadDispatch()

    }, [getSlug, prodVarId, prodId])


    const pickImage = async (index: number) => {
        ImagePicker.openPicker({
          width: 500,
          height: 600,
          cropping: true,
          mediaType: "photo",
          multiple: false,
        }).then(async image => {
          const ImageUrl = await pictureUpload(image)
          setMultipleUpload([...multipleUpload, ImageUrl])
        });
      };

      const removeImage = (index: any) => {
        const update = multipleUpload?.filter((data: any, i: number) => i !== index)
        setMultipleUpload(update)
        const popData = dummyUploadImage.slice(0, -1);
        setDummyUploadImage(popData)
    }


    const handleFormSubmit = async (data: any) => {

    }

    const editSize = (data: any, index: any) => {
        setModalQuantity(data?.quantity)
        setEditSizeData({ size: data?.size, amount: data?.amount })
        setEditDataId(data?.id)
        showModal2()
    }

    const editSize1 = (data: any, index: any) => {
        setModalQuantity(data?.quantity)
        setEditSizeData({ size: data?.size, amount: data?.amount })
        setEditDataId(data?.id)
        showModal()
    }

    const deleteSize = async (info: any) => {
        try {
            var result = await dispatch(deleteProductVariantSpec(info))
            if (deleteProductVariantSpec.fulfilled.match(result)) {
                dispatch(getProductBySlug(getSlug)).then(dd => {
                    setMultipleUpload(dd?.payload?.product_variants[0]?.img_urls)
                    setDummyUploadImage([...dd?.payload?.product_variants[0]?.img_urls, ""])
                    setSizeLists(dd?.payload?.product_variants[0]?.product_variant_specs)
                })
            }
            else {
                var errMsg = result?.payload as string
                Notifier.showNotification({
                    title: errMsg,
                    description: '',
                    Component: NotifierComponents.Alert,
                    hideOnPress: false,
                    componentProps: {
                      alertType: 'error',
                    },
                  });
          

            }
        }
        catch (e) {
            console.log({ e })
        }
    }


    const renderSizeList = () => {
        return sizeLists?.map((data, i) => {
            return (
                <View style={styles.minidiv} key={i}>
                    {/* <RowStart>
                        <Paragraph text='Size: ' fontSize={GlobalStyle.size.size14} fontWeight='400' margin='2% 2% 0% 0%' color={GlobalStyle.color.gray} />
                        <Paragraph text={data?.size} fontSize={GlobalStyle.size.size14} fontWeight='400' margin='2% 0% 0% 0%' />
                    </RowStart>
                    <RowStart>
                        <Paragraph text='Price: ' fontSize={GlobalStyle.size.size14} fontWeight='400' margin='2% 2% 0% 0%' color={GlobalStyle.color.gray} />
                        <CurrencyFormat value={data.amount} displayType={'text'} thousandSeparator={true} prefix={'₦'} renderText={value => <Paragraph text={value} fontSize={GlobalStyle.size.size14} fontWeight='400' margin='2% 0% 0% 0%' />} />
                    </RowStart>
                    <RowBetween>
                        <ContDiv>
                            <RowStart>
                                <Paragraph text='Quantity: ' fontSize={GlobalStyle.size.size14} fontWeight='400' margin='2% 2% 0% 0%' color={GlobalStyle.color.gray} />
                                <Paragraph text={`${data.quantity} item(s)`} fontSize={GlobalStyle.size.size14} fontWeight='400' margin='2% 0% 0% 0%' />
                            </RowStart>
                        </ContDiv>
                        <RowStart>
                            <IconImage src={editIcon} onClick={() => editSize1(data, i)} />
                            <Paragraph text='' margin='0% 3px' />
                            <IconImage src={delIcon} onClick={() => deleteSize(data?.id)} />
                        </RowStart>
                    </RowBetween> */}
                </View>
            )
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setEditDataId('')
        setEditSizeData(null)
    };

    useEffect(() => {
        const loadAsyn = async () => {
            var productInDrafts = await AsyncStorage.getItem('productDraft').then((req: any) => JSON.parse(req))
            var id = await AsyncStorage.getItem('activeId') as string
            var editId = await AsyncStorage.getItem('editableId') as string
            var prodId = await AsyncStorage.getItem('prodId') as string
            var slug = await AsyncStorage.getItem('slug') as string
            var variant = await AsyncStorage.getItem('prodVarId').then((req: any) => JSON.parse(req))

            setProductInDraft(productInDrafts)
            setActiveId(id)
            setProdId(prodId)
            setEditableItem(editId)
            setGetSlug(slug)
            setProdVarId(variant)

        }
        loadAsyn()
    }, [])


  return (
    <View>
      <Text>AddProductVariant</Text>
    </View>
  )
}

export default AddProductVariant

const styles = StyleSheet.create({
    minidiv: {

    }
})