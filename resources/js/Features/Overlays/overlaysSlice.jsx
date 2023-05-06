import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';


export const overlaysSlice = createSlice({
    name: "overlays",
    initialState: {
        ShowLeaveModal: false,
        ShowRejoin: false,
        ShowRedrawModal: false,
    },
    reducers: {
        setShowLeaveModal(state, action) { state.ShowLeaveModal = action.payload },
        setShowRejoin(state, action) { state.ShowRejoin = action.payload },
        setShowRedrawModal(state, action) { state.ShowRedrawModal = action.payload },
    }
})

export const {
    setShowLeaveModal,
    setShowRejoin,
    setShowRedrawModal,
} = overlaysSlice.actions;

export default overlaysSlice.reducer;

export const selectShowLeaveModal = state => state.overlays.ShowLeaveModal;
export const selectShowRejoin = state => state.overlays.ShowRejoin;
export const selectShowRedrawModal = state => state.overlays.ShowRedrawModal;