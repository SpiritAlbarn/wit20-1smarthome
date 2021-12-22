import React, { FunctionComponent } from 'react';
import { HookMqtt } from './components/Hook/';
// Hook or Class
// import ClassMqtt from './components/Class/'
import './App.css';

export const App: FunctionComponent = () => {
    return (
        <div className="App">
            <HookMqtt />
            {/* Hook or Class */}
            {/* <ClassMqtt /> */}
        </div>
    );
};
