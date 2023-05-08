import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from '@reduxjs/toolkit';
import { selectGameId } from '../Game/gameSlice';

import { notifyOfErrors } from '../Overlays/notificationsSlice';

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
            const gameRoomId = selectGameId(getState());
            if (user_data.game_room_id === gameRoomId) {
                dispatch(updateUser(user_data));
            }
        })
}

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (gameId, thunkAPI) => {
        const { data: users } = await window.axios.get(`/api/users`);

        initializeEcho(gameId, thunkAPI);

        return users;
    }
);
export const admitWaitingUser = createAsyncThunk(
    'users/admitWaitingUser',
    async ({ id }, thunkAPI) => {
        window.axios.post(`/api/admit`, {
            id,
        });
    }
)
export const denyWaitingUser = createAsyncThunk(
    'users/denyWaitingUser',
    async ({ id }, thunkAPI) => {
        window.axios.post(`/api/deny`, {
            id,
        });
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
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.pending, (state, action) => {

            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                usersAdapter.setAll(state, action.payload);
            })
            .addCase(fetchUsers.rejected, (state, action) => {
            })
            .addCase(admitWaitingUser.pending, (state, action) => {

            })
            .addCase(admitWaitingUser.fulfilled, (state, action) => {

            })
            .addCase(denyWaitingUser.pending, (state, action) => {

            })
            .addCase(denyWaitingUser.fulfilled, (state, action) => {

            })
    }
});

export default usersSlice.reducer;
export const {
    removeUser,
    updateUser,
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

import {
    faHourglass,
} from '@fortawesome/free-regular-svg-icons';
import {
    faGamepad,
    faGlasses,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';

export function playingStatusIcon(playingStatus) {
    switch (playingStatus) {
        case "playing":
            return faGamepad;
        case "spectating":
            return faGlasses;
        case "waiting":
            return faHourglass;
        default:
            return null;
    }
}

export function readyStatusIcon(ready) {
    return ready ? faCheck : faGamepad
}