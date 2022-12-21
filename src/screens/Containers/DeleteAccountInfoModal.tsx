import { View, Modal, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles'
import { hp } from '../../utils/helpers'
import { cancel, profileDelete } from '../../assets'
import { Text } from '../../components/common'
import { Button } from '../../components/common/Button'
import { colors } from '../../utils/themes'


const DeleteAccountInfoModal = ({ deleteVisible, closeDelete, deleteAction, loading }: any) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={deleteVisible}
            onRequestClose={() => closeDelete()}
            presentationStyle='pageSheet'
        >
            <View style={styles.container}>
                <View style={globalStyles.rowBetween}>
                    <Text style={{ textTransform: 'capitalize', marginVertical: hp(3) }} text={``} fontSize={hp(16)} fontWeight='700' />
                    <Pressable onPress={closeDelete}>
                        <Image source={cancel} />
                    </Pressable>
                </View>
                <View style={styles.contain}>
                    <Image
                        source={profileDelete}
                    />
                    <Text text='Delete Account' fontWeight='700' style={{ marginVertical: hp(10) }} fontSize={hp(20)} />
                    <Text text='If you delete your account you will no longer have access to your data' lineHeight={22} textAlign='center' fontWeight='400' style={{ marginVertical: hp(10) }} fontSize={hp(16)} />
                    <View style={styles.br} />
                    <Button title='Yes, delete my account' isLoading={loading} onPress={() => deleteAction()} />
                    <View style={styles.br} />
                    <Pressable onPress={closeDelete}>
                        <View style={globalStyles.rowStart}>
                            <Text text='No' textAlign='center' fontWeight='400' fontSize={hp(14)} />
                        </View>
                    </Pressable>
                    <View style={styles.br} />
                </View>
            </View>

        </Modal>
    )
}

export default DeleteAccountInfoModal


const styles = StyleSheet.create({
    contain: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    br: {
        marginVertical: hp(10)
    },
    container: {
        backgroundColor: colors.black,
        marginVertical: hp(200),
        marginHorizontal: hp(10),
        borderRadius: 5,
        padding: hp(10)
    }
})