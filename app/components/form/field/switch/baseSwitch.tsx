import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import HTML from 'react-native-render-html';

import {isIOS} from '../../../../helpers/device';
import Icon from '../../../icon';
import BaseField from '../baseField';

const images = {
    'assets/aw.png': require('@assets/aw.png'),
    'assets/exp-track.png': require('@assets/exp-track.png'),
};
const requireImage = (src: string) => images[src];

export default class BaseSwitch extends BaseField {
    static displayName = 'SwitchField';

    static propTypes = {
        attr: PropTypes.object,
        onChangeValue: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.bool,
        hint: PropTypes.node,
        disabled: PropTypes.bool,
        disabledValue: PropTypes.bool,
        labelUpperCase: PropTypes.bool,
        customStyle: PropTypes.shape({
            container: PropTypes.shape({
                base: PropTypes.object.isRequired,
                disabled: PropTypes.object,
            }),
            label: PropTypes.shape({
                base: PropTypes.object.isRequired,
                disabled: PropTypes.object,
            }),
            hint: PropTypes.shape({
                base: PropTypes.object.isRequired,
                disabled: PropTypes.object,
            }),
            primaryColor: PropTypes.shape({
                base: PropTypes.string.isRequired,
                disabled: PropTypes.string,
            }),
        }),
    };

    static defaultProps = {
        value: false,
        disabled: false,
        labelUpperCase: false,
    };

    getAccessibilityState(disabled, selected) {
        const states = [];

        if (disabled) {
            states.push('disabled');
        }

        if (selected) {
            states.push('selected');
        }

        return states;
    }

    renderIcon = (name) => {
        const colors = this.themeColors;

        return <Icon key={`icon-${name}`} name={name} color={isIOS ? colors.grayDarkLight : '#9e9e9e'} size={24} />;
    };

    renderIcons() {
        const {attr} = this.props;

        if (_.isObject(attr)) {
            const {icons} = attr;

            if (_.isArray(icons)) {
                return <View style={styles.container}>{icons.map(this.renderIcon)}</View>;
            }
        }

        return null;
    }

    renderLabel(upperCase = true, style?, props?) {
        const {label, required} = this.props;
        const {label: styleLabel, required: styleRequired} = this.getStylesObject();

        if (_.isString(label)) {
            return (
                <HTML
                    source={{
                        html: label + (required ? '<span class="required">  *</span>' : ''),
                    }}
                    containerStyle={{
                        padding: 0,
                        margin: 0,
                        flex: 0.8,
                        flexDirection: 'row',
                    }}
                    tagsStyles={{
                        rawtext: {
                            ...styleLabel,
                            ...style,
                        },
                    }}
                    classesStyles={{
                        required: styleRequired,
                        'icon-aw': {
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        },
                        'exp-track': {
                            marginRight: 12,
                        },
                    }}
                    baseFontStyle={{...styleLabel, ...style}}
                    renderers={{
                        img: (htmlAttribs, _children, _convertedCSSStyles, passProps) => {
                            if (_.isString(htmlAttribs.src)) {
                                const source = requireImage(htmlAttribs.src);

                                return <Image key={passProps.key} source={source} style={{width: 24, height: 24}} />;
                            }

                            return null;
                        },
                    }}
                    alterData={(node) => {
                        if (node.type === 'text') {
                            if (node.parent && node.parent.attribs?.class === 'required') {
                                return undefined;
                            }

                            const text = _.trim(node.data);

                            return upperCase ? _.upperCase(text) : text;
                        }

                        // return undefined to skip changing node text
                        return undefined;
                    }}
                />
            );
        }

        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 10,
    },
});
