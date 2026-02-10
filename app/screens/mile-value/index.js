import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Prompt from 'react-native-prompt-android';

import Button from '../../components/accounts/list/button';
import {BaseThemedPureComponent} from '../../components/baseThemed';
import Icon from '../../components/icon';
import MileValueModal from '../../components/mile-value/modal';
import MileValueRow from '../../components/mile-value/row';
import {RefreshableSectionList} from '../../components/page';
import ActionButton from '../../components/page/actionButton';
import SearchBar from '../../components/page/searchBar';
import SkeletonSectionList from '../../components/page/skeleton/skeletonSectionList';
import {isAndroid, isIOS} from '../../helpers/device';
import {addMileValue, deleteMileValue, editMileValue, getMileValue} from '../../services/mileValue';
import {Colors, DarkColors, Fonts} from '../../styles';
import {ThemeColors, useTheme} from '../../theme';
import {useNavigationMainColor} from '../../theme/navigator';

const regularExpression = /\d+.\d+|\d+,\d+|\d+/g;

class MileValue extends BaseThemedPureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            search: null,
            searchData: null,
            loading: true,
            visibleModal: false,
            loadingTime: Date.now(),
        };

        this.openMileValue = this.openMileValue.bind(this);
        this.getData = this.getData.bind(this);
        this.onSearchInput = this.onSearchInput.bind(this);
        this.search = this.search.bind(this);
        this.search = _.debounce(this.search, 350);
        this.onRefresh = this.onRefresh.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.openListApplications = this.openListApplications.bind(this);
        this.addProgram = this.addProgram.bind(this);
        this.editProgram = this.editProgram.bind(this);
        this.deleteProgram = this.deleteProgram.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        const {navigation} = this.props;

        this.willFocusSubscription = navigation.addListener('focus', this.openMileValue);
    }

    componentWillUnmount() {
        this.mounted = false;

        this.willFocusSubscription();
    }

    safeSetState(...args) {
        return new Promise((resolve) => {
            if (this.mounted) {
                this.setState(...args, resolve);
            }
        });
    }

    async openMileValue() {
        const {navigation, route} = this.props;
        let programName = route.params?.programName;

        if (_.isString(programName)) {
            programName = decodeURIComponent(route.params?.programName);

            await this.safeSetState({
                search: programName.replace(/[+]/g, ' '),
            });

            navigation.setParams({search: null});
        }

        this.onRefresh();
    }

    async getData() {
        const data = await getMileValue();

        if (_.isObject(data)) {
            this.safeSetState({
                data,
                loadingTime: Date.now(),
            });
        }

        this.safeSetState({
            loading: false,
        });
    }

    async editProgram({id, value}) {
        const formattedValues = value.match(regularExpression);

        if (_.isArray(formattedValues)) {
            const success = await editMileValue({id, value: formattedValues[0]});

            if (success) {
                this.onRefresh();
            }
        }
    }

    async deleteProgram({id}) {
        const success = await deleteMileValue({id});

        if (success) {
            this.onRefresh();
        }
    }

    async addProgram({programId, mileValue}) {
        this.toggleModal();
        const success = await addMileValue({id: programId, value: mileValue});

        if (success) {
            this.onRefresh();
        }
    }

    onSearchInput(search) {
        this.safeSetState({search}, this.search);
    }

    search() {
        const {data, search} = this.state;
        let searchData = null;

        if (_.isArray(data) && _.isString(search) && search.length > 0) {
            const newData = data.map(({title, data}) => {
                const rows = data.filter(({name}) => name.toLowerCase().includes(search.toLowerCase()));

                if (!_.isEmpty(rows)) {
                    return {title, data: rows};
                }

                return null;
            });

            searchData = _.compact(newData);
        }

        this.safeSetState({searchData});
    }

    async onRefresh() {
        await this.getData();
        this.search();
    }

    onEdit({id, value, name}) {
        Prompt(
            name,
            Translator.trans(/** @Desc('Override the value with your own estimate') */ 'mile-value.override', {}, 'mobile-native'),
            [
                {text: Translator.trans('cancel', {}, 'messages'), style: 'cancel'},
                {
                    text: Translator.trans('form.button.save', {}, 'messages'),
                    onPress: (customValue) => {
                        if (customValue.length === 0) {
                            this.deleteProgram({id});
                        } else {
                            this.editProgram({id, value: customValue});
                        }
                    },
                },
            ],
            {
                keyboardType: 'numeric',
                cancelable: true,
                defaultValue: value,
            },
        );
    }

    toggleModal() {
        const {visibleModal} = this.state;

        this.safeSetState({visibleModal: !visibleModal});
    }

    openListApplications() {
        const {navigation} = this.props;

        navigation.navigate('FlightDeals');
    }

    keyExtractor = (item, index) => {
        if (_.isObject(item) && item.name) {
            return `${item.name}-${index}`;
        }

        return String(index);
    };

    renderListHeader = () => {
        const {search} = this.state;
        const {theme, mainColor} = this.props;
        let tintColor = ThemeColors[theme].blue;

        if (isAndroid) {
            tintColor = mainColor;
        }

        return (
            <SearchBar tintColor={tintColor} autoFocus={!!search} placeholder='Find Program Name' value={search} onChangeText={this.onSearchInput} />
        );
    };

    renderSectionHeader = ({section}) => {
        const {theme, mainColor} = this.props;
        let color = ThemeColors[theme].blue;

        if (isAndroid) {
            color = mainColor;
        }
        return <MileValueRow.Title title={section.title} color={color} />;
    };

    renderItem = ({item, index}) => (
        <>
            <MileValueRow data={item} index={index} onEdit={this.onEdit} onDelete={this.deleteProgram} />
            {this.renderSeparator()}
        </>
    );

    renderListFooter = () =>
        isIOS ? (
            <Button
                onPress={this.toggleModal}
                label={Translator.trans('booking.request.add.form.miles.add-custom', {}, 'booking')}
                iconName='plus'
                stylesButton={styles.button}
            />
        ) : (
            <View style={styles.paddingForButton} />
        );

    renderSeparator = () => <View style={[styles.border, this.isDark && styles.borderDark]} />;

    renderSkeletonListHeader = () => <SearchBar placeholder='Find Program Name' onChangeText={_.noop} editable={false} />;

    renderSkeletonSectionHeader = () => <MileValueRow.SkeletonTitle />;

    renderListEmpty = () => (
        <View style={styles.listEmpty}>
            <Icon name='warning' color={this.isDark ? DarkColors.orange : Colors.orange} size={24} />
            <Text style={[styles.listEmptyMessage, styles.text, this.isDark && styles.textDark]}>
                {Translator.trans('award.account.list.search.not-found', {}, 'messages')}
            </Text>
        </View>
    );

    render() {
        const {mainColor} = this.props;
        const {data, searchData, loading, loadingTime, visibleModal} = this.state;

        if (loading) {
            return (
                <SkeletonSectionList
                    sections={4}
                    length={5}
                    ListHeaderComponent={this.renderSkeletonListHeader}
                    renderSectionHeader={this.renderSkeletonSectionHeader}
                    ItemSeparatorComponent={_.stubFalse}>
                    <>
                        <MileValueRow.Skeleton />
                        {this.renderSeparator()}
                    </>
                </SkeletonSectionList>
            );
        }

        return (
            <>
                <RefreshableSectionList
                    sections={searchData || data}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderListHeader()}
                    ListFooterComponent={this.renderListFooter}
                    renderSectionHeader={this.renderSectionHeader}
                    ListEmptyComponent={this.renderListEmpty}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.onRefresh}
                    lastSyncDate={loadingTime}
                    keyboardDismissMode='on-drag'
                />
                {isAndroid && <ActionButton color={mainColor} onPress={this.toggleModal} iconName='plus' />}
                {visibleModal && <MileValueModal onClose={this.toggleModal} onApply={this.addProgram} />}
            </>
        );
    }
}

const MileValueScreen = ({navigation, route}) => {
    const theme = useTheme();
    const mainColor = useNavigationMainColor();

    return <MileValue theme={theme} navigation={navigation} route={route} mainColor={mainColor} />;
};

MileValueScreen.navigationOptions = ({route}) => ({
    title: Translator.trans('point-mile-values', {}, 'messages'),
    animation: route.params?.animation ?? 'default',
});

export default MileValueScreen;

const styles = StyleSheet.create({
    border: {
        borderTopWidth: 1,
        borderTopColor: Colors.gray,
    },
    borderDark: {
        borderTopColor: DarkColors.border,
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    button: {
        marginHorizontal: 15,
        marginVertical: 30,
    },
    listEmpty: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        marginTop: 30,
    },
    listEmptyMessage: {
        flex: 1,
        marginLeft: 10,
    },
    paddingForButton: {
        height: 90,
    },
});
