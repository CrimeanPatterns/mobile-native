import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Modal, Platform, StyleSheet} from 'react-native';
import RNDocumentScanCrop from 'react-native-document-scan-crop';

import {isIOS} from '../../helpers/device';
import {Colors} from '../../styles';
import Header from '../page/header';
import HeaderButton from '../page/header/button';

export default class DocumentCrop extends PureComponent {
    static propTypes = {
        file: PropTypes.string,
        title: PropTypes.string,
        tooltip: PropTypes.string,
        onCrop: PropTypes.func,
        onClose: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.close = this.close.bind(this);
        this.onCrop = this.onCrop.bind(this);
    }

    async close() {
        const {onClose} = this.props;

        if (_.isFunction(onClose)) {
            await onClose();
        }
    }

    async onCrop(event) {
        const {imagePath} = event;
        const {onCrop} = this.props;

        await this.close();

        if (_.isFunction(onCrop)) {
            onCrop(imagePath);
        }
    }

    get headerLeft() {
        return <HeaderButton onPress={this.close} iconName='android-clear' />;
    }

    get headerRight() {
        return (
            <HeaderButton
                onPress={() => this.cardCrop.crop()}
                {...Platform.select({
                    ios: {
                        title: Translator.trans('form.button.save', {}, 'messages'),
                    },
                    android: {
                        iconName: 'android-baseline-check',
                    },
                })}
            />
        );
    }

    render() {
        const {title, file} = this.props;

        return (
            <Modal
                presentationStyle='overFullScreen'
                statusBarTranslucent
                visible
                transparent={false}
                animationType='slide'
                onRequestClose={this.close}>
                <Header
                    headerLeft={this.headerLeft}
                    headerRight={this.headerRight}
                    title={title}
                    transparent={!isIOS}
                    transparentHeaderColor={Colors.black}
                />
                <RNDocumentScanCrop
                    ref={(ref) => {
                        this.cardCrop = ref;
                    }}
                    style={styles.container}
                    imagePath={file}
                    onCrop={this.onCrop}
                />
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Platform.select({ios: Colors.white, android: Colors.black}),
    },
});
