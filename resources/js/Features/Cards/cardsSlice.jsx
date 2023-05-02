import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';

export const fetchQuestionCards = createAsyncThunk(
    'cards/fetchQuestionCards',
    async (_, thunkAPI) => {
        const { data: cards } = await window.axios.get('/api/qcards');

        console.log(cards);
        return cards;
    }
)
export const fetchAnswerCards = createAsyncThunk(
    'cards/fetchAnswerCards',
    async (_, thunkAPI) => {
        console.log('fetchAnswerCards');
        const { data: cards } = await window.axios.get('/api/acards');

        console.log(cards);
        return cards;
    }
)

export const pickQuestionCard = createAsyncThunk(
    'cards/pickQuestionCard',
    async(uqc, thunkAPI) => {
        console.log('pickQuestionCard');
        const { data: card } = await window.axios.post('/api/question', uqc);

        console.log(card);
        return card;
    }
)

export const pickAnswerCards = createAsyncThunk(
    'cards/pickAnswerCards',
    async(uacs, thunkAPI) => {
        console.log('pickQuestionCard');
        const { data: cards } = await window.axios.post('/api/answer', uacs);

        console.log(cards);
        return cards;
    }
)

export const revealAnswerCard = createAsyncThunk(
    'cards/revealAnswerCard',
    async(uac, thunkAPI) => {
        console.log('revealAnswerCard');
        const { data: card } = await window.axios.post('/api/reveal', {
            user_answer_card_id: uac.id
        });

        console.log(card);
        return card;
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
            console.log('setQuestionCards');
            cardsAdapter.setAll(state.questionCards, action.payload);
        },
        setQuestionCard(state, action) {
            console.log('setQuestionCard');
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
            console.log('setAnswerCards');
            cardsAdapter.setAll(state.answerCards, action.payload);
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchQuestionCards.pending, (state, action) => {
            })
            .addCase(fetchQuestionCards.fulfilled, (state, { payload }) => {
                console.log(`fulfilled ${payload}`);
                cardsSlice.reducer(state, { type: 'cards/setQuestionCards', payload });
            })
            .addCase(fetchAnswerCards.pending, (state, action) => {
                console.log('fetchAnswerCards.pending');
            })
            .addCase(fetchAnswerCards.fulfilled, (state, { payload }) => {
                console.log('fetchAnswerCards.fulfilled');
                cardsSlice.reducer(state, { type: 'cards/setAnswerCards', payload });
            })
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