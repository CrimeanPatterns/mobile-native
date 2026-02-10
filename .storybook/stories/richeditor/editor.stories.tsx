import React, {useRef} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

const initHTML = `
<p>
Что такое <b>Lorem Ipsum</b>?
<b>Lorem Ipsum</b> - это текст-"<i>рыба</i>", часто используемый в печати и вэб-дизайне. <u>Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века.</u> В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.
</p>
`;

export default {
    title: 'RichEditor',
    component: RichEditor,
    args: {},
};

export function Example() {
    const contentStyle = {
        backgroundColor: '#fff',
        color: '#000033',
        caretColor: 'blue',
        placeholderColor: '#a9a9a9',
        contentCSSText: 'font-size: 16px; min-height: 200px;', // initial valid
    };
    const richText = useRef<RichEditor>(null);
    const scrollRef = useRef<ScrollView>(null);

    return (
        <SafeAreaView style={[styles.container]}>
            <ScrollView style={[styles.scroll]} keyboardDismissMode={'none'} ref={scrollRef} nestedScrollEnabled={true} scrollEventThrottle={20}>
                <RichToolbar
                    style={[styles.richBar]}
                    flatContainerStyle={styles.flatStyle}
                    editor={richText}
                    selectedIconTint={'#2095F2'}
                    disabledIconTint={'#bfbfbf'}
                    actions={['bold', 'italic', 'underline']}>
                    <View
                        style={{
                            justifyContent: 'center',
                        }}>
                        <TouchableOpacity style={[{width: 36}, styles.icon]} onPress={() => richText.current?.sendAction('undo', 'result')}>
                            <Image
                                source={require('react-native-pell-rich-editor/img/undo.png')}
                                style={{
                                    tintColor: '#71787F',
                                    height: 20,
                                    width: 20,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                        }}>
                        <TouchableOpacity style={[{width: 36}, styles.icon]} onPress={() => richText.current?.sendAction('redo', 'result')}>
                            <Image
                                source={require('react-native-pell-rich-editor/img/redo.png')}
                                style={{
                                    tintColor: '#71787F',
                                    height: 20,
                                    width: 20,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </RichToolbar>
                <RichEditor
                    initialFocus={false}
                    firstFocusEnd={false}
                    editorStyle={contentStyle} // default light style
                    ref={richText}
                    style={styles.rich}
                    useContainer={true}
                    initialHeight={400}
                    enterKeyHint={'done'}
                    placeholder={'please input content'}
                    initialContentHTML={initHTML}
                    pasteAsPlainText={true}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
    rich: {
        minHeight: '100%',
        flex: 1,
        marginHorizontal: 3,
    },
    richBar: {
        alignItems: 'stretch',
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 15,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 6,
    },
    scroll: {
        backgroundColor: '#ffffff',
    },
    flatStyle: {
        flexDirection: 'row',
        flex: 1,
        paddingLeft: 5,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
