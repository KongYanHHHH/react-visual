import { useEffect } from 'react';
import Router from './router/router';
import { useDispatch } from 'react-redux';
import { RootState } from 'reduxDir/store';
import { acceptUserInfoByMainApp } from 'reduxDir/userSlice';

function App({ userInfo }: { userInfo?: RootState['user'] }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(acceptUserInfoByMainApp(userInfo))
        }
    }, [dispatch, userInfo]);

    return <Router />;
}

export default App;
