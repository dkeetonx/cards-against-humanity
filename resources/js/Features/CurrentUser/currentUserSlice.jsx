import {
    nanoid,
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';
import { addNotification } from '../Overlays/notificationsSlice';
import getStore from '../../getStore';

function initializeEcho(id) {
    console.log(`initializing echo App.Models.User.${id}`);
    window.Echo.private(`App.Models.User.${id}`)
        .listen('UserChangedOnServer', () => { });
}

export const fetchCurrentUser = createAsyncThunk(
    'currentUser/fetchCurrentUser',
    async (_, thunkAPI) => {
        const { getState } = thunkAPI;
        const oldUserId = selectCurrentUserId(getState());

        const { data: user } = await window.axios.get('/api/user');

        if (user.id !== oldUserId) {
            initializeEcho(user.id);
        }
        delete user.game_room;

        return user;
    }
);

function notifyOfErrors({ errors }) {
    Object.values(errors).forEach(message => {
        getStore().dispatch(addNotification({
            id: nanoid(),
            priority: 5,
            duration: 5,
            extraClasses: "alert-warning",
            component: () => <p className="text-sm">{message}</p>,
        }));
    });
}

export const updateCurrentUser = createAsyncThunk(
    'currentUser/updateCurrentUser',
    async (user_update, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI
        const oldUserId = selectCurrentUserId(getState());

        try {
            const { data: user } = await window.axios.post('/api/name', user_update);
            delete user.game_room;

            if (user.id !== oldUserId) {
                initializeEcho(user.id, thunkAPI);
            }
            return user;

        } catch (err) {
            if (err.response) {
                notifyOfErrors(err.response.data, thunkAPI);
                return rejectWithValue(err.response.data);
            }
            else {
                throw error;
            }
        }
    }
);

export const joinGame = createAsyncThunk(
    'currentUser/joinGame',
    async (join_data, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI
        const oldUserId = selectCurrentUserId(getState());

        try {
            const { user } = await window.axios.post('/api/join', join_data);

            if (user.id !== oldUserId) {
                initializeEcho(user.id, thunkAPI);
            }

            return user;

        } catch (err) {
            if (err.response) {
                notifyOfErrors(err.response.data, thunkAPI);
                return rejectWithValue(err.response.data);
            }
            throw error;
        }
    }
);

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: {
        fetchStatus: 'idle',
        errors: {},

        id: null,
        name: "",
        game_room_id: null,
        game_room_status: "nothing",
    },
    reducers: {
        setCurrentUser(state, action) {
            return { ...state, fetchStatus: 'initialized', ...action.payload };
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                return currentUserSlice.reducer(state, { type: 'currentUser/setCurrentUser', payload: action.payload });
            })
            .addCase(fetchCurrentUser.pending, (state, action) => {
                state.fetchStatus = 'loading';
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.errors = action.error.errors;
            })
            .addCase(updateCurrentUser.fulfilled, (state, action) => {
                return currentUserSlice.reducer(state, { type: 'currentUser/setCurrentUser', payload: action.payload });
            })
            .addCase(updateCurrentUser.pending, (state, action) => {
                state.fetchStatus = 'loading';
            })
            .addCase(updateCurrentUser.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.errors = action.payload.errors ?? {};
            })
            .addCase(joinGame.fulfilled, (state, action) => {
                return currentUserSlice.reducer(state, { type: 'currentUser/setCurrentUser', payload: action.payload });
            })
            .addCase(joinGame.pending, (state, action) => {
                state.fetchStatus = 'loading';
            })
            .addCase(joinGame.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                if (action.payload)
                    state.errors = action.payload.errors ?? {};
            })
    }
})

export default currentUserSlice.reducer;

export const { setCurrentUser } = currentUserSlice.actions;

export const selectCurrentUserFetchStatus = (state) => state.currentUser.fetchStatus;
export const selectCurrentUserErrors = (state) => state.currentUser.errors;
export const selectCurrentUserCanFetch = (state) => state.currentUser.fetchStatus !== 'loading';

export const selectCurrentUser = (state) => state.currentUser;
export const selectCurrentUserId = (state) => state.currentUser.id;
export const selectCurrentUserName = (state) => state.currentUser.name;
export const selectCurrentUserGameId = (state) => state.currentUser.game_room_id;
export const selectCurrentUserStatus = (state) => state.currentUser.game_room_status;

