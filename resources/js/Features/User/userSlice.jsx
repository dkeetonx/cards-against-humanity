import {
    nanoid,
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';
import getStore from '../../getStore';
import { addNotification } from '../Notifications/notificationsSlice';

function initializeEcho(id) {
    console.log(`initializing echo App.Models.User.${id}`);
    window.Echo.private(`App.Models.User.${id}`)
        .listen('UserChangedOnServer', () => { });
}

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const oldUserId = selectUser(getStore().getState()).id;

    const response = await window.axios.get('/api/user');
    const user_data = response.data;

    if (user_data.id !== oldUserId) {
        initializeEcho(user_data.id);
    }
    delete user_data.game_room;

    return user_data;
});

function makeNotification(error) {
    if (error.response) {
        Object.values(error.response.data.errors).forEach(error => {
            getStore().dispatch(addNotification({
                id: nanoid(),
                priority: 5,
                duration: 5,
                extraClasses: "alert-warning",
                component: () => <p className="text-sm">{error}</p>,
            }));
        });
    }
    else {
        throw error;
    }
}

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (user, { rejectWithValue }) => {
        const oldUserId = selectUser(getStore().getState()).id;

        try {
            const response = await window.axios.post('/api/name', user);
            const user_data = response.data;

            delete user_data.game_room;
            if (user_data.id !== oldUserId) {
                initializeEcho(user_data.id);
            }
            return user_data;
        } catch (error) {
            makeNotification(error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const joinGame = createAsyncThunk(
    'user/joinGame',
    async (join_data, { rejectWithValue }) => {
        const oldUserId = selectUser(getStore().getState()).id;

        try {
            console.log(`joining: code = ${room_code}`);
            const response = await window.axios.post('/api/join', join_data);
            const user_data = response.data.user;

            if (user_data.id !== oldUserId) {
                initializeEcho(user_data.id);
            }

            return user_data;

        } catch (error) {
            if (error.response) {
                makeNotification(error);
                return rejectWithValue(error.response.data);
            }
            else {
                throw error;
            }
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        store_status: 'idle',
        errors: {},

        id: null,
        name: "",
        game_room_id: null,
        game_room_status: "nothing",
    },
    reducers: {
        setUser(state, action) {
            return { ...state, store_status: 'initialized', ...action.payload };
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                return userSlice.reducer(state, { type: 'user/setUser', payload: action.payload });
            })
            .addCase(fetchUser.pending, (state, action) => {
                state.store_status = 'loading';
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.store_status = 'failed';
                state.errors = action.error.errors;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                return userSlice.reducer(state, { type: 'user/setUser', payload: action.payload });
            })
            .addCase(updateUser.pending, (state, action) => {
                state.store_status = 'loading';
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.store_status = 'failed';
                state.errors = action.payload.errors ?? {};
            })
            .addCase(joinGame.fulfilled, (state, action) => {
                return userSlice.reducer(state, { type: 'user/setUser', payload: action.payload });
            })
            .addCase(joinGame.pending, (state, action) => {
                state.store_status = 'loading';
            })
            .addCase(joinGame.rejected, (state, action) => {
                state.store_status = 'failed';
                state.errors = action.payload.errors ?? {};
            })
    }
})

export default userSlice.reducer;

export const { setUser } = userSlice.actions;

export const selectUserStoreStatus = (state) => state.user.store_status;
export const selectUserStoreErrors = (state) => state.user.errors;

export const selectUser = (state) => state.user;
export const selectUserId = (state) => state.user.id;
export const selectUserName = (state) => state.user.name;
export const selectUserGameId = (state) => state.user.game_room_id;
export const selectUserStatus = (state) => state.user.game_room_status;

