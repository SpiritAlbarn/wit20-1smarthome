import React, { FunctionComponent, useEffect, useState } from 'react';
import { Client } from 'mqtt';
type Props = {
    payload: any;
    publish: (context: any) => void;
    client: Client;
};

export const Status: FunctionComponent<Props> = ({ payload, publish, client }) => {
    const [status, setStatus] = useState('');

    useEffect(() => {
        const topic = 'zigbee2mqtt/lampe1';
        client.subscribe(topic, { qos: 2 }, (error) => {
            if (error) {
                console.log('Subscribe to topics error', error);
                return;
            }
        });

        const context = {
            topic: 'zigbee2mqtt/lampe1/get/state',
            qos: 2,
            payload: '',
        };
        publish(context);
    }, []);

    useEffect(() => {
        if (payload.topic == 'zigbee2mqtt/lampe1') {
            setStatus(JSON.stringify(payload));
            console.log(JSON.parse(payload.message));
        }
    }, [payload]);

    return <div>{status}</div>;
};
