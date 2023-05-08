import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import { notifyOfErrors } from '../Overlays/notificationsSlice';

export const fetchQuestionCards = createAsyncThunk(
    'cards/fetchQuestionCards',
    async (_, thunkAPI) => {
        const { data: cards } = await window.axios.get('/api/qcards');

        return cards;
    }
)
export const fetchAnswerCards = createAsyncThunk(
    'cards/fetchAnswerCards',
    async (_, thunkAPI) => {
        const { data: cards } = await window.axios.get('/api/acards');

        return cards;
    }
)

export const pickQuestionCard = createAsyncThunk(
    'cards/pickQuestionCard',
    async(uqc, thunkAPI) => {
        const { data: card } = await window.axios.post('/api/question', uqc);

        return card;
    }
)

export const pickAnswerCards = createAsyncThunk(
    'cards/pickAnswerCards',
    async(uacs, thunkAPI) => {
        const { data: cards } = await window.axios.post('/api/answer', uacs);

        return cards;
    }
)

export const revealAnswerCard = createAsyncThunk(
    'cards/revealAnswerCard',
    async(uac, thunkAPI) => {
        const { data: card } = await window.axios.post('/api/reveal', {
            user_answer_card_id: uac.id
        });

        return card;
    }
)

export const redrawHand = createAsyncThunk(
    'cards/redrawHand',
    async (_, thunkAPI) => {

        try {
            const { data: cards } = await window.axios.post('/api/redraw', {});

            return cards;
        }
        catch (err) {
            if (err.response) {
                notifyOfErrors(err.response.data, thunkAPI);
                return rejectWithValue(err.response.data);
            }
        }
    }
)

const cardsAdapter = createEntityAdapter({
    sortComparer: (a, b) => a.drawn - b.draw,
});

const initialState = {
    questionCards: cardsAdapter.getInitialState(),
    answerCards: cardsAdapter.getInitialState(),
};

const cardsSlice = createSlice({
    name: "cards",
    initialState,
    reducers: {
        addQuestionCard(state, action) {
            cardsAdapter.addOne(state.questionCards, action.payload);
        },
        removeQuestionCard(state, action) {
            cardsAdapter.removeOne(state.questionCards, action.payload);
        },
        setQuestionCards(state, action) {
            cardsAdapter.setAll(state.questionCards, action.payload);
        },
        setQuestionCard(state, action) {
            cardsAdapter.setOne(state.questionCards, action.payload);
        },
        addAnswerCard(state, action) {
            cardsAdapter.addOne(state.answerCards, action.payload);
        },
        removeAnswerCard(state, action) {
            cardsAdapter.removeCards(state.answerCards, action.payload);
        },
        setAnswerCard(state, action) {
            cardsAdapter.setOne(state.answerCards, action.payload);
        },
        setAnswerCards(state, action) {
            cardsAdapter.setAll(state.answerCards, action.payload);
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchQuestionCards.pending, (state, action) => {
            })
            .addCase(fetchQuestionCards.fulfilled, (state, { payload }) => {
                cardsSlice.reducer(state, { type: 'cards/setQuestionCards', payload });
            })
            .addCase(fetchAnswerCards.pending, (state, action) => {
            })
            .addCase(fetchAnswerCards.fulfilled, (state, { payload }) => {
                cardsSlice.reducer(state, { type: 'cards/setAnswerCards', payload });
            })
            .addCase(redrawHand.pending, (state, action) => {
            })
            .addCase(redrawHand.fulfilled, (state, { payload }) => {
                cardsSlice.reducer(state, { type: 'cards/setAnswerCards', payload });
            });
    }
});

export default cardsSlice.reducer;

export const { setAnswerCard } = cardsSlice.actions;

export const {
    selectById: selectAnswerCardById,
    selectAll: selectAllAnswerCards,
} = cardsAdapter.getSelectors(state => state.cards.answerCards);

export const {
    selectById: selectQuestionCardById,
    selectAll: selectAllQuestionCards,
} = cardsAdapter.getSelectors(state => state.cards.questionCards);