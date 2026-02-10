import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button as NativeButton} from 'react-native-paper';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import Spinner from '../../../spinner';
import util from '../../util';
import BaseButton from './baseButton';

class Button extends BaseButton {
    static propTypes = {
        ...BaseButton.propTypes,
        icon: PropTypes.string,
        raised: PropTypes.bool,
    };

    static defaultProps = {
        ...BaseButton.defaultProps,
        raised: true,
    };

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            icon: null,
            raised: null,
        };
    }

    setIcon(icon) {
        this.setState({icon});
    }

    setRaised(raised) {
        this.setState({raised});
    }

    getVars() {
        const {icon: propIcon, raised: propRaised} = this.props;
        const {icon, raised} = this.state;
        const callback = (o) => !_.isNil(o);

        return {
            ...super.getVars(),
            icon: _.find([icon, propIcon], callback),
            raised: _.find([raised, propRaised], callback),
        };
    }

    render() {
        const {onPress = _.noop, customStyle, testID, uppercase = true} = this.props;
        const {label, mode, disabled, loading, color, icon, raised} = this.getVars();

        const hasIcon = !util.isEmpty(icon);
        const isLoading = loading && !hasIcon;
        const isDisabled = disabled || isLoading;

        const styles = StyleSheet.create({
            buttonView: {
                position: 'relative',
                ..._.get(customStyle, 'buttonView.base'),
            },
            button: {
                elevation: 0, // ReactNative 0.58.4 breaks without it
                ...(isLoading && {backgroundColor: this.selectColor(Colors.gray, DarkColors.border)}),
                ..._.get(customStyle, 'button.base'),
                ...(isDisabled ? _.get(customStyle, 'button.disabled') : {}),
                ...(isLoading ? _.get(customStyle, 'button.loading') : {}),
            },
            label: {
                fontFamily: Fonts.regular,
                fontWeight: '500',
                letterSpacing: 0,
                color: Colors.white,
                ..._.get(customStyle, 'label.base'),
                ...(isDisabled ? _.get(customStyle, 'label.disabled') : {}),
                ...(isLoading ? _.get(customStyle, 'label.loading') : {}),
            },
            spinner: {
                zIndex: 2,
                position: 'absolute',
                left: 10,
                top: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'flex-start',
            },
            contentContainer: {
                ...(hasIcon ? {} : {paddingHorizontal: 20}),
                ..._.get(customStyle, 'contentContainer.base'),
                ...(isDisabled ? _.get(customStyle, 'contentContainer.disabled') : {}),
                ...(loading ? _.get(customStyle, 'contentContainer.loading') : {}),
            },
        });
        let buttonMode = mode;

        if (_.isEmpty(buttonMode)) {
            buttonMode = raised ? 'contained' : 'text';
        }

        return (
            <View style={styles.buttonView}>
                {isLoading && <Spinner size={24} color='#0974d9' style={styles.spinner} />}
                <NativeButton
                    testID={testID}
                    accessibilityLabel={label}
                    accessibilityRole='button'
                    accessibilityState={this.getAccessibilityState(isDisabled)}
                    theme={{
                        roundness: 2,
                    }}
                    icon={icon}
                    disabled={isDisabled}
                    mode={buttonMode}
                    onPress={onPress}
                    color={color}
                    style={styles.button}
                    contentStyle={styles.contentContainer}
                    uppercase={uppercase}>
                    <Text style={styles.label}>{label}</Text>
                </NativeButton>
            </View>
        );
    }
}

export default Button;
