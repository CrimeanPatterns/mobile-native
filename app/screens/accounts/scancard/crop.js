import Translator from 'bazinga-translator';
import React from 'react';
import {BackHandler, Platform, StyleSheet, Text, View} from 'react-native';
import RNDocumentScanCrop from 'react-native-document-scan-crop';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BaseThemedComponent} from '../../../components/baseThemed';
import Icon from '../../../components/icon';
import {HeaderRightButton} from '../../../components/page/header/button';
import {isAndroid, isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import {Colors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';

const TouchableRow = getTouchableComponent(View);

@withTheme
class ScanCardCrop extends BaseThemedComponent {
    static navigationOptions = ({route}) => {
        const cropFn = route.params.crop;
        let headerRight;
        let title = '';

        if (isIOS) {
            headerRight = () => <HeaderRightButton onPress={cropFn} title={Translator.trans('form.button.save', {}, 'messages')} />;
        } else {
            title = Translator.trans('camera.edit.tooltip', {}, 'mobile');
        }

        return {
            gestureEnabled: false,
            headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
            title,
            headerRight,
            ...Platform.select({
                android: {
                    // tabBarVisible: false,
                    headerTransparent: false,
                    headerStyle: {
                        // ...defaultNavigationOptions.headerStyle,
                        backgroundColor: Colors.black,
                        elevation: 0,
                    },
                },
            }),
        };
    };

    constructor(props) {
        super(props);

        this.crop = this.crop.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        navigation.setParams({crop: this.crop});

        if (isAndroid) {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                navigation.goBack();
                return true;
            });
        }
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    crop() {
        if (this.cardCrop) {
            this.cardCrop.crop();
        }
    }

    render() {
        const {route, navigation} = this.props;
        const imagePath = route.params?.imagePath;
        const onCrop = route.params?.onCrop;

        return (
            <View style={[styles.container, this.isDark && styles.containerDark]}>
                <RNDocumentScanCrop
                    ref={(ref) => {
                        this.cardCrop = ref;
                    }}
                    style={{flex: 1}}
                    imagePath={imagePath}
                    onCrop={onCrop}
                />
                {isAndroid && (
                    <SafeAreaView>
                        <View style={styles.bottomContainer}>
                            <TouchableRow onPress={() => navigation.goBack()}>
                                <View style={styles.button} pointerEvents='box-only'>
                                    <Icon name='arrow' color={Colors.white} size={15} style={{transform: [{rotate: '180deg'}], marginRight: 15}} />
                                    <Text style={styles.buttonText}>{Translator.trans('retake', {}, 'mobile').toUpperCase()}</Text>
                                </View>
                            </TouchableRow>
                            <TouchableRow onPress={() => this.crop()}>
                                <View style={styles.button} pointerEvents='box-only'>
                                    <Text style={styles.buttonText}>{Translator.trans('form.button.save', {}, 'messages').toUpperCase()}</Text>
                                    <Icon name='arrow' color={Colors.white} size={15} style={{marginLeft: 15}} />
                                </View>
                            </TouchableRow>
                        </View>
                    </SafeAreaView>
                )}
            </View>
        );
    }
}

export default ScanCardCrop;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Platform.select({ios: Colors.white, android: Colors.black}),
    },
    containerDark: {
        backgroundColor: Colors.black,
    },
    bottomContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        bottom: 0,
    },
    button: {
        paddingVertical: 20,
        paddingHorizontal: 25,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 13,
        color: Colors.white,
        fontFamily: Fonts.regular,
    },
});
