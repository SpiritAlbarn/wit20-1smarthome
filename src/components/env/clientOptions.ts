import { IClientOptions } from 'mqtt/types/lib/client-options';

export const clientOptions: IClientOptions = {
    host: '192.168.178.83',
    // host: '192.168.178.107',
    // host: '192.168.178.55',
    clientId: `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`,
    port: 9001,
    keepalive: 30,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 2,
        retain: false,
    },
    rejectUnauthorized: false,
    username: 'admin',
    password: 'admin',
};
