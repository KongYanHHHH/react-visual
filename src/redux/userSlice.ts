import {
    createSlice,
    createAsyncThunk,
    createSelector,
} from '@reduxjs/toolkit';
import JSEncrypt from 'jsencrypt';
import type { RootState } from './store';
import PUBLIC_KEY from '@/uilts/PUBLIC_KEY';
import useFetchWrapper from '@/hooks/useFetchWrapper';

const encryptor = new JSEncrypt();
encryptor.setPublicKey(PUBLIC_KEY);

function encryptionCipher(cipher: string) {
    return encryptor.encrypt(cipher) as string;
}

// 异步 action creator 用于登录
export const login = createAsyncThunk(
    'user/login',
    async (bodyData: { account: string; cipher: string }, thunkAPI) => {
        const fetchInstance = useFetchWrapper();

        bodyData.cipher = encryptionCipher(bodyData.cipher);
        try {
            const data = await fetchInstance.post(
                fetchInstance.apiUri.login,
                JSON.stringify(bodyData),
            );

            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    },
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        loading: false,
        error: null,
        name: null,
        uuid: null,
        avatar: null,
        token: null,
    },
    reducers: {
        acceptUserInfoByMainApp: (state, action) => {
            if (action.payload.token) {
                state.isLoggedIn = true;
                state.name = action.payload.name;
                state.uuid = action.payload.uuid;
                state.token = action.payload.token;
                state.avatar = action.payload.avatar;
            }
            return state;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(login.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.name = action.payload.name;
                state.uuid = action.payload.uuid;
                state.token = action.payload.token;
                state.avatar = action.payload.avatar;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as any;
            });
    },
});

export const { acceptUserInfoByMainApp } = userSlice.actions;

export default userSlice.reducer;

const name = (state: RootState) => state.user.name;
const uuid = (state: RootState) => state.user.uuid;
const avatar = (state: RootState) => state.user.avatar;

export const selectUserInfo = createSelector(
    name,
    avatar,
    uuid,
    (name, avatar, uuid) => {
        return {
            name,
            avatar,
            uuid,
        };
    },
);
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectLoading = (state: RootState) => state.user.loading;
export const selectError = (state: RootState) => state.user.error;
export const selectToken = (state: RootState) => state.user.token;
