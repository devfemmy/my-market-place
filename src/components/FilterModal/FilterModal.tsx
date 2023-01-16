/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react"
import {View, StyleSheet, Modal, Pressable} from "react-native"
import { hp, wp } from "../../utils/helpers"
import { colors } from "../../utils/themes"
import { Button } from "../common/Button"
import { Text } from "../common/Text"

const FilterModal = ({modalVisible, closeModal, action, loading, rate, setRate}: any) => {
    const handleRateSelect = (data:any) => {
        if(data === rate){
            setRate(0)
        }
        setRate(data)
    }


    return (
  <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}

        >
            <View style={styles.containerDiv}>
                <View style={{marginVertical: hp(20), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text text='Filter by Ratings' fontSize={hp(20)} fontWeight='bold' />
                <Text text='X' fontSize={hp(20)} fontWeight='bold' onPress={closeModal}  />

                </View>
                <View style={styles.contain}>
                    <View style={styles.mandiv}>
                        <View style={styles.ratdiv}>
                            <Pressable onPress={() => handleRateSelect(5)} >
                            <View style={[styles.circle, {backgroundColor: rate === 5 ? colors.bazaraTint : ""}]} />
                            </Pressable>
                            <Text text='5 stars' fontSize={hp(20)} fontWeight='bold'  />
                        </View>
                        <View style={styles.ratdiv}>
                            <Pressable onPress={() => handleRateSelect(4)} >
                            <View style={[styles.circle, {backgroundColor: rate === 4 ? colors.bazaraTint : ""}]} />
                            </Pressable>
                            <Text text='4 stars' fontSize={hp(20)} fontWeight='bold'  />
                        </View>
                        <View style={styles.ratdiv}>
                            <Pressable onPress={() => handleRateSelect(3)} >
                            <View style={[styles.circle, {backgroundColor: rate === 3 ? colors.bazaraTint : ""}]} />
                            </Pressable>
                            <Text text='3 stars' fontSize={hp(20)} fontWeight='bold'  />
                        </View>
                        <View style={styles.ratdiv}>
                            <Pressable onPress={() => handleRateSelect(2)} >
                            <View style={[styles.circle, {backgroundColor: rate === 2 ? colors.bazaraTint : ""}]} />
                            </Pressable>
                            <Text text='2 stars' fontSize={hp(20)} fontWeight='bold'  />
                        </View>
                        <View style={styles.ratdiv}>
                            <Pressable onPress={() => handleRateSelect(1)} >
                            <View style={[styles.circle, {backgroundColor: rate === 1 ? colors.bazaraTint : ""}]} />
                            </Pressable>
                            <Text text='1 stars' fontSize={hp(20)} fontWeight='bold'  />
                        </View>
                    </View>
                </View>
                <Button isLoading={loading} title={"Filter"} onPress={() => action()} />
            </View>

        </Modal>
    )
}

export default FilterModal


const styles = StyleSheet.create({
    containerDiv: {
        width: '95%',
        backgroundColor: 'black',
        padding: hp(15),
        marginVertical: hp(250),
        marginHorizontal: hp(10),
        borderRadius: 10
    },
    containerDiv2: {
        width: '100%',
    },
    div: {
        paddingVertical: hp(10)
    },
    rowStart: {
        flexDirection: 'row',
        // justifyContent: 'flex-start',
        // alignItems: 'center',
    },
    activeBox: {
        width: wp(20),
        height: hp(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bazaraTint,
        borderRadius: 50
    },
    inactiveBox: {
        width: wp(20),
        height: hp(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkBlack,
        borderWidth: 0.3,
        borderColor: colors.white,
        borderRadius: 50
    },
    span: {
        paddingVertical: hp(10)
    },
    iconImage: {

    },
    input: {
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        color: 'white'
    },
    contain: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    mandiv: {

    },
    ratdiv: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(10)
    },
    circle: {
        width: wp(20),
        height: hp(20),
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.bazaraTint,
        marginRight: hp(15)
    }
})