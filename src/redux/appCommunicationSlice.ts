import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';

const communicationSlice = createSlice({
    name: 'communication',
    initialState: {
        setGlobalStateFn: null,
    },
    reducers: {
        assetpSetGlobalStateFn(state, action) {
            if (typeof action.payload === 'function') {
                state.setGlobalStateFn = action.payload;
            }
            return state;
        },
    },
});


export default communicationSlice.reducer;

export const { assetpSetGlobalStateFn } = communicationSlice.actions;

export const selectSetFn = (state: RootState) => state.appCommunication.setGlobalStateFn;
