import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from '@reduxjs/toolkit';
import { notifyOfErrors } from '../Overlays/notificationsSlice';
import { selectCurrentUser } from '../CurrentUser/currentUserSlice';
import { selectAllUsers } from '../Users/usersSlice';
import { setAnswerCard, setQuestionCard } from '../Cards/cardsSlice';

function leaveEchoChannel(id, thunkAPI) {
    console.log(`leaving echo channel App.Models.GameRoom.${id}`);
    window.Echo.leave(`App.Models.GameRoom.${id}`);
}

function initializeEcho(id, thunkAPI) {
    const { dispatch, getState } = thunkAPI;
    console.log(`initializing echo App.Models.GameRoom.${id}`);
    window.Echo.private(`App.Models.GameRoom.${id}`)
        .listen('GameUpdated', (game_data) => {
            console.log("GameUpdated");
            const currentUser = selectCurrentUser(getState());
            if (currentUser.game_room_id == game_data.id) {
                dispatch(setGame(game_data));
            }
        })
        .listen('UserAnswerCardDrawn', (userAnswerCard) => {
            console.log("UserAnswerCardDrawn");
            const currentUser = selectCurrentUser(getState());
            if (currentUser.game_room_id == userAnswerCard.game_room_id) {
                dispatch(setAnswerCard(userAnswerCard));
            }
            else {
                console.log("not dispatching setAnswerCard");
            }
        })
        .listen('UserAnswerCardChanged', (userAnswerCard) => {
            console.log("UserAnswerCardChanged");
            const currentUser = selectCurrentUser(getState());
            if (currentUser.game_room_id == userAnswerCard.game_room_id) {
                dispatch(setAnswerCard(userAnswerCard));
            }
            else {
                console.log("not dispatching setAnswerCard");
            }
        })
        .listen('UserQuestionCardDrawn', (userQuestionCard) => {
            console.log("UserQuestionCardDrawn");
            const currentUser = selectCurrentUser(getState());
            if (currentUser.game_room_id == userQuestionCard.game_room_id) {
                dispatch(setQuestionCard(userQuestionCard));
            }
            else {
                console.log("not dispatching setQuestionCard");
            }
        })
        .listen('UserQuestionCardChanged', (userQuestionCard) => {
            console.log("UserQuestionCardChanged");
            const currentUser = selectCurrentUser(getState());
            if (currentUser.game_room_id == userQuestionCard.game_room_id) {
                dispatch(setQuestionCard(userQuestionCard));
            }
            else {
                console.log("not dispatching setQuestionCard");
            }
        })
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
            if (oldGameId) {
                leaveEchoChannel(oldGameId, thunkAPI);
            }
            initializeEcho(game.id, thunkAPI);
        }

        return game;
    }
);

export const startGame = createAsyncThunk(
    'game/startGame',
    async (_, thunkAPI) => {
        const { data: game } = await window.axios.post('/api/start', {});

        return game;
    }
);

export const voteSkip = createAsyncThunk(
    'game/voteSkip',
    async (_, thunkAPI) => {
        const { data: game } = await window.axios.post('/api/vote', {});

        return game;
    }
)

export const nextRound = createAsyncThunk(
    'game/nextRound',
    async (_, thunkAPI) => {
        const { data: game } = await window.axios.post('/api/next', {});

        return game;
    }
)

export const submitWinner = createAsyncThunk(
    'game/submitWinner',
    async (winning_group_id, thunkAPI) => {
        const { data: game } = await window.axios.post('/api/winner', {
            winning_group_id,
        });

        return game;
    }
)

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
    deadline_at: null,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGame: {
            reducer(state, action) {
                return {
                    ...state,
                    ...action.payload,
                    storeStatus: 'initialized',
                    fetchStatus: 'idle',
                }
            },
            prepare(newGame) {
                const deadline_in = newGame.deadline_in;
                return {
                    payload: {
                        ...newGame,
                        deadline_at: Date.now() + deadline_in,
                    }
                };
            }
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
                return gameSlice.reducer(state, setGame(payload));
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
            })
            .addCase(startGame.pending, (state, action) => {

            })
            .addCase(startGame.fulfilled, (state, action) => {

            })
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
export const selectGameDeadline = (state) => state.game.deadline_at;
export const selectGameOwnerId = (state) => state.game.owner_id;
export const selectGameProgress = (state) => state.game.progress;
export const selectCurrentQuestionerId = (state) => state.game.current_questioner;
export const selectAnswerCount = (state) => state.game.answer_count;
export const selectWinningGroupId = (state) => state.game.winning_group_id;

export const selectOwner = createSelector(
    [selectAllUsers, selectGameOwnerId],
    (users, ownerId) => users.reduce((owner, user) => user.id == ownerId ? user : owner, { id: null }),
);

export const selectCurrentQuestioner = createSelector(
    [selectAllUsers, selectCurrentQuestionerId],
    (users, questionerId) => users.reduce((questioner, user) => (
        user.id == questionerId ? user : questioner
    ), { id: null, name: "" }),
)