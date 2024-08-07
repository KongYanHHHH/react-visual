import './public-path';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Spin } from 'antd';

let root: ReactDOM.Root | null = null;
function render(props: any) {
    const { container, userInfo } = props;
    root =
        root ||
        ReactDOM.createRoot(
            container
                ? container.querySelector('#microAppBox')
                : document.querySelector('#microAppBox'),
        );

    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <PersistGate loading={<Spin />} persistor={persistor}>
                    <App userInfo={userInfo} />
                </PersistGate>
            </Provider>
        </React.StrictMode>,
    );
}

if (!window.__POWERED_BY_QIANKUN__) {
    render({});
}

export async function bootstrap() {
    console.log('[react18] react app bootstraped');
}

export async function mount(props: any) {
    // console.log('[react18] props from main framework', props);
    render(props);
}

export async function unmount() {
    root?.unmount();
    root = null;
}

reportWebVitals();
