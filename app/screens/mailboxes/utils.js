import {firebase} from '@react-native-firebase/analytics';

export const log = (...args) => console.log('[email scanner]', ...args);

export function logMailboxConnectEvent(route, {type, source = 'profile'}) {
    // eslint-disable-next-line no-param-reassign
    source = route.params?.source ?? source;
    firebase.analytics().logEvent('mailbox_add', {source, type});
    log('logEvent', 'mailbox_add', {source, type});
}
