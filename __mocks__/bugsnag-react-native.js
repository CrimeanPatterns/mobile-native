export class Client {}

export class Configuration {
    registerBeforeSendCallback = () => {};
}

export default {
	bugsnag: () => '',
	leaveBreadcrumb: () => '',
	notify: () => '',
	loggerConfig: () => ''
};
