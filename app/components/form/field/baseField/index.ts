import {Platform} from 'react-native';

import BaseFieldAndroid from './index.android';
import BaseFieldIos from './index.ios';

export default Platform.select({
    ios: BaseFieldIos as typeof BaseFieldIos,
    android: BaseFieldAndroid as typeof BaseFieldAndroid,
});
