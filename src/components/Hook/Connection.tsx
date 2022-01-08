import React, { FunctionComponent } from 'react';
import { IClientOptions } from 'mqtt';

import { clientOptions } from '../env/clientOptions';

type Props = {
    connect: (host: string, mqttOption?: IClientOptions) => void;
    disconnect: () => void;
    connectBtn: string;
};

export const Connection: FunctionComponent<Props> = ({ connect, disconnect, connectBtn }) => {
    const handleDisconnect = () => {
        disconnect();
    };

    const connectSocket = () => {
        const host = (document.getElementById('host') as HTMLInputElement).value;
        const clientId = (document.getElementById('clientId') as HTMLInputElement).value;
        const port = (document.getElementById('port') as HTMLInputElement).value;
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        const url = `ws://${host}:${port}/mqtt`;
        const options = clientOptions;
        if (clientId && username && password) {
            options.clientId = clientId;
            options.username = username;
            options.password = password;
        }
        connect(url, options);
    };

    return (
        <div className="flex flex-col w-full items-center text-gray-800">
            <div className="flex flex-wrap w-full md:w-2/5 gap-6 text-xl bg-white mb-5 px-6 py-6">
                <div className="w-full border-b-2 font-bold">Connection</div>
                <div className="flex flex-col">
                    <label htmlFor="host">Host</label>
                    <input type="text" id="host" value={clientOptions.host} className="border border-gray-300 px-3" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="port">Port</label>
                    <input type="text" id="port" value={clientOptions.port} className="border border-gray-300 px-3" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="clientId">Client ID</label>
                    <input
                        type="text"
                        id="clientId"
                        value={clientOptions.clientId}
                        className="border border-gray-300 px-3"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={clientOptions.username}
                        className="border border-gray-300 px-3"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input
                        type="text"
                        id="password"
                        value={clientOptions.password}
                        className="border border-gray-300 px-3"
                    />
                </div>
                <div className="flex w-full divide-x divide-gray-800">
                    <div className="w-1/2 flex justify-center">
                        <button
                            onClick={connectSocket}
                            className={
                                'flex items-center justify-center rounded-lg px-3 py-1 text-white text-2xl ' +
                                (connectBtn === 'Connected' ? 'bg-green-600' : 'bg-blue-600 hover:bg-green-300')
                            }>
                            {connectBtn}
                        </button>
                    </div>
                    <div className="w-1/2 flex justify-center">
                        <button
                            onClick={handleDisconnect}
                            className="bg-red-800 text-white rounded-lg hover:bg-red-600 px-3 py-1">
                            Disonnect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
