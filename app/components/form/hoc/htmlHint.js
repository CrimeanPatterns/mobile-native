import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native';
import HTML from 'react-native-render-html';

import {handleOpenUrlAnyway} from '../../../helpers/handleOpenUrl';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';
import util from '../util';

const baseFontStyle = {
    fontSize: 12,
    fontFamily: Fonts.regular,
};

const containerStyle = {
    margin: 0,
    padding: 0,
};

export default function withHTMLHint(Component) {
    class HtmlHint extends BaseThemedPureComponent {
        static displayName = `withHTMLHint(${Component.displayName || Component.name || 'Component'})`;

        static propTypes = {
            ...Component.propTypes,
            ...BaseThemedPureComponent.propTypes,
            onLinkPress: PropTypes.func,
        };

        static defaultProps = {
            ...Component.defaultProps,
        };

        constructor(props) {
            super(props);

            this.customWrapper = this.customWrapper.bind(this);
        }

        customWrapper(content) {
            const colors = this.themeColors;

            return (
                <Text
                    style={{
                        fontSize: 12,
                        fontFamily: Fonts.regular,
                        color: colors.text,
                    }}>
                    {content}
                </Text>
            );
        }

        onLinkPress = (event, href, attrs) => {
            const {onLinkPress, navigation} = this.props;

            if (!_.isFunction(onLinkPress) && href) {
                handleOpenUrlAnyway({url: href});
            } else {
                (onLinkPress || _.noop)(attrs, navigation);
            }
        };

        renderHint() {
            const {hint} = this.props;
            const colors = this.themeColors;

            if (util.isEmpty(hint)) {
                return null;
            }

            return (
                <HTML
                    baseFontStyle={baseFontStyle}
                    containerStyle={containerStyle}
                    tagsStyles={{
                        a: {
                            color: colors.blue,
                            fontSize: 12,
                            fontFamily: Fonts.bold,
                            textDecorationLine: 'none',
                        },
                        p: {
                            margin: 0,
                            padding: 0,
                        },
                        rawtext: {
                            color: this.selectColor(Colors.grayDark, DarkColors.text),
                        },
                    }}
                    customWrapper={this.customWrapper}
                    defaultTextProps={{
                        selectable: false,
                    }}
                    source={{html: hint}}
                    onLinkPress={this.onLinkPress}
                />
            );
        }

        render() {
            const {forwardedRef, onLinkPress, hint, ...rest} = this.props;

            return <Component ref={forwardedRef} {...rest} hint={this.renderHint()} />;
        }
    }

    const ForwardRefWithHTMLHintComponent = React.forwardRef((props, ref) => <HtmlHint {...props} forwardedRef={ref} />);

    ForwardRefWithHTMLHintComponent.displayName = 'ForwardRefWithHTMLHintComponent';

    return ForwardRefWithHTMLHintComponent;
}
