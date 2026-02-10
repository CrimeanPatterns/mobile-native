import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useMemo, useState} from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {addMileValue} from '../../../../services/mileValue';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import Form from '../../../form';
import HeaderButton from '../../../page/header/button';
import {Modal} from '../../../page/modal';
import styles from './styles';

type AccountMileValueModalProp = {
    onClose: () => void;
    accountName?: string;
    accountId?: string;
    onComplete?: (boolean) => void;
};

type IAccountMileValueModal = React.FunctionComponent<AccountMileValueModalProp>;

const AccountMileValueModal: IAccountMileValueModal = ({onClose, accountName, accountId, onComplete}) => {
    const isDark = useDark();
    const [programId, setProgramId] = useState<string | null>(accountId || null);
    const [programName, setProgramName] = useState<string | null>(null);
    const [mileValue, setMileValue] = useState<string | null>(null);

    const onPress = useCallback(async () => {
        if (_.isString(programId) && _.isString(mileValue)) {
            const success = await addMileValue({id: programId, value: mileValue});

            if (_.isFunction(onComplete)) {
                onComplete(success);
            } else {
                onClose();
            }
        }
    }, [mileValue, onClose, onComplete, programId]);

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

    const HeaderButtonRight = useMemo(() => {
        const color = isDark ? DarkColors.blue : Colors.blueDark;
        const title = Translator.trans('button.add', {}, 'messages');

        return (
            <HeaderButton
                disabled={_.isNull(programId) || _.isNull(mileValue)}
                onPress={onPress}
                title={isIOS ? title : undefined}
                iconName={isIOS ? undefined : 'android-baseline-check'}
                color={isIOS ? color : undefined}
            />
        );
    }, [isDark, mileValue, onPress, programId]);

    const headerComponent = useMemo(
        () => (
            <Text style={[styles.message, isDark && styles.messageDark]}>
                {Translator.trans(
                    /** @Desc("To calculate the value of your %programName% miles, please specify what a single %programName% mile is worth to you in US cents.")  */ 'mile-value.massage',
                    {programName},
                    'mobile-native',
                )}
            </Text>
        ),
        [isDark, programName],
    );

    const additionalHint = useCallback(
        () =>
            isIOS && (
                <View style={[styles.hint, isDark && styles.hintDark]}>
                    <Text style={[styles.hintText, isDark && styles.hintTextDark]}>¢</Text>
                </View>
            ),
        [isDark],
    );

    const fields = useMemo(
        () => [
            {
                value: accountName,
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
                autoFocus: true,
                additionalHint,
            },
        ],
        [accountName, additionalHint, onSelectProgramId],
    );

    return (
        <Modal visible presentationStyle={isIOS ? 'formSheet' : 'overFullScreen'} onClose={onClose} headerRight={HeaderButtonRight}>
            <View style={[styles.modal, isDark && styles.modalDark]}>
                <Form key='accountMileValueForm' fields={fields} onFieldChange={onFieldChange} headerComponent={headerComponent} />
            </View>
        </Modal>
    );
};

export default AccountMileValueModal;
