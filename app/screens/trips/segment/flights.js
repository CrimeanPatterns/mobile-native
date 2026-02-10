import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {BaseThemedComponent} from '../../../components/baseThemed';
import Icon from '../../../components/icon';
import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {withTheme} from '../../../theme';
import {getSegment} from './index';

class TimelineSegmentFlights extends BaseThemedComponent {
    static navigationOptions = () => ({
        title: Translator.trans('trip.alternative-flights.title', {}, 'mobile'),
    });

    constructor(props) {
        super(props);

        this._renderMain = this._renderMain.bind(this);
        this._renderExtra = this._renderExtra.bind(this);
        this.showFlights = this.showFlights.bind(this);

        const segment = this.getSegment();

        this.state = {
            flights: (segment && segment.menu.alternativeFlights) || null,
        };
    }

    componentDidMount() {
        const {flights} = this.state;
        const {navigation} = this.props;

        if (_.isNil(flights)) {
            navigation.goBack();
        }
    }

    getSegment() {
        const {route} = this.props;

        return getSegment(route);
    }

    showFlights(trip, dates) {
        const {navigation} = this.props;
        const params = {Trip: trip, Dates: [], loading: true};

        if (_.isArray(dates)) {
            _.forEach(dates, (date) => {
                params.Dates.push(date.ts);
            });
        } else {
            params.Dates.push(dates.ts);
        }

        navigation.navigate('TimelineSegmentFlightsAutoLogin', params);
    }

    _renderMain(item, index, extra) {
        let key = `row-${index}`;

        if (extra) {
            key += '-extra';
        }
        const styleTextDark = this.isDark && styles.textDark;
        const styleButtonDark = this.isDark && styles.buttonSilverDark;
        const styleButtonSmall = extra === true && styles.buttonSmall;
        const buttonIconColor = this.selectColor(IconColors.gray, Colors.white);

        return (
            <View style={[styles.container, this.isDark && styles.separatorDark, this.isDark && styles.containerDark]} key={key}>
                <View style={styles.title}>
                    {item.points.map((name, index) => (
                        <Text style={[styles.caption, extra === true && styles.captionSmall, styleTextDark]} key={`caption-${index}`}>
                            {name}
                        </Text>
                    ))}
                </View>
                <View style={styles.buttons}>
                    <View style={styles.col}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSilver, styleButtonDark, styleButtonSmall]}
                            onPress={() => this.showFlights(item.points, item.dates[0])}>
                            <Icon name='minus' color={buttonIconColor} size={isIOS ? 24 : 14} />
                        </TouchableOpacity>
                        <View style={styles.textWrap}>
                            <Text style={[styles.text, styleTextDark]}>
                                {Translator.trans('trip.alternative-flights.buttons.previousDay', {}, 'mobile')}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.col}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonBlue, this.isDark && styles.buttonBlueDark, styleButtonSmall]}
                            onPress={() => this.showFlights(item.points, item.dates[1])}>
                            <Icon
                                name='success'
                                color={Platform.select({
                                    ios: Colors.white,
                                    android: this.selectColor(Colors.white, Colors.black),
                                })}
                                size={isIOS ? 24 : 16}
                            />
                        </TouchableOpacity>
                        <View style={styles.textWrap}>
                            <Text style={[styles.text, styleTextDark]}>
                                {_.isArray(item.dates[1]) ? item.dates[1].map((date) => date.fmt).join(' - ') : item.dates[1].fmt}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.col}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSilver, styleButtonDark, styleButtonSmall]}
                            onPress={() => this.showFlights(item.points, item.dates[2])}>
                            <Icon name='plus' color={buttonIconColor} size={isIOS ? 24 : 14} />
                        </TouchableOpacity>
                        <View style={styles.textWrap}>
                            <Text style={[styles.text, styleTextDark]}>
                                {Translator.trans('trip.alternative-flights.buttons.nextDay', {}, 'mobile')}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    _renderExtra(item, index) {
        return this._renderMain(item, index, true);
    }

    render() {
        const {flights} = this.state;

        if (_.isObject(flights)) {
            const hasExtra = flights.extra && flights.extra.length > 0;

            return (
                <ScrollView style={[styles.page, this.isDark && styles.pageDark]}>
                    <View style={[styles.top, this.isDark && styles.separatorDark]}>
                        <Text style={[styles.topText, this.isDark && styles.textDark]}>
                            {Translator.trans('trip.alternative-flights.sub-title', {}, 'mobile')}
                        </Text>
                    </View>
                    <View style={styles.pageView}>
                        {flights.main.map(this._renderMain)}
                        {hasExtra && <View style={[styles.separator, this.isDark && styles.separatorDark]} />}
                        {hasExtra && flights.extra.map(this._renderExtra)}
                    </View>
                </ScrollView>
            );
        }

        return null;
    }
}

export default withTheme(TimelineSegmentFlights);
export {TimelineSegmentFlights};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.white,
            },
            android: {
                backgroundColor: Colors.gray,
            },
        }),
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
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
    top: {
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
                paddingVertical: 20,
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
            },
            android: {
                paddingHorizontal: 16,
                paddingTop: 26,
                paddingBottom: 20,
            },
        }),
    },
    separatorDark: {
        ...Platform.select({
            ios: {
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    topText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 13,
            },
            android: {
                fontSize: 12,
            },
        }),
    },
    separator: {
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
            },
            android: {
                height: 0,
                width: 0,
                opacity: 0,
            },
        }),
    },
    pageView: {
        ...Platform.select({
            android: {
                paddingHorizontal: 8,
            },
        }),
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                paddingVertical: 10,
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 6,
                backgroundColor: Colors.white,
                elevation: 5,
                marginBottom: 8,
            },
        }),
    },
    containerDark: {
        ...Platform.select({
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    caption: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 23,
                lineHeight: 28,
            },
            android: {
                fontSize: 20,
                lineHeight: 24,
            },
        }),
    },
    captionSmall: {
        ...Platform.select({
            ios: {
                fontSize: 19,
                lineHeight: 24,
            },
            android: {
                fontSize: 16,
                lineHeight: 20,
            },
        }),
    },
    title: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            android: {
                marginTop: -5,
            },
        }),
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    col: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        maxWidth: 70,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                width: 53,
                height: 53,
            },
            android: {
                width: 36,
                height: 36,
            },
        }),
    },
    buttonSmall: {
        ...Platform.select({
            ios: {
                width: 33,
                height: 33,
            },
            android: {
                width: 36,
                height: 36,
            },
        }),
    },
    buttonSilver: {
        borderColor: Colors.gray,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
            },
            android: {
                backgroundColor: Colors.white,
            },
        }),
    },
    buttonSilverDark: {
        borderColor: DarkColors.border,
        backgroundColor: DarkColors.bg,
    },
    buttonBlue: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.blue,
            },
            android: {
                elevation: 3,
                backgroundColor: Colors.green,
            },
        }),
    },
    buttonBlueDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.blue,
            },
            android: {
                backgroundColor: DarkColors.green,
            },
        }),
    },
    textWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    text: {
        fontSize: 12,
        lineHeight: 12,
        fontFamily: Fonts.regular,
        textAlign: 'left',
        ...Platform.select({
            ios: {
                marginTop: 5,
                color: Colors.grayDark,
            },
            android: {
                marginTop: 10,
                color: Colors.grayDarkLight,
            },
        }),
    },
});
