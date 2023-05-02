import {
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';
import { notifyOfErrors } from '../Overlays/notificationsSlice';
import { setNullGame } from '../Game/gameSlice';

function initializeEcho({ id, oldUserId }, thunkAPI) {
    const { dispatch } = thunkAPI;
    console.log(`user.id = ${id} oldUserId = ${oldUserId}`)

    if (oldUserId !== null) {
        console.log(`leaving App.Models.User.${oldUserId}`)
        window.Echo.leave(`App.Models.User.${oldUserId}`);
    }

    if (id !== oldUserId) {
        console.log(`initializing echo App.Models.User.${id}`);
        window.Echo.private(`App.Models.User.${id}`)
            .listen('UserUpdated', (user_data) => {
                console.log("UserUpdated");
                console.log(user_data);
                dispatch(setCurrentUser(user_data));

                if (user_data.game_room_id === null) {
                    dispatch(setNullGame());
                }
            });
    }
}

export const fetchCurrentUser = createAsyncThunk(
    'currentUser/fetchCurrentUser',
    async (_, thunkAPI) => {
        const { getState, dispatch } = thunkAPI;
        const oldUserId = selectCurrentUserId(getState());

        const { data: user } = await window.axios.get('/api/user');

        if (!user) {
            dispatch(setNullGame());
            return null;
        }

        if (user.id !== oldUserId) {
            initializeEcho({ id: user.id, oldUserId }, thunkAPI);
        }
        delete user.game_room;

        if (user.game_room_id === null) {
            dispatch(setNullGame());
        }
        return user;
    }
);

export const updateCurrentUser = createAsyncThunk(
    'currentUser/updateCurrentUser',
    async (user_update, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI
        const oldUserId = selectCurrentUserId(getState());

        try {
            const { data: user } = await window.axios.post('/api/user', user_update);
            delete user.game_room;

            if (user.id !== oldUserId) {
                initializeEcho({ id: user.id, oldUserId }, thunkAPI);
            }
            return user;

        } catch (err) {
            if (err.response) {
                notifyOfErrors(err.response.data, thunkAPI);
                return rejectWithValue(err.response.data);
            }
            else {
                throw err;
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
            const { data: user } = await window.axios.post('/api/join', join_data);

            if (user.id !== oldUserId) {
                initializeEcho({ id: user.id, oldUserId }, thunkAPI);
            }

            return user;

        } catch (err) {
            if (err.response) {
                notifyOfErrors(err.response.data, thunkAPI);
                return rejectWithValue(err.response.data);
            }
            throw err;
        }
    }
);

const initialState = {
    storeStatus: 'prestart',
    fetchStatus: 'idle',
    errors: {},

    id: null,
    name: "",
    game_room_id: null,
    status: "nothing",

}
const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState,
    reducers: {
        setCurrentUser(state, action) {
            return {
                ...state,
                ...action.payload,
                storeStatus: 'initialized',
                fetchStatus: 'idle',
            };
        },
        setNullCurrentUser(state, action) {
            return {
                ...initialState,
                storeStatus: 'initialized',
                fetchStatus: state.fetchStatus,
                errors: state.errors,
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
                return currentUserSlice.reducer(state, { type: 'currentUser/setCurrentUser', payload });
            })
            .addCase(fetchCurrentUser.pending, (state, action) => {
                state.fetchStatus = 'loading';
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.errors = action.error.errors;
            })
            .addCase(updateCurrentUser.fulfilled, (state, { payload }) => {
                return currentUserSlice.reducer(state, { type: 'currentUser/setCurrentUser', payload });
            })
            .addCase(updateCurrentUser.pending, (state, action) => {
                state.fetchStatus = 'loading';
            })
            .addCase(updateCurrentUser.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.errors = action.payload.errors ?? {};
            })
            .addCase(joinGame.fulfilled, (state, { payload }) => {
                return currentUserSlice.reducer(state, { type: 'currentUser/setCurrentUser', payload });
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
export const selectCurrentUserStatus = (state) => state.currentUser.status;
export const selectPlayingStatus = (state) => state.currentUser.playing_status;
export const selectCurrentUserReady = (state) => state.currentUser.ready;
export const selectCurrentUserVoted = (state) => state.currentUser.voted;
