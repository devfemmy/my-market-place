import { Modal, View, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles'
import { Text } from '../../components/common'
import { Button } from '../../components/common/Button'
import { cancel } from '../../assets'
import { hp } from '../../utils/helpers'
import { colors } from '../../utils/themes'



function AddToCartModal({ visible, setVisible, handleAdd, handleDelete, getCartFromStorage }: any) {


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible()}
            presentationStyle='pageSheet'
            style={styles.modal}
        >
            <View style={styles.contain}>
                <View style={globalStyles.rowBetween}>
                    <Text text='Action Required' />

                    <Pressable onPress={() => setVisible()}>
                        <View>
                            <Image source={cancel} />
                        </View>
                    </Pressable>
                </View>
                <View style={styles.br}></View>
                <Text text={`You have ${getCartFromStorage?.length} Item about to be added to your cart`} />
                <View style={styles.br}></View>
                <View style={styles.br}></View>
                <Button style={{backgroundColor: colors.artBoard}} title='Delete' onPress={handleDelete} />
                <View style={styles.br}></View>
                
                <Button title='Add' onPress={handleAdd} />
                <View style={styles.br}></View>
            </View>

        </Modal>
    )
}

export default AddToCartModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        marginTop: 50
    },
    contain: {
        backgroundColor: colors.black,
        marginVertical: hp(200),
        marginHorizontal: hp(10),
        borderRadius: 5,
        padding: hp(10)
    },
    br: {
        marginVertical: hp(10)
    }
})