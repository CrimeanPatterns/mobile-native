import _ from 'lodash';
import React, {ReactElement, useCallback, useMemo} from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../theme';
import {AccessView, AccessViewItem, AirportView, OpeningHoursItemView, OpeningHoursView, Range, TerminalView} from '../../../../types/trips/blocks';
import Icon from '../../../icon';
import Skeleton from '../../../page/skeleton';
import CreditCardImage, {CreditCardImageSkeleton} from '../creditCardImage';
import styles, {iconColors, iconColorsDark, iconSize} from './styles';

type LoungeDetailsProps = {
    header: AirportView['header'] | TerminalView['header'] | OpeningHoursView['header'] | AccessView['header'];
    icon: AirportView['icon'] | TerminalView['icon'] | OpeningHoursView['icon'] | AccessView['icon'];
    description?: TerminalView['description'] | AccessView['description'];
    openingHours?: OpeningHoursView['openingHours'];
    airportCode?: AirportView['airportCode'];
};

type ILoungeDetails = React.FunctionComponent<LoungeDetailsProps>;

const LoungeDetails: ILoungeDetails = ({header, icon, description, openingHours, airportCode}) => {
    const isDark = useDark();

    const renderTextBlock = useCallback(
        (gate: string, index?: number): ReactElement => (
            <View key={_.isNumber(index) ? `gate-${index}` : null} style={[styles.number, styles.marginRight, isDark && styles.numberDark]}>
                <Text style={[styles.text, styles.textWhite]}>{gate}</Text>
            </View>
        ),
        [isDark],
    );

    const renderTime = useCallback(
        (time: string | Range, index?: number): ReactElement => {
            if (_.isObject(time)) {
                return (
                    <View key={`time-${_.isNumber(index) ? index : ''}`} style={styles.openingHoursTime}>
                        <Text style={[styles.flex1, styles.text, styles.textRight, isDark && styles.textDark]}>{time.start}</Text>
                        <View style={[styles.dash, isDark && styles.dashDark]} />
                        <Text style={[styles.flex1, styles.text, isDark && styles.textDark]}>{time.end}</Text>
                    </View>
                );
            }

            return (
                <View style={[styles.flex1, styles.alignItemsCenter]}>
                    <Text style={[styles.text, isDark && styles.textDark]}>{time}</Text>
                </View>
            );
        },
        [isDark],
    );

    const renderDay = useCallback(
        (day: string, index: number): ReactElement => (
            <Text key={`day-${index}`} style={[styles.text, isDark && styles.textDark]}>
                {day}
            </Text>
        ),
        [isDark],
    );

    const renderOpeningHours = useCallback(
        (openingHoursItem: OpeningHoursItemView, index: number, openingHours: OpeningHoursView['openingHours']): ReactElement => (
            <View
                key={`openingHours-${index}`}
                style={[
                    styles.openingHours,
                    styles.containerPaddingCompensation,
                    openingHours.length > index + 1 && [styles.border, isDark && styles.borderDark],
                ]}>
                <View style={openingHours.length > 1 ? styles.openingHoursDeyWidth : styles.openingHoursDeyMargin}>
                    {openingHoursItem.days.map(renderDay)}
                </View>
                {_.isArray(openingHoursItem.openingHours) ? (
                    <View style={styles.flex1}>{openingHoursItem.openingHours.map(renderTime)}</View>
                ) : (
                    renderTime(openingHoursItem.openingHours)
                )}
            </View>
        ),
        [isDark, renderDay, renderTime],
    );

    const renderDetailsText = useCallback(
        (text: string): ReactElement => (
            <Text style={[styles.text, styles.marginTop, styles.containerPaddingCompensation, isDark && styles.textDark]}>{text}</Text>
        ),
        [isDark],
    );

    const renderCreditCard = useCallback(
        ({icon, isGranted, description: descriptionCard}: AccessViewItem, index: number, cards: AccessViewItem[]): ReactElement => (
            <View
                style={[styles.on, cards.length > index + 1 && [styles.border, styles.description, isDark && styles.borderDark]]}
                key={`details-${index}`}>
                <Text style={[styles.flex1, styles.text, isDark && styles.textDark]}>{descriptionCard}</Text>
                <CreditCardImage isGranted={isGranted} name={icon} style={styles.marginLeft} />
            </View>
        ),
        [isDark],
    );

    const DetailsIcon = useMemo(
        (): ReactElement => (
            <View style={styles.detailsIcon}>
                <Icon name={icon} color={isDark ? iconColorsDark : iconColors} size={iconSize} />
            </View>
        ),
        [icon, isDark],
    );

    const Header = useMemo((): ReactElement => {
        if (_.isObject(header)) {
            return (
                <View style={[styles.headerTerminal, styles.details]}>
                    <View style={[styles.onDateRight, styles.headerTerminalCompensation]}>
                        <Text style={[styles.text, styles.textBold, isDark && styles.textDark, styles.marginRight]}>{header.terminalLabel}</Text>
                        {renderTextBlock(header.terminalValue)}
                    </View>
                    {_.isString(header.gateLabel) && _.isArray(header.gateValue) && (
                        <View style={[styles.header, styles.headerTerminalCompensation]}>
                            <Text style={[styles.text, styles.textBold, isDark && styles.textDark, styles.marginRight]}>{header.gateLabel}</Text>
                            {header.gateValue.map(renderTextBlock)}
                        </View>
                    )}
                </View>
            );
        }

        return (
            <View style={[styles.header, styles.containerPaddingCompensation]}>
                <Text style={[styles.text, styles.textBold, isDark && styles.textDark, styles.marginRight]}>{header}</Text>
                {_.isString(airportCode) && renderTextBlock(airportCode)}
            </View>
        );
    }, [airportCode, header, isDark, renderTextBlock]);

    const DetailsContent = useMemo((): ReactElement | ReactElement[] | null => {
        if (_.isObject(description)) {
            return <View style={styles.containerPaddingCompensation}>{description.items.map(renderCreditCard)}</View>;
        }

        if (_.isString(description)) {
            return renderDetailsText(description);
        }

        if (_.isArray(openingHours)) {
            return openingHours.map(renderOpeningHours);
        }

        if (_.isString(openingHours)) {
            return renderDetailsText(openingHours);
        }

        return null;
    }, [description, openingHours, renderCreditCard, renderDetailsText, renderOpeningHours]);

    return (
        <View style={[styles.container, styles.containerPadding0, isDark && styles.containerDark]}>
            {DetailsIcon}
            <View style={styles.flex1}>
                {Header}
                {DetailsContent}
            </View>
        </View>
    );
};

type LoungeDetailsSkeletonProps = {
    type: 'AirportView' | 'TerminalView' | 'OpeningHoursView' | 'AccessView';
};

const LoungeDetailsSkeleton: React.FC<LoungeDetailsSkeletonProps> = ({type}) => {
    const isDark = useDark();

    const DetailsIcon = useMemo(
        () => (
            <View style={styles.detailsIcon}>
                <Skeleton layout={[{key: 'image', width: 30, height: 30}]} />
            </View>
        ),
        [],
    );

    switch (type) {
        case 'AirportView':
            return (
                <View style={[styles.container, styles.flex1, isDark && styles.containerDark]}>
                    {DetailsIcon}
                    <View style={styles.flex1}>
                        <View style={[styles.onDateRight]}>
                            <Skeleton layout={[{key: 'image', width: 70, height: 20}]} style={styles.marginRight} />
                            <Skeleton layout={[{key: 'image', width: 40, height: 30}]} style={styles.marginRight} />
                        </View>
                    </View>
                </View>
            );

        case 'TerminalView':
            return (
                <View style={[styles.container, styles.flex1, isDark && styles.containerDark]}>
                    {DetailsIcon}
                    <View style={styles.flex1}>
                        <View style={[styles.onDateRight]}>
                            <Skeleton layout={[{key: 'image', width: 70, height: 20}]} style={styles.marginRight} />
                            <Skeleton layout={[{key: 'image', width: 30, height: 30}]} style={styles.marginRight} />
                            <Skeleton layout={[{key: 'image', width: 50, height: 20}]} style={styles.marginRight} />
                            <Skeleton layout={[{key: 'image', width: 30, height: 30}]} />
                        </View>

                        <Skeleton layout={[{key: 'image', width: '100%', height: 15}]} style={styles.marginTop} />
                        <Skeleton layout={[{key: 'image', width: '100%', height: 15}]} style={styles.marginTop} />
                        <Skeleton layout={[{key: 'image', width: '60%', height: 15}]} style={styles.marginTop} />
                    </View>
                </View>
            );

        case 'OpeningHoursView':
            return (
                <View style={[styles.container, styles.containerPadding0, isDark && styles.containerDark]}>
                    {DetailsIcon}
                    <View style={styles.flex1}>
                        <Skeleton layout={[{key: 'image', width: 200, height: 20}]} style={styles.skeletonIcon} />
                        {Array(3)
                            .fill(null)
                            .map((_, index) => (
                                <View
                                    key={`openingHours-${index}`}
                                    style={[
                                        styles.openingHours,
                                        styles.containerPaddingCompensation,
                                        index < 2 && [styles.border, isDark && styles.borderDark],
                                    ]}>
                                    <Skeleton layout={[{key: 'image', width: 80, height: 15}]} />
                                    <View style={styles.flex1}>
                                        <View style={styles.openingHoursTime}>
                                            <View style={[styles.flex1, styles.flexEnd]}>
                                                <Skeleton layout={[{key: 'image', width: 55, height: 15}]} />
                                            </View>
                                            <View style={[styles.dash, isDark && styles.dashDark]} />
                                            <View style={styles.flex1}>
                                                <Skeleton layout={[{key: 'image', width: 55, height: 15}]} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                    </View>
                </View>
            );

        case 'AccessView':
            return (
                <View style={[styles.container, isDark && styles.containerDark]}>
                    {DetailsIcon}
                    <View style={styles.flex1}>
                        <Skeleton layout={[{key: 'image', width: 80, height: 20}]} style={styles.skeletonIcon} />
                        <View style={styles.on}>
                            <View style={[styles.onDateRight, styles.border, styles.description, isDark && styles.borderDark]}>
                                <View style={styles.flex1}>
                                    <Skeleton layout={[{key: 'image', width: '100%', height: 15}]} />
                                    <Skeleton layout={[{key: 'image', width: '90%', height: 15}]} style={styles.marginTop} />
                                </View>
                                <CreditCardImageSkeleton style={styles.marginLeft} />
                            </View>
                        </View>
                        <View style={styles.marginTop}>
                            <View style={[styles.onDateRight, styles.border, styles.description, isDark && styles.borderDark]}>
                                <View style={styles.flex1}>
                                    <Skeleton layout={[{key: 'image', width: '100%', height: 15}]} />
                                    <Skeleton layout={[{key: 'image', width: '50%', height: 15}]} style={styles.marginTop} />
                                </View>
                                <CreditCardImageSkeleton style={styles.marginLeft} />
                            </View>
                        </View>
                        <View style={styles.marginTop}>
                            <View style={styles.onDateRight}>
                                <View style={styles.flex1}>
                                    <Skeleton layout={[{key: 'image', width: '90%', height: 15}]} />
                                </View>
                                <CreditCardImageSkeleton style={styles.marginLeft} />
                            </View>
                        </View>
                    </View>
                </View>
            );

        default:
            return null;
    }
};

export default LoungeDetails;
export {LoungeDetailsSkeleton};
