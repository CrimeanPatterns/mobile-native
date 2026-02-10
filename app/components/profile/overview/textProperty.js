import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';

import {isAndroid} from '../../../helpers/device';
import {handleOpenUrl} from '../../../helpers/handleOpenUrl';
import {getTouchableComponent} from '../../../helpers/touchable';
import {Colors, DarkColors} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import styles from './styles';

class TextProperty extends BaseThemedPureComponent {
    static touchableComponent = getTouchableComponent(TouchableHighlight);

    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        attrs: PropTypes.object,
        onPress: PropTypes.func,
        formLink: PropTypes.string,
        formTitle: PropTypes.string,
        hint: PropTypes.any,
        name: PropTypes.string.isRequired,
        navigation: PropTypes.object,
        style: PropTypes.object,
        subHint: PropTypes.any,
        testID: PropTypes.string,
        text: PropTypes.any,
        help: PropTypes.any,
        separators: PropTypes.object,
        new: PropTypes.bool,
    };

    static defaultProps = {
        style: {},
    };

    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    _onPress() {
        const {navigation, formLink, formTitle, onPress, reload, attrs} = this.props;
        let scrollTo;

        if (_.isObject(attrs)) {
            const {formFieldName} = attrs;

            scrollTo = formFieldName;
        }

        if (_.isFunction(onPress)) {
            onPress();
        }

        if (!formLink) {
            return;
        }

        const params = {formLink, formTitle, scrollTo, reload};

        handleOpenUrl(
            {url: formLink},
            () => {
                navigation.push('ProfileEdit', params);
            },
            params,
        );
    }

    onPress() {
        this._onPress();
    }

    getTouchableRow = (cond = true) => (cond && TextProperty.touchableComponent) || View;

    getTouchableProps(cond = true) {
        const {separators} = this.props;
        const props = {};

        if (cond) {
            props.onPress = this.onPress;

            if (isAndroid && _.isObject(separators)) {
                props.onPressIn = separators.highlight;
                props.onPressOut = separators.unhighlight;
            }

            props.underlayColor = this.selectColor(Colors.grayLight, DarkColors.bgLight);
            props.delayPressIn = 0;
        }

        return props;
    }

    getCaption = () => {
        const {name} = this.props;

        return name;
    };

    getHelpText = () => {
        const {help} = this.props;

        return help;
    };

    getText = () => {
        const {text} = this.props;

        return text;
    };

    getHint = () => {
        const {hint} = this.props;

        return hint;
    };

    getSubHint = () => {
        const {subHint} = this.props;

        return subHint;
    };

    get accessibilityLabel() {
        const {name, text} = this.props;

        if (_.isString(text) === false) {
            return name;
        }

        return `${name} ${text}`;
    }

    get isLink() {
        const {formLink, onPress} = this.props;

        return _.isString(formLink) || _.isFunction(onPress);
    }

    getDetails() {
        const text = this.getText();
        const hint = this.getHint();
        const subHint = this.getSubHint();

        return {text, hint, subHint};
    }

    _renderCaption = (caption, help, customStyle) => {
        const styleTextDark = this.isDark && styles.textDark;
        const captionStyles = {};

        if (_.isObject(customStyle) && _.get(customStyle, 'caption')) {
            captionStyles.caption = _.get(customStyle, 'caption');
        }

        return (
            <View style={styles.containerCaption}>
                <Text style={[styles.caption, styleTextDark, ..._.flatMapDeep([captionStyles.caption])]}>{caption}</Text>
                {_.isString(help) && <Text style={[styles.caption, styles.smallText]}>{help}</Text>}
            </View>
        );
    };

    _renderDetails = ({text, hint, subHint}) => {
        const styleTextDark = this.isDark && styles.textDark;

        return (
            <View style={[styles.containerDetails]}>
                {!_.isNil(text) && (
                    <Text numberOfLines={1} style={[styles.boldText, styleTextDark]}>
                        {text}
                    </Text>
                )}
                <View style={styles.containerDetailsRow}>
                    {this.props.new && this.renderBadge()}
                    {_.isString(hint) && <Text style={[styles.smallText, styleTextDark]}>{hint}</Text>}
                    {_.isString(subHint) && <Text style={[styles.smallText, isAndroid && {marginLeft: 3}, styleTextDark]}>{`(${subHint})`}</Text>}
                </View>
            </View>
        );
    };

    _renderRow({testID, style: {style, customStyle} = {}, isLink, caption, help, details = {}, touchableRow, touchableProps, isSilver}) {
        const Touchable = touchableRow;
        const styleContainerGray = isSilver && styles.containerGray;
        const rowStyles = {};

        if (_.isObject(customStyle)) {
            rowStyles.container = _.get(customStyle, 'container');
            rowStyles.containerWrap = _.get(customStyle, 'containerWrap');
        }

        return (
            <View style={[styles.container, this.isDark && styles.containerDark, styleContainerGray, style, ..._.flatMapDeep([rowStyles.container])]}>
                <Touchable style={{flex: 1}} {...touchableProps} testID={testID} accessibilityLabel={this.accessibilityLabel}>
                    <View
                        pointerEvents='box-only'
                        style={[styles.containerWrap, isSilver && styles.containerGrayWrap, style, ..._.flatMapDeep([rowStyles.containerWrap])]}>
                        {this._renderCaption(caption, help, customStyle)}
                        {_.isObject(details) && this._renderDetails(details)}
                        {this.renderArrow(isLink)}
                    </View>
                </Touchable>
            </View>
        );
    }

    renderBadge = () => (
        <View style={[styles.badge, {backgroundColor: this.themeColors.green}]}>
            <Text style={[styles.textBadge]}>NEW</Text>
        </View>
    );

    renderArrow = (cond = true) => cond && <Icon style={styles.arrow} name='arrow' color={this.themeColors.grayDarkLight} size={20} />;

    renderRow(styles) {
        const {testID, attrs = {}, style = {}, customStyle} = this.props;
        const parent = this.getTouchableRow(this.isLink);
        const props = this.getTouchableProps();
        const isSilver = _.isObject(attrs) && attrs.class === 'silver';

        if (customStyle) {
            // eslint-disable-next-line no-param-reassign
            styles = customStyle;
        }
        return this._renderRow({
            testID,
            style: {style, customStyle: styles},
            touchableProps: props,
            touchableRow: parent,
            caption: this.getCaption(),
            help: this.getHelpText(),
            details: this.getDetails(),
            isSilver,
            isLink: this.isLink,
        });
    }

    render() {
        return this.renderRow();
    }
}

export {TextProperty};
