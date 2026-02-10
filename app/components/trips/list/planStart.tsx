import {TouchableItem, TouchableOpacity} from '@components/page/touchable';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Alert, Platform, Text, TouchableWithoutFeedback, View} from 'react-native';
import Prompt from 'react-native-prompt-android';

import {isIOS} from '../../../helpers/device';
import Popover from '../../../helpers/popover';
import {TripSegmentDetails} from '../../../screens/trips/segment/details';
import TimelineService from '../../../services/timeline';
import {Colors} from '../../../styles';
import {withTheme} from '../../../theme';
import {IDate} from '../../../types/trips/blocks';
import Icon from '../../icon';
import Row from './row';
import styles from './style';

type PlanStartProps = {
    breakAfter: boolean;
    endDate: IDate;
    isActive: boolean;
    name: string;
    reloadTimeline: () => void;
    setLoading: (boolean) => void;
    onLongPress: () => void;
    onPressOut: () => void;
    planId: string;
    shareCode: string;
    startDate: IDate;
    canChange: boolean;
    hasNotes: boolean;
    duration?: string;
    navigation: any;
};

type PlanStartState = {
    menu:
        | {
              label: string;
              icon: string;
              key: string;
          }[]
        | null;
};

class PlanStart extends Row<PlanStartProps, PlanStartState> {
    static LAYOUT_HEIGHT: number = isIOS ? 70 : 60;

    private dropdownRef = React.createRef<typeof TouchableItem>();

    private readonly menuFunctions: {
        move: () => void;
        delete: () => void;
        share: () => void;
        rename: () => void;
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const {canChange, shareCode} = nextProps;
        const menus: {label: string; icon: string; key: string}[] = [];
        let dropdown;
        let subMenus;
        const [moveBtn, renameBtn, shareBtn, deleteBtn] = [
            {
                label: Translator.trans('trips.segment.move.btn'),
                icon: 'move',
                key: 'move',
            },
            {
                label: Translator.trans(/** @Desc("Rename") */ 'button.rename', {}, 'mobile-native'),
                icon: 'footer-edit',
                key: 'rename',
            },
            {
                label: Translator.trans('trips.segment.share.btn'),
                icon: isIOS ? 'share' : 'android-share',
                key: 'share',
            },
            {
                label: Translator.trans('button.delete'),
                icon: 'footer-delete',
                key: 'delete',
            },
        ];

        if (canChange) {
            menus.push(moveBtn);
            menus.push(renameBtn);
        }

        if (_.isString(shareCode)) {
            menus.push(shareBtn);
        }

        if (canChange) {
            if (isIOS) {
                menus.push(deleteBtn);
            } else {
                subMenus = {
                    menus: [deleteBtn],
                };
            }
        }

        if (_.isEmpty(menus) === false) {
            dropdown = [
                {
                    menus,
                },
            ];

            if (_.isObject(subMenus)) {
                dropdown.push(subMenus);
            }
        }

        return {
            ...prevState,
            menu: dropdown,
        };
    }

    constructor(props) {
        super(props);

        this.rename = this.rename.bind(this);
        this.share = this.share.bind(this);
        this.delete = this.delete.bind(this);
        this.showRenamePopup = this.showRenamePopup.bind(this);

        this.onLongPress = this.onLongPress.bind(this);
        this.onMenuItemPress = this.onMenuItemPress.bind(this);

        this.state = {
            menu: null,
        };

        this.menuFunctions = {
            move: this.movePlan,
            delete: this.delete,
            share: this.share,
            rename: this.showRenamePopup,
        };
    }

    share() {
        const {shareCode} = this.props;

        TripSegmentDetails.sharePlan(shareCode);
    }

    async delete() {
        const {planId} = this.props;

        this.setLoading(true);

        try {
            await TimelineService.deletePlan(planId);
        } catch (error) {
            this.setLoading(false);
        } finally {
            this.reloadTimeline();
        }
    }

    movePlan = () => {
        Alert.alert(
            '',
            Translator.trans(
                /** @Desc("In order to control where the trip ends or begins just touch and hold the beginning or the end of the trip and move that border up or down.") */ 'move-plan.notice',
                {},
                'mobile-native',
            ),
            [],
            {cancelable: true},
        );
    };

    showRenamePopup() {
        const {name} = this.props;

        Prompt(
            Translator.trans(/** @Desc("Change the name") */ 'plan.rename', {}, 'mobile-native'),
            '',
            [
                {
                    text: Translator.trans('alerts.btn.cancel'),
                    style: 'cancel',
                    onPress: _.noop,
                },
                {
                    text: Translator.trans('update.button'),
                    onPress: this.rename,
                },
            ],
            {
                defaultValue: name,
                type: 'plain-text',
                cancelable: true,
            },
        );
    }

    async rename(name) {
        const {planId} = this.props;

        if (name.length > 0) {
            this.setLoading(true);

            try {
                await TimelineService.renamePlan(planId, name);
            } catch (error) {
                this.setLoading(false);
            } finally {
                this.reloadTimeline();
            }
        }
    }

    showPopover = (ref) => {
        const {menu} = this.state;
        const {theme} = this.props;

        const menuWidth = 200;

        // if (LocaleManager.get() === 'ru') {
        //     menuWidth = 170;
        // }

        Popover.show(ref, {
            menus: menu,
            onDone: this.onMenuItemPress,
            menuWidth,
            theme,
        });
    };

    onMenuItemPress(selectionIndex, groupIndex = 0) {
        const {menu} = this.state;

        Popover.onMenuItemPress(menu, selectionIndex, groupIndex, this.menuFunctions);
    }

    onLongPress(...args) {
        const {onLongPress} = this.props;

        if (_.isFunction(onLongPress)) {
            onLongPress(...args);
        }
    }

    renderIconMore = () =>
        Platform.select({
            ios: <Icon name='more' color={Colors.white} size={24} />,
            android: <Icon name='android-more' color={this.selectColor(Colors.white, Colors.black)} size={24} />,
        });

    render() {
        const {name, planId, hasNotes, startDate, isActive, onPressOut, duration, navigation} = this.props;
        const {menu} = this.state;

        return (
            <TouchableWithoutFeedback
                delayLongPress={200}
                onLongPress={this.onLongPress}
                onPressOut={onPressOut}
                testID='planStart'
                accessibilityLabel={name}>
                <View style={[styles.segmentBlue, styles.segmentStart, {height: PlanStart.LAYOUT_HEIGHT, maxHeight: PlanStart.LAYOUT_HEIGHT}]}>
                    <View style={[styles.row, styles.marginRight]}>
                        <View style={[styles.segmentDate, styles.flex1]}>
                            <Text style={[styles.segmentDateText, this.isDark && styles.segmentDateTextDark]} numberOfLines={1}>
                                {startDate.fmt.d}
                            </Text>
                        </View>
                        {_.isString(duration) && (
                            <View style={styles.durationRow}>
                                <Text
                                    style={[styles.durationMessage, styles.durationMargin, this.isDark && styles.durationMessageDark]}
                                    numberOfLines={1}>
                                    {Translator.trans(/** @Desc("Trip for") */ 'trips.segment.trip-for', {}, 'mobile-native')}
                                </Text>
                                <Text style={[styles.durationMessage, styles.textBold, this.isDark && styles.durationMessageDark]} numberOfLines={1}>
                                    {duration}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View style={[styles.segmentTitle, this.isDark && styles.segmentTitleDark, isActive && styles.segmentTitleActive]}>
                        <View style={[styles.segmentCircle, this.isDark && styles.segmentCircleDark]} />
                        <View style={styles.segmentTitleWrap}>
                            <View style={styles.segmentTitleWrapText}>
                                <Text
                                    style={[styles.segmentTitleText, this.isDark && styles.segmentTitleTextDark]}
                                    numberOfLines={1}
                                    ellipsizeMode='tail'>
                                    {name}
                                </Text>
                            </View>

                            <View style={styles.segmentActionWrap}>
                                <View
                                    style={[
                                        styles.segmentNoteWrap,
                                        hasNotes && styles.segmentHasNotes,
                                        this.isDark && hasNotes && styles.segmentHasNotesDark,
                                    ]}>
                                    <TouchableOpacity
                                        style={[styles.segmentNote]}
                                        onPress={() => {
                                            navigation.navigate('ModalScreens', {
                                                screen: `TimelineNote`,
                                                params: {id: planId, isTravelPlan: true},
                                            });
                                        }}>
                                        <Icon name={'menu-terms-new'} color={Colors.white} size={isIOS ? 15 : 16} />
                                    </TouchableOpacity>

                                    {hasNotes && <View style={styles.notesIndicator} />}
                                </View>
                                {_.isArray(menu) && (
                                    <TouchableItem
                                        ref={this.dropdownRef}
                                        borderless
                                        style={styles.segmentShare}
                                        onPress={() => this.showPopover(this.dropdownRef.current)}>
                                        {this.renderIconMore()}
                                    </TouchableItem>
                                )}
                            </View>
                        </View>
                        <View
                            style={[
                                styles.segmentStartTriangle,
                                this.isDark && styles.segmentStartTriangleDark,
                                isActive && styles.segmentStartTriangleActive,
                            ]}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default withTheme(PlanStart);
