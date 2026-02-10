import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';

import {handleOpenUrl} from '../../../helpers/handleOpenUrl';
import Upgrade from './upgrade';

const customStyles = {
    container: {borderBottomWidth: 0},
    containerWrap: {borderBottomWidth: 0, borderTopWidth: 0},
};

class CancelSubscription extends Upgrade {
    constructor(props) {
        super(props);

        this.cancel = this.cancel.bind(this);
    }

    get isLink() {
        const {attrs = {}} = this.props;

        return attrs.kind === 8;
    }

    onPress() {
        const {navigation} = this.props;

        navigation.navigate('SubscriptionInfo');
    }

    cancel() {
        // eslint-disable-next-line no-underscore-dangle
        handleOpenUrl({url: this.props.formLink});
    }

    getSecondCaption = () => Translator.trans('subscription.cancel', {}, 'messages');

    render() {
        const {formLink} = this.props;
        const TouchableRow = this.getTouchableRow(true);

        return (
            <>
                {this.renderRow(customStyles)}
                {this._renderRow({
                    testID: 'cancel-subscription',
                    caption: this.getSecondCaption(),
                    isLink: _.isString(formLink),
                    touchableRow: TouchableRow,
                    touchableProps: {
                        ...this.getTouchableProps(true),
                        onPress: this.cancel,
                    },
                })}
            </>
        );
    }
}

export default CancelSubscription;
