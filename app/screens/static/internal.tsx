import Translator from 'bazinga-translator';
import React from 'react';

import {useTheme} from '../../theme';
import {useNavigationMainColor} from '../../theme/navigator';
import {BaseWebViewPage} from './index';

class InternalPage extends BaseWebViewPage {
    constructor(props) {
        super(props);

        // @ts-ignore
        this.renderLoadingView = this.renderLoadingView.bind(this);
    }

    get mainColor() {
        // @ts-ignore
        return this.props.mainColor;
    }

    getSourceUrl = () => {
        // @ts-ignore
        const {route} = this.props;

        return route?.params?.url;
    };
}

const InternalPageScreen: React.FunctionComponent = (props) => {
    const theme = useTheme();
    const mainColor = useNavigationMainColor();

    // @ts-ignore
    return <InternalPage {...props} theme={theme} mainColor={mainColor} />;
};

// @ts-ignore
InternalPageScreen.navigationOptions = ({route}) => ({
    title: '',
    headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    animation: route.params?.animation ?? 'default',
});

export default InternalPageScreen;
