/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentProps, memo } from 'react';
import { ColorValue, View, StyleProp, ViewStyle } from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Edge, SafeAreaView as BaseSafeAreaView } from 'react-native-safe-area-context';

import { Layout } from '@ui-kitten/components';
import { colors } from '../../../utils/themes';

type Props = {
    style?: StyleProp<ViewStyle>;
};

export const SkeletonUI = memo(({ style, ...rest }: Props) => {
  return (
    <SkeletonPlaceholder
    backgroundColor={colors.black}
    highlightColor={colors.dimBlack}
    >
        <View
            style={style}
        />
    </SkeletonPlaceholder>
  );
});

