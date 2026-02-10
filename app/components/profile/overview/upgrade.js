import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {PathConfig} from '../../../navigation/linking';
import {navigateByPath} from '../../../services/navigator';
import {TextProperty} from './textProperty';

const customStyles = {
    container: {borderBottomWidth: 0},
    containerWrap: {borderBottomWidth: 0, borderTopWidth: 0},
};

class Upgrade extends TextProperty {
    static propTypes = {
        attrs: PropTypes.object,
        formLink: PropTypes.string,
        formTitle: PropTypes.string,
        hint: PropTypes.any,
        name: PropTypes.string.isRequired,
        navigation: PropTypes.any,
        style: PropTypes.object,
        testID: PropTypes.string,
        text: PropTypes.any,
    };

    constructor(props) {
        super(props);

        this.onPress = this.onPress.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this
    get isLink() {
        return false;
    }

    // eslint-disable-next-line class-methods-use-this
    onPress() {
        navigateByPath(PathConfig.SubscriptionPayment);
    }

    getSecondCaption = () => Translator.trans('userinfo.upgrade', {}, 'mobile');

    render() {
        const {formLink} = this.props;
        const TouchableRow = this.getTouchableRow(true);

        return (
            <>
                {this.renderRow(customStyles)}
                {this._renderRow({
                    testID: 'upgrade',
                    caption: this.getSecondCaption(),
                    isLink: _.isString(formLink),
                    touchableRow: TouchableRow,
                    touchableProps: this.getTouchableProps(true),
                })}
            </>
        );
    }
}

export default Upgrade;
