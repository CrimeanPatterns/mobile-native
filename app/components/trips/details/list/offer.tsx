import React, {useCallback} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {openExternalUrl} from '../../../../helpers/navigation';
import {useDark} from '../../../../theme';
import {OfferBlock} from '../../../../types/trips/blocks';
import styles from './styles';

type IOffer = React.FunctionComponent<OfferBlock>;

const Offer: IOffer = ({val, link}) => {
    const isDark = useDark();
    const {title, href} = link;

    const onPress = useCallback(() => openExternalUrl({url: href, external: false}), [href]);

    return (
        <View style={styles.offer}>
            <Text style={[styles.text, isDark && styles.textDark]}>{val}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={[styles.textLink, styles.textCenter, isDark && styles.textBlueDark]}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Offer;
