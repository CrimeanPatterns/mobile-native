import {DarkColors} from '@styles/index';
import {StyleSheet} from 'react-native';

import {isAndroid, isTablet} from '../../../../helpers/device';

const base = {
    card: isAndroid
        ? {
              backgroundColor: '#f5f5f5',
              marginHorizontal: -16,
              marginTop: 18,
              paddingHorizontal: 16,
              paddingBottom: 16,
              marginBottom: -16,
          }
        : {},
    cardDark: isAndroid
        ? {
              backgroundColor: DarkColors.bg,
          }
        : {},
};

let additional;

if (isTablet) {
    additional = {
        card: {
            ...base.card,
            flexDirection: 'row',
            justifyContent: 'center',
        },
    };
}

export default StyleSheet.create({...base, ...additional});
