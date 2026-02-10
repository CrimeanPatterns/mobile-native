import Translator from 'bazinga-translator';
import React, {useCallback, useState} from 'react';
import {Text} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import {ShowMoreBlock} from '../../../../types/trips/blocks';
import Icon from '../../../icon';
import {TouchableBackground} from '../../../page/touchable/background';
import styles from './styles';

type IShowMore = React.FunctionComponent<ShowMoreBlock>;

const ShowMore: IShowMore = ({index, showMore, val}) => {
    const isDark = useDark();
    const [hidden, setHidden] = useState(true);

    const onPress = useCallback(() => {
        setHidden(false);
        showMore(index + 1, val);
    }, [index, showMore, val]);

    return hidden ? (
        <TouchableBackground
            onPress={onPress}
            style={[styles.container, styles.containerSmall, styles.arrowCompensation, isDark && styles.containerDark]}
            activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.grayLight}
            rippleColor={isDark ? DarkColors.border : Colors.gray}>
            <Text style={[styles.text, isDark && styles.textDark]}>{Translator.trans('advert.more', {}, 'menu')}</Text>
            {isIOS && <Icon name='arrow' color={isDark ? DarkColors.blue : Colors.blue} size={24} />}
        </TouchableBackground>
    ) : null;
};

export default ShowMore;
