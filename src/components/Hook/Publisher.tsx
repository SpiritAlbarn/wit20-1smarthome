import React, { useContext } from 'react';
import { Card, Form, Input, Row, Col, Button, Select } from 'antd';
import { QosOption } from './index';
import { FunctionComponent } from 'react';

type Props = {
    publish: (context: any) => void;
};

export const Publisher: FunctionComponent<Props> = ({ publish }) => {
    const [form] = Form.useForm();
    const qosOptions = useContext(QosOption);

    const record = {
        topic: 'zigbee2mqtt/0xf0d1b8000019237e/set/state',
        qos: 2,
    };

    const onFinish = (values: any) => {
        publish(values);
    };

    const PublishForm = (
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
                <Col span={24}>
                    <Form.Item label="Payload" name="payload">
                        <Input.TextArea />
                    </Form.Item>
                </Col>
                <Col span={8} offset={16} style={{ textAlign: 'right' }}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Publish
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );

    return <Card title="Publisher">{PublishForm}</Card>;
};
