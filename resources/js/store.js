import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from './Features/CurrentUser/currentUserSlice';
import gameReducer from './Features/Game/gameSlice';
import usersReducer from './Features/Users/usersSlice';
import notificationsReducer from './Features/Overlays/notificationsSlice';
import overlaysReducer from './Features/Overlays/overlaysSlice';

export default configureStore({
  reducer: {
    currentUser: currentUserReducer,
    game: gameReducer,
    users: usersReducer,
    notifications: notificationsReducer,
    overlays: overlaysReducer,
  }
})
