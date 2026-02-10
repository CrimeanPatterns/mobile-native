import {RouteProp, useRoute} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useMemo} from 'react';
import {Linking} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {useAttachments} from '../../../hooks/trips/attachments';
import {Colors, DarkColors} from '../../../styles';
import {TripStackParamList} from '../../../types/navigation';
import {ITripSegment, LocationDirection} from '../../../types/trips';
import BottomMenu from '../../page/menu';

type BottomMenuItem = {
    key: string;
    title: string;
    icon: {
        name: string;
        size?: number;
    };
    onPress?: () => void;
    state?: {
        [key: string]: unknown;
    };
};

const showLocation = async (direction: LocationDirection, prefix?: string) => {
    const {address, lat, lng} = direction;
    const prefixes = ['comgooglemaps://', 'https://maps.apple.com/', 'https://maps.google.com/'];
    let url = isIOS ? prefixes[0] : prefixes[2];
    let latlng = '';

    if (prefix) {
        url = prefix;
    }

    if (lat && lng) {
        latlng = `${lat},${lng}`;
    }

    url += '?q=';
    url += latlng || address;

    try {
        await Linking.openURL(url);
    } catch (e) {
        if (isIOS) {
            await showLocation(direction, prefixes[1]);
        }
    }
};

const getDirection: (direction: LocationDirection) => void = (direction) => {
    const {address, lat, lng} = direction;
    const options = {address, lat, lng};

    showLocation(options);
};

const getRouteName = (shortName, segment: ITripSegment) => {
    const routes = {
        phones: segment.shared ? 'TimelineShareSegmentPhones' : 'TimelineSegmentPhones',
        alternativeFlights: segment.shared ? 'TimelineShareSegmentFlights' : 'TimelineSegmentFlights',
    };

    return routes[shortName];
};

export const TripSegmentDetailsBottomMenu: React.FunctionComponent<{
    segment: ITripSegment;
    confirmDelete: () => void;
    confirmChanges: () => void;
    restoreSegment: () => void;
}> = ({segment, confirmDelete, confirmChanges, restoreSegment}) => {
    const route = useRoute<RouteProp<TripStackParamList, 'TimelineSegmentDetails'>>();
    const {menu: segmentMenu, deleted, canChange} = segment;
    const {openFilePicker, files} = useAttachments();
    const items: BottomMenuItem[] = useMemo((): BottomMenuItem[] => {
        const items: BottomMenuItem[] = [];

        if (!deleted) {
            const {boardingPassUrl, phones, alternativeFlights, itineraryAutologin, direction, allowConfirmChanges} = segmentMenu;

            if (boardingPassUrl) {
                items.push({
                    key: 'boardingPass',
                    title: Translator.trans('buttons.board-pass', {}, 'mobile'),
                    icon: {
                        name: 'footer-barcode',
                    },
                    state: {
                        routeName: 'InternalPage',
                        params: {
                            url: boardingPassUrl,
                        },
                    },
                });
            }

            if (_.isArray(phones)) {
                items.push({
                    key: 'phone',
                    title: Translator.trans('buttons.phone', {}, 'mobile'),
                    icon: {
                        name: 'phone',
                        size: 24,
                    },
                    state: {
                        routeName: getRouteName('phones', segment),
                        params: {
                            ...route.params,
                            tabs: phones.map((tab) => {
                                const {title, icon} = tab;

                                return {
                                    title,
                                    // @ts-ignore
                                    icon: icon.split(/\s/)[0],
                                };
                            }),
                        },
                    },
                });
            }

            if (canChange) {
                items.push({
                    key: 'delete',
                    title: Translator.trans('trips.segment.delete.btn', {}, 'messages'),
                    icon: {
                        name: 'footer-delete',
                        size: 24,
                    },
                    onPress: confirmDelete,
                });
            }

            if (alternativeFlights) {
                items.push({
                    key: 'alternative-flights',
                    title: Translator.trans('trip.alternative-flights.title', {}, 'mobile'),
                    icon: {
                        name: 'footer-alternative-flights',
                        size: 24,
                    },
                    state: {
                        routeName: getRouteName('alternativeFlights', segment),
                        params: route.params,
                    },
                });
            }

            if (_.isObject(itineraryAutologin)) {
                items.push({
                    key: 'autologin',
                    title: Translator.trans('button.autologin'),
                    icon: {
                        name: 'footer-autologin',
                    },
                    state: {
                        routeName: 'ItineraryAutologin',
                        params: {
                            ...itineraryAutologin,
                            loading: true,
                        },
                    },
                });
            }

            if (direction) {
                items.push({
                    key: 'direction',
                    title: Translator.trans('buttons.getdirections', {}, 'mobile'),
                    icon: {
                        name: 'footer-direction',
                    },
                    onPress: () => {
                        getDirection(direction);
                    },
                });
            }

            if (allowConfirmChanges) {
                items.push({
                    key: 'confirm-changes',
                    title: Translator.trans('trips.segment.confirm_change.btn', {}, 'messages'),
                    icon: {
                        name: 'footer-confirm',
                        size: 24,
                    },
                    onPress: confirmChanges,
                });
            }
        } else if (canChange) {
            items.push({
                key: 'undelete',
                title: Translator.trans('form.button.restore', {}, 'messages'),
                icon: {
                    name: 'footer-delete',
                    size: 24,
                },
                onPress: restoreSegment,
            });
        }

        return items;
    }, [canChange, confirmChanges, confirmDelete, deleted, files, openFilePicker, restoreSegment, route.params, segment, segmentMenu]);

    if (_.isEmpty(items)) {
        return null;
    }

    return <BottomMenu items={items} color={Colors.green} colorDark={DarkColors.green} />;
};
