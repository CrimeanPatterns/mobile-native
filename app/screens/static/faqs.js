import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import Config from 'react-native-config';

import FAQ from '../../components/faq';
import API from '../../services/api';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';
import {BaseWebViewPage} from './index';

class FAQs extends BaseWebViewPage {
    static navigationOptions = ({route}) => ({
        title: Translator.trans('menu.faqs', {}, 'menu'),
        animation: route.params?.animation ?? 'default',
        headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    });

    constructor(props) {
        super(props);

        this.state = {
            faq: null,
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.loadPage();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    getSourceUrl = () => `${Config.API_URL}/m/api/faq`;

    loadPage() {
        API.post(this.getSourceUrl(), []).then((response) => {
            const {data} = response;

            if (_.isArray(data)) {
                this.safeSetState({
                    faq: data,
                });
            }
        });
    }

    // eslint-disable-next-line class-methods-use-this
    get containerStyle() {
        return this.selectStyle({ios: {light: styles.page, dark: styles.pageDark}, android: styles.page});
    }

    renderFaq() {
        const {route, navigation} = this.props;
        const {faq} = this.state;
        const initialScrollTo = route?.params?.scrollTo;

        return <FAQ navigation={navigation} data={faq} style={this.containerStyle} initialScrollTo={initialScrollTo} scrollEnabled />;
    }

    render() {
        const {faq} = this.state;

        if (_.isArray(faq) && _.isEmpty(faq) === false) {
            return this.renderFaq();
        }

        return this.renderLoadingView();
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
});

export default withTheme(FAQs);
