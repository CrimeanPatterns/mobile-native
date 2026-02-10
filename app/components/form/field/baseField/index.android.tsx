import fromColor from 'color';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import {BaseThemedPureComponent} from '../../../baseThemed';
import util from '../../util';

export default class BaseField extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        hint: PropTypes.node,
        disabled: PropTypes.bool,
        error: PropTypes.string,
        customStyle: PropTypes.any,
    };

    static getPrimaryColor(customStyle, states) {
        if (states?.focused && _.get(customStyle, 'primaryColor.focused')) {
            return _.get(customStyle, 'primaryColor.focused');
        }

        if (states?.disabled && _.get(customStyle, 'primaryColor.disabled')) {
            return _.get(customStyle, 'primaryColor.disabled');
        }

        if (states?.errored && _.get(customStyle, 'primaryColor.errored')) {
            return _.get(customStyle, 'primaryColor.errored');
        }

        return _.get(customStyle, 'primaryColor.base', Colors.blueDark);
    }

    get textColor() {
        return fromColor(this.selectColor(Colors.black, DarkColors.text)).alpha(0.87).rgb().string();
    }

    get disabledColor() {
        return fromColor(this.selectColor(Colors.black, DarkColors.gray))
            .alpha(this.isDark ? 0.5 : 0.12)
            .rgb()
            .string();
    }

    getPrimaryColor(customStyle, {focused, disabled, errored}) {
        return BaseField.getPrimaryColor(customStyle, {focused, disabled, errored});
    }

    hasError() {
        const {error} = this.props;

        return !util.isEmpty(error);
    }

    hasHint() {
        const {hint} = this.props;

        return !util.isEmpty(hint);
    }

    getStylesObject() {
        return {
            container: {
                paddingHorizontal: 16,
            },
            label: {
                fontFamily: Fonts.regular,
                fontSize: 15,
                color: Colors.grayDark,
            },
            input: {
                color: this.textColor,
                fontSize: 16,
            },
            hint: {
                fontFamily: Fonts.regular,
                fontSize: 12,
            },
            affix: {
                fontFamily: Fonts.regular,
            },
        };
    }

    getStyles() {
        return StyleSheet.create(this.getStylesObject());
    }
}
