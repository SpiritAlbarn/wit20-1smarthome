import React, { FunctionComponent } from 'react';
import { HookMqtt } from './components/Hook/HookMqtt';
import './App.css';

export const App: FunctionComponent = () => {
    return (
        <div className="App">
            <HookMqtt />
        </div>
    );
};
