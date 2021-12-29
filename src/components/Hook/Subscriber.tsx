import React, { FunctionComponent, useContext } from 'react';
import { Card, Form, Input, Row, Col, Button, Select } from 'antd';
import { QosOption } from './HookMqtt';

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

    const SubForm = (
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
    );

    return <Card title="Subscriber">{SubForm}</Card>;
};
