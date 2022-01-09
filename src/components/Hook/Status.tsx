import React, { FunctionComponent, useEffect, useState } from 'react';
import { Client } from 'mqtt';

type Props = {
    payload: any;
    publish: (context: any) => void;
    client: Client;
};

export const Status: FunctionComponent<Props> = ({ payload, publish, client }) => {
    const [status, setStatus] = useState({
        state: '',
        color: {
            x: 0,
            y: 0,
        },
        brightness: 0,
        linkquality: 0,
    });

    const [kontakt, setKontakt] = useState(false);

    useEffect(() => {
        const lampe1 = 'zigbee2mqtt/lampe1';
        client.subscribe(lampe1, { qos: 2 }, (error) => {
            if (error) {
                console.log('Subscribe to topics error', error);
                return;
            }
        });

        const kontaktSensor = 'zigbee2mqtt/kontaktsensor';
        client.subscribe(kontaktSensor, { qos: 2 }, (error) => {
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

        const moveSensor = document.getElementById('move-sensor');
        moveSensor?.addEventListener('mouseover', () => {
            const context = {
                topic: 'zigbee2mqtt/lampe1/set/state',
                qos: 2,
                payload: 'ON',
            };
            publish(context);
        });
        moveSensor?.addEventListener('mouseout', () => {
            const context = {
                topic: 'zigbee2mqtt/lampe1/set/state',
                qos: 2,
                payload: 'OFF',
            };
            publish(context);
        });
    }, []);

    useEffect(() => {
        if (payload.topic == 'zigbee2mqtt/lampe1') {
            const statusObj = JSON.parse(payload.message);
            const statusMap = {
                state: '',
                color: {
                    x: 0,
                    y: 0,
                },
                brightness: 0,
                linkquality: 0,
            };
            statusMap.state = statusObj.state;
            statusMap.color = statusObj.color;
            statusMap.brightness = statusObj.brightness;
            statusMap.linkquality = statusObj.linkquality;
            setStatus(statusMap);
        }
        if (payload.topic == 'zigbee2mqtt/kontaktsensor') {
            const statusObj = JSON.parse(payload.message);
            let context;
            if (statusObj.contact) {
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
            publish(context);
        }
    }, [payload]);

    useEffect(() => {
        let context;

        if (kontakt) {
            context = {
                topic: 'zigbee2mqtt/kontaktsensor',
                qos: 2,
                payload: '{"battery":100,"battery_low":false,"contact":true,"linkquality":123,"tamper":true}',
            };
        } else {
            context = {
                topic: 'zigbee2mqtt/kontaktsensor',
                qos: 2,
                payload: '{"battery":100,"battery_low":false,"contact":false,"linkquality":123,"tamper":true}',
            };
        }
        publish(context);
    }, [kontakt]);

    function toggleKontakt() {
        setKontakt(!kontakt);
    }

    function xyBriToRgb(x: number, y: number, bri: number) {
        const z = 1.0 - x - y;

        const Y = bri / 255.0; // Brightness of lamp
        const X = (Y / y) * x;
        const Z = (Y / y) * z;
        let r = X * 1.612 - Y * 0.203 - Z * 0.302;
        let g = -X * 0.509 + Y * 1.412 + Z * 0.066;
        let b = X * 0.026 - Y * 0.072 + Z * 0.962;
        r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, 1.0 / 2.4) - 0.055;
        g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, 1.0 / 2.4) - 0.055;
        b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, 1.0 / 2.4) - 0.055;
        const maxValue = Math.max(r, g, b);
        r /= maxValue;
        g /= maxValue;
        b /= maxValue;
        r = r * 255;
        if (r < 0) {
            r = 255;
        }
        g = g * 255;
        if (g < 0) {
            g = 255;
        }
        b = b * 255;
        if (b < 0) {
            b = 255;
        }

        let r2 = Math.round(r).toString(16);
        let g2 = Math.round(g).toString(16);
        let b2 = Math.round(b).toString(16);

        if (r2.length < 2) r2 = '0' + r;
        if (g2.length < 2) g2 = '0' + g;
        if (b2.length < 2) b2 = '0' + r;
        return '#' + r2 + g2 + b2;
    }

    return (
        <div className="flex flex-col w-full justify-center text-gray-800">
            <section className="flex w-full justify-center">
                <div className="w-1/3 h-36 mb-12 bg-yellow-500" id="move-sensor"></div>
            </section>
            <div className="flex flex-col items-center">
                <button onClick={toggleKontakt}>Kontaktsensor</button>
                <div className="flex flex-col w-1/3 bg-white rounded-sm">
                    <div className="flex justify-between">
                        <p>State:</p>
                        <p>{status.state}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Color:</p>
                        <p>X: {status.color.x}</p>
                    </div>
                    <div className="flex justify-end">
                        <p>Y: {status.color.y}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>ColorRGB:</p>
                        <p className="uppercase">{xyBriToRgb(status.color.x, status.color.y, status.brightness)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Brightness:</p>
                        <p>{status.brightness}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Link Quality:</p>
                        <p>{status.linkquality}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
