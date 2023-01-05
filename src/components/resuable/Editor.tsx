import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'

import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { Text } from '../common';
import { hp } from '../../utils/helpers';
import { colors } from '../../utils/themes';
import { globalStyles } from '../../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const Editor = ({ errorMsg, placeholder, value, onChangeText,onBlur }: any) => {
    const [editorAttached, seteditorAttached] = useState(false)
    const richText = React.useRef();

    const editorInitializedCallback = () => {
        richText.current?.registerToolbar(function (items: any) {
            seteditorAttached(true)
        });
        
      };
    return (
        <KeyboardAwareScrollView>
            <View style={{ borderColor: colors.gray, borderWidth: 1, marginBottom: hp(20), borderRadius: hp(5) }}>

               { editorAttached &&  <RichToolbar
                    editor={richText}
                    actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1,actions.heading2,actions.paragraph,actions.undo,actions.redo,actions.setStrikethrough]}
                    iconMap={{ 
                        [actions.heading1]: ({ tintColor }) => (<Text text='h1' style={[{ color: tintColor }]} />),
                        [actions.heading2]: ({ tintColor }) => (<Text text='h2' style={[{ color: tintColor }]} />),
                        [actions.paragraph]: ({ tintColor }) => (<Text text='p' style={[{ color: tintColor }]} />)
                     }}
                     selectedButtonStyle={{
                        backgroundColor: colors.bazaraTint,
                        
                     }}
                    style={{backgroundColor: 'transparent', borderBottomColor: 'grey', borderBottomWidth: 1}}
                />
                    }
                <RichEditor
                    ref={richText}
                    placeholder={placeholder}
                    onChange={onChangeText}
                    onBlur={onBlur}
                    initialContentHTML={value}
                    initialHeight={70}
                    editorInitializedCallback={editorInitializedCallback}
                    editorStyle={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        placeholderColor: "white"
                    }}
                />
            </View>
            {errorMsg !== undefined ? (
                <View style={[globalStyles.rowStart, styles.errorHold]}>
                    <Text
                        text={errorMsg}
                        category="s1"
                        fontSize={hp(12)}
                        style={styles.error}
                        textAlign="left"
                    />
                </View>
            ) : null}

        </KeyboardAwareScrollView>
    )
}

export default Editor


const styles = StyleSheet.create({

    error: {
        paddingTop: hp(-8),
        color: 'tomato',
    },
    errorHold: {
        marginTop: hp(-15),
        marginBottom: hp(20)
    },
});
