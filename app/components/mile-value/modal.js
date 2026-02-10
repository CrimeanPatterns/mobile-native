import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useDark} from '../../theme';
import {useNavigationMainColor} from '../../theme/navigator';
import Form from '../form';
import HeaderButton from '../page/header/button';
import {Modal} from '../page/modal';

const MileValueModal = React.memo(({onApply, onClose}) => {
    const isDark = useDark();
    const mainColor = useNavigationMainColor();
    const [programId, setProgramId] = useState(null);
    const [programName, setProgramName] = useState(null);
    const [mileValue, setMileValue] = useState(null);

    const fieldsStyles = useMemo(
        () => ({
            text_completion: {
                primaryColor: {
                    base: mainColor,
                },
            },
            text: {
                primaryColor: {
                    base: mainColor,
                },
            },
        }),
        [mainColor],
    );

    const saveProgram = useCallback(() => {
        onApply({programId, mileValue});
    }, [onApply, programId, mileValue]);

    const onFieldChange = useCallback(
        (form, fieldName) => {
            const value = form.getValue(fieldName);

            if (fieldName === 'programName') {
                if (value !== programName) {
                    setProgramId(null);
                }
            }

            if (fieldName === 'mileValue') {
                if (!_.isNaN(+value) && +value !== 0 && value.length > 0) {
                    setMileValue(value);
                } else {
                    setMileValue(null);
                }
            }
        },
        [programName, setProgramId, setMileValue],
    );

    const onSelectProgramId = useCallback(
        ({provider, value}) => {
            setProgramId(provider);
            setProgramName(value);
        },
        [setProgramId, setProgramName],
    );

    const additionalHint = useCallback(
        () =>
            isIOS && (
                <View style={[styles.hint]}>
                    <Text style={[styles.hintText, isDark && styles.hintTextDark]}>¢</Text>
                </View>
            ),
        [isDark],
    );

    const fields = useMemo(
        () => [
            {
                value: '',
                attr: [],
                name: 'programName',
                full_name: 'programName',
                disabled: false,
                label: Translator.trans('account.program', {}, 'messages'),
                required: false,
                mapped: true,
                submitData: true,
                type: 'text_completion',
                completionLink: '/providers/completion',
                attachedAccounts: [],
                providerKind: null,
                onSelect: onSelectProgramId,
                autoFocus: true,
            },
            {
                value: '',
                name: 'mileValue',
                full_name: 'mileValue',
                label: Translator.trans('average-value', {}, 'messages'),
                type: 'text',
                required: false,
                submitData: true,
                keyboardType: 'numeric',
                additionalHint,
                fieldsStyles: {
                    primaryColor: {
                        base: Colors.red,
                        focused: Colors.red,
                        disabled: Colors.red,
                        errored: Colors.red,
                    },
                },
            },
        ],
        [additionalHint, onSelectProgramId],
    );

    const HeaderButtonRight = useMemo(() => {
        const color = isDark ? DarkColors.blue : Colors.blueDark;
        const title = Translator.trans('button.add', {}, 'messages');

        return (
            <HeaderButton
                disabled={_.isNull(programId) || _.isNull(mileValue)}
                onPress={saveProgram}
                title={isIOS ? title : undefined}
                iconName={isIOS ? undefined : 'android-baseline-check'}
                color={isIOS ? color : undefined}
            />
        );
    }, [programId, mileValue, saveProgram, isDark]);

    return (
        <Modal
            visible
            presentationStyle={isIOS ? 'formSheet' : 'overFullScreen'}
            onClose={onClose}
            headerRight={HeaderButtonRight}
            headerColor={isDark ? DarkColors.bgLight : mainColor}>
            <View style={[styles.page, isDark && styles.pageDark]}>
                <Form fields={fields} onFieldChange={onFieldChange} fieldsStyles={fieldsStyles} />
            </View>
        </Modal>
    );
});

MileValueModal.propTypes = {
    onApply: PropTypes.func,
    onClose: PropTypes.func,
};

export default MileValueModal;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    hint: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        bottom: 1,
        height: 46,
        width: 46,
    },
    hintText: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    hintTextDark: {
        color: Colors.white,
    },
});
