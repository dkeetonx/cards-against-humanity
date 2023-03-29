import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';

function initializeEcho(id) {
    console.log(`initializing echo App.Models.GameRoom.${id}`);
    window.Echo.private(`App.Models.GameRoom.${id}`)
        .listen('GameChangedOnServer', () => { });
}

export const fetchGame = createAsyncThunk('game/fetchGame', async (oldGameId) => {
    const response = await window.axios.get(`/api/game`);
    const game_data = response.data;

    console.log(`game_data.id = ${game_data.id} gameId = ${oldGameId}`);

    if (game_data.id !== oldGameId) {
        initializeEcho(game_data.id);
    }

    return game_data;
});

export const leaveGame = createAsyncThunk('game/leaveGAme', async () => {
    const response = await window.axios.post('/leave', {});
    return response.data;
});

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        store_status: 'idle',
        errors: {},

        id: null,
        room_code: "",
    },
    reducers: {
        setGame(state, action) {

        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchGame.fulfilled, (state, action) => {
                return { ...state, store_status: 'initialized', ...action.payload };
            })
            .addCase(fetchGame.pending, (state, action) => {
                state.store_status = 'loading';
            })
            .addCase(fetchGame.rejected, (state, action) => {
                state.store_status = 'failed';
                state.errors = action.error.message;
            })
            .addCase(leaveGame.fulfilled, (state, action) => {
                console.log("left game");
                return { store_status: 'initialized' }
            })
            .addCase(leaveGame.pending, (state, action) => {
                state.store_status = 'loading';
            })
    }
});

export default gameSlice.reducer;

export const canUpdate = (status) => status !== 'loading';


export const selectGameStoreStatus = (state) => state.game.store_status;
export const selectGameStoreErrors = (state) => state.game.errors;

export const selectGame = (state) => state.game;
export const selectGameId = (state) => state.game.id;
export const selectGameCode = (state) => state.game.room_code;

