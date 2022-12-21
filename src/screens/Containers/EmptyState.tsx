import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { hp, wp } from '../../utils/helpers'
import { Button } from '../../components/common/Button'
import { Text } from '../../components/common'
import { TabRouter, useNavigation } from '@react-navigation/native'

type EmptyStateType = {
    icon: ImageSourcePropType,
    title: string,
    header: string,
    btn?: boolean,
    route?: string,
    btnText?: string,
   }


const EmptyState: React.FC<EmptyStateType> = ({icon, title, header,btn, route, btnText}) => {
    const navigation = useNavigation()
    return (
        <View style={styles.column}>
            <View style={styles.glob}>
                <Image source={icon} resizeMode='contain' style={styles.image} />
                <Text text={title} style={{marginTop: hp(10)}} />

                <View style={styles.div}>
                <Text text={header} textAlign='center' style={{marginBottom: hp(10)}} />
                </View>
                {
                    btn && <View>
                            <Button title={btnText} onPress={() => navigation?.navigate(route)} />
                        </View>
                }
            </View>
        </View>
    )
}

export default EmptyState

const styles = StyleSheet.create({
    column: {
        flex: 1,
    },
    image: {
        width: wp(100),
        height: hp(80)
    },
    glob: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
        width: '100%',
        marginVertical: 0,
        marginHorizontal: 'auto',
    },
    div: {
        width: '80%',
        marginVertical: hp(10),
        marginHorizontal: 'auto'
    },
})