import React, { FunctionComponent, useEffect, useState } from 'react';
import { Card, List } from 'antd';

type Props = {
    payload: any;
};

export const Receiver: FunctionComponent<Props> = ({ payload }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (payload.topic) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setMessages((messages) => [...messages, payload]);
        }
    }, [payload]);

    const renderListItem = (item: any) => (
        <List.Item>
            <List.Item.Meta title={item.topic} description={item.message} />
        </List.Item>
    );

    return (
        <Card title="Receiver">
            <List size="small" bordered dataSource={messages} renderItem={renderListItem} />
        </Card>
    );
};
