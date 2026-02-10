import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import React, {PureComponent} from 'react';
import {Platform} from 'react-native';
import HTML from 'react-native-render-html';

import {PathConfig} from '../../../navigation/linking';
import {navigateByPath} from '../../../services/navigator';
import {Colors, Fonts} from '../../../styles';
import {AccountsStackParamList} from '../../../types/navigation';

type ExistingAccountErrorProps = {
    existingAccountId: string;
    displayName: string;
    login: string;
    name: string;
};

class ExistingAccountError extends PureComponent<
    ExistingAccountErrorProps & {navigation: StackNavigationProp<AccountsStackParamList, 'AccountAdd'>}
> {
    render() {
        const {existingAccountId, displayName, login, name} = this.props;
        const {tagsStyles, baseFontStyle, container} = styles;
        const message = Translator.trans(
            'accounts-add.errors.existing-account',
            {
                displayName,
                login,
                name,
                url: existingAccountId,
            },
            'mobile',
        );

        return (
            <HTML
                containerStyle={container}
                tagsStyles={tagsStyles}
                baseFontStyle={baseFontStyle}
                defaultTextProps={{
                    selectable: false,
                }}
                source={{html: message}}
                onLinkPress={(_, accountId) => {
                    navigateByPath(PathConfig.AccountEdit, {ID: `a${accountId}`});
                }}
            />
        );
    }
}

const styles = {
    container: {
        paddingHorizontal: 5,
    },
    tagsStyles: {
        p: {
            marginVertical: 5,
            color: Colors.white,
            fontFamily: Fonts.regular,
        },
        a: {
            color: Colors.white,
            fontFamily: Fonts.regular,
            textDecorationLine: 'underline',
        },
    },
    baseFontStyle: {
        color: Colors.white,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 12,
            },
            android: {
                fontSize: 14,
            },
        }),
    },
};

export default (props: ExistingAccountErrorProps) => {
    const navigation = useNavigation<StackNavigationProp<AccountsStackParamList, 'AccountAdd'>>();

    return <ExistingAccountError navigation={navigation} {...props} />;
};
