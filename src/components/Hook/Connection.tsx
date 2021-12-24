import React, { FunctionComponent } from 'react';
import { Card, Button, Form, Input, Row, Col } from 'antd';
import { IClientOptions } from 'mqtt';
import { clientOptins } from '../env/clientOptins';

type Props = {
    connect: (host: string, mqttOption?: IClientOptions) => void;
    disconnect: () => void;
    connectBtn: string;
};

export const Connection: FunctionComponent<Props> = ({ connect, disconnect, connectBtn }) => {
    const [form] = Form.useForm();
    function onFinish(values: any) {
        const { host, clientId, port, username, password } = values;
        const url = `ws://${host}:${port}/mqtt`;
        const options = clientOptins;
        options.clientId = clientId;
        options.username = username;
        options.password = password;
        connect(url, options);
    }

    const handleConnect = () => {
        form.submit();
    };

    const handleDisconnect = () => {
        disconnect();
    };

    const ConnectionForm = (
        <Form layout="vertical" name="basic" form={form} initialValues={clientOptins} onFinish={onFinish}>
            <Row gutter={20}>
                <Col span={8}>
                    <Form.Item label="Host" name="host">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Port" name="port">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Client ID" name="clientId">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Username" name="username">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Password" name="password">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );

    return (
        <Card
            title="Connection"
            actions={[
                <Button type="primary" key={1} onClick={handleConnect}>
                    {connectBtn}
                </Button>,
                <Button key={2} danger onClick={handleDisconnect}>
                    Disconnect
                </Button>,
            ]}>
            {ConnectionForm}
        </Card>
    );
};
