import {isIOS} from '../../../helpers/device';

export default isIOS ? require('./index.ios').default() : require('./index.android').default();
