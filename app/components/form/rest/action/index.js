import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';

import API from '../../../../services/api';
import {Colors, Fonts} from '../../../../styles';
import {BaseThemedPureComponent} from '../../../baseThemed';
import Icon from '../../../icon';
import util from '../../util';

export default class Action extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        text: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        method: PropTypes.oneOf(['POST', 'GET']).isRequired,
        onResponse: PropTypes.func,
        message: PropTypes.string,
        form: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
    }

    _onPress() {
        const {form, link, method, message, onResponse = _.noop} = this.props;

        if (!util.isEmpty(link) && !util.isEmpty(method)) {
            const apiMethod = API[_.toLower(method)];

            if (_.isFunction(apiMethod)) {
                apiMethod(link).then((response) => {
                    if (!util.isEmpty(message) && form) {
                        form.setSuccessMessage(message);
                    }
                    onResponse(response);
                });
            }
        }
    }

    render() {
        const {text} = this.props;
        const colors = this.themeColors;
        const styles = StyleSheet.create({
            container: {
                minHeight: 52,
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...Platform.select({
                    ios: {
                        paddingHorizontal: 16,
                        marginVertical: 12,
                    },
                    android: {
                        paddingHorizontal: 16,
                    },
                }),
            },
            caption: {
                fontSize: 15,
                fontFamily: Fonts.regular,
                color: this.selectColor(Colors.textGray, Colors.white),
            },
            arrow: {
                marginLeft: 10,
                marginRight: -6,
            },
        });

        return (
            <TouchableOpacity style={styles.container} onPress={this._onPress}>
                <Text style={styles.caption}>{text}</Text>
                <Icon style={styles.arrow} name='arrow' color={colors.grayDarkLight} size={20} />
            </TouchableOpacity>
        );
    }
}
