import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {BackHandler, Platform, StyleSheet, View} from 'react-native';

import {BaseThemedComponent} from '../../../components/baseThemed';
import CardCamera from '../../../components/card/camera';
import {HeaderBackButton, HeaderRightButton} from '../../../components/page/header/button';
import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';

@withTheme
class ScanCardCamera extends BaseThemedComponent {
    static goBack(navigation, route, step) {
        const setStep = route.params?.setStep;

        if (_.isFunction(setStep)) {
            setStep(step);
        }

        if (step === 'Front') {
            return navigation.pop(2);
        }

        return navigation.goBack();
    }

    static navigationOptions = ({navigation, route}) => {
        // const headerBackTitle = Translator.trans('buttons.back', {}, 'mobile');
        const skip = route.params?.skip;
        const step = route.params?.side;
        const title = route.params?.title;
        let headerRight;
        let headerLeft;

        headerLeft = () => <HeaderBackButton />;

        if (step === 'Back') {
            headerLeft = () => <HeaderBackButton onPress={() => ScanCardCamera.goBack(navigation, route, 'Front')} />;

            if (isIOS) {
                headerRight = () => <HeaderRightButton onPress={skip} title={Translator.trans('skip', {}, 'mobile')} />;
            } else {
                headerRight = () => <HeaderRightButton onPress={skip} iconStyle={{transform: [{rotate: '180deg'}]}} iconName='android-arrow_back' />;
            }
        }

        return {
            title,
            headerLeft,
            headerRight,
            gestureEnabled: false,
            ...Platform.select({
                android: {
                    headerTransparent: true,
                    headerBackground: () => <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}} />,
                },
            }),
        };
    };

    constructor(props) {
        super(props);

        this.translations = {
            Front: {
                title: Translator.trans('camera.front.title', {}, 'mobile'),
                tooltip: Translator.trans('camera.front.tooltip', {}, 'mobile'),
            },
            Back: {
                title: Translator.trans('camera.back.title', {}, 'mobile'),
                tooltip: Translator.trans('camera.back.tooltip', {}, 'mobile'),
            },
        };

        this.state = {
            active: true,
        };
    }

    componentDidMount() {
        const {navigation, route} = this.props;
        const side = route.params?.side ?? 'Front';
        const {title} = this.translations[side];

        navigation.setParams({title});

        this.willFocusSubscription = navigation.addListener('focus', () => {
            const {active} = this.state;

            if (!active) {
                this.setState({
                    active: true,
                });
            }
        });

        this.willBlurSubscription = navigation.addListener('blur', () => {
            const {active} = this.state;

            if (active) {
                this.setState({
                    active: false,
                });
            }
        });

        if (!isIOS && side === 'Back') {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                ScanCardCamera.goBack(navigation, 'Front');
                return true;
            });
        }
    }

    componentWillUnmount() {
        this.willFocusSubscription();
        this.willBlurSubscription();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    render() {
        const {active} = this.state;
        const {route, theme} = this.props;
        const onTakePicture = route.params?.onTakePicture;
        const side = route.params?.side ?? 'Front';
        const {tooltip} = this.translations[side];

        if (active) {
            return (
                <CardCamera
                    ref={(ref) => {
                        this.cardCamera = ref;
                    }}
                    onTakePicture={onTakePicture}
                    tooltip={tooltip}
                    theme={theme}
                />
            );
        }

        return <View style={[styles.page, this.isDark && styles.pageDark]} />;
    }
}

export default ScanCardCamera;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Platform.select({isIOS: Colors.white, android: Colors.black}),
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
});
