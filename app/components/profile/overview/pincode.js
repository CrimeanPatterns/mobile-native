import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import TouchID from 'react-native-touch-id';

import {usePasscodeContext} from '../../../context/passcode';
import {isIOS} from '../../../helpers/device';
import {ThemedPasscodeSetup} from '../../../screens/passcode/setup';
import PasscodeService from '../../../services/passcode';
import {TextProperty} from './textProperty';

const customStyles = {
    container: {borderBottomWidth: 0},
    containerWrap: {borderBottomWidth: 0, borderTopWidth: 0},
};

class Pincode extends TextProperty {
    static defaultProps = {
        name: '',
        testID: 'pincode-setup',
    };

    constructor(props) {
        super(props);

        this.onPress = this.onPress.bind(this);
        this.remove = this.remove.bind(this);

        this.state = {
            code: PasscodeService.getCode(),
            touchIDSupported: false,
            faceIDSupported: false,
        };
    }

    componentDidMount() {
        this.isTouchIDSupported();
    }

    isTouchIDSupported = async () => {
        if (isIOS) {
            try {
                const biometryType = await TouchID.isSupported();

                if (biometryType === 'FaceID') {
                    this.setState({faceIDSupported: true});
                } else {
                    this.setState({touchIDSupported: true});
                }
            } catch (e) {
                // do nothing
            }
        }
    };

    get isLink() {
        return true;
    }

    onPress() {
        this._passcode.open(() => {
            const code = PasscodeService.getCode();

            this.setState({code});
        });
    }

    remove() {
        const {openPasscode} = this.props;

        openPasscode(() => {
            const code = null;

            this.setState({code});
            PasscodeService.setCode(code);
        });
    }

    getCaption = () => {
        const {touchIDSupported, faceIDSupported} = this.state;

        let caption = Translator.trans('pincode.setup.title', {}, 'mobile');

        if (touchIDSupported || faceIDSupported) {
            if (touchIDSupported) {
                caption = Translator.trans('pincode.setup.title-ios', {}, 'mobile');
            } else {
                caption = Translator.trans('faceid.title', {}, 'mobile');
            }
        }

        return caption;
    };

    getSecondCaption = () => Translator.trans('userinfo.pincode.turnoff', {}, 'mobile');

    render() {
        const {code} = this.state;
        const TouchableRow = this.getTouchableRow(true);

        return (
            <>
                {this.renderRow(!_.isEmpty(code) && customStyles)}
                {!_.isEmpty(code) &&
                    this._renderRow({
                        testID: 'pincode-remove',
                        caption: this.getSecondCaption(),
                        isLink: true,
                        touchableRow: TouchableRow,
                        touchableProps: {
                            ...this.getTouchableProps(true),
                            onPress: this.remove,
                        },
                    })}
                <ThemedPasscodeSetup
                    ref={(ref) => {
                        this._passcode = ref;
                    }}
                />
            </>
        );
    }
}

export default (props) => {
    const {open} = usePasscodeContext();

    return <Pincode openPasscode={open} {...props} />;
};
