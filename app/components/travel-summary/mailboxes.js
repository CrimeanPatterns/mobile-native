import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {isIOS} from '../../helpers/device';
import {withNavigation} from '../../navigation/withNavigation';
import {BaseTimelineMailboxes} from '../../screens/trips/mailboxes';
import {Colors, DarkColors} from '../../styles';
import {Warning} from '../warning';

class TravelSummaryMailboxes extends BaseTimelineMailboxes {
    subscribe() {
        //
    }

    renderHeader() {
        const {noData} = this.props;

        return (
            <>
                {noData && (
                    <View style={[styles.container, this.isDark && styles.containerDark]}>
                        <Warning text='We found no travel data for the selected user and the specified date range.' />
                    </View>
                )}
                {super.renderHeader()}
            </>
        );
    }

    render() {
        return (
            <ScrollView style={this.containerStyle} alwaysBounceVertical={false}>
                {this.renderOwnerPicker()}
                {this.renderForm()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        paddingBottom: 15,
    },
    containerDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : Colors.bgGray,
    },
});

export default withNavigation(TravelSummaryMailboxes);
