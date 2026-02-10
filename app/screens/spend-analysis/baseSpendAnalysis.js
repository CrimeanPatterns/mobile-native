import Translator from 'bazinga-translator';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import Icon from '../../components/icon';
import {isIOS} from '../../helpers/device';
import {getTouchableComponent} from '../../helpers/touchable';
import {PathConfig} from '../../navigation/linking';
import {navigateByPath} from '../../services/navigator';
import {Colors, DarkColors} from '../../styles';
import {IconColors} from '../../styles/icons';
import {styles} from './styles';

const TouchableItem = getTouchableComponent(TouchableOpacity);

class BaseSpendAnalysis extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        navigation: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.upgrade = this.upgrade.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/explicit-module-boundary-types
    upgrade() {
        navigateByPath(PathConfig.SubscriptionPayment);
    }

    createHeader({title, subTitle, helperSubTitle, isStub = false}) {
        return (
            <View style={[styles.container, styles.borderBottom, this.isDark && styles.containerDark]}>
                {_.isString(title) && !_.isEmpty(title) && (
                    <View style={styles.containerRow}>
                        <View style={[styles.icon, !isStub && styles.iconOffset]}>
                            <Icon
                                name='menu-spend-analysis'
                                color={this.selectColor(IconColors.gray, isIOS ? Colors.white : DarkColors.text)}
                                size={24}
                            />
                        </View>
                        <View style={styles.titleCol}>
                            <Text style={[styles.title, this.isDark && styles.textDark]}>{title}</Text>
                        </View>
                    </View>
                )}
                {_.isString(subTitle) && !_.isEmpty(subTitle) && (
                    <View style={[styles.containerRow, _.isString(title) && styles.headerMargin]}>
                        <View style={styles.icon}>
                            <Icon name='warning' color={this.selectColor(Colors.orange, DarkColors.orange)} size={17} />
                        </View>
                        <View style={styles.titleCol}>
                            <Text style={[styles.subText, this.isDark && styles.textDark]}>{subTitle}</Text>
                        </View>
                    </View>
                )}
                {_.isString(helperSubTitle) && !_.isEmpty(helperSubTitle) && (
                    <View style={[styles.containerRow, (_.isString(title) || _.isString(subTitle)) && styles.headerMargin, styles.helperSubTitle]}>
                        <Text style={[styles.bottomLinkText, this.isDark && styles.textDark]}>{helperSubTitle}</Text>
                    </View>
                )}
            </View>
        );
    }

    renderFooter() {
        const {navigation} = this.props;

        return (
            <TouchableItem onPress={() => navigation.navigate('MerchantLookup')}>
                <View style={[styles.bottomLink, styles.borderTop, this.isDark && styles.borderTopDark]} pointerEvents='box-only'>
                    <View style={styles.bottomLinkWrap}>
                        <Text style={[styles.bottomLinkText, this.isDark && styles.textDark]}>
                            {Translator.trans('credit-card.merchant.which-credit-card-use-rewards', {}, 'messages')}
                        </Text>
                    </View>
                    <Icon name='arrow' style={[styles.bottomLinkArrow, this.isDark && styles.bottomLinkArrowDark]} size={20} />
                </View>
            </TouchableItem>
        );
    }

    keyExtractor = (item, index) => {
        if (_.isObject(item) && item.date) {
            const {d, m} = item.date;

            return `${d}-${m}-${index}`;
        }

        return String(index);
    };
}

export default BaseSpendAnalysis;
