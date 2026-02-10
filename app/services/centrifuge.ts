import Centrifuge from 'centrifuge';

import EventEmitter from './eventEmitter';

export type CentrifugeConnectionConfig = {
    [key: string]: unknown;
    authEndpoint: string;
    debug?: boolean;
    info: {[key: string]: unknown};
    timestamp: string;
    token: string;
    url: string;
    user: string;
};

function log(...args) {
    console.log('[CentrifugeProvider]', ...args);
}

class CentrifugeProvider {
    protected connection: Centrifuge;

    protected clientInfo: Partial<CentrifugeConnectionConfig> | undefined;

    constructor() {
        this.destroy = this.destroy.bind(this);

        EventEmitter.addListener('logout', this.destroy);
    }

    configure(config: Partial<CentrifugeConnectionConfig>): void {
        if (!this.connection) {
            // config.debug = true;
            log('configure centrifuge', config);
            this.clientInfo = config;
            this.connection = new Centrifuge(config);
        }
    }

    connect(): Promise<void> {
        log('connect');

        return new Promise((resolve, reject) => {
            if (this.connection) {
                if (!this.connection.isConnected()) {
                    this.connection.on('connect', (context) => {
                        log('connected', context);
                        resolve();
                    });
                    this.connection.connect();
                } else {
                    log('connection already established');
                    resolve();
                }
            } else {
                log('connection not established');
                reject();
            }
        });
    }

    disconnect() {
        if (this.connection && this.connection.isConnected()) {
            this.connection.disconnect();
            log('disconnect');
        }
    }

    getConnection() {
        this.connect();
        return this.connection;
    }

    async getConnectionAsync() {
        await this.connect();
        return this.connection;
    }

    getClientInfo() {
        return this.clientInfo;
    }

    getClientId(): string {
        return this.connection.getClientId();
    }

    destroy() {
        console.log('[CentrifugeProvider]', 'destroy centrifuge connection');
        this.disconnect();
        this.connection = undefined;
        this.clientInfo = undefined;
    }
}

export default new CentrifugeProvider();
