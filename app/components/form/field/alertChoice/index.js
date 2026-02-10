import Translator from 'bazinga-translator';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Alert} from 'react-native';

import util from '../../util';
import Choice from '../choice';

export default class AlertChoice extends PureComponent {
    static displayName = 'AlertChoiceField';

    static propTypes = {
        ...Choice.propTypes,
        alerts: PropTypes.object.isRequired,
    };

    static defaultProps = {
        ...Choice.defaultProps,
    };

    componentDidUpdate({value: prevValue}) {
        const {value, alerts} = this.props;

        if (prevValue !== value && _.isString(alerts[value]) && !_.isEmpty(alerts[value])) {
            setTimeout(() => {
                Alert.alert(Translator.trans('alerts.warning'), util.breakLine(alerts[value]), [
                    {
                        text: Translator.trans('button.ok'),
                    },
                ]);
            }, 200);
        }
    }

    render() {
        const {alerts, ...rest} = this.props;

        return <Choice {...rest} />;
    }
}
