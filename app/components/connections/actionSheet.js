import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform} from 'react-native';
import HTML from 'react-native-render-html';

import {Colors, DarkColors, Fonts} from '../../styles';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import {ActionSheet} from '../page';

@withTheme
class ConnectionActionSheet extends BaseThemedPureComponent {
    constructor(props) {
        super(props);

        this.open = this.open.bind(this);

        this.callback = null;
        this.actionSheet = React.createRef();

        this.state = {
            actions: [],
            destructiveButtonIndex: -1,
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    open({actions, destructiveButtonIndex}, callback) {
        this.callback = callback;
        this.safeSetState({actions, destructiveButtonIndex: destructiveButtonIndex >= 0 ? destructiveButtonIndex : -1}, this.show);
    }

    show = () => {
        if (this.actionSheet && this.actionSheet.current) {
            this.actionSheet.current.show();
        }
    };

    onPress = (index) => {
        if (_.isFunction(this.callback)) {
            const {actions} = this.state;

            if (!_.isEmpty(actions) && actions[index]) {
                this.callback(index);
            }
        }
    };

    render() {
        const {actions, destructiveButtonIndex} = this.state;

        return (
            <ActionSheet
                cancelButton={Translator.trans('cancel', {}, 'messages')}
                ref={this.actionSheet}
                options={actions}
                destructiveButtonIndex={destructiveButtonIndex}
                tintColor={Platform.select({android: this.selectColor(Colors.grayDarkLight, DarkColors.text)})}
                warnColor={this.selectColor(Colors.red, DarkColors.red)}
                onPress={this.onPress}
                buttonUnderlayColor={this.selectColor('#f9f9f9', DarkColors.bgLight)}
            />
        );
    }
}

const ActionRow = React.memo(({fontColor, option, style = {}}) => (
    <HTML
        tagsStyles={{
            p: {
                alignItems: 'center',
                justifyContent: 'center',
            },
            strong: {
                fontSize: 17,
                fontFamily: Fonts.bold,
                fontWeight: 'bold',
            },
        }}
        baseFontStyle={{
            fontSize: 17,
            fontFamily: Fonts.regular,
            color: fontColor,
            textAlign: 'center',
            ...style.text,
        }}
        defaultTextProps={{
            selectable: false,
        }}
        source={{html: option}}
    />
));

ActionRow.propTypes = {
    option: PropTypes.string.isRequired,
    styles: PropTypes.any,
    style: PropTypes.any,
    fontColor: PropTypes.string,
    index: PropTypes.number,
};

export default React.forwardRef((props, ref) => <ConnectionActionSheet {...props} forwardedRef={ref} />);
export {ActionRow};
