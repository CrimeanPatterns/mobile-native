import {CancelToken} from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text as NativeText, TouchableOpacity, View} from 'react-native';

import API from '../../../../services/api';
import {Colors, DarkColors, Fonts} from '../../../../styles';
import {BaseThemedPureComponent} from '../../../baseThemed';
import Text from '../text';

export function withCompletion(Component = Text) {
    class Completion extends BaseThemedPureComponent {
        static displayName = `withCompletion(${Component.displayName || Component.name || 'Component'})`;

        static propTypes = {
            ...Component.propTypes,
            ...BaseThemedPureComponent.propTypes,
            completionLink: PropTypes.string,
            completionMethod: PropTypes.string,
            paramName: PropTypes.string,
            minLength: PropTypes.number,
            createRequest: PropTypes.func,
            onSelect: PropTypes.func,
            wait: PropTypes.number,
        };

        static defaultProps = {
            ...Component.defaultProps,
            completionMethod: 'post',
            paramName: 'queryString',
            minLength: 2,
            wait: 200,
        };

        constructor(props) {
            super(props);

            this.state = {
                focused: false,
                completions: [],
                completionValue: '',
            };

            this._handleInnerRef = this._handleInnerRef.bind(this);
            this._onChangeValue = this._onChangeValue.bind(this);
            this._onFocus = this._onFocus.bind(this);
            this._onBlur = this._onBlur.bind(this);
            this._renderCompletions = this._renderCompletions.bind(this);

            this._createRequest = _.debounce(this._createRequest, props.wait);
        }

        componentDidMount() {
            this.mounted = true;
        }

        componentDidUpdate({completionLink: prevCompletionLink, completionMethod: prevCompletionMethod, paramName: prevParamName}) {
            const {completionLink, completionMethod, paramName, form} = this.props;
            const {focused, completions} = this.state;

            if (completionLink !== prevCompletionLink || prevCompletionMethod !== completionMethod || prevParamName !== paramName) {
                this._close();
            }

            if (this.mounted && this._completion && focused && completions.length > 0 && _.isObject(form)) {
                form.scrollToView(this._completion, true);
            }
        }

        componentWillUnmount() {
            this.mounted = false;
            this._close();
        }

        safeSetState(...args) {
            if (this.mounted) {
                this.setState(...args);
            }
        }

        focus() {
            if (this.mounted) {
                this._input.focus();
            }
        }

        isFocused() {
            const {focused} = this.state;

            return focused;
        }

        blur() {
            if (this.mounted) {
                this._input.blur();
            }
        }

        _handleInnerRef(ref) {
            const {innerRef = _.noop} = this.props;

            this._input = ref;
            innerRef(this._input);
        }

        _onChangeValue(value) {
            const {onChangeValue = _.noop} = this.props;

            this._createRequest(value);
            onChangeValue(value);
        }

        _createRequest(value) {
            const {completionLink, completionMethod, paramName, minLength, createRequest} = this.props;

            if (!_.isString(value) || value.length < minLength) {
                this._close();
                return;
            }

            if (_.isFunction(createRequest)) {
                createRequest(value).then((completions) => {
                    this.safeSetState({
                        completions,
                        completionValue: value,
                    });
                });
                return;
            }

            if (this._requestSource && _.isFunction(this._requestSource.cancel)) {
                this._requestSource.cancel();
            }
            this._requestSource = CancelToken.source();

            API.request({
                url: completionLink,
                method: _.toLower(completionMethod),
                cancelToken: this._requestSource.token,
                data: {
                    [paramName]: value,
                },
            }).then((response) => {
                if (response && _.isObject(response.data) && response.data[paramName] === value) {
                    this.safeSetState({
                        completions: response.data.completions || [],
                        completionValue: value,
                    });
                }
            });
        }

        _prepareCompletions(highlight, completions) {
            const prepared = [];
            const mainColor = this.selectStyle({
                ios: {
                    light: Colors.grayDark,
                    dark: Colors.white,
                },
                android: {
                    light: Colors.grayDark,
                    dark: DarkColors.blue,
                },
            });
            const highlightColor = this.selectColor(Colors.blueDark, DarkColors.blue);
            const styles = StyleSheet.create({
                completion: {
                    fontFamily: Fonts.regular,
                    fontSize: 13,
                    color: mainColor,
                },
                highlight: {
                    color: highlightColor,
                },
            });

            let preparedCompletion;

            _.forEach(completions, (completion) => {
                preparedCompletion = {...completion};
                preparedCompletion.label = this.getTextSections(highlight, completion.label).map((section, k) => (
                    <NativeText key={`text-highlight-element-${k}`} style={[styles.completion, section.highlight && styles.highlight]}>
                        {section.text}
                    </NativeText>
                ));

                prepared.push({
                    onPress: this._onPress.bind(this, completion),
                    details: preparedCompletion,
                });
            });

            return prepared;
        }

        getTextSections(highlight, text) {
            const indices = [];
            const searchStrLen = highlight.length;
            let startIndex = 0;
            const str = text.toLowerCase();
            const preparedHighlight = highlight.toLowerCase();
            let index = str.indexOf(preparedHighlight, startIndex);

            while (index > -1) {
                if (index > 0) {
                    indices.push({
                        text: text.substring(startIndex, index),
                    });
                }
                startIndex = index + searchStrLen;
                indices.push({
                    highlight: true,
                    text: text.substring(index, startIndex),
                });
                index = str.indexOf(preparedHighlight, startIndex);
            }
            if (startIndex < str.length) {
                indices.push({text: text.substring(startIndex, str.length)});
            }
            return indices;
        }

        _onFocus() {
            const {onFocus = _.noop} = this.props;

            this.safeSetState({
                focused: true,
            });
            onFocus();
        }

        _onBlur() {
            const {onBlur = _.noop} = this.props;

            this.safeSetState({
                focused: false,
            });
            this._close();
            onBlur();
        }

        _onPress(completion) {
            const {form, name, onChangeValue = _.noop, onSelect = _.noop} = this.props;

            if (_.isObject(form)) {
                const field = form.getField(name);

                if (_.isObject(field)) {
                    field.row = completion;
                    form.setField(name, field);
                }
            }
            onSelect(completion);
            onChangeValue(completion.value);
            this._close();
        }

        _close() {
            this._cancelRequest();
            this.safeSetState({
                completions: [],
            });
        }

        _cancelRequest() {
            this._createRequest.cancel();
            if (this._requestSource && _.isFunction(this._requestSource.cancel)) {
                this._requestSource.cancel();
            }
        }

        setRef = (view) => {
            this._completion = view;
        };

        _renderCompletions() {
            const {testID} = this.props;
            const {completions = [], completionValue} = this.state;
            const bgColor = this.selectColor(Colors.white, DarkColors.bg);
            const borderColor = this.selectColor(Colors.gray, DarkColors.border);
            const textColor = Platform.select({
                ios: this.selectColor(Colors.black, Colors.white),
                android: this.selectColor(Colors.black, DarkColors.text),
            });
            const borderHorizontalWidth = this.selectStyle({
                ios: {
                    light: 1,
                    dark: 0,
                },
                android: 1,
            });

            const styles = StyleSheet.create({
                container: {
                    position: 'relative',
                    width: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: bgColor,
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    borderLeftWidth: borderHorizontalWidth,
                    borderLeftColor: borderColor,
                    borderRightWidth: borderHorizontalWidth,
                    borderRightColor: borderColor,
                    paddingVertical: 3,
                    ...Platform.select({
                        android: {
                            zIndex: 2,
                        },
                    }),
                },
                completionContainer: {
                    padding: 6,
                    ...Platform.select({
                        ios: {
                            paddingHorizontal: 16,
                        },
                    }),
                },
                text: {
                    color: textColor,
                },
            });
            const preparedCompletions = this._prepareCompletions(completionValue, completions);
            const result = [];

            if (preparedCompletions.length === 0) {
                return null;
            }

            _.forEach(preparedCompletions, (completion, k) => {
                result.push(
                    <TouchableOpacity
                        accessibilityLabel={completion.details.value}
                        testID={`completion-value-${k}`}
                        style={styles.completionContainer}
                        key={`completion-${k}-${completion.details.value}`}
                        onPress={completion.onPress}>
                        <NativeText style={styles.text}>{completion.details.label}</NativeText>
                    </TouchableOpacity>,
                );
            });

            return (
                <View testID={`completion-result-${testID}`} style={styles.container}>
                    {result}
                </View>
            );
        }

        render() {
            const {completionLink, completionMethod, paramName, minLength, createRequest, onSelect, wait, ...rest} = this.props;

            return (
                <View ref={this.setRef}>
                    <Component
                        {...rest}
                        onChangeValue={this._onChangeValue}
                        additionalHint={() => this._renderCompletions()}
                        onFocus={this._onFocus}
                        onBlur={this._onBlur}
                        innerRef={this._handleInnerRef}
                        clearButtonMode='while-editing'
                    />
                </View>
            );
        }
    }

    return Completion;
}

export default withCompletion();
