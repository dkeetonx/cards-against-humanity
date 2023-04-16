import {
    nanoid,
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';

const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => a.severity - b.severity,
});

const initialState = notificationsAdapter.getInitialState();

let componentProxy = {};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: {
            reducer(state, action) {
                notificationsAdapter.upsertOne(state, action.payload)
            },
            prepare({ id, priority, extraClasses, duration, component }) {
                componentProxy[id] = component;
                return {
                    payload: {
                        id,
                        priority,
                        extraClasses,
                        duration,
                    }
                };
            }
        },
        dismissNotification(state, action) {
            notificationsAdapter.removeOne(state, action.payload);
        }
    }
})

export const addNotification = (notification) => {
    return function (dispatch) { //redux-toolkit provides thunk middleware
        console.log("addNotification");
        dispatch(_addNotification(notification));
        setTimeout(() => {
            dispatch(dismissNotification(notification.id));
        }, notification.duration * 1000)
    }
}
const { addNotification: _addNotification } = notificationsSlice.actions;

export const { dismissNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const { selectAll: selectAllNotifications } =
    notificationsAdapter.getSelectors(state => {
        let entities = {};
        for (const [id, value] of Object.entries(state.notifications.entities)) {
            entities[id] = { ...value, component: componentProxy[id] };
        }
        return {
            ids: state.notifications.ids,
            entities,
        };
    });

export function notifyOfErrors({ errors }, { dispatch }) {
    Object.values(errors).forEach(message => {
        dispatch(addNotification({
            id: nanoid(),
            priority: 5,
            duration: 5,
            extraClasses: "alert-warning",
            component: () => <p className="">{message}</p>,
        }));
    });
}