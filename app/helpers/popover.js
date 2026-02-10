import _ from 'lodash';
import {Platform} from 'react-native';
import RNPopover from 'react-native-popover-menu';

import Icons from '../assets/icons';
import {Colors, DarkColors} from '../styles';
import {isIOS} from './device';

function getPopoverMenuIcon(iconName, theme) {
    const isDark = theme === 'dark';
    const color = isIOS ? Colors.white : 'white';

    return {
        name: iconName,
        glyph: Icons[iconName],
        color: isDark ? color : Colors.grayDark,
        size: Platform.select({android: 24, ios: 300}),
        family: 'awardwallet',
    };
}

function processMenu(menus, theme) {
    return menus.map((item) => {
        const {icon, menus, ...props} = item;
        const output = {...props};

        if (icon) {
            output.icon = getPopoverMenuIcon(icon, theme);
        }

        if (_.isArray(menus)) {
            output.menus = processMenu(menus, theme);
        }

        return output;
    });
}

function show(ref, props) {
    const {menus, theme, ...rest} = props;
    const isDark = theme === 'dark';
    const menu = processMenu(menus, theme);
    const additionalProps = {
        menuCornerRadius: 11,
        fontName: 'OpenSans-Regular',
        fontSize: 19,
        rowHeight: 56,
        textMargin: 10,
        iconMargin: 10,
        selectedRowBackgroundColor: isDark ? DarkColors.bg : Colors.grayLight,
    };

    RNPopover.Show(ref, {
        roundedArrow: false,
        separatorColor: isDark ? DarkColors.border : Colors.borderGray,
        tintColor: isDark ? DarkColors.bgLight : Colors.white,
        coverBackgroundColor: '#00000080',
        textColor: isDark ? Colors.white : Colors.grayDark,
        menus: menu,
        theme,
        ...Platform.select({ios: additionalProps}),
        ...rest,
    });
}

function onMenuItemPress(menu, selectionIndex, groupIndex = 0, functions) {
    let selection;

    if (isIOS) {
        selection = menu[groupIndex].menus[selectionIndex];
    } else {
        selection = menu[selectionIndex].menus[groupIndex];
    }

    const {onPress, key} = selection;

    if (_.isFunction(onPress)) {
        onPress();
    }

    if (_.isString(key) && _.isObject(functions)) {
        if (_.isFunction(functions[key])) {
            functions[key]();
        }
    }
}

export default {show, onMenuItemPress};
