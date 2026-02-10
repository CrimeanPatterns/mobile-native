import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import Config from 'react-native-config';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import OfferWebView from '../../components/offerWebview';
import {isAndroid} from '../../helpers/device';
import API from '../../services/api';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';

class Terms extends BaseThemedPureComponent {
    static navigationOptions = ({route}) => ({
        title: Translator.trans('menu.terms-of-use', {}, 'menu'),
        animation: route.params?.animation ?? 'default',
        headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    });

    constructor(props) {
        super(props);

        this.state = {
            source: null,
            jquery: null,
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.loadPage();
        this.loadJQuery();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    getSourceUrl = () => `${Config.API_URL}/m/api/terms`;

    loadPage() {
        API.get(this.getSourceUrl(), {headers: {'x-aw-platform': null}}).then((response) => {
            const {data} = response;

            if (_.isString(data)) {
                this.safeSetState({
                    source: data,
                });
            }
        });
    }

    async loadJQuery() {
        let jquery;

        jquery = await RNFetchBlob.fs.readFile(RNFetchBlob.fs.asset(isAndroid ? 'custom/jquery.min.js' : 'jquery.min.js'), 'utf8');

        this.safeSetState({
            jquery,
        });
    }

    getSource() {
        const {source, jquery} = this.state;

        return `
                <html>
                  <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                      <script>
                           ${jquery}
                      </script>
                  </head>
                  <body>
                    ${source}
                  </body>
                 </html>
        `;
    }

    render() {
        const {source} = this.state;
        const {navigation} = this.props;
        const containerStyle = [styles.page, this.isDark && styles.pageDark];

        return (
            <View style={containerStyle}>
                <OfferWebView source={source ? this.getSource() : undefined} navigation={navigation} />
            </View>
        );
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

export {Terms as BaseTerms};
export default withTheme(Terms);
