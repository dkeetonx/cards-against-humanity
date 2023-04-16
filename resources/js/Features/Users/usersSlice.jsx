import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from '@reduxjs/toolkit';
import { notifyOfErrors } from '../Overlays/notificationsSlice';
import { selectGameId } from '../Game/gameSlice';

function initializeEcho(id, thunkAPI) {
    const { dispatch, getState } = thunkAPI;
    console.log(`initializing echo App.Models.GameRoom.${id}`);
    window.Echo.private(`App.Models.GameRoom.${id}`)
        .listen('UserLeftGame', (user_data) => {
            console.log(`UserLeftGame seen: ${user_data}`);
            dispatch(removeUser(user_data.id))
        })
        .listen('UserUpdated', (user_data) => {
            console.log(`UserUpdated seen: ${user_data}`);
            const state = getState();
            console.log(state);
            dispatch(updateUser(user_data));
        })
}

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (gameId, thunkAPI) => {
        const { data: users } = await window.axios.get(`/api/users`);

        console.log(users);
        initializeEcho(gameId, thunkAPI);

        return users;
    }
);

const usersAdapter = createEntityAdapter({
    sortComparer: (a, b) => a.points - b.points,
});

const initialState = usersAdapter.getInitialState({});

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        removeUser(state, action) {
            usersAdapter.removeOne(state, action.payload);
        },
        updateUser(state, action) {
            usersAdapter.upsertOne(state, action.payload);
        },
        admitWaitingUser(state, { payload }) {
            window.axios.post(`/api/admit`, {
                id: payload.id,
            });
        },
        denyWaitingUser(state, { payload }) {
            window.axios.post(`/api/deny`, {
                id: payload.id,
            });
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.pending, (state, action) => {

            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                usersAdapter.upsertMany(state, action.payload);
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                console.log(`fetchUsers.rejected: ${action}`);
            })
    }
});

export default usersSlice.reducer;
export const {
    removeUser,
    updateUser,
    admitWaitingUser,
    denyWaitingUser,
} = usersSlice.actions;

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds,
} = usersAdapter.getSelectors(state => state.users);

export const selectAllSpectating = createSelector(
    [selectAllUsers],
    (users) => users.filter(user => user.playing_status === "spectating")
);

export const selectAllWaiting = createSelector(
    [selectAllUsers],
    (users) => users.filter(user => user.playing_status === "waiting")
);

export const selectAllPlaying = createSelector(
    [selectAllUsers],
    (users) => users.filter(user => user.playing_status === "playing")
);
