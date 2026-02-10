import {CancelToken} from 'axios';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Keyboard} from 'react-native';

import API from '../../../services/api';

export default function withPassProtect(Component) {
    class WithPassProtect extends PureComponent {
        static displayName = `withPassProtect(${Component.displayName || Component.name || 'Component'})`;

        static propTypes = {
            ...Component.propTypes,
            passwordAccess: PropTypes.shape({
                route: PropTypes.string.isRequired,
                triggerValue: PropTypes.bool.isRequired,
            }),
        };

        static defaultProps = {
            ...Component.defaultProps,
        };

        constructor(props) {
            super(props);

            this.popupOpened = false;
            this._onChangeValue = this._onChangeValue.bind(this);

            this.state = {
                passProtect: props.value === props.passwordAccess?.triggerValue,
            };
        }

        _onChangeValue(value) {
            const {
                value: prevValue,
                passwordAccess: {triggerValue},
                onChangeValue = _.noop,
            } = this.props;
            const {passProtect} = this.state;

            if (prevValue !== value && passProtect && prevValue === triggerValue) {
                this._openPopup(() => {
                    this.setState({passProtect: false});
                    onChangeValue(value);
                });

                return;
            }
            onChangeValue(value);
        }

        _openPopup(onSuccess) {
            if (this.popupOpened) {
                return;
            }

            this._createRequest(onSuccess);

            this.popupOpened = true;
        }

        _createRequest(onSuccess) {
            const {
                passwordAccess: {route},
            } = this.props;

            this._cancelRequest();
            this._requestSource = CancelToken.source();
            Keyboard.dismiss();

            this._fireEvent(true);
            API.request({
                url: route,
                method: 'post',
                cancelToken: this._requestSource.token,
            })
                .then((response) => {
                    this._fireEvent(false);
                    if (_.isObject(response.data)) {
                        const responseData = response.data;

                        if (responseData.success) {
                            onSuccess();
                        }
                    }
                })
                .finally(() => {
                    this.popupOpened = false;
                });
        }

        _cancelRequest() {
            this._fireEvent(false);
            if (this._requestSource && _.isFunction(this._requestSource.cancel)) {
                this._requestSource.cancel();
            }
        }

        _fireEvent(processing) {
            const {form} = this.props;

            if (_.isObject(form)) {
                form.fire('onFormProcessing', form, processing);
            }
        }

        render() {
            const {forwardedRef, passwordAccess, ...rest} = this.props;

            return <Component ref={forwardedRef} {...rest} onChangeValue={this._onChangeValue} />;
        }
    }

    const ForwardRefWithPassProtectComponent = React.forwardRef((props, ref) => <WithPassProtect {...props} forwardedRef={ref} />);

    ForwardRefWithPassProtectComponent.displayName = 'ForwardRefWithPassProtectComponent';

    return ForwardRefWithPassProtectComponent;
}
