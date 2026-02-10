import PropTypes from 'prop-types';
import React from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import HTML from 'react-native-render-html';

import {isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import API from '../../../services/api';
import {Colors, Fonts} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import styles from './styles';

class FlashMessage extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        status: PropTypes.oneOf(['success', 'fail']).isRequired,
        message: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        method: PropTypes.string.isRequired,
        notice: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.verify = this.verify.bind(this);

        const {status, message} = props;

        this.state = {
            status,
            message,
        };
    }

    componentDidUpdate(prevProps) {
        const {status, message} = this.props;

        if (prevProps.status !== status || prevProps.message !== message) {
            this.setState({
                status,
                message,
            });
        }
    }

    verify() {
        const {method, link, notice} = this.props;

        this.setState(
            {
                status: 'success',
                message: notice,
            },
            () =>
                API({
                    method,
                    url: link,
                }),
        );
    }

    render() {
        const {testID, message, status} = this.state;
        const colors = this.themeColors;
        const TouchableRow = getTouchableComponent(TouchableOpacity);

        if (status === 'success') {
            return (
                <View style={styles.emailSuccess} testID={`${testID}-${status}`}>
                    {isIOS ? (
                        <Icon name='square-success' style={styles.emailSuccessIcon} color={colors.green} size={13} />
                    ) : (
                        <Icon name='success' style={styles.emailSuccessIcon} color={colors.green} size={8} />
                    )}
                    <HTML
                        textSelectable={false}
                        html={message}
                        containerStyle={{marginLeft: 8}}
                        baseFontStyle={Platform.select({
                            ios: {
                                fontSize: 13,
                                fontFamily: Fonts.regular,
                                color: colors.green,
                            },
                            android: {
                                fontSize: 12,
                                fontFamily: Fonts.regular,
                                color: '#9e9e9e',
                            },
                        })}
                    />
                </View>
            );
        }

        return (
            <TouchableRow onPress={this.verify} testID={testID}>
                <View style={[styles.emailWarning, {backgroundColor: colors.orange}]} pointerEvents='box-only'>
                    <View style={styles.emailWarningCol}>
                        <Icon name='warning' color={Colors.white} size={13} />
                        <View style={styles.emailWarningDetails}>
                            <HTML
                                defaultTextProps={{
                                    selectable: false,
                                }}
                                source={{html: message}}
                                baseFontStyle={{
                                    fontSize: 12,
                                    color: Colors.white,
                                    fontFamily: Fonts.regular,
                                }}
                            />
                        </View>
                    </View>
                    <Icon style={styles.arrow} name='arrow' color={Colors.white} size={20} />
                </View>
            </TouchableRow>
        );
    }
}

export default FlashMessage;
