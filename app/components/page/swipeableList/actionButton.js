import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {Colors, DarkColors} from '../../../styles';
import {ThemeColors, useDark, useTheme} from '../../../theme';
import Icon from '../../icon';
import {TouchableOpacity} from '../touchable/opacity';

const ActionButton = ({onPress: _onPress, index, disabled = false, iconName, iconColor, color, style}) => {
    const isDark = useDark();
    const onPress = useCallback(() => {
        _onPress(index);
    }, [index, _onPress]);
    const defaultColor = isDark ? DarkColors.bgLight : Colors.grayLight;
    const defaultIconColor = isDark ? Colors.white : Colors.grayDark;

    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} style={style}>
            <View style={[styles.swipeButton, {backgroundColor: color || defaultColor}]}>
                <Icon name={iconName} color={iconColor || defaultIconColor} size={24} />
            </View>
        </TouchableOpacity>
    );
};

ActionButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    index: PropTypes.number,
    color: PropTypes.string,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    disabled: PropTypes.bool,
};

const ActionUpdate = React.memo((props) => <ActionButton iconName='authenticate' {...props} />);

ActionUpdate.displayName = 'ActionUpdate';

const ActionRemove = React.memo((props) => {
    const theme = useTheme();
    const colors = ThemeColors[theme];

    return <ActionButton color={colors.red} iconName='footer-delete' iconColor={Colors.white} {...props} />;
});

ActionRemove.displayName = 'ActionRemove';

const ActionPartialRemoval = React.memo((props) => <ActionRemove iconName='android-clear' {...props} />);

ActionPartialRemoval.displayName = 'ActionRemove';

const ActionEdit = React.memo((props) => <ActionButton iconName='footer-edit' {...props} />);

ActionEdit.displayName = 'ActionEdit';

const ACTION_DELETE = 'delete';
const ACTION_PARTIAL_DELETE = 'partialDelete';
const ACTION_UPDATE = 'update';
const ACTION_EDIT = 'edit';

const MailboxActions = {
    [ACTION_DELETE]: ActionRemove,
    [ACTION_PARTIAL_DELETE]: ActionPartialRemoval,
    [ACTION_UPDATE]: ActionUpdate,
    [ACTION_EDIT]: ActionEdit,
};

export {
    MailboxActions,
    ActionRemove,
    ActionPartialRemoval,
    ActionUpdate,
    ActionEdit,
    ACTION_DELETE,
    ACTION_PARTIAL_DELETE,
    ACTION_UPDATE,
    ACTION_EDIT,
};

const styles = StyleSheet.create({
    swipeButton: {
        width: 70,
        paddingHorizontal: 5,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
