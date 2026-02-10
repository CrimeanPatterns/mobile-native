import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Image, Modal, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import {getUserPanePicture} from '../../components/drawer/content/login';
import {SubmitButton} from '../../components/form';
import {Header} from '../../components/page/header';
import HeaderButton from '../../components/page/header/button';
import {isIOS} from '../../helpers/device';
import PasscodeService from '../../services/passcode';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';
import {ThemedPasscodeSetup} from './setup';
import styles from './styles';

class PasscodePromo extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onClose: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            visiblePromo: false,
        };
    }

    open = () => {
        this.setState({
            visible: true,
            visiblePromo: true,
        });
    };

    hide = () => {
        this.setState(
            {
                visible: false,
                visiblePromo: false,
            },
            this.onClose,
        );
    };

    close = () => {
        PasscodeService.skip();
        this.hide();
    };

    setup = () => {
        this.setState(
            {
                visiblePromo: false,
            },
            () => {
                this._passcode.open(this.hide);
            },
        );
    };

    onClose = () => {
        const {onClose} = this.props;

        if (_.isFunction(onClose)) {
            onClose();
        }
    };

    get headerLeft() {
        return (
            <View testID='passcode-promo-popup-close'>
                <HeaderButton onPress={this.close} iconName='android-clear' size={24} />
            </View>
        );
    }

    // eslint-disable-next-line class-methods-use-this
    get headerRight() {
        return <View />;
    }

    render() {
        const {visible, visiblePromo} = this.state;
        const {theme} = this.props;
        const headerProps = {
            transparent: !isIOS,
            title: isIOS ? Translator.trans('pincode.setup.title', {}, 'mobile') : '',
        };

        if (visible) {
            return (
                <>
                    <ThemedPasscodeSetup
                        ref={(ref) => {
                            this._passcode = ref;
                        }}
                        key='passcode-setup'
                    />
                    {visiblePromo && (
                        <Modal
                            statusBarTranslucent
                            visible
                            transparent={false}
                            animationType='slide'
                            onRequestClose={this.close}
                            key='passcode-promo'>
                            <Header headerLeft={this.headerLeft} headerRight={this.headerRight} transparent={!isIOS} {...headerProps} />
                            <SafeAreaView style={[styles.page, styles.pageWhite, this.isDark && styles.pageDark]}>
                                {!isIOS && (
                                    <View style={styles.pageHeader}>
                                        <Image style={styles.pageHeaderPane} source={getUserPanePicture()} />
                                        <View style={styles.pageHeaderItem}>
                                            <Text style={styles.pageTitle}>{Translator.trans('pincode.setup.title', {}, 'mobile')}</Text>
                                        </View>
                                    </View>
                                )}
                                <View style={styles.pageContent}>
                                    <View style={styles.improve}>
                                        <Text style={[styles.improveText, this.isDark && styles.textDark]}>
                                            {Translator.trans('pincode.setup.text', {}, 'mobile')}
                                        </Text>
                                    </View>
                                    <SubmitButton
                                        onPress={this.setup}
                                        label={Translator.trans('pincode.setup.button', {}, 'mobile')}
                                        raised
                                        color={this.selectColor(Colors.blueDark, DarkColors.blue)}
                                        theme={theme}
                                    />
                                </View>
                            </SafeAreaView>
                        </Modal>
                    )}
                </>
            );
        }

        return null;
    }
}

const ThemedPasscodePromo = withTheme(PasscodePromo);
const ForwardRefComponent = React.forwardRef((props, ref) => <ThemedPasscodePromo {...props} forwardedRef={ref} />);

ForwardRefComponent.displayName = 'ForwardRefPasscodePromo';

export default ForwardRefComponent;
