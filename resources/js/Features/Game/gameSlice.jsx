import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import { notifyOfErrors } from '../Overlays/notificationsSlice';
import { selectCurrentUser } from '../CurrentUser/currentUserSlice';

function initializeEcho(id, thunkAPI) {
    const { dispatch } = thunkAPI;
    console.log(`initializing echo App.Models.GameRoom.${id}`);
    window.Echo.private(`App.Models.GameRoom.${id}`)
        .listen('GameUpdate', (game_data) => { 
            console.log("GameUpdated");
            console.log(game_data);
            const currentUser = dispatch(selectCurrentUser)
            if (currentUser.game_room_id === game_data.id)
            {
                dispatch(setGame(game_data));
            }
        });
}

export const fetchGame = createAsyncThunk(
    'game/fetchGame',
    async (_, thunkAPI) => {
        const { getState } = thunkAPI;
        const oldGameId = selectGameId(getState());
        const { data: game } = await window.axios.get(`/api/game`);

        if (!game) {
            return null;
        }

        if (game.id !== oldGameId) {
            initializeEcho(game.id, thunkAPI);
        }

        return game;
    }
);

export const createGame = createAsyncThunk(
    'game/createGame',
    async (game_data, thunkAPI) => {
        const { getState, rejectWithValue } = thunkAPI;
        const oldGameId = selectGameId(getState());

        try {
            const { data: game } = await window.axios.post('/api/create', game_data);

            if (game.id !== oldGameId) {
                initializeEcho(game.id, thunkAPI);
            }

            return game;
        }
        catch (err) {
            if (err.response) {
                notifyOfErrors(err.response.data, thunkAPI);
                return rejectWithValue(err.response.data);
            }
        }
    });

export const leaveGame = createAsyncThunk('game/leaveGame', async () => {
    const { data } = await window.axios.post('/api/leave', {});
    return data;
});

const initialState = {
    storeStatus: 'prestart',
    fetchStatus: 'idle',
    errors: {},

    id: null,
    room_code: "",
    deadline: new Date().getTime(),
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGame(state, action) {
            return {
                ...state,
                ...action.payload,
                storeStatus: 'initialized',
                fetchStatus: 'idle',
            };
        },
        setNullGame(state, action) {
            return {
                ...initialState,
                storeStatus: 'initialized',
                fetchStatus: state.fetchStatus,
                errors: state.errors
            };
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchGame.fulfilled, (state, { payload }) => {
                return gameSlice.reducer(state, { type: 'game/setGame', payload })
            })
            .addCase(fetchGame.pending, (state, action) => {
                state.fetchStatus = 'loading';
            })
            .addCase(fetchGame.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.errors = action.error.message;
            })
            .addCase(leaveGame.fulfilled, (state, action) => {
                return { fetchStatus: 'idle' }
            })
            .addCase(leaveGame.pending, (state, action) => {
                state.fetchStatus = 'loading';
            })
            .addCase(createGame.pending, (state, { payload }) => {
                return gameSlice.reducer(state, { type: 'game/setGame', payload })
            })
            .addCase(createGame.fulfilled, (state, { payload }) => {
                return gameSlice.reducer(state, { type: 'game/setGame', payload })
            });
    }
});

export default gameSlice.reducer;

export const { setGame, setNullGame } = gameSlice.actions;

export const canUpdate = (status) => status !== 'loading';


export const selectGameStoreStatus = (state) => state.game.storeStatus;
export const selectGameFetchStatus = (state) => state.game.fetchStatus;
export const selectGameErrors = (state) => state.game.errors;

export const selectGame = (state) => state.game;
export const selectGameId = (state) => state.game.id;
export const selectGameCode = (state) => state.game.room_code;
export const selectGameDeadline = (state) => state.game.deadline;
export const selectGameOwnerId = (state) => state.game.owner_id;
