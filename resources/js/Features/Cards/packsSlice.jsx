import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';

export const fetchPacks = createAsyncThunk(
    'packs/fetchPacks',
    async (_, thunkAPI) => {
        const { data: packs } = await window.axios.get('/api/packs');

        return packs;
    }
)

const packsAdapter = createEntityAdapter({
    sortComparer: (a,b) => a.id - b.id,
});

const initialState = packsAdapter.getInitialState();

export const packsSlice = createSlice({
    name: "packs",
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPacks.pending, (state, action) => {

            })
            .addCase(fetchPacks.fulfilled, (state, action) => {
                packsAdapter.setAll(state, action.payload);
            })
    }
});

export default packsSlice.reducer;

export const {
    selectById: selectPackById,
    selectAll: selectAllPacks,
} = packsAdapter.getSelectors(state => state.packs);