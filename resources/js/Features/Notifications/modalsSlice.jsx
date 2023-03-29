import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';


export const modalsSlice = createSlice({
    name: "modals",
    initialState: {
        ShowLeaveModal: false,
        ShowRejoin: false,
    },
    reducers: {
        setShowLeaveModal(state, action) { state.ShowLeaveModal = action.payload },
        setShowRejoin(state, action) { state.ShowRejoin = action.payload }
    }
})

export const { setShowLeaveModal, setShowRejoin } = modalsSlice.actions;

export default modalsSlice.reducer;

export const selectShowLeaveModal = (state) => state.modals.ShowLeaveModal;
export const selectShowRejoin = state => state.modals.ShowRejoin;
