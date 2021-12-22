import React, { createContext, FunctionComponent, useEffect, useState } from 'react';
import { Connection } from './Connection';
import { Publisher } from './Publisher';
import { Subscriber } from './Subscriber';
import { Receiver } from './Receiver';
import mqtt, { IClientOptions, MqttClient } from 'mqtt';
import { qosOption } from '../helper/qosOption';
import { QoSOptions } from '../../types/QoSOptions';

export const QosOption = createContext<QoSOptions[]>([]);

export const HookMqtt: FunctionComponent = () => {
    const [client, setClient] = useState<MqttClient | null>(null);
    const [isSub, setIsSub] = useState<boolean>(false);
    const [payload, setPayload] = useState<JSON | any>({});
    const [connectStatus, setConnectStatus] = useState('Connect');

    const mqttConnect = (host: string, mqttOption?: IClientOptions) => {
        setConnectStatus('Connecting');
        setClient(mqtt.connect(host, mqttOption));
    };

    useEffect(() => {
        if (client) {
            client.on('connect', () => {
                setConnectStatus('Connected');
            });
            client.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
            });
            client.on('reconnect', () => {
                setConnectStatus('Reconnecting');
            });
            client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                setPayload(payload);
            });
        }
    }, [client]);

    const mqttDisconnect = () => {
        if (client) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            client.end(() => {
                setConnectStatus('Connect');
            });
        }
    };

    const mqttPublish = (context: any) => {
        if (client) {
            const { topic, qos, payload } = context;
            client.publish(topic, payload, { qos }, (error) => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }
    };

    const mqttSub = (subscription: any) => {
        if (client) {
            const { topic, qos } = subscription;
            client.subscribe(topic, { qos }, (error) => {
                if (error) {
                    console.log('Subscribe to topics error', error);
                    return;
                }
                setIsSub(true);
            });
        }
    };

    const mqttUnSub = (subscription: any) => {
        if (client) {
            const { topic } = subscription;
            client.unsubscribe(topic, (error: any) => {
                if (error) {
                    console.log('Unsubscribe error', error);
                    return;
                }
                setIsSub(false);
            });
        }
    };

    return (
        <>
            <Connection connect={mqttConnect} disconnect={mqttDisconnect} connectBtn={connectStatus} />
            <QosOption.Provider value={qosOption}>
                <Subscriber sub={mqttSub} unSub={mqttUnSub} showUnsub={isSub} />
                <Publisher publish={mqttPublish} />
            </QosOption.Provider>
            <Receiver payload={payload} />
        </>
    );
};
