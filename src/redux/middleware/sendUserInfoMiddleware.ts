import type { UnknownAction } from 'redux';

const sendUserInfoMiddleware =
    (store: { getState: () => any }) =>
    (next: (arg0: any) => any) =>
    (action: UnknownAction) => {
        if (action.type === 'user/login/fulfilled' && action.payload) {
            const state = store.getState();
            
            if (typeof state.appCommunication.setGlobalStateFn === 'function') {
                state.appCommunication.setGlobalStateFn({
                    type: 'userInfo',
                    payload: action.payload,
                });
            }
        }
        return next(action);
    };

export default sendUserInfoMiddleware;
