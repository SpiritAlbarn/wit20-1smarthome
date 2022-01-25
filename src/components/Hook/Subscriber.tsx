import React, { FunctionComponent, useContext } from 'react';
import { Button } from 'antd';

type Props = {
    sub: (subscription: any) => void;
    unSub: (subscription: any) => void;
    showUnsub: boolean;
};

export const Subscriber: FunctionComponent<Props> = ({ sub, unSub, showUnsub }) => {
    const topicNode = document.getElementById('topic') as HTMLInputElement;
    const qosNode = document.getElementById('qos') as HTMLInputElement;

    const record = {
        topic: 'zigbee2mqtt/lampe1',
    };

    const onFinish = () => {
        const values = {
            topic: topicNode.value,
            qos: qosNode.value,
        };
        sub(values);
    };

    const handleUnsub = () => {
        const values = {
            topic: topicNode.value,
            qos: qosNode.value,
        };
        unSub(values);
    };

    return (
        <div className="flex flex-col w-full items-center text-gray-800">
            <div className="flex flex-wrap w-full md:w-2/5 gap-6 text-xl bg-white mb-5 px-6 py-6 md:justify-between">
                <div className="w-full border-b-2 font-bold">Subscriber</div>
                <div className="flex flex-col w-full md:w-2/5">
                    <label htmlFor="topic">Topic</label>
                    <input type="text" id="topic" defaultValue={record.topic} className="border border-gray-300 px-3" />
                </div>
                <div className="flex flex-col w-full md:w-2/5">
                    <label htmlFor="qos">QoS</label>
                    <select name="qos" id="qos">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>
                <div className="flex w-full divide-x divide-gray-800">
                    <div className="w-1/2 flex justify-center">
                        <button
                            onClick={onFinish}
                            className={
                                'flex items-center justify-center rounded-lg px-3 py-1 text-white text-2xl ' +
                                (showUnsub ? 'bg-green-600' : 'bg-blue-600 hover:bg-green-300')
                            }>
                            Subscribe
                        </button>
                    </div>

                    {showUnsub ? (
                        <div className="w-1/2 flex justify-center">
                            <button
                                className="bg-red-800 text-white rounded-lg hover:bg-red-600 px-3 py-1"
                                onClick={handleUnsub}>
                                Unsubscribe
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
