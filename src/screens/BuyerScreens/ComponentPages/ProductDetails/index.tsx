import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, Text} from '../../../../components/common';
import { View, ActivityIndicator, StatusBar, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { Nav } from '../../../../utils/types';
import { AuthContext } from '../../../../context/context';
import { Button } from '../../../../components/common/Button';
import { globalStyles } from '../../../../styles';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import { getAllCategories } from '../../../../redux/slices/sideHustleSlice';
import { Banner } from '../../../../constants/images';
import { colors } from '../../../../utils/themes';
import { hp, wp } from '../../../../utils/helpers';
import { useRoute } from '@react-navigation/native';
import BuyerProductCard from '../../../../components/resuable/BuyerProductCard';
import { Input } from '../../../../components/common/TextInput';
import { firstLetterUppercase } from '../../../../utils/functions';
import { numberFormat } from '../../../../utils/helpers';
import QtyBtn from '../../../../components/resuable/QtyBtn';
import SubHeader from '../../main/Home/Layout/subHeader';
import { addToCart, loading as cartLoader } from '../../../../redux/slices/cartSlice';
import { getProductBySlugBuyer, loading, buyerProduct } from '../../../../redux/slices/productSlice';
import { Notify } from '../../../../utils/functions';

export const ProductDetails = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const {data} = route?.params
  const product : any = useAppSelector(buyerProduct)
  const loader = useAppSelector(loading)
  const cartloading = useAppSelector(cartLoader)

  const [selectedVariant, setSelectedVariant]= useState("")
  const [selectedSpec, setSelectedSpec]= useState("")
  const [selectedPrice, setSelectedPrice]= useState(null)
  const [quantity, setQuantity]= useState(0)

  const [colorSizes, setColorSizes]= useState([])


  useEffect(() => {
    dispatch(getProductBySlugBuyer(data?.slug))
  }, [])

  const CartAdd = async (quantity: number) => {
    try {
      const payload = {
        "product_id": data?.id,
        "product_variant_id": selectedVariant,
        "product_variant_spec_id": selectedSpec,
        "quantity": quantity
      }
      const resultAction = await dispatch(addToCart(payload))
      if(addToCart.fulfilled.match(resultAction)){
        Notify('Cart!', 'Your product was successfully added to cart!', 'success')
        setSelectedPrice(null)
        setSelectedSpec("")
        setSelectedVariant("")
        setQuantity(0)
        setColorSizes([])
        
      } else{
          Notify('Product not Added!', 'Your product was not added to cart', 'error')
      }
    } catch (error) {
      
    }
    
  }

  if(loader){
    return (
        <SafeAreaView>
            <View style={[globalStyles.rowCenter, {flex: 1}]}>
                <ActivityIndicator size={'small'}/>
            </View>
        </SafeAreaView>
    )
  }

  let prices: Array<any> = []
  prices.sort(function(a, b){return a-b});

  let sizes: Array<any> = []

  let availcolors: Array<any> = []

  const availablePrices = product?.product_variants?.map((variant: any) => {
    variant?.product_variant_specs?.map((spec: any) => {
      prices.push(spec?.amount)
    })
  })

  const availableSizes = product?.product_variants?.map((variant: any) => {
    variant?.product_variant_specs?.map((spec: any) => {
      if(spec?.size !== null && spec?.size !== "N/A" && !sizes?.includes(spec?.size?.toUpperCase())){
        sizes.push({size: spec?.size.toUpperCase(), id: spec?.id, price: spec?.amount, variant_id: variant?.id})
      }
    })
  })

  const availableColors = product?.product_variants?.map(async (variant: any) => {
    if(variant?.color !== null && variant?.color !== "N/A"){
      await availcolors?.push({color: variant?.color, id: variant?.id, img_url: variant?.img_urls[0]})
    }
  })

  const getColorSizes = async (color: string) => {
    let arr : Array<any> = []
    let varian: any
    await product?.product_variants?.map(async (variant: any) => {
      if(variant?.color === color){
        varian = variant
        const sizesAvailable = await variant?.product_variant_specs?.map((spec: any) => {
          if(spec?.size !== null && spec?.size !== "N/A"){
            return arr.push({size: spec?.size.toUpperCase(), id: spec?.id, price: spec?.amount, variant_id: variant?.id})
          }
        })
      }
    })
    setSelectedSpec("")
    setColorSizes(arr)
    if(arr?.length < 1){
      setSelectedSpec(varian?.product_variant_specs[0]?.id)
      setSelectedPrice(varian?.product_variant_specs[0]?.amount)
    }
  }

  const RenderColors = ({item}: {item: any}) => {
    return (
      <TouchableOpacity onPress={() => {
        if(selectedVariant == item?.id){
          setSelectedVariant("")
          setColorSizes([])
          setQuantity(0)
          setSelectedPrice(null)
        }else{
          setQuantity(0)
          setSelectedVariant(item?.id)
          getColorSizes(item?.color)
        }
      }} style={styles?.miniimageContainer}>
        <Image source={{uri: item?.img_url}} resizeMode='cover' style={[styles.miniimageCard, {
          borderWidth: selectedVariant == item?.id ? 1 : 0
        }]} />
        <Text 
        text={firstLetterUppercase(item?.color)} 
        fontSize={hp(12)}
        color={selectedVariant == item?.id ? colors.bazaraTint : colors.white}
        textAlign={'center'}
        numberOfLines={1}
        style={{marginTop: hp(5)}}
        />
      </TouchableOpacity>
    )
  }

  const RenderSizes = ({item}: {item: any}) => {
    return (
      <TouchableOpacity onPress={() => {
        if(selectedSpec == item?.id){
          setSelectedSpec("")
          setQuantity(0)
          setSelectedPrice(null)
        }else{
          setQuantity(0)
          setSelectedVariant(item?.variant_id)
          setSelectedSpec(item?.id)
          setSelectedPrice(item?.price)
        }
      }} style={[styles?.minisizeContainer, { borderWidth: selectedSpec == item?.id ? 1 : 0 }]}>
        <Text 
        text={item?.size} 
        fontSize={hp(12)}
        color={selectedSpec == item?.id ? colors.bazaraTint : colors.white}
        textAlign={'center'}
        numberOfLines={1}
        />
      </TouchableOpacity>
    )
  }

  const validate = () => {
    if( selectedVariant === "" || selectedSpec === "" || quantity < 1){
      return true
    }else{
      return false
    }
  }

  const IncreaseCart = () => {
    product?.product_variants?.map((variant: any) => {
      if(variant?.id == selectedVariant){
        variant?.product_variant_specs?.map((spec: any) => {
          if(spec?.id == selectedSpec){
            if(quantity < spec?.quantity){
              setQuantity(quantity + 1)
            }
          }
        })
      }
    })
  }

  return (
    <View style={globalStyles.wrapper}>
      <ScrollView style={{padding: hp(10)}}>
        <View style={styles.imageCard}>
            <Image source={{uri: product?.img_url}} resizeMode='cover' style={styles.imageContainer} />
        </View>
        <Text 
        text={firstLetterUppercase(product?.name)} 
        fontSize={hp(15)}
        color={colors.white}
        textAlign={'left'}
        numberOfLines={3}
        style={{marginTop: hp(20)}}
        />
        <Text 
        text={firstLetterUppercase(product?.store?.brand_name)} 
        fontSize={hp(12)}
        color={colors.white}
        textAlign={'left'}
        numberOfLines={3}
        style={{marginTop: hp(20), textDecorationLine: "underline"}}
        />
        <Text 
        text={ selectedPrice ? (`₦${numberFormat(Number(selectedPrice))}`) : (prices?.length > 1 ? `₦${numberFormat(Number(prices.sort(function(a, b){return a-b})[0]))} - ₦${numberFormat(Number(prices.sort(function(a, b){return a-b})[prices?.length - 1]))}` : `₦${numberFormat(Number(prices[0] || 0))}`)}
        fontSize={hp(15)}
        color={colors.dispatched}
        textAlign={'left'}
        numberOfLines={3}
        style={{marginVertical: hp(20)}}
        />
        { availcolors?.length > 0 ?
          <>
            <SubHeader name={'Available Colours'}/>
            <ScrollView horizontal contentContainerStyle={globalStyles?.rowStart}>
              {
                availcolors?.map((item) => {
                  return <RenderColors item={item} />
                })
              }
            </ScrollView>
          </>
          :
          null
        }
        { colorSizes?.length > 0 ?
          <>
            <SubHeader name={'Available Sizes'}/>
            <ScrollView horizontal contentContainerStyle={globalStyles?.rowStart}>
              {
                colorSizes?.map((item) => {
                  return <RenderSizes item={item} />
                })
              }
            </ScrollView>
          </>
          :
          null
        }
        { sizes?.length > 0 && availcolors?.length < 1 ?
          <>
            <SubHeader name={'Available Sizes'}/>
            <ScrollView horizontal contentContainerStyle={globalStyles?.rowStart}>
              {
                sizes?.map((item) => {
                  return <RenderSizes item={item} />
                })
              }
            </ScrollView>
          </>
          :
          null
        }
        { selectedVariant != "" && selectedSpec != "" ?
          <>
            <SubHeader name={'Quantity'}/>
            <View style={{marginBottom: hp(15)}} />
            <View style={{width: "60%"}}>
              <QtyBtn onMinus={() => setQuantity(quantity - 1)} onAdd={() => IncreaseCart()} value={quantity} size={hp(15)}/>
            </View>
          </>
          :
          null
        }
        <View style={{marginVertical: hp(100)}}/>
      </ScrollView>
      <>
      <View style={[globalStyles.rowAround, {width: "100%", alignSelf: "center", position: "absolute", bottom: 0}]}>
        <Button disabled={validate()} isLoading={cartloading} title={`Add to Cart(${quantity})`} small style={[styles.btn, {backgroundColor: colors?.black}]} onPress={() => CartAdd(quantity)} />
        <Button isLoading={false} title={'Buy Now'} small style={styles.btn} onPress={() => console.log('help')} />
      </View>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
      width: '100%',
      height: hp(200)
  },
  imageCard: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: wp(5),
    width: '100%',
    height: hp(200),
    backgroundColor: colors.dimBlack,
    overflow: 'hidden'
  },
  miniimageCard: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
    borderRadius: hp(15),
    width: hp(60),
    height: hp(60),
    borderColor: colors?.bazaraTint,
    backgroundColor: colors.dimBlack,
  },
  miniimageContainer: {
    marginRight: hp(10),
    marginVertical: hp(15),
  },
  minisizeContainer: {
    padding: hp(10),
    minWidth: hp(50),
    backgroundColor: colors.dimBlack,
    marginRight: hp(10),
    marginVertical: hp(15),
    borderRadius: hp(10),
    borderColor: colors?.bazaraTint
  },
  btn: {
    // marginTop: hp(30),
    marginBottom: hp(50),
    height: hp(55),
    width: wp(160),
    borderRadius: hp(15),
  },
})
