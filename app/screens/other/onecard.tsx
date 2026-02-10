import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import {WebView} from 'react-native-webview';

import Spinner from '../../components/spinner';
import {Colors} from '../../styles';
import {ProfileStackScreenFunctionalComponent} from '../../types/navigation';

export const OnecardScreen: ProfileStackScreenFunctionalComponent<'Onecard'> = () => {
    const renderLoadingView = useCallback(() => <Spinner androidColor={Colors.grayBlue} style={{top: 10, alignSelf: 'center'}} />, []);

    return (
        <View style={styles.page}>
            <WebView
                source={{uri: `${Config.API_URL}/new-onecard?fromapponce=1&KeepDesktop=1`}}
                renderLoading={renderLoadingView}
                startInLoadingState
            />
        </View>
    );
};

OnecardScreen.navigationOptions = () => ({title: ''});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
});
