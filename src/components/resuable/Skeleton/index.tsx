/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentProps, memo } from 'react';
import { ColorValue, View, StyleProp, ViewStyle, FlatList } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Edge, SafeAreaView as BaseSafeAreaView } from 'react-native-safe-area-context';
import { SkeletonUI } from './ui';
import { globalStyles } from '../../../styles';
import { Layout } from '@ui-kitten/components';
import { hp } from '../../../utils/helpers';

type Props = {
    label?: boolean;
    number?: number;
    numberDesc?: number;
    horizontal?: boolean
    style?: StyleProp<ViewStyle>;
    imgStyle?: StyleProp<ViewStyle>;
};

export const SkeletonView = memo(({ 
    number = 3,
    numberDesc = 2,
    horizontal=false, 
    label= false, 
    style,
    imgStyle,
    ...rest }: Props) => {
    const arr = []
    const descArr: Array<any> = []

    for(var i = 0; i < number; i ++){
        arr.push({id: i.toString()})
    }
    for(var i = 0; i < numberDesc; i ++){
        descArr.push({id: i.toString()})
    }

    const diffLengths = [hp(80), hp(60), hp(100), hp(90), hp(110), hp(130)]

    const renderCard = ({ item }) => (
        <View style={style}>
            <SkeletonUI
                style={imgStyle}
            />
            <View>
                {
                    descArr?.map((val) => {
                        return (
                            <SkeletonUI
                                style={{
                                    width: diffLengths[Math.floor(Math.random() * diffLengths.length)], 
                                    height: hp(10), 
                                    marginBottom: hp(10)}}
                            />
                        )
                    })
                }
            </View>
        </View>
    );
    const HeaderCard = () => (
        <View style={[globalStyles.rowStart, globalStyles.lowerContainer]}>
            <SkeletonUI
                style={globalStyles.labelPlaceholder}
            />
        </View>
    );
    return (
        <View style={globalStyles.wrapper}>
            {label ? <HeaderCard/> : null}
            <FlatList
                data={arr}
                renderItem={renderCard}
                horizontal={horizontal}
                keyExtractor={item => item?.id}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
            />
        </View>
    );
});

