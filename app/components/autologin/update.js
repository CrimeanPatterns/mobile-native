import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Animated, Dimensions, Easing} from 'react-native';

import {Colors} from '../../styles';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import Header from '../page/header';
import HeaderButton from '../page/header/button';
import AutoLogin from './index';

const AutoLoginUpdateContext = React.createContext();
const screenHeight = Dimensions.get('window').height;

class AutoLoginUpdateProvider extends PureComponent {
    static propTypes = {
        children: PropTypes.any,
    };

    _autologinUpdate = React.createRef();

    state = {
        abort: (...rest) => this.autologinUpdate.abort(...rest),
        start: (...rest) => this.autologinUpdate.start(...rest),
        stop: (...rest) => this.autologinUpdate.stop(...rest),
    };

    get autologinUpdate() {
        return this._autologinUpdate.current;
    }

    render() {
        return (
            <AutoLoginUpdateContext.Provider value={this.state}>
                {/* eslint-disable-next-line react/destructuring-assignment */}
                {this.props.children}
                <AutoLoginUpdate ref={this._autologinUpdate} />
            </AutoLoginUpdateContext.Provider>
        );
    }
}

class BaseAutoLoginUpdate extends BaseThemedPureComponent {
    state = {
        position: new Animated.Value(screenHeight * 2),
        visible: false,
        key: String(Date.now()),
        started: false,
    };

    _autoLogin = React.createRef();

    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.cancel = this.cancel.bind(this);
        this._onRequestShow = this._onRequestShow.bind(this);
        this._onRequestHide = this._onRequestHide.bind(this);
    }

    get autoLogin() {
        return this._autoLogin.current;
    }

    start({accountId, onError, onShow, onHide}) {
        this.setState(
            {
                started: true,
                key: `webview-${Date.now()}`,
            },
            () => {
                if (this.autoLogin) {
                    this.autoLogin.startExtensionUpdate(accountId, onError);

                    if (_.isFunction(onShow)) {
                        this.onShow = onShow;
                    }

                    if (_.isFunction(onHide)) {
                        this.onHide = onHide;
                    }
                }
            },
        );
    }

    stop(cb) {
        if (_.isFunction(this.onHide)) {
            this.onHide();
        }

        this.onShow = null;
        this.onHide = null;

        this.setState({started: false}, cb);
    }

    cancel() {
        if (this.autoLogin) {
            this.autoLogin.cancel();
        }

        this.stop();
    }

    abort(reason) {
        if (this.autoLogin) {
            this.autoLogin.abort(reason);
        }

        this.stop();
    }

    _onRequestShow() {
        this.setState(
            {
                visible: true,
            },
            () => {
                const {position} = this.state;

                Animated.timing(position, {
                    toValue: 0,
                    duration: 250,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start(() => {
                    if (_.isFunction(this.onShow)) {
                        this.onShow();
                    }
                });
            },
        );
    }

    _onRequestHide() {
        this.setState(
            {
                visible: false,
            },
            () => {
                const {position} = this.state;

                Animated.timing(position, {
                    toValue: screenHeight * 2,
                    duration: 250,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start();

                if (_.isFunction(this.onHide)) {
                    this.onHide();
                }
            },
        );
    }

    setRef = (ref) => {
        this._autoLogin = ref;
    };

    get headerLeft() {
        return <HeaderButton onPress={this.cancel} iconName='android-clear' />;
    }

    render() {
        const {started, position, visible, key} = this.state;

        if (!started) {
            return null;
        }

        return (
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        zIndex: 100,
                        width: '100%',
                        height: '100%',
                        opacity: !visible ? 0 : 1,
                        top: position,
                        backgroundColor: this.selectColor(Colors.white, Colors.black),
                    },
                ]}>
                {visible && <Header headerLeft={this.headerLeft} />}
                <AutoLogin key={`webview-${key}`} ref={this._autoLogin} onRequestShow={this._onRequestShow} onRequestHide={this._onRequestHide} />
            </Animated.View>
        );
    }
}

const ThemedComponent = withTheme(BaseAutoLoginUpdate);
// eslint-disable-next-line react/display-name
const AutoLoginUpdate = React.forwardRef((props, ref) => <ThemedComponent {...props} forwardedRef={ref} />);

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const withAutoLoginUpdate = (Component) =>
    class extends PureComponent {
        static displayName = `withAutoLoginUpdate${_.upperFirst(getDisplayName(Component))}`;

        render() {
            const {...rest} = this.props;

            return (
                <AutoLoginUpdateContext.Consumer>
                    {({abort, start, stop}) =>
                        React.createElement(Component, {
                            ...rest,
                            autoLoginUpdate: {abort, start, stop},
                        })
                    }
                </AutoLoginUpdateContext.Consumer>
            );
        }
    };

export default AutoLoginUpdate;
export {AutoLoginUpdateProvider, AutoLoginUpdateContext, withAutoLoginUpdate};
