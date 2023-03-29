import { configureStore } from '@reduxjs/toolkit'
import userReducer from './Features/User/userSlice';
import gameReducer from './Features/Game/gameSlice';
//import usersReducer from './Features/Users/usersSlice';
import notificationsReducer from './Features/Notifications/notificationsSlice';
import modalsReducer from './Features/Notifications/modalsSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    game: gameReducer,
    //users: usersReducer,
    notifications: notificationsReducer,
    modals: modalsReducer,
  }
})
