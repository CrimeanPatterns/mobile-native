import DateTimePicker from '@react-native-community/datetimepicker';
import fromColor from 'color';
import * as _ from 'lodash';
import React from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';

import Icon from '../../../icon';
import Text from '../text';
import BaseDate from './baseDate';

class BaseDateTime extends BaseDate {
    static contextType = null;

    constructor(props) {
        super(props);

        this.state = {
            dateTimePickerVisible: false,
        };

        this.onClear = this.onClear.bind(this);
        this.renderAccessory = this.renderAccessory.bind(this);
        this.showDateTimePicker = this.showDateTimePicker.bind(this);
        this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
    }

    static propTypes = {
        ...BaseDate.propTypes,
    };

    static defaultProps = {
        onChangeValue: _.noop,
        disabled: false,
    };

    onClear() {
        const {onChangeValue} = this.props;

        onChangeValue(null);
    }

    renderAccessory() {
        const {value, disabled} = this.props;
        const color = fromColor('#000').alpha(0.38).rgb().string();

        if (value && !disabled) {
            return (
                <TouchableWithoutFeedback onPress={this.onClear}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Icon name='android-clear' color={color} size={18} />
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        return null;
    }

    showDateTimePicker() {
        Keyboard.dismiss();
        this.setState({
            dateTimePickerVisible: true,
        });
    }

    hideDateTimePicker(callback) {
        this.setState(
            {
                dateTimePickerVisible: false,
            },
            callback,
        );
    }

    onChangeDate(event, date) {
        if (!date) {
            this.hideDateTimePicker();
            return;
        }

        const {onChangeValue} = this.props;
        const normalizedDate = this.normalizeDate(date);

        this._input.blur();
        this.hideDateTimePicker(() => onChangeValue(normalizedDate.toISOString()));
    }

    render() {
        const {value, disabled} = this.props;
        const {dateTimePickerVisible} = this.state;

        return (
            <>
                <TouchableWithoutFeedback disabled={disabled} onPress={this.showDateTimePicker}>
                    <View>
                        <Text
                            {...this.props}
                            editable={false}
                            value={this._formatDatetime(value)}
                            renderAccessory={this.renderAccessory}
                            innerRef={this._handleInnerRef}
                        />
                    </View>
                </TouchableWithoutFeedback>
                {dateTimePickerVisible && (
                    <DateTimePicker value={this.normalizeDate(value)} onChange={this.onChangeDate} mode='date' timeZoneOffsetInMinutes={0} />
                )}
            </>
        );
    }
}

const DateTime = React.forwardRef((props, ref) => {
    const intl = useIntl();

    return <BaseDateTime {...props} intl={intl} ref={ref} />;
});

export default DateTime;
