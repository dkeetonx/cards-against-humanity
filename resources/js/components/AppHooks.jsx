import React, { useState, useEffect, createContext, useSyncExternalStore } from 'react'

window.user = {
    id: null,
    name: "",
    game_room_id: null,
    status: "nothing",
};

window.setUser = (user_data) => {

    if (user_data.id != window.user.id) {

        if (window.user.id) {
            console.log(`stopListening App.Models.User.${window.user.id}`)
            window.Echo.private(`App.Models.User.${window.user.id}`)
                .stopListening('UserChangedOnServer', window.setUser);
        }

        console.log(`initializing echo App.Models.User.${user_data.id}`);
        window.Echo.private(`App.Models.User.${user_data.id}`)
            .listen('UserChangedOnServer', window.setUser);
    }

    window.user = user_data;
    console.log("setUser");
    window.dispatchEvent(new Event("window.user:changed"));

}

export const UserContext = createContext(null);

export function useUser() {
    const user = useSyncExternalStore((callback) => {
        if (!window.user.id) {
            window.axios.get('/api/user')
                .then(response => { 
                    if (response.data && response.data.id != null)
                        window.setUser(response.data)
                });
        }
        console.log("subscribe to window.user:changed");
        window.addEventListener('window.user:changed', callback);

        return () => {
            console.log("unscubscribe to window.user:changed");
            window.removeEventListener('window.user:changed', callback);
        };
    }, () => window.user);

    return user;
}





export const GameRoomContext = createContext(null);

export function useGameRoom() {
    const gameRoom = useSyncExternalStore((callback) => {
        if (window.user.game_room_id) {
            if (!window.game_room || window.game_room.id != window.user.game_room_id) {
                window.axios.get(`/api/game/${window.user.game_room_id}/data`)
                    .then(response => {
                        if (response.data && response.data.id != null)
                            window.setGameRoom(response.data)
                    });

                /*window.axios.get(`/api/game/${window.user.game_room_id/users})
                    .then(response => window.setUsers(response.data))
                    */
            }
        }

        console.log("subscribe to window.game_room:changed");
        window.addEventListener('window.game_room:changed', callback);

        return () => {
            console.log("unscubscribe to window.game_room:changed");
            window.removeEventListener('window.game_room:changed', callback);
        };
    }, () => window.game_room);

    return gameRoom;
}
