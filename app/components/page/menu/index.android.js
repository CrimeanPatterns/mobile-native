import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {FAB, Portal, Provider} from 'react-native-paper';

import {Colors, DarkColors} from '../../../styles';
import {useTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import ActionButton from '../actionButton';

class BottomMenu extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                icon: PropTypes.oneOfType([PropTypes.object, PropTypes.element]).isRequired,
                state: PropTypes.object,
                onPress: PropTypes.func,
            }),
        ).isRequired,
        color: PropTypes.string,
        colorDark: PropTypes.string,
        navigation: PropTypes.object.isRequired,
    };

    static defaultProps = {
        items: [],
    };

    constructor(props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
        this.onPress = this.onPress.bind(this);
        this.state = {
            open: false,
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    onPress(index) {
        const {navigation, items} = this.props;

        if (items && items[index]) {
            const item = items[index];

            if (item.onPress && _.isFunction(item.onPress)) {
                item.onPress();
            }

            if (item.state && _.isObject(item.state)) {
                const {routeName, params} = item.state;

                navigation.navigate(routeName, params);
            }
        }
    }

    renderItem(item, index) {
        const {title, icon} = item;

        return {
            icon: () => (React.isValidElement(icon) ? icon : <Icon size={24} color={this.selectColor(Colors.grayDark, DarkColors.text)} {...icon} />),
            label: title,
            onPress: () => this.onPress(index),
            style: {
                alignSelf: 'center',
                backgroundColor: this.selectColor(Colors.white, DarkColors.bgLight),
            },
        };
    }

    render() {
        const {items, color, colorDark} = this.props;
        const {open} = this.state;

        if (items.length > 0) {
            if (items.length === 1) {
                const [item] = items;
                const {
                    icon: {name, size},
                } = item;

                return (
                    <ActionButton
                        color={this.selectColor(color || Colors.blueDark, colorDark || DarkColors.blue)}
                        onPress={() => this.onPress(0)}
                        iconName={name}
                        iconSize={size}
                    />
                );
            }

            return (
                <Provider>
                    <Portal>
                        <FAB.Group
                            open={open}
                            icon={open ? 'close' : 'dots-vertical'}
                            actions={items.map(this.renderItem)}
                            onStateChange={({open}) => this.setState({open})}
                            style={{position: 'absolute'}}
                            fabStyle={{
                                backgroundColor: this.selectColor(color || Colors.blueDark, colorDark || DarkColors.blue),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            color={this.selectColor(Colors.white, Colors.black)}
                            theme={{
                                dark: true,
                                colors: {
                                    text: this.isDark ? Colors.white : Colors.black,
                                },
                            }}
                        />
                    </Portal>
                </Provider>
            );
        }

        return null;
    }
}

export default ({items, ...rest}) => {
    const theme = useTheme();
    const navigation = useNavigation();

    return <BottomMenu items={items} theme={theme} navigation={navigation} {...rest} />;
};
