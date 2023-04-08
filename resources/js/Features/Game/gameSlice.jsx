import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import { notifyOfErrors } from '../Overlays/notificationsSlice';

function initializeEcho(id, thunkAPI) {
    console.log(`initializing echo App.Models.GameRoom.${id}`);
    window.Echo.private(`App.Models.GameRoom.${id}`)
        .listen('GameUpdate', (game_data) => { 
            
        });
}

export const fetchGame = createAsyncThunk(
    'game/fetchGame',
    async (_, thunkAPI) => {
        const { getState } = thunkAPI;
        const oldGameId = selectGameId(getState());
        const { data: game } = await window.axios.get(`/api/game`);

        console.log(`game.id = ${game.id} oldGameId = ${oldGameId}`);

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

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        fetchStatus: 'idle',
        errors: {},

        id: null,
        room_code: "",
    },
    reducers: {
        setGame(state, action) {
            return { ...state, fetchStatus: 'initialized', ...action.payload };
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
                console.log("left game");
                return { fetchStatus: 'initialized' }
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

export const canUpdate = (status) => status !== 'loading';


export const selectGameFetchStatus = (state) => state.game.fetchStatus;
export const selectGameErrors = (state) => state.game.errors;

export const selectGame = (state) => state.game;
export const selectGameId = (state) => state.game.id;
export const selectGameCode = (state) => state.game.room_code;

