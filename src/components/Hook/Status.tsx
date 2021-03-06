import React, { FunctionComponent, useEffect, useState } from 'react';
import { Client } from 'mqtt';
import { xyBriToHex } from '../helper/xyBriToHex';

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
    const [sensor, setSensor] = useState({
        battery: 0,
        battery_low: false,
        contact: true,
        linkquality: 0,
        tamper: true,
    });
    const [melder, setMelder] = useState({
        battery: 0,
        battery_low: false,
        occupancy: true,
        voltage: 0,
        tamper: true,
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

        const bewegungsMelder = 'zigbee2mqtt/bewegungsmelder';
        client.subscribe(bewegungsMelder, { qos: 2 }, (error) => {
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
                topic: 'zigbee2mqtt/bewegungsmelder',
                qos: 2,
                payload: '{"battery":100,"battery_low":false,"occupancy":false,"tamper":true,"voltage":3100}',
            };
            publish(context);
        });
        moveSensor?.addEventListener('mouseout', () => {
            const context = {
                topic: 'zigbee2mqtt/bewegungsmelder',
                qos: 2,
                payload: '{"battery":100,"battery_low":false,"occupancy":false,"tamper":false,"voltage":3100}',
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
            const sensorMap = {
                battery: 0,
                battery_low: false,
                contact: true,
                linkquality: 0,
                tamper: true,
            };
            sensorMap.battery = statusObj.battery;
            sensorMap.battery_low = statusObj.battery_low;
            sensorMap.contact = statusObj.contact;
            sensorMap.linkquality = statusObj.linkquality;
            sensorMap.tamper = statusObj.tamper;
            setSensor(sensorMap);
            if (statusObj.contact) {
                context = {
                    topic: 'zigbee2mqtt/lampe1/set/state',
                    qos: 2,
                    payload: 'ON',
                };
                publish(context);

                context = {
                    topic: 'zigbee2mqtt/lampe1/set/color',
                    qos: 2,
                    payload: '{"x": 0.2388, "y": 0.5358}',
                };
                publish(context);
            } else {
                context = {
                    topic: 'zigbee2mqtt/lampe1/set/state',
                    qos: 2,
                    payload: 'OFF',
                };
                publish(context);
            }
        }
        if (payload.topic == 'zigbee2mqtt/bewegungsmelder') {
            const statusObj = JSON.parse(payload.message);
            let context;
            const melderMap = {
                battery: 0,
                battery_low: false,
                occupancy: false,
                linkquality: 0,
                voltage: 0,
                tamper: false,
            };
            melderMap.battery = statusObj.battery;
            melderMap.battery_low = statusObj.battery_low;
            melderMap.occupancy = statusObj.contact;
            melderMap.linkquality = statusObj.linkquality;
            melderMap.voltage = statusObj.voltage;
            melderMap.tamper = statusObj.tamper;
            setMelder(melderMap);
            if (statusObj.tamper) {
                context = {
                    topic: 'zigbee2mqtt/lampe1/set/color',
                    qos: 2,
                    payload: '{"x": 0.6899, "y": 0.3078}',
                };
                publish(context);

                context = {
                    topic: 'zigbee2mqtt/lampe1/set/state',
                    qos: 2,
                    payload: 'ON',
                };
                publish(context);
            } else {
                context = {
                    topic: 'zigbee2mqtt/lampe1/set/state',
                    qos: 2,
                    payload: 'OFF',
                };
                publish(context);

                context = {
                    topic: 'zigbee2mqtt/lampe1/set/state',
                    qos: 2,
                    payload: 'OFF',
                };
                publish(context);
            }
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

    return (
        <div className="flex flex-col w-full justify-center text-gray-800">
            <section className="flex w-full justify-center">
                <div className="w-full md:w-1/3 h-36 mb-12 bg-yellow-500" id="move-sensor" />
            </section>
            <div className="flex flex-col items-center mb-6">
                <button onClick={toggleKontakt} className="text-white mb-6">
                    Kontaktsensor
                </button>
                <div className="flex flex-col w-full md:w-1/3 mb-6 bg-white rounded-sm">
                    <div className="text-2xl">Lampe</div>
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
                        <p className="uppercase">{xyBriToHex(status.color.x, status.color.y, status.brightness)}</p>
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
                <div className="flex flex-col w-full md:w-1/3 mb-6 bg-white rounded-sm">
                    <div className="text-2xl">Kontaktsensor</div>
                    <div className="flex justify-between">
                        <p>Battery:</p>
                        <p>{sensor.battery}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Battery Low:</p>
                        <p>{sensor.battery_low ? 'true' : 'false'}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Link Quality</p>
                        <p>{sensor.linkquality}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Contact:</p>
                        <p>{sensor.contact ? 'true' : 'false'}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Tamper:</p>
                        <p>{sensor.tamper ? 'true' : 'false'}</p>
                    </div>
                </div>
                <div className="flex flex-col w-full md:w-1/3 bg-white rounded-sm">
                    <div className="text-2xl">Bewegungsmelder</div>
                    <div className="flex justify-between">
                        <p>Battery:</p>
                        <p>{melder.battery}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Battery Low:</p>
                        <p>{melder.battery_low ? 'true' : 'false'}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Link Quality</p>
                        <p>{sensor.linkquality}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Voltage:</p>
                        <p>{melder.voltage}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Occupancy</p>
                        <p>{melder.occupancy ? 'true' : 'false'}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Tamper:</p>
                        <p>{melder.tamper ? 'true' : 'false'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
