import React, { createContext, FormEvent, FunctionComponent, useEffect, useState } from 'react';
import { Connection } from './Connection';
import { Publisher } from './Publisher';
import { Subscriber } from './Subscriber';
import { Receiver } from './Receiver';
import mqtt, { IClientOptions, MqttClient } from 'mqtt';
import { qosOption } from '../helper/qosOption';
import { QoSOptions } from '../../types/QoSOptions';
import { hexToRgb } from '../helper/hexToRgb';
import { Status } from './Status';

export const QosOption = createContext<QoSOptions[]>([]);

export const HookMqtt: FunctionComponent = () => {
    const [client, setClient] = useState<MqttClient | null>(null);
    const [isSub, setIsSub] = useState<boolean>(false);
    const [payload, setPayload] = useState<JSON | any>({});
    const [connectStatus, setConnectStatus] = useState('Connect');
    const [connected, setConnected] = useState(false);

    const mqttConnect = (host: string, mqttOption?: IClientOptions) => {
        setConnectStatus('Connecting');
        setClient(mqtt.connect(host, mqttOption));
    };

    useEffect(() => {
        if (client) {
            client.on('connect', () => {
                setConnectStatus('Connected');
                setConnected(true);
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
            window.location.reload();
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

    const setBrightness = (e: FormEvent<HTMLInputElement>) => {
        const context = {
            topic: 'zigbee2mqtt/lampe1/set/brightness',
            qos: 2,
            payload: '' + e.currentTarget.value,
        };
        mqttPublish(context);
    };

    const effectLoop = (counter: number) => {
        let x = 0;
        const intervalID = setInterval(() => {
            if (x > counter) {
                let context = {
                    topic: '',
                    qos: 0,
                    payload: '',
                };
                context = {
                    topic: 'zigbee2mqtt/lampe1/set/color',
                    qos: 2,
                    payload: `{"x": ${0.1813}, "y": ${0.7363}}`,
                };
                mqttPublish(context);
                window.clearInterval(intervalID);
            } else {
                let context = {
                    topic: '',
                    qos: 0,
                    payload: '',
                };
                if (x % 2 === 0) {
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
                x++;
                console.log(x);
                mqttPublish(context);

                context = {
                    topic: 'zigbee2mqtt/lampe1/set/color',
                    qos: 2,
                    payload: `{"x": ${x / 18}, "y": ${x / 18}}`,
                };
                mqttPublish(context);
            }
        }, 1000);
    };

    return (
        <>
            <Connection connect={mqttConnect} disconnect={mqttDisconnect} connectBtn={connectStatus} />
            <QosOption.Provider value={qosOption}>
                <Subscriber sub={mqttSub} unSub={mqttUnSub} showUnsub={isSub} />
                <Publisher publish={mqttPublish} />
            </QosOption.Provider>
            <div>
                <input type="color" onChange={setColor} />
            </div>
            <div>
                <input type="range" min="0" max="255" step="1" onChange={setBrightness} />
            </div>
            <button onClick={() => effectLoop(10)} className="mb-6">
                Effect
            </button>
            {connected && client && <Status payload={payload} publish={mqttPublish} client={client} />}
            <Receiver payload={payload} />
        </>
    );
};
