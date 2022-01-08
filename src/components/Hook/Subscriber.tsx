import React, { FunctionComponent, useContext } from 'react';
import { Card, Form, Input, Row, Col, Button, Select } from 'antd';
import { QosOption } from './HookMqtt';
import { clientOptions } from '../env/clientOptions';

type Props = {
    sub: (subscription: any) => void;
    unSub: (subscription: any) => void;
    showUnsub: boolean;
};

export const Subscriber: FunctionComponent<Props> = ({ sub, unSub, showUnsub }) => {
    const [form] = Form.useForm();
    const qosOptions = useContext(QosOption);

    const record = {
        topic: 'zigbee2mqtt/lampe1',
        qos: 2,
    };

    const onFinish = (values: any) => {
        sub(values);
    };

    const handleUnsub = () => {
        const values = form.getFieldsValue();
        unSub(values);
    };

    return (
        <div className="flex flex-col w-full items-center text-gray-800">
            <Card title="Subscriber">
                <Form layout="vertical" name="basic" form={form} initialValues={record} onFinish={onFinish}>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label="Topic" name="topic">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="QoS" name="qos">
                                <Select options={qosOptions} />
                            </Form.Item>
                        </Col>
                        <Col span={8} offset={16} style={{ textAlign: 'right' }}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Subscribe
                                </Button>
                                {showUnsub ? (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    <Button type="danger" style={{ marginLeft: '10px' }} onClick={handleUnsub}>
                                        Unsubscribe
                                    </Button>
                                ) : null}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
            {/*TODO: Wrapping*/}
            <div className="flex flex-wrap w-full md:w-2/5 gap-6 text-xl bg-white mb-5 px-6 py-6 md:justify-between">
                <div className="w-full border-b-2 font-bold">Connection</div>
                <div className="flex flex-col w-full md:w-2/5">
                    <label htmlFor="host">Host</label>
                    <input type="text" id="host" value={clientOptions.host} className="border border-gray-300 px-3" />
                </div>
                <div className="flex flex-col w-full md:w-2/5">
                    <label htmlFor="qos">QoS</label>
                    <select name="qos" id="qos">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2" selected={true}>
                            2
                        </option>
                    </select>
                </div>
                <div className="flex w-full divide-x divide-gray-800">
                    <Button type="primary" htmlType="submit">
                        Subscribe
                    </Button>
                    {showUnsub ? (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        <Button type="danger" style={{ marginLeft: '10px' }} onClick={handleUnsub}>
                            Unsubscribe
                        </Button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
