import { useEffect } from 'react';
import Router from './router/router';
import { useDispatch } from 'react-redux';
import { RootState } from 'reduxDir/store';
import { acceptUserInfoByMainApp } from 'reduxDir/userSlice';

import { SetGlobalStateFnContext } from '@/context/globalStateContest';
import { assetpSetGlobalStateFn } from 'reduxDir/appCommunicationSlice';
import getCookie from './uilts/getCookie';
import apiUri from './uilts/api_uri';

function App({
    userInfo,
    setGlobalState,
}: {
    userInfo?: RootState['user'];
    setGlobalState?: Function;
}) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(acceptUserInfoByMainApp(userInfo));
        }

        dispatch(assetpSetGlobalStateFn(setGlobalState));
    }, [dispatch, setGlobalState, userInfo]);

    useEffect(() => {
        const timer = setTimeout(() => {
            clearTimeout(timer);

            if (!getCookie('csrfToken')) {
                fetch(apiUri.hahaha);
            }
        }, 500);
    }, []);

    return (
        // <SetGlobalStateFnContext.Provider value={setGlobalState}>
        <Router />
        // </SetGlobalStateFnContext.Provider>
    );
}

export default App;
