import {
    nanoid,
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import getStore from '../../getStore';

const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.id > a.id,
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
                setTimeout(() => {
                    const store = getStore();
                    store.dispatch(dismissNotification(action.payload.id));
                },
                    action.payload.duration * 1000)
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
export const { addNotification, dismissNotification } = notificationsSlice.actions;

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

export function notifyOfErrors({ errors }) {
    Object.values(errors).forEach(message => {
        getStore().dispatch(addNotification({
            id: nanoid(),
            priority: 5,
            duration: 5,
            extraClasses: "alert-warning",
            component: () => <p className="text-sm">{message}</p>,
        }));
    });
}