import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { Buffer } from 'buffer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.Buffer = Buffer;

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);
