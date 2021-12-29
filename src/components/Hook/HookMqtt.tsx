import React, { createContext, FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { Connection } from './Connection';
import { Publisher } from './Publisher';
import { Subscriber } from './Subscriber';
import { Receiver } from './Receiver';
import mqtt, { IClientOptions, MqttClient } from 'mqtt';
import { qosOption } from '../helper/qosOption';
import { QoSOptions } from '../../types/QoSOptions';
import { hexToRgb } from '../helper/hexToRgb';

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

    const setColor = (e: FormEvent<HTMLInputElement>) => {
        console.log('color', hexToRgb(e.currentTarget.value));
        hexToRgb(e.currentTarget.value);
        const context = {
            topic: 'zigbee2mqtt/lampe1/set/color',
            qos: 2,
            payload: '' + hexToRgb(e.currentTarget.value),
        };
        mqttPublish(context);
    };

    const effectLoop = (counter: number) => {
        let context = {
            topic: '',
            qos: 0,
            payload: '',
        };
        if (counter < 11) {
            if (counter % 2 === 0) {
                context = {
                    topic: 'zigbee2mqtt/lampe1/set/state',
                    qos: 2,
                    payload: 'ON',
                };
            } else {
                context = {
                    topic: 'zigbee2mqtt/lampe1/set/state',
                    qos: 2,
                    payload: 'OFF',
                };
            }
            setTimeout(function () {
                counter++;
                console.log(counter);
                mqttPublish(context);

                effectLoop(counter);
            }, 1000);
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
            <div>
                <input type="color" onChange={setColor} />
            </div>
            <button onClick={() => effectLoop(0)}>Click Me Please</button>
            <p className="text-4xl text-red-900">ASDASF</p>
        </>
    );
};
